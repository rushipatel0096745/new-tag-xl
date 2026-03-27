"use client";

import { ManualTemplate } from "@/app/company-admin/(admin)/template-master/manual-template/page";
import {
    clientFetch,
    getCompanyId,
    getCompanyUserPermissions,
    getSessionId,
    getSuperAdminFlag,
} from "@/app/utils/user-helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetManualTemplateList } from "@/app/services/company-admin/manual_template";

interface Props {
    tempList: ManualTemplate[];
}

const ManualTemplateList = ({ tempList }: Props) => {
    const [list, setList] = useState<ManualTemplate[]>(tempList);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showMsg, setShowMsg] = useState("");
    const [error, setError] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [permitted, setPermitted] = useState<boolean>();
    const [permError, setPermError] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [userRole, setUserRole] = useState<string[]>([]);
    const [is_super_admin, setIsSuperAdmin] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const role = getCompanyUserPermissions();
        setUserRole(role?.manual_template || []);
        if (getSuperAdminFlag()) setIsSuperAdmin(true);

        async function fetchRoles() {
            const cookieFilters = Cookies.get("company_manual_filter");
            let parsedFilters = null;
            if (cookieFilters) {
                parsedFilters = JSON.parse(cookieFilters);
            }
            console.log("parsed filters: ", parsedFilters);
            const response = await GetManualTemplateList(page, pageSize, parsedFilters);
            console.log("list response....", response);

            if (response.has_error && response.message === "Permission denied") {
                setError({ permission: "Permission Denied" });
                setLoading(false);
                return;
            }

            if (response.has_error && response.message === "Manual Templates not found") {
                setLoading(false);
                setList([]);
                setTotal(0);
                return;
            }
            if (!response.has_error && response.message === "Manual templates fetched successfully") {
                setList(response.manual_templates);
                setError({});
                setTotal(response.total);
                setLoading(false);
                return;
            }
            if (response.has_error && response.message === "Invalid or expired session") {
                setLoading(false);
                alert("Session is over, Please Login Again.");
                Cookies.remove("company_user_session");
                window.location.reload();
                return;
            }
            if (response.has_error) {
                setLoading(false);
                setError({ api: response.message });
                setList([]);
                setTotal(0);
                return;
            }
        }

        fetchRoles();

        const handleFiltersChanged = () => fetchRoles();
        window.addEventListener("ManualFiltersChanged", handleFiltersChanged);

        return () => {
            window.removeEventListener("ManualFiltersChanged", handleFiltersChanged);
        };
    }, [page, pageSize, is_super_admin]);

    function checkPermission(perm: string) {
        const permission = getCompanyUserPermissions();
        const flag = permission.manual_template.includes(perm);
        console.log(flag);
        return flag;
    }

    async function getTemplate() {
        // if (!checkPermission("view")) {
        //     setPermError("Not allowed to delete!!");
        //     return;
        // }
        try {
            const result = await clientFetch("/company/manual-template/list", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page: 1,
                    page_size: 10,
                    filters: [],
                }),
            });

            console.log("API response:", result);

            if (result?.has_error) {
                console.error("Template deletion failed:", result.message);
                return;
            }

            setList(result.manual_templates);
        } catch (error) {
            console.error("Create template error:", error);
        }
    }

    async function deleteTemplate(id: number | string) {
        if (!checkPermission("delete")) {
            setPermError("Not allowed to delete!!");
            return;
        }

        const sessionId = getSessionId("company-user-session");
        const companyId = getCompanyId("company-user-session");

        try {
            const result = await clientFetch("/company/manual-template/delete/" + Number(id), {
                method: "DELETE",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
            });

            if (result.has_error && result.error_code == "PERMISSION_DENIED") {
                setPermitted(result.message || "Permission denied to delete");
                return;
            }

            if (result?.has_error) {
                console.error("Template deletion failed:", result.message);
                return;
            }

            setList((prev) => prev.filter((item) => item.id !== id));
            setShowMsg("Template deleted successfully");
        } catch (error) {
            console.error("Delete template error:", error);
        }
    }

    function handleUpdate(id: number): void {
        if (!checkPermission("update")) {
            setPermError("Not allowed to update!!");
            return;
        }
        router.push(`/company-admin/template-master/manual-template/edit/${id}`);
    }

    return (
        <div className='card-box bg-[#fff] border-gray-700 rounded-[18px] shadow-3xl shadow-white px-3 py-5.5'>
            <div className='card-box_head border-b border-b-[#ededed] px-4 py-5.5 flex justify-between items-center'>
                <h3 className='h3 text-[18px] font-semibold leading-6'>Manual Template List</h3>
                {showMsg && (
                    <div className='text-yellow-600'>
                        <p>{showMsg}</p>
                    </div>
                )}

                {permitted && (
                    <div className='text-red-500'>
                    <p>{permitted}</p>
                    </div>
                )}
                <div className='actions-btn flex gap-2 items-center'>
                    {(is_super_admin || userRole?.includes("create")) && (
                        <Link
                            className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'
                            href='/company-admin/template-master/manual-template/add'>
                            <span className='icon-circle'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width={20}
                                    height={20}
                                    viewBox='0 0 20 20'
                                    fill='none'>
                                    <path
                                        fillRule='evenodd'
                                        clipRule='evenodd'
                                        d='M10 4C10.355 4 10.6429 4.28782 10.6429 4.64286V9.35714H15.3571C15.7122 9.35714 16 9.64496 16 10C16 10.355 15.7122 10.6429 15.3571 10.6429H10.6429V15.3571C10.6429 15.7122 10.355 16 10 16C9.64496 16 9.35714 15.7122 9.35714 15.3571V10.6429H4.64286C4.28782 10.6429 4 10.355 4 10C4 9.64496 4.28782 9.35714 4.64286 9.35714H9.35714V4.64286C9.35714 4.28782 9.64496 4 10 4Z'
                                        fill='#845ADF'
                                    />
                                </svg>
                            </span>
                            <span className='button-label text-[#1a1a1a] capitalize ml-2'>Add Template</span>
                        </Link>
                    )}

                    <Link
                        className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'
                        href='/company-admin/template-master/manual-template'>
                        <span className='icon-circle'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width={20}
                                height={20}
                                viewBox='0 0 20 20'
                                fill='none'>
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M10 4C10.355 4 10.6429 4.28782 10.6429 4.64286V9.35714H15.3571C15.7122 9.35714 16 9.64496 16 10C16 10.355 15.7122 10.6429 15.3571 10.6429H10.6429V15.3571C10.6429 15.7122 10.355 16 10 16C9.64496 16 9.35714 15.7122 9.35714 15.3571V10.6429H4.64286C4.28782 10.6429 4 10.355 4 10C4 9.64496 4.28782 9.35714 4.64286 9.35714H9.35714V4.64286C9.35714 4.28782 9.64496 4 10 4Z'
                                    fill='#845ADF'
                                />
                            </svg>
                        </span>
                        <span className='button-label text-[#1a1a1a] capitalize ml-2'>Manual Template</span>
                    </Link>
                    <Link
                        className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'
                        href='/company-admin/template-master/maintenance-check-template'>
                        <span className='icon-circle'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width={20}
                                height={20}
                                viewBox='0 0 20 20'
                                fill='none'>
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M10 4C10.355 4 10.6429 4.28782 10.6429 4.64286V9.35714H15.3571C15.7122 9.35714 16 9.64496 16 10C16 10.355 15.7122 10.6429 15.3571 10.6429H10.6429V15.3571C10.6429 15.7122 10.355 16 10 16C9.64496 16 9.35714 15.7122 9.35714 15.3571V10.6429H4.64286C4.28782 10.6429 4 10.355 4 10C4 9.64496 4.28782 9.35714 4.64286 9.35714H9.35714V4.64286C9.35714 4.28782 9.64496 4 10 4Z'
                                    fill='#845ADF'
                                />
                            </svg>
                        </span>
                        <span className='button-label text-[#1a1a1a] capitalize ml-2'>Maintenance Check Template</span>
                    </Link>
                    <Link
                        className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'
                        href='/company-admin/template-master/pre-use-check-template'>
                        <span className='icon-circle'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width={20}
                                height={20}
                                viewBox='0 0 20 20'
                                fill='none'>
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M10 4C10.355 4 10.6429 4.28782 10.6429 4.64286V9.35714H15.3571C15.7122 9.35714 16 9.64496 16 10C16 10.355 15.7122 10.6429 15.3571 10.6429H10.6429V15.3571C10.6429 15.7122 10.355 16 10 16C9.64496 16 9.35714 15.7122 9.35714 15.3571V10.6429H4.64286C4.28782 10.6429 4 10.355 4 10C4 9.64496 4.28782 9.35714 4.64286 9.35714H9.35714V4.64286C9.35714 4.28782 9.64496 4 10 4Z'
                                    fill='#845ADF'
                                />
                            </svg>
                        </span>
                        <span className='button-label text-[#1a1a1a] capitalize ml-2'>Pre Use Chcek Template</span>
                    </Link>
                </div>
            </div>

            <div>
                <div className='card-box_body'>
                    {error.permission && <p className='text-red-500'>{error.permission}</p>}

                    {is_super_admin || userRole?.includes("list") ? (
                        <div className='table-wrapper'>
                            {list.length !== 0 ? (
                                <table className='table text-left border-collapse w-full text-[#111c43] border rounded-md text-[14px] leading-5 overflow-hidden'>
                                    <thead className='bg-[#f5f6fa] table-header-group align-middle'>
                                        <tr className='table-row border border-solid border-[#f5f6f1]'>
                                            <th style={{ width: 33 }} className='p-2 font-medium'>
                                                Template Title
                                            </th>
                                            <th style={{ width: 33 }} className='p-2 font-medium'>
                                                Template Description
                                            </th>
                                            <th style={{ width: 33 }} className='p-2 font-medium'>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-row-group align-middle '>
                                        {list?.map((temp) => {
                                            return (
                                                <tr
                                                    className='table-row border-1 border-solid border-[#f5f6f1] align-middle'
                                                    key={temp.id}>
                                                    <td className='text-[13px] p-2 font-medium text-[#474a54]'>
                                                        {temp.name}
                                                    </td>
                                                    <td className='text-[13px] p-2 font-medium text-[#474a54]'>
                                                        {temp.description}
                                                    </td>

                                                    <td className='p-2'>
                                                        <div className='actions-btn flex gap-2 items-center'>
                                                            <div className='actions-btn flex gap-2 items-center'>
                                                                {(is_super_admin || userRole.includes("update")) && (
                                                                    <button
                                                                        onClick={() => handleUpdate(temp.id)}
                                                                        className='icon-button edit inline-flex items-center justify-center cursor-pointer p-0 decoration-0'>
                                                                        <span className='icon-circle'>
                                                                            <svg
                                                                                xmlns='http://www.w3.org/2000/svg'
                                                                                width={16}
                                                                                height={16}
                                                                                viewBox='0 0 16 16'
                                                                                fill='none'>
                                                                                <path
                                                                                    d='M8.66992 9.39657C8.6699 9.30031 8.65077 9.2049 8.61393 9.11597C8.57708 9.02707 8.52313 8.94639 8.45508 8.87834C8.38703 8.81029 8.30634 8.75634 8.21745 8.71948C8.12852 8.68265 8.0331 8.66352 7.93685 8.66349C7.84057 8.66349 7.7452 8.68265 7.65625 8.71948C7.56727 8.75634 7.48607 8.81023 7.41797 8.87834L3.92773 12.3744L3.58398 13.7462L4.95964 13.3979L8.45638 9.91414C8.52394 9.84628 8.57728 9.76564 8.61393 9.67717C8.65077 9.58821 8.66992 9.49285 8.66992 9.39657ZM6 2.00008V3.33341H10V2.00008H6ZM10.0033 9.39657C10.0033 9.66792 9.95018 9.93687 9.84635 10.1876C9.74249 10.4383 9.5897 10.6662 9.39779 10.8582L9.39714 10.8588L5.77083 14.4721C5.68601 14.5566 5.57962 14.6172 5.46354 14.6466L5.30013 14.0001L5.29948 13.9994L5.46354 14.6466L2.83008 15.3132C2.60277 15.3707 2.36199 15.3043 2.19596 15.1388C2.02988 14.9731 1.96315 14.7322 2.02018 14.5046L2.67969 11.8712C2.70898 11.7544 2.76976 11.6478 2.85482 11.5626L6.47461 7.93563H6.47526L6.62565 7.79891C6.78245 7.67025 6.95777 7.56496 7.14583 7.48706C7.39654 7.38324 7.6655 7.33016 7.93685 7.33016C8.20819 7.33018 8.47717 7.38322 8.72786 7.48706C8.97855 7.59092 9.20591 7.74375 9.39779 7.93563C9.58966 8.12751 9.74249 8.35486 9.84635 8.60555C9.9502 8.85625 10.0032 9.12522 10.0033 9.39657ZM12 2.00008C12.5304 2.00008 13.039 2.21095 13.4141 2.58602C13.7891 2.96109 14 3.46965 14 4.00008V13.3334C14 13.8638 13.7891 14.3724 13.4141 14.7475C13.039 15.1226 12.5304 15.3334 12 15.3334H8.33333C7.96514 15.3334 7.66667 15.0349 7.66667 14.6667C7.66667 14.2986 7.96514 14.0001 8.33333 14.0001H12C12.1768 14.0001 12.3463 13.9298 12.4714 13.8048C12.5964 13.6797 12.6667 13.5102 12.6667 13.3334V4.00008C12.6667 3.82327 12.5964 3.65375 12.4714 3.52873C12.3463 3.4037 12.1768 3.33341 12 3.33341H11.3333C11.3333 4.06979 10.7364 4.66675 10 4.66675H6C5.26362 4.66675 4.66667 4.06979 4.66667 3.33341H4C3.82319 3.33341 3.65367 3.4037 3.52865 3.52873C3.40362 3.65375 3.33333 3.82327 3.33333 4.00008V9.00008C3.33333 9.36827 3.03486 9.66675 2.66667 9.66675C2.29848 9.66675 2 9.36827 2 9.00008V4.00008C2 3.46965 2.21086 2.96109 2.58594 2.58602C2.96101 2.21095 3.46957 2.00008 4 2.00008H4.66667C4.66667 1.2637 5.26362 0.666748 6 0.666748H10C10.7364 0.666748 11.3333 1.2637 11.3333 2.00008H12Z'
                                                                                    fill='#2AA466'
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    </button>
                                                                )}
                                                                {(is_super_admin || userRole.includes("update")) && (
                                                                    <button
                                                                        onClick={() => deleteTemplate(Number(temp.id))}
                                                                        className='icon-button delete inline-flex items-center justify-center cursor-pointer p-0 decoration-0'
                                                                        type='button'>
                                                                        <span className='icon-circle'>
                                                                            <svg
                                                                                xmlns='http://www.w3.org/2000/svg'
                                                                                width={16}
                                                                                height={16}
                                                                                viewBox='0 0 16 16'
                                                                                fill='none'>
                                                                                <path
                                                                                    d='M11.9997 4.66675H3.99967V13.3334C3.99967 13.4499 4.06459 13.6223 4.22103 13.7787C4.37746 13.9352 4.54983 14.0001 4.66634 14.0001H11.333C11.4495 14.0001 11.6219 13.9352 11.7783 13.7787C11.9348 13.6223 11.9997 13.4499 11.9997 13.3334V4.66675ZM5.99967 11.3334V7.33341C5.99967 6.96522 6.29815 6.66675 6.66634 6.66675C7.03453 6.66675 7.33301 6.96522 7.33301 7.33341V11.3334C7.33301 11.7016 7.03453 12.0001 6.66634 12.0001C6.29815 12.0001 5.99967 11.7016 5.99967 11.3334ZM8.66634 11.3334V7.33341C8.66634 6.96522 8.96482 6.66675 9.33301 6.66675C9.7012 6.66675 9.99967 6.96522 9.99967 7.33341V11.3334C9.99967 11.7016 9.7012 12.0001 9.33301 12.0001C8.96482 12.0001 8.66634 11.7016 8.66634 11.3334ZM9.99967 2.66675C9.99967 2.55024 9.93476 2.37787 9.77832 2.22144C9.62188 2.065 9.44952 2.00008 9.33301 2.00008H6.66634C6.54983 2.00008 6.37747 2.065 6.22103 2.22144C6.06459 2.37787 5.99967 2.55024 5.99967 2.66675V3.33341H9.99967V2.66675ZM11.333 3.33341H13.9997C14.3679 3.33341 14.6663 3.63189 14.6663 4.00008C14.6663 4.36827 14.3679 4.66675 13.9997 4.66675H13.333V13.3334C13.333 13.8836 13.0646 14.3779 12.721 14.7214C12.3775 15.065 11.8832 15.3334 11.333 15.3334H4.66634C4.11619 15.3334 3.62188 15.065 3.27832 14.7214C2.93476 14.3779 2.66634 13.8836 2.66634 13.3334V4.66675H1.99967C1.63148 4.66675 1.33301 4.36827 1.33301 4.00008C1.33301 3.63189 1.63148 3.33341 1.99967 3.33341H4.66634V2.66675C4.66634 2.11659 4.93476 1.62229 5.27832 1.27873C5.62188 0.935163 6.11619 0.666748 6.66634 0.666748H9.33301C9.88316 0.666748 10.3775 0.935163 10.721 1.27873C11.0646 1.62229 11.333 2.11659 11.333 2.66675V3.33341Z'
                                                                                    fill='#F56262'
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                        {/* <span className='tooltip'>Delete</span> */}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                !error.permission && (
                                    <>
                                        <span className='flex justify-center p-6'>No result found</span>
                                    </>
                                )
                            )}
                        </div>
                    ) : (
                        !error.permission && <p>Permission Denied</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualTemplateList;
