"use client";

import Link from "next/link";
import React, { startTransition, useActionState, useEffect, useState } from "react";
import { Tag } from "./TagList";
import { Asset } from "../../(admin)/tag/edit/[id]/page";
import Modal from "../Modal";
import UnassignTagModal from "./UnassignTagModal";
import AssignTagModal from "./AssignTagModal";
import { DeleteTag, GetTag } from "@/app/services/company-admin/tags";
import { useRouter } from "next/navigation";

const EditTag = ({
    id,
    initialTagData,
    action,
    asset,
    assetList,
}: {
    id: number;
    initialTagData: Tag;
    action: (id: number, prevState: any, formData: any) => Promise<any>;
    asset: Asset;
    assetList: Asset[];
}) => {
    // console.log("initial data: ", initialData);
    // console.log("asset data: ", asset);

    const [state, formAction, isPending] = useActionState(action.bind(null, id), {
        success: null,
        error: "",
        data: "",
    });

    const router = useRouter();

    const [initialData, setInitialData] = useState<Tag | undefined>();
    const [tagType, setTagType] = useState<string | undefined>(initialData?.tag_type);

    const [showMsg, setShowMsg] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [error, setError] = useState<{ [key: string]: string }>({});

    const [permError, setPermError] = useState("");

    async function fetchTag() {
        const tag = await GetTag(id);
        if (tag.has_error && tag.error_code == "PERMISSION_DENIED") {
            setPermError(tag.message);
        }
        if (tag.has_error) {
            setPermError(tag.message);
        }
        if (!tag.has_error) {
            setInitialData(tag?.tag);
        }
    }

    useEffect(() => {
        fetchTag();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setTagType(e.target.value);
    }

    function saveData() {
        const data = {
            uid: initialData?.uid,
            tag_type: tagType,
        };
        console.log(data);
        startTransition(() => formAction(data));
    }

    useEffect(() => {
        if (state?.success === true) {
            setShowMsg("Tag updated successfully");
        } else if (state?.success === false) {
            setShowMsg("");
        }
    }, [state]);

    async function handleDelete(id: number) {
        const result = await DeleteTag(id);
        if (result.has_error && result.error_code == "PERMISSION_DENIED") {
            setError((prev) => ({
                ...prev,
                permission: "Permission Denied To Delete Tag",
            }));
        }
        if (!result.has_error) {
            router.push("/company-admin/tag/manage-tags?delete=true");
        }
    }

    return (
        <div>
            <div className='card-box bg-[#fff] border-gray-700 rounded-[18px] shadow-3xl shadow-white px-3 py-5.5'>
                <div className='card-box_head border-b border-b-[#ededed] px-4 py-5.5 flex justify-between items-center'>
                    {showMsg && (
                        <div className='text-green-700'>
                            <p>{showMsg}</p>
                        </div>
                    )}

                    {state?.error && (
                        <div className='text-red-500'>
                            <p>{state?.error}</p>
                        </div>
                    )}

                    {permError && (
                        <div className='text-red-500'>
                            <p>{permError}</p>
                        </div>
                    )}

                    {error.permission && <p className='text-red-500'>{error.permission}</p>}

                    <h3 className='h3 text-[18px] font-semibold leading-6'>Edit Tag</h3>
                    <div className='actions-btn flex gap-2 items-center'>
                        <Link
                            className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'
                            href='/company-admin/tag/manage-tags'>
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
                                        d='M9.53033 15.7804C9.23743 16.0733 8.76256 16.0733 8.46967 15.7804L3.21967 10.5304C2.92678 10.2375 2.92678 9.76259 3.21967 9.4697L8.46967 4.2197C8.76256 3.92681 9.23743 3.92681 9.53033 4.2197C9.82322 4.51259 9.82322 4.98747 9.53033 5.28036L5.56066 9.25003L16.25 9.25003C16.6642 9.25003 17 9.58582 17 10C17 10.4142 16.6642 10.75 16.25 10.75L5.56066 10.75L9.53033 14.7197C9.82322 15.0126 9.82322 15.4875 9.53033 15.7804Z'
                                        fill='#919191'
                                    />
                                </svg>
                            </span>
                            <span className='button-label text-[#1a1a1a] capitalize ml-2'>Back</span>
                        </Link>
                        <button
                            onClick={() => handleDelete(id)}
                            className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'>
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
                            <span className='button-label text-[#1a1a1a] capitalize ml-2'>Delete</span>
                        </button>
                        <button
                            onClick={openModal}
                            className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'>
                            <span className='icon-circle'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 20 20'
                                    fill='none'>
                                    <path
                                        d='M7.09144 2.0001C7.59088 1.99989 7.95921 1.99539 8.31382 2.08041C8.61102 2.15167 8.89538 2.26899 9.15598 2.42864L9.2704 2.50326C9.53288 2.68626 9.76857 2.92752 10.0777 3.23669L16.2209 9.37984C16.6447 9.80365 16.9941 10.1523 17.2542 10.4587C17.5198 10.7715 17.7351 11.088 17.8576 11.465C18.0475 12.0495 18.0474 12.6792 17.8576 13.2637C17.7351 13.6407 17.5198 13.9579 17.2542 14.2708C16.9941 14.5771 16.6446 14.9251 16.2209 15.3489L15.3489 16.2209C14.9251 16.6446 14.5771 16.9941 14.2708 17.2542C13.9579 17.5198 13.6407 17.7351 13.2637 17.8576C12.6792 18.0474 12.0495 18.0475 11.465 17.8576C11.0881 17.7351 10.7715 17.5198 10.4587 17.2542C10.1523 16.9941 9.80365 16.6447 9.37985 16.2209L3.23669 10.0777C2.9275 9.76854 2.68627 9.5329 2.50327 9.2704L2.42865 9.15598C2.26899 8.89536 2.15167 8.61103 2.08041 8.31382C1.99541 7.9592 1.99988 7.59088 2.0001 7.09144L2.00081 6.21943C2.00108 5.62071 2.00066 5.12792 2.0335 4.7277C2.06707 4.31893 2.13857 3.94285 2.31849 3.5899C2.59749 3.04257 3.04258 2.59751 3.5899 2.31849L3.72351 2.25595C4.03749 2.12121 4.37001 2.06286 4.72771 2.0335C5.12792 2.00066 5.6207 2.00105 6.21943 2.00081L7.09144 2.0001ZM6.54066 5.33605C7.09098 5.39208 7.5207 5.85687 7.5207 6.42198C7.52057 7.02465 7.03175 7.51343 6.42909 7.51359C5.86396 7.51359 5.39917 7.0839 5.34316 6.53355L5.33748 6.42198L5.34316 6.3104C5.39896 5.75984 5.86381 5.33036 6.42909 5.33036L6.54066 5.33605ZM3.45558 7.09144C3.45533 7.66042 3.45987 7.8267 3.49538 7.97482C3.531 8.12331 3.58975 8.26533 3.6695 8.39554C3.74907 8.52543 3.86344 8.64634 4.26576 9.04866L10.4089 15.1918C10.8497 15.6326 11.1498 15.9322 11.4003 16.1448C11.6443 16.352 11.7934 16.4337 11.9149 16.4732C12.2071 16.5681 12.5223 16.5681 12.8146 16.4732C12.936 16.4337 13.0847 16.3517 13.3284 16.1448C13.5789 15.9322 13.879 15.6326 14.3198 15.1918L15.1918 14.3198C15.6326 13.8791 15.9322 13.5789 16.1448 13.3284C16.3517 13.0847 16.4337 12.936 16.4732 12.8146C16.5682 12.5223 16.5681 12.2072 16.4732 11.9149C16.4337 11.7934 16.352 11.6443 16.1448 11.4003C15.9322 11.1498 15.6326 10.8497 15.1918 10.4089L9.04796 4.26576C8.64571 3.86351 8.52542 3.74906 8.39555 3.6695C8.26534 3.58974 8.12331 3.531 7.97482 3.49538C7.82671 3.45986 7.6604 3.45535 7.09144 3.45558L6.22014 3.45629C5.59732 3.45654 5.17366 3.45714 4.84639 3.48401C4.5278 3.51018 4.36456 3.55752 4.25084 3.61548C3.97733 3.75497 3.75496 3.97732 3.61549 4.25084C3.55751 4.36457 3.51019 4.52771 3.48401 4.84639C3.45714 5.17368 3.45657 5.59726 3.45629 6.22014L3.45558 7.09144Z'
                                        fill='#2AA466'></path>
                                </svg>
                            </span>
                            <span className='button-label text-[#1a1a1a] capitalize ml-2'>
                                {initialData?.is_assigned ? "Unassign Tag" : "Assign Tag"}
                            </span>
                        </button>
                        <button
                            onClick={saveData}
                            className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'>
                            <span className='icon-circle'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 20 20'
                                    fill='none'>
                                    <path
                                        d='M15.8333 14.1667H6.66585C5.8374 14.1667 5.58642 14.174 5.40121 14.2236C4.82615 14.3778 4.37691 14.8269 4.22282 15.402C4.207 15.4611 4.1936 15.541 4.18376 15.6714C4.18769 15.7549 4.19154 15.8333 4.19759 15.9074C4.22744 16.2727 4.28174 16.4598 4.34815 16.5902C4.50792 16.9037 4.76296 17.1587 5.0765 17.3185C5.20683 17.3849 5.39393 17.4392 5.75928 17.4691C6.13431 17.4997 6.61951 17.5 7.33317 17.5H14.6663C15.0301 17.5 15.2533 17.499 15.4199 17.4853C15.4974 17.479 15.5444 17.4717 15.5729 17.465C15.5863 17.4619 15.5944 17.4585 15.599 17.4569C15.6027 17.4555 15.6048 17.4547 15.6055 17.4544C15.6839 17.4145 15.7478 17.3505 15.7878 17.2721C15.7881 17.2715 15.7889 17.2693 15.7902 17.2656C15.7918 17.261 15.7952 17.2529 15.7983 17.2396C15.8051 17.2111 15.8124 17.1641 15.8187 17.0866C15.8323 16.9199 15.8333 16.6968 15.8333 16.333V14.1667ZM9.16667 7.61636L10.0277 7.04751C10.1068 6.99516 10.3155 6.8424 10.5648 6.78303L10.7088 6.7578C10.8056 6.74645 10.9034 6.74645 11.0002 6.7578L11.1442 6.78303L11.2354 6.80988C11.4434 6.87953 11.6121 7.0017 11.6813 7.04751L12.5423 7.61636V2.49999H9.16667V7.61636ZM15.8333 3.66698C15.8333 3.30319 15.8323 3.08003 15.8187 2.9134C15.8124 2.83592 15.8051 2.78891 15.7983 2.7604C15.7952 2.74706 15.7918 2.73892 15.7902 2.73436C15.7889 2.73063 15.7881 2.72851 15.7878 2.72785C15.7478 2.64945 15.6839 2.58551 15.6055 2.54556C15.6048 2.54523 15.6027 2.54445 15.599 2.54312C15.5944 2.5415 15.5863 2.53812 15.5729 2.53498C15.5444 2.52827 15.4974 2.52097 15.4199 2.51463C15.2533 2.50102 15.0301 2.49999 14.6663 2.49999H14.209V7.92642C14.209 8.11134 14.21 8.30829 14.1952 8.47004C14.1811 8.62367 14.1436 8.89706 13.9567 9.14468C13.737 9.43581 13.4011 9.61668 13.0371 9.63947C12.7276 9.6588 12.4789 9.53912 12.3429 9.46613C12.1998 9.38929 12.0358 9.28005 11.8815 9.17805L10.8545 8.49852L9.82748 9.17805C9.67318 9.28005 9.50918 9.38929 9.36605 9.46613C9.23009 9.53912 8.98137 9.6588 8.67188 9.63947C8.30786 9.61668 7.97199 9.43581 7.75228 9.14468C7.56542 8.89706 7.52792 8.62367 7.51384 8.47004C7.49902 8.30829 7.5 8.11134 7.5 7.92642V2.49999H7.33317C6.61951 2.49999 6.13431 2.50028 5.75928 2.53091C5.39393 2.56076 5.20683 2.61506 5.0765 2.68146C4.76295 2.84124 4.50792 3.09627 4.34815 3.40982C4.28174 3.54015 4.22744 3.72725 4.19759 4.0926C4.16696 4.46763 4.16667 4.95283 4.16667 5.66649V12.946C4.41549 12.8024 4.68505 12.6903 4.96989 12.6139C5.42045 12.4932 5.94464 12.5 6.66585 12.5H15.8333V3.66698ZM17.5 16.333C17.5 16.6693 17.5009 16.9722 17.4805 17.2225C17.4592 17.4823 17.4108 17.7584 17.273 18.029C17.0732 18.421 16.7543 18.7399 16.3623 18.9396C16.0917 19.0775 15.8157 19.1259 15.5558 19.1471C15.3056 19.1676 15.0026 19.1667 14.6663 19.1667H7.33317C6.64693 19.1667 6.08202 19.1675 5.62337 19.13C5.15499 19.0918 4.72408 19.0098 4.31966 18.8037C3.69257 18.4841 3.18251 17.9741 2.86296 17.347C2.65689 16.9426 2.5749 16.5117 2.53662 16.0433C2.52899 15.9499 2.52514 15.8518 2.52035 15.7495C2.51809 15.7261 2.51572 15.7026 2.51546 15.6787C2.49985 15.2943 2.5 14.848 2.5 14.3335V5.66649C2.5 4.98025 2.49915 4.41534 2.53662 3.95669C2.5749 3.48831 2.65689 3.0574 2.86296 2.65298C3.18251 2.02589 3.69257 1.51583 4.31966 1.19627C4.72408 0.990212 5.15499 0.908214 5.62337 0.86994C6.08202 0.832467 6.64693 0.833319 7.33317 0.833319H14.6663C15.0026 0.833319 15.3056 0.832404 15.5558 0.85285C15.8157 0.874099 16.0917 0.922522 16.3623 1.06037C16.7543 1.26011 17.0732 1.57901 17.273 1.97101L17.321 2.07274C17.4227 2.31036 17.4619 2.55018 17.4805 2.77749C17.5009 3.02774 17.5 3.3307 17.5 3.66698V16.333Z'
                                        fill='#2AA466'></path>
                                </svg>
                            </span>
                            <span className='button-label text-[#1a1a1a] capitalize ml-2'>Save Tag</span>
                        </button>
                    </div>
                </div>

                {initialData?.is_assigned ? (
                    <UnassignTagModal
                        isOpen={isModalOpen}
                        isClose={closeModal}
                        uid={initialData.uid}
                        permError={setPermError}
                        showMsg={setShowMsg}
                        fetchTag={fetchTag}
                    />
                ) : (
                    <AssignTagModal
                        isOpen={isModalOpen}
                        isClose={closeModal}
                        assetList={assetList}
                        uid={initialData?.uid ?? ""}
                        permError={setPermError}
                        showMsg={setShowMsg}
                        fetchTag={fetchTag}
                    />
                )}

                <div className='card-box_body p-5.5'>
                    <div className='row flex flex-wrap gap-4 w-full'>
                        <div className='col-6 w-[calc(50%-8px)]'>
                            <form>
                                <div className='row form-row flex flex-wrap gap-4 w-full'>
                                    <h3 className='title h4 mt-4 text-[16px] leading-5.5 font-semibold'>Tag Detail</h3>
                                    <div className='col w-full'>
                                        <div className='form-group flex flex-col gap-2'>
                                            <div className='fancy-input relative'>
                                                <input
                                                    readOnly
                                                    placeholder=''
                                                    id='uid'
                                                    type='uid'
                                                    defaultValue={initialData?.uid}
                                                    name='uid'
                                                    className='box-border text-[#17181a] bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full h-11 pt-[18px] px-[14px] pb-2 text-[14px] font-medium'
                                                />
                                                <label
                                                    htmlFor='uid'
                                                    className='form-label text-[#878d99] text-[11px] top-4 bg-[#0000] py-0.5 absolute left-3 transform -translate-y-1/2'>
                                                    Uid
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col w-full'>
                                        <div className='form-group flex flex-col gap-2'>
                                            <div className='fancy-input select relative'>
                                                <select
                                                    id='role_id'
                                                    name='role_id'
                                                    defaultValue={initialData?.tag_type}
                                                    onChange={handleTypeChange}
                                                    className='form-select text-[#17181a] bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full h-11 pt-[18px] px-[14px] pb-2 text-[14px] font-medium'>
                                                    <option value='RFID'>RFID</option>
                                                    <option value='QR'>QR</option>
                                                    <option value='Manual'>Manual</option>
                                                </select>
                                                <label
                                                    htmlFor='role_id'
                                                    className='form-label text-[#878d99] text-[11px] top-4 bg-[#0000] py-0.5 absolute left-3 transform -translate-y-1/2'>
                                                    Select UID Type
                                                    <span className='require inline-block ml-px text-red-600 '>*</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {initialData?.is_assigned && (
                            <div className='col-6 pl-10 w-[calc(50%-8px)]'>
                                <h3 className='title h4 mb-16 mt-4 text-[16px] font-semibold leading-5.5'>
                                    Asset details
                                </h3>
                                <div className='tag-product-wrapper flex gap-5'>
                                    <div className='tag-product-image'>
                                        <img
                                            alt=''
                                            loading='lazy'
                                            width={140}
                                            height={140}
                                            decoding='async'
                                            data-nimg={1}
                                            className='product-img'
                                            src={`https://api.tagxl.com/${asset?.image}`}
                                            style={{}}
                                        />
                                    </div>
                                    <div className='info-block-wrapper flex flex-col gap-2.5 w-[calc(100%-160px)]'>
                                        <div className='info-block flex flex-col'>
                                            <div className='title text-[#808080] text-[12px]'>Product Name</div>
                                            <div className='value'>{asset?.name}</div>
                                        </div>
                                        <div className='info-block flex flex-col'>
                                            <div className='title text-[#808080] text-[12px]'>Location</div>
                                            <div className='value'>{asset?.location?.location_name}</div>
                                        </div>
                                        <div className='info-block flex flex-col'>
                                            <div className='title text-[#808080] text-[12px]'>Batch Code</div>
                                            <div className='value'>{asset?.batch_code}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTag;
