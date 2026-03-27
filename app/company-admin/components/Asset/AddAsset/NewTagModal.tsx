"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import { CreateTag } from "@/app/services/company-admin/tags";
import { CheckTagAssigned } from "@/app/services/company-admin/assets";

type NewTagModalProps = {
    isOpen: boolean;
    isClosed: () => void;
    updateForm: (name: string, value: any) => void;
    formData: any;
    next: () => void;
};

type TagType = "RFID" | "QR" | "Manual" | "";

const NewTagModal = ({ isOpen, isClosed, updateForm, formData, next }: NewTagModalProps) => {
    const tagTypeOptions: { label: string; value: TagType; text: string }[] = [
        { label: "RFID", value: "RFID", text: "Scan or enter RFID tag" },
        { label: "QR", value: "QR", text: "Scan or enter QR code" },
        { label: "Manual", value: "Manual", text: "Enter the unique ID" },
    ];

    const [uid, setUid] = useState(formData.uid ?? "");
    const [tag_type, setTagType] = useState(formData.tag_type ?? "");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [assignError, setAssignError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setUid(formData.uid ?? "");
            setTagType(formData.tag_type ?? "");
        }
    }, [isOpen]);

    function handleTagTypeSelect(value: string) {
        setTagType(value);
    }

    function handleUid(value: string) {
        setUid(value);
    }

    function validate() {
        const newErrors = {} as Record<string, string>;
        if (!tag_type) newErrors.tag_type = "Select the Type of Tag";
        if (!uid) newErrors.uid = "UID is required";

        setErrors(newErrors);

        return Object.entries(newErrors).length === 0;
    }

    async function handleSave() {
        if (!validate()) {
            return;
        }

        const createTag = await CreateTag(uid, tag_type);

        if (createTag.has_error && createTag.error_code == "PERMISSION_DENIED") {
            setAssignError(createTag.message);
            return;
        }

        if (createTag.has_error) {
            setAssignError(createTag.message);
            return;
        }

        if (!createTag.has_error) {
            const checkAssigned = await CheckTagAssigned(uid);
            updateForm("tag_id", createTag?.created_tags[0]?.tag_id);
            updateForm("uid", uid);
            updateForm("tag_type", tag_type);

            if (checkAssigned.has_error && checkAssigned.error_code == "RECORD_ALREADY_USED") {
                setAssignError(checkAssigned.message);
                return;
            }

            if (checkAssigned.has_error && checkAssigned.error_code == "RECORD_NOT_FOUND") {
                setAssignError(checkAssigned.message);
            }

            if (!checkAssigned.has_error) {
                next();
                return;
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={isClosed}>
            <div className='popup-inner max-w-[710px] bg-white p-5.5 rounded-3xl w-[90%] relative'>
                {errors.tag_type && (
                    <div className='text-red-600'>
                        <p>{errors.tag_type}</p>
                    </div>
                )}
                <div className='popup-head border-b border-solid border-[#ececec] flex items-center justify-between'>
                    <h3 className='h3 text-xl leading-6 font-semibold'>Assign Tag</h3>
                    <button
                        onClick={isClosed}
                        className='close-btn cursor-pointer border-0 rounded-[10px] justify-center items-center w-[38px] h-[38px] ml-auto p-0 transition-all duration-300 flex'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={24}
                            height={24}
                            viewBox='0 0 24 24'
                            fill='none'
                            className='w-5 h-5 align-bottom'>
                            <path
                                d='M6 6L12 12M12 12L18 18M12 12L18 6M12 12L6 18'
                                stroke='black'
                                strokeWidth={2}
                                strokeLinecap='round'
                            />
                        </svg>
                    </button>
                </div>
                <div className='popup-content max-h-[calc(90vh-89px)]' onClick={(e) => e.stopPropagation()}>
                    <div className='add-one-by-one_items flex flex-col gap-2.5'>
                        <div className='description'>
                            <p>The entered tag ID does not exist.</p>
                            <p>Would you like to create it as a new tag and assign it to the new asset?</p>
                        </div>
                        <div className='actions-btn flex items-center justify-between gap-2'>
                            {tagTypeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type='button'
                                    onClick={() => handleTagTypeSelect(option.value)}
                                    className={`btn min-w-25 cursor-pointer text-center rounded-4xl justify-center items-center gap-[6px] h-[38px] px-[10px] py-[14px] text-[14px] font-medium inline-flex border border-solid transition-all duration-150
                                                ${
                                                    tag_type === option.value
                                                        ? "bg-[#263f94] border-[#263f94] text-white"
                                                        : "bg-[#f5f6fa] border-[#c9d5ff] text-[#111c43]"
                                                }`}>
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <div className='fancy-input relative'>
                            <input
                                placeholder=''
                                type='text'
                                value={uid}
                                name='uid'
                                className='text-[#17181a] bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full h-11 text-[14px] font-medium pt-[18px] px-[14px] pb-[8px]'
                                onChange={(e) => handleUid(e.target.value)}
                            />
                            <label className='form-label absolute left-3 px-0 py-0.5 text-[#676767] top-1 text-[11px] pointer-events-none'>
                                UID<span className='text-red-500'>*</span>
                            </label>
                            {errors.uid && (
                                <div className='text-red-600'>
                                    <p> {errors.uid}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='actions-btn flex justify-end gap-2.5 mt-5.5 items-center'>
                        <button
                            type='button'
                            onClick={handleSave}
                            className='btn success all-unset cursor-pointer text-center bg-[#2aa466] border border-[#2aa466] text-[#fff] box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex'>
                            Save
                        </button>
                        <button
                            type='button'
                            onClick={isClosed}
                            className='btn danger-light all-unset cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-[#fff] box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex'>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default NewTagModal;
