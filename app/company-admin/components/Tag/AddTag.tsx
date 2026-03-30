"use client";

import { ImportTag } from "@/app/services/company-admin/tags";
import React, { startTransition, useActionState, useEffect, useRef, useState } from "react";
import ImportedTagModal from "./ImportedTagModal";

type TagType = "RFID" | "QR" | "Manual" | "";

interface TagItem {
    tag_type: TagType;
    uid: string;
}

interface ImportedTag {
    tag_type: TagType;
    uid: string;
    is_assigned: "0" | "1";
}

type section = "MANUAL" | "EXCEL";

const AddTag = ({ action }: { action: (prevState: any, formData: any) => Promise<any> }) => {
    const initialList: TagItem[] = [
        {
            tag_type: "",
            uid: "",
        },
    ];

    const [tagList, setTagList] = useState<TagItem[]>(initialList);

    const [showMsg, setShowMsg] = useState<string>("");

    const [createdTagsMsg, setCreatedTagsMsg] = useState("");

    const [duplicateTagError, setDuplicateTagError] = useState("");

    const [section, setSection] = useState<section>("MANUAL");

    const [excel_file, setExcelFile] = useState<File | null>(null);

    const [excelError, setExcelError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [importedTags, setImportedTags] = useState<ImportedTag[]>([]);

    const [state, formAction, isPending] = useActionState(action, {
        success: null,
        error: "",
        data: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAddInput = () => {
        setTagList([...tagList, { tag_type: "", uid: "" }]);
    };

    const handleUidChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = event.target;
        const updated = [...tagList];
        updated[index].uid = value;
        setTagList(updated);
    };

    const handleTagTypeSelect = (type: TagType, index: number) => {
        const updated = [...tagList];
        updated[index].tag_type = type;
        setTagList(updated);
    };

    const handleDeleteInput = (index: number) => {
        if (tagList.length === 1) return;
        const newArray = [...tagList];
        newArray.splice(index, 1);
        setTagList(newArray);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        tagList.forEach((item, index) => {
            if (!item.tag_type) {
                newErrors[`tag_type_${index}`] = "Tag type is required";
            }
            if (!item.uid) {
                newErrors[`uid_${index}`] = "UID is required";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "text/csv",
        ];

        if (!allowedTypes.includes(file.type)) {
            setErrors({ excel_file: "Only Excel or CSV files are allowed." });
            setExcelFile(null);
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrors({ excel_file: "File size must be less than 10MB." });
            setExcelFile(null);
            return;
        }

        setErrors({});
        setExcelFile(file);
    };

    const importTags = async () => {
        if (!excel_file) {
            setErrors({ excel_file: "Upload the excel file" });
            return;
        }

        const formData = new FormData();
        formData.append("file", excel_file as File);

        const result = await ImportTag(formData);
        if (result?.has_error && result?.error_code == "PERMISSION_DENIED") {
            setExcelError(result.message);
            return;
        }
        if (result?.has_error) {
            setExcelError(result.message);
            return;
        }
        if (!result?.has_error) {
            setImportedTags(result?.tags);
            openModal();
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSave = () => {
        if (!validate()) {
            return;
        }

        const data = tagList.filter((item) => item.tag_type && item.uid);

        if (data.length === 0) return;

        const formData = {
            tags: data.map((tag) => {
                return { ...tag, is_assigned: 0 };
            }),
        };

        console.log("form data....", formData);

        startTransition(() => formAction(formData));
    };

    async function SaveImportedTags(importedTagList: ImportedTag[]) {
        closeModal();
        const formData = {
            tags: importedTagList,
        };
        startTransition(() => formAction(formData));
    }

    useEffect(() => {
        if (state?.success === true) {
            if (state?.data?.created_tags?.length > 0) {
                const created_tags = state?.data?.created_tags?.map((tag: any) => tag.uid);
                setCreatedTagsMsg(`Tags created successfully: ${created_tags}`);
            }

            if (state?.data?.duplicates?.length > 0) {
                setDuplicateTagError(
                    `The following tags were not created due to duplication: ${state.data.duplicates.join(", ")}`
                );
            }

            setTagList(initialList);
        } else if (state?.success === false) {
            setShowMsg("");
        }
    }, [state]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRemoveFile = () => {
        setExcelFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const tagTypeOptions: { label: string; value: TagType }[] = [
        { label: "RFID", value: "RFID" },
        { label: "QR", value: "QR" },
        { label: "Manual", value: "Manual" },
    ];
    // in this if taglist object in array already have is_assigned then dont add is_assigned property in formdata
    return (
        <div className='tab-content border border-solid border-[#ededed] rounded-2xl p-5.5'>
            <ImportedTagModal
                isOpen={isModalOpen}
                isClose={closeModal}
                importedTags={importedTags}
                handleSave={SaveImportedTags}
            />

            {createdTagsMsg && (
                <div className='text-green-700'>
                    <p>{createdTagsMsg}</p>
                </div>
            )}

            {duplicateTagError && (
                <div className='text-yellow-500'>
                    <p>{duplicateTagError}</p>
                </div>
            )}

            {state?.error && (
                <div className='text-red-500'>
                    <p>{state?.error}</p>
                </div>
            )}
            <div className='block'>
                <button
                    onClick={() => setSection("MANUAL")}
                    className='title h4 mb-5 mr-2 text-[16px] p-2 leading-5.5 border-0 bg-blue-600 text-white rounded-sm'>
                    Add Tags One-by-One
                </button>
                <button
                    onClick={() => setSection("EXCEL")}
                    className='title h4 mb-5 text-[16px] p-2 border-0 bg-blue-600 text-white rounded-sm leading-5.5'>
                    Excel File
                </button>
                <div className='section flex justify-baseline gap-2'>
                    {section === "MANUAL" && (
                        <div className='add-one-by-one_content'>
                            <div className='add-one-by-one_items flex flex-col gap-2.5'>
                                {tagList.map((item, index) => (
                                    <div
                                        className='add-one-by-one_item grid grid-cols-[316px_1fr_28px] gap-2.5'
                                        key={index}>
                                        {/* Tag Type Selector */}
                                        {/* Tag Type Selector */}
                                        <div className='flex flex-col gap-1'>
                                            <div className='actions-btn flex items-center justify-between gap-2'>
                                                {tagTypeOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type='button'
                                                        onClick={() => handleTagTypeSelect(option.value, index)}
                                                        className={`btn min-w-25 cursor-pointer text-center rounded-4xl justify-center items-center gap-[6px] h-[38px] px-[10px] py-[14px] text-[14px] font-medium inline-flex border border-solid transition-all duration-150
                    ${
                        item.tag_type === option.value
                            ? "bg-[#263f94] border-[#263f94] text-white"
                            : "bg-[#f5f6fa] border-[#c9d5ff] text-[#111c43]"
                    }`}>
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors[`tag_type_${index}`] && (
                                                <p className='text-red-500 text-[12px] mt-1'>
                                                    {errors[`tag_type_${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* UID Input */}
                                        {/* UID Input */}
                                        <div className='fancy-input relative'>
                                            <input
                                                placeholder=''
                                                type='text'
                                                value={item.uid}
                                                name='uid'
                                                className='text-[#17181a] bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full h-11 text-[14px] font-medium pt-[18px] px-[14px] pb-[8px]'
                                                onChange={(event) => handleUidChange(event, index)}
                                            />
                                            <label className='form-label absolute left-3 px-0 py-0.5 text-[#676767] top-1 text-[11px] pointer-events-none'>
                                                UID<span className='text-red-500'>*</span>
                                            </label>
                                            {errors[`uid_${index}`] && (
                                                <p className='text-red-500 text-[12px] mt-1'>
                                                    {errors[`uid_${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <div className='actions-btn flex items-center justify-center'>
                                            <button
                                                className='icon-button delete relative inline-flex items-center justify-center cursor-pointer p-0 border-0 disabled:opacity-30'
                                                type='button'
                                                disabled={tagList.length === 1}
                                                onClick={() => handleDeleteInput(index)}>
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
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='actions-btn mt-8 flex gap-2 items-center'>
                                <button
                                    type='button'
                                    onClick={handleAddInput}
                                    className='inline-flex h-[38px] items-center justify-center gap-[6px] rounded-[40px] border border-[#263f94] bg-[#263f94] px-[14px] py-[10px] text-center text-[14px] font-medium text-white transition-all duration-200 cursor-pointer box-border'>
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
                                            fill='#fff'
                                        />
                                    </svg>
                                    Add New Tag
                                </button>
                                <button
                                    type='button'
                                    onClick={handleSave}
                                    className='inline-flex h-[38px] items-center justify-center gap-[6px] rounded-[40px] border border-[#2aa466] bg-[#2aa466] px-[14px] py-[10px] text-center text-[14px] font-medium text-white transition-all duration-200 cursor-pointer box-border'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width={20}
                                        height={20}
                                        viewBox='0 0 20 20'
                                        fill='none'>
                                        <path
                                            d='M7.09144 2.0001C7.59088 1.99989 7.95921 1.99539 8.31382 2.08041C8.61102 2.15167 8.89538 2.26899 9.15598 2.42864L9.2704 2.50326C9.53288 2.68626 9.76857 2.92752 10.0777 3.23669L16.2209 9.37984C16.6447 9.80365 16.9941 10.1523 17.2542 10.4587C17.5198 10.7715 17.7351 11.088 17.8576 11.465C18.0475 12.0495 18.0474 12.6792 17.8576 13.2637C17.7351 13.6407 17.5198 13.9579 17.2542 14.2708C16.9941 14.5771 16.6446 14.9251 16.2209 15.3489L15.3489 16.2209C14.9251 16.6446 14.5771 16.9941 14.2708 17.2542C13.9579 17.5198 13.6407 17.7351 13.2637 17.8576C12.6792 18.0474 12.0495 18.0475 11.465 17.8576C11.0881 17.7351 10.7715 17.5198 10.4587 17.2542C10.1523 16.9941 9.80365 16.6447 9.37985 16.2209L3.23669 10.0777C2.9275 9.76854 2.68627 9.5329 2.50327 9.2704L2.42865 9.15598C2.26899 8.89536 2.15167 8.61103 2.08041 8.31382C1.99541 7.9592 1.99988 7.59088 2.0001 7.09144L2.00081 6.21943C2.00108 5.62071 2.00066 5.12792 2.0335 4.7277C2.06707 4.31893 2.13857 3.94285 2.31849 3.5899C2.59749 3.04257 3.04258 2.59751 3.5899 2.31849L3.72351 2.25595C4.03749 2.12121 4.37001 2.06286 4.72771 2.0335C5.12792 2.00066 5.6207 2.00105 6.21943 2.00081L7.09144 2.0001ZM6.54066 5.33605C7.09098 5.39208 7.5207 5.85687 7.5207 6.42198C7.52057 7.02465 7.03175 7.51343 6.42909 7.51359C5.86396 7.51359 5.39917 7.0839 5.34316 6.53355L5.33748 6.42198L5.34316 6.3104C5.39896 5.75984 5.86381 5.33036 6.42909 5.33036L6.54066 5.33605ZM3.45558 7.09144C3.45533 7.66042 3.45987 7.8267 3.49538 7.97482C3.531 8.12331 3.58975 8.26533 3.6695 8.39554C3.74907 8.52543 3.86344 8.64634 4.26576 9.04866L10.4089 15.1918C10.8497 15.6326 11.1498 15.9322 11.4003 16.1448C11.6443 16.352 11.7934 16.4337 11.9149 16.4732C12.2071 16.5681 12.5223 16.5681 12.8146 16.4732C12.936 16.4337 13.0847 16.3517 13.3284 16.1448C13.5789 15.9322 13.879 15.6326 14.3198 15.1918L15.1918 14.3198C15.6326 13.8791 15.9322 13.5789 16.1448 13.3284C16.3517 13.0847 16.4337 12.936 16.4732 12.8146C16.5682 12.5223 16.5681 12.2072 16.4732 11.9149C16.4337 11.7934 16.352 11.6443 16.1448 11.4003C15.9322 11.1498 15.6326 10.8497 15.1918 10.4089L9.04796 4.26576C8.64571 3.86351 8.52542 3.74906 8.39555 3.6695C8.26534 3.58974 8.12331 3.531 7.97482 3.49538C7.82671 3.45986 7.6604 3.45535 7.09144 3.45558L6.22014 3.45629C5.59732 3.45654 5.17366 3.45714 4.84639 3.48401C4.5278 3.51018 4.36456 3.55752 4.25084 3.61548C3.97733 3.75497 3.75496 3.97732 3.61549 4.25084C3.55751 4.36457 3.51019 4.52771 3.48401 4.84639C3.45714 5.17368 3.45657 5.59726 3.45629 6.22014L3.45558 7.09144Z'
                                            fill='white'
                                        />
                                    </svg>
                                    Save Tag
                                </button>
                            </div>
                        </div>
                    )}

                    {section === "EXCEL" && (
                        <div className='upload-block-wrapper w-full'>
                            <h4>Upload Excel File</h4>
                            <div className='upload-block w-full cursor-pointer text-[#333] text-center border-2 border-dashed border-[#c9d5ff] rounded-[10px] flex-col justify-center items-center gap-[10px] h-[180px] transition-[background] duration-200 flex relative overflow-hidden'>
                                <input
                                    ref={fileInputRef}
                                    className='file-input opacity-0 cursor-pointer absolute inset-0'
                                    id='excel_tag_list'
                                    type='file'
                                    name='excel_tag_list'
                                    onChange={handleFileChange}
                                />
                                <div className='upload-icon bg-[#d7e0f9] rounded-[6px] justify-center items-center w-[40px] h-[40px] transition-colors duration-200 flex'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width={25}
                                        height={24}
                                        viewBox='0 0 25 24'
                                        className='align-bottom'
                                        fill='none'>
                                        <path
                                            d='M18.5313 22V20.0313H16.5625C16.0103 20.0312 15.5625 19.5835 15.5625 19.0313C15.5625 18.479 16.0103 18.0313 16.5625 18.0313H18.5313V16.0625C18.5313 15.5103 18.979 15.0625 19.5313 15.0625C20.0835 15.0625 20.5312 15.5103 20.5313 16.0625V18.0313H22.5C23.0523 18.0313 23.5 18.479 23.5 19.0313C23.5 19.5836 23.0523 20.0313 22.5 20.0313H20.5313V22C20.5312 22.5523 20.0835 23 19.5313 23C18.979 23 18.5313 22.5523 18.5313 22ZM15 12.5C15 11.1193 13.8807 10 12.5 10C11.1193 10 10 11.1193 10 12.5C10.0001 13.8807 11.1193 15 12.5 15C13.8807 15 15 13.8807 15 12.5ZM20.5 12.75V9.25686L20.4951 8.86526C20.432 7.92922 19.7296 7.17191 18.8194 7.02542L18.6338 7.00491C18.5753 7.00099 18.4971 7.00003 18.2432 7.00003L18.0205 6.99808C17.2355 6.97353 16.4777 6.7185 15.8399 6.26858L15.5742 6.0635L15.4063 5.91702L15.208 5.73929C15.0663 5.61257 14.9742 5.53104 14.9072 5.47366L14.7569 5.35354C14.5181 5.18534 14.2454 5.07114 13.959 5.01956L13.835 5.00198C13.7334 4.9902 13.6216 4.98831 13.2412 4.98831H11.7588C11.5687 4.98831 11.4456 4.9884 11.3574 4.99026L11.1651 5.00198C10.875 5.03571 10.5956 5.13176 10.3477 5.28421L10.2432 5.35354C10.2014 5.38299 10.1597 5.41635 10.0928 5.47366L9.79201 5.73929L9.59377 5.91702L9.4258 6.0635C8.82402 6.56859 8.08911 6.88408 7.31349 6.97366L6.97951 6.99808C6.91362 7.00013 6.84703 7.00003 6.75685 7.00003L6.36623 7.00491C5.36758 7.07208 4.5723 7.86668 4.5049 8.86526C4.50096 8.92384 4.50002 9.00242 4.50002 9.25686V14.7002C4.50002 15.5566 4.50036 16.1389 4.53713 16.5889C4.57295 17.0273 4.6381 17.2518 4.71779 17.4082L4.79494 17.5459C4.98709 17.8592 5.26259 18.1145 5.59181 18.2823L5.72463 18.3389C5.87419 18.3924 6.08257 18.4351 6.41115 18.4619C6.8612 18.4987 7.44339 18.5 8.29982 18.5H12.5C13.0523 18.5 13.5 18.9477 13.5 19.5C13.5 20.0523 13.0523 20.5 12.5 20.5H8.29982C7.47633 20.5 6.79844 20.5011 6.24806 20.4561C5.75609 20.4159 5.29903 20.3347 4.8672 20.1494L4.68361 20.0635C4.02532 19.728 3.47408 19.2182 3.08986 18.5918L2.93556 18.3155C2.6885 17.8303 2.58988 17.3138 2.54396 16.752C2.499 16.2016 2.50002 15.5237 2.50002 14.7002V9.25686C2.50002 9.03493 2.49922 8.87398 2.50881 8.73147C2.64317 6.73391 4.23391 5.14323 6.23146 5.00882L6.46388 5.001C6.54966 4.99994 6.64572 5.00003 6.75685 5.00003C6.85923 5.00003 6.88947 4.99991 6.91701 4.99905L7.084 4.98636C7.47183 4.94155 7.83975 4.78386 8.14064 4.53128L8.26076 4.42581L8.45802 4.24905L8.79396 3.95218C8.89578 3.86538 8.99177 3.78927 9.09181 3.71878L9.3008 3.58108C9.79653 3.2763 10.3536 3.08212 10.9336 3.01468L11.1182 2.99905C11.3059 2.98755 11.5074 2.98831 11.7588 2.98831H13.2412C13.5764 2.98831 13.823 2.98637 14.0664 3.01468C14.7294 3.09177 15.3626 3.33435 15.9082 3.71878L16.0567 3.82913C16.2044 3.94576 16.3545 4.08139 16.542 4.24905L16.7393 4.42581L16.8594 4.53128L16.9922 4.63382C17.3112 4.85901 17.6903 4.98677 18.083 4.99905L18.2432 5.00003C18.4651 5.00003 18.6261 4.99923 18.7686 5.00882L18.9541 5.02542C20.8639 5.24258 22.3611 6.79615 22.4912 8.73147L22.499 8.9639C22.5001 9.04965 22.5 9.14577 22.5 9.25686V12.75C22.5 13.3023 22.0523 13.75 21.5 13.75C20.9478 13.75 20.5001 13.3023 20.5 12.75ZM17 12.5C17 14.9853 14.9853 17 12.5 17C10.0148 17 8.00007 14.9853 8.00002 12.5C8.00002 10.0147 10.0147 8.00003 12.5 8.00003C14.9853 8.00003 17 10.0147 17 12.5Z'
                                            fill='#263f94'
                                        />
                                    </svg>
                                </div>
                                <span className='upload-text'>
                                    Upload file <br /> no more 10 Mb
                                </span>
                                <button className='btn min-w-19 h-auto px-[5px] appearance-none cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-white box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex '>
                                    Upload
                                </button>
                            </div>
                            {excel_file && (
                                <div className='upload-block-content flex flex-col w-full gap-2.5 '>
                                    <div className='upload-file-block flex gap-1 items-center'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width={24}
                                            height={24}
                                            className='h-5 w-5'
                                            viewBox='0 0 24 24'
                                            fill='none'>
                                            <path
                                                d='M3 20V4C3 3.20435 3.3163 2.44152 3.87891 1.87891C4.44152 1.3163 5.20435 1 6 1H14.5C14.7652 1 15.0195 1.10543 15.207 1.29297L20.707 6.79297C20.8946 6.9805 21 7.23478 21 7.5V20C21 20.7957 20.6837 21.5585 20.1211 22.1211C19.5585 22.6837 18.7957 23 18 23H6C5.20435 23 4.44152 22.6837 3.87891 22.1211C3.3163 21.5585 3 20.7957 3 20ZM16 16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17C7 16.4477 7.44772 16 8 16H16ZM16 12C16.5523 12 17 12.4477 17 13C17 13.5523 16.5523 14 16 14H8C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12H16ZM10 8C10.5523 8 11 8.44772 11 9C11 9.55228 10.5523 10 10 10H8C7.44772 10 7 9.55228 7 9C7 8.44772 7.44772 8 8 8H10ZM15 7H18.0859L15 3.91406V7ZM5 20C5 20.2652 5.10543 20.5195 5.29297 20.707C5.48051 20.8946 5.73478 21 6 21H18C18.2652 21 18.5195 20.8946 18.707 20.707C18.8946 20.5195 19 20.2652 19 20V9H14C13.4477 9 13 8.55228 13 8V3H6C5.73478 3 5.4805 3.10543 5.29297 3.29297C5.10543 3.4805 5 3.73478 5 4V20Z'
                                                fill='#454B54'
                                            />
                                        </svg>
                                        <div className='upload-file-name-wrapper flex gap-1 items-center'>
                                            <span className='upload-file-name underline underline-offset-[3px] decoration-[#111c43] text-[#454b54] text-[12px] leading-[16px]'>
                                                {excel_file.name}
                                            </span>
                                            <button
                                                type='button'
                                                onClick={handleRemoveFile}
                                                className='text-red-500 hover:text-red-700 cursor-pointer border-0 bg-none p-0 text-2xl float-right'>
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className='action-btn mt-2'>
                                <button
                                    type='button'
                                    onClick={importTags}
                                    className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm'>
                                    Import Tags
                                </button>
                            </div>
                            {errors?.excel_file && (
                                <div className='text-red-600'>
                                    <p>{errors.excel_file}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddTag;
