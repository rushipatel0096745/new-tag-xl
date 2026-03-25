// MaintenanceDueAssetList

"use client";

import React, { useEffect, useState } from "react";
import AlertHeader from "./AlertHeader";
import { getCompanyUserPermissions, getSuperAdminFlag } from "@/app/utils/user-helper";
import Cookies from "js-cookie";
import { GetAlertsList } from "@/app/services/company-admin/alerts";
import Link from "next/link";

export interface Alert {
    id: number;
    status: number;
    note: string;
    alert_type: string;
    asset: Asset;
    pre_use_answers_id: number;
    maintenance_answers_id: any;
    asset_alert_image: string;
    assigned_by: AssignedBy;
    created_at: string;
    updated_at: string;
}

export interface Asset {
    id: number;
    tag: Tag;
    name: string;
    location: Location;
    batch_code: string;
    image: string;
    status: number;
}

export interface Tag {
    id: number;
    uid: string;
    tag_type: string;
}

export interface Location {
    id: number;
    location_name: string;
}

export interface AssignedBy {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
}

const MaintenanceDueAssetList = () => {
    const [list, setList] = useState<Alert[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showMsg, setShowMsg] = useState("");
    const [error, setError] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [userRole, setUserRole] = useState<string[]>([]);
    const [is_super_admin, setIsSuperAdmin] = useState(false);

    const filter = [
        {
            field: "alert_type",
            condition: "equals",
            text: "maintenance_due",
        },
    ];
    useEffect(() => {
        const role = getCompanyUserPermissions();
        setUserRole(role?.alerts || []);
        if (getSuperAdminFlag()) setIsSuperAdmin(true); 

        async function fetchRoles() {
            const response = await GetAlertsList(page, pageSize, filter);
            console.log("list response....", response);

            if (response.has_error && response.message === "Permission denied") {
                setError({ permission: "Permission Denied" });
                setLoading(false);
                return;
            }

            if (response.has_error && response.message === "Tag not found") {
                setLoading(false);
                setList([]);
                setTotal(0);
                return;
            }
            if (!response.has_error && response.message === "Alerts fetched successfully") {
                setList(response.alerts);
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
    }, [page, pageSize]);

    useEffect(() => {
        console.log("tag permissions: ", userRole);
    }, [userRole]);

    return (
        <div className='card-box bg-[#fff] border-gray-700 rounded-[18px] shadow-3xl shadow-white px-3 py-5.5'>
            <AlertHeader title='Maintenance Check Due Alert List' />

            <div>
                <div className='card-box_body'>
                    {error.permission && <p className='text-red-500'>{error.permission}</p>}
                    {(is_super_admin || userRole?.includes("list")) ? (
                        <div className='table-wrapper'>
                            {list.length !== 0 ? (
                                <table className='table text-left border-collapse w-full text-[#111c43] border rounded-md text-[14px] leading-5 overflow-hidden'>
                                    <thead className='bg-[#f5f6fa] table-header-group align-middle'>
                                        <tr className='table-row border-1 border-solid border-[#f5f6f1]'>
                                            <th className='p-2 font-medium'>Asset Info</th>
                                            <th className='p-2 font-medium'>Location</th>

                                            <th className='p-2 font-medium'>Status</th>
                                            <th className='p-2 font-medium'>Alert Type</th>

                                            <th style={{ width: "14%" }} className='p-2 font-medium'>
                                                Created At
                                            </th>

                                            <th style={{ width: "14%" }} className='p-2 font-medium'>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-row-group align-middle '>
                                        {list?.map((alert) => {
                                            return (
                                                <tr className='border border-[#f5f6f1]' key={alert.id}>
                                                    <td className='p-2 align-middle text-[13px] font-medium text-[#474a54]'>
                                                        <div className='products-info flex gap-1'>
                                                            <div className='product-image border rounded-sm w-12.5 h-12.5 overflow-hidden'>
                                                                <img
                                                                    alt='Logo'
                                                                    loading='lazy'
                                                                    width={80}
                                                                    height={80}
                                                                    decoding='async'
                                                                    data-nimg={1}
                                                                    src={`https://api.tagxl.com/${alert.asset.image}`}
                                                                    style={{ color: "transparent" }}
                                                                />
                                                            </div>
                                                            <div className='product-content'>
                                                                <h5 className='font-semibold text-[14px]'>
                                                                    {alert.asset.name}
                                                                </h5>
                                                                <span className='text-[#878787]'>
                                                                    {alert.asset.batch_code}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='p-3 align-middle text-[13px] font-medium text-[#474a54]'>
                                                        {alert.asset.location.location_name}
                                                    </td>
                                                    <td className='p-3 align-middle text-[13px] font-medium text-[#474a54]'>
                                                        {alert.status === 0 && (
                                                            <span className='status processing text-[#f56262] bg-[#fdecea] border-[#f56262] border border-solid rounded-[40px] uppercase px-[2px] py-2.5 text-[10px] inline font-extrabold tracking-[0.5px] '>
                                                                PENDING
                                                            </span>
                                                        )}
                                                        {alert.status === 1 && (
                                                            <span className='status processing text-[#f5a623] bg-[#fff7e6] border border-solid rounded-[40px] uppercase px-[2px] py-2.5 text-[10px] inline font-extrabold tracking-[0.5px] '>
                                                                PROCESSING
                                                            </span>
                                                        )}
                                                        {alert.status === 2 && (
                                                            <span className='status processing text-green-500 bg-[#c9f4d2] border border-solid rounded-[40px] uppercase px-[2px] py-2.5 text-[10px] inline font-extrabold tracking-[0.5px] '>
                                                                COMPLETED
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className='p-3 align-middle text-[13px] font-medium text-[#474a54]'>
                                                        {alert.alert_type}
                                                    </td>
                                                    <td className='p-3 align-middle text-[13px] font-medium text-[#474a54]'>
                                                        {alert.created_at}
                                                    </td>
                                                    <td className='p-3 align-middle text-[13px] font-medium text-[#474a54]'>
                                                        {(is_super_admin || userRole.includes("update")) && (
                                                            <Link
                                                                className='icon-button edit inline-flex items-center justify-center cursor-pointer p-0 decoration-0'
                                                                href={`/company-admin/alerts/edit/${alert.id}`}>
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
                                                            </Link>
                                                        )}
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
                        <p>Permission Denied</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaintenanceDueAssetList;
