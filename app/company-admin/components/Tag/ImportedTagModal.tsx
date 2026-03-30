"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";

type TagType = "RFID" | "QR" | "Manual" | "";

interface ImportedTag {
    tag_type: TagType;
    uid: string;
    is_assigned: "0" | "1";
}

const ImportedTagModal = ({
    isOpen,
    isClose,
    importedTags,
    handleSave,
}: {
    isOpen: boolean;
    isClose: () => void;
    importedTags: ImportedTag[];
    handleSave: (importList: ImportedTag[]) => void;
}) => {
    const [tagList, setTagList] = useState<ImportedTag[]>(importedTags);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (importedTags?.length > 0) {
            setTagList(importedTags);
        }
    }, [importedTags]);

    async function handleSubmit() {
        if (tagList.length === 0) {
            isClose();
            return;
        }

        handleSave(tagList);
    }

    return (
        <Modal isOpen={isOpen} onClose={isClose}>
            <div className='popup-inner max-w-[710px] bg-white p-5.5 rounded-3xl w-[90%] relative'>
                <div className='popup-head border-b border-solid border-[#ececec] flex items-center justify-between'>
                    <h3 className='h3 text-xl leading-6 font-semibold'>Previewing tag data</h3>
                    <button
                        onClick={isClose}
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
                    <div className='content flex flex-col flex-wrap justify-between gap-2'>
                        <p>You will be importing {tagList.length}</p>
                        {tagList.map((tag, index) => (
                            <div className='tag-container flex justify-between gap-2' key={index}>
                                <div className='tag-info'>
                                    <p>
                                        Tag UID: <span>{tag.uid}</span>
                                    </p>
                                    <p>
                                        Tag Type: <span>{tag.tag_type}</span>
                                    </p>
                                </div>
                                <div className='action-btn'>
                                    <button
                                        type='button'
                                        onClick={() => setTagList(tagList.filter((t) => t.uid !== tag.uid))}
                                        className='bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 text-sm rounded transition-colors'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='actions-btn flex justify-end gap-2.5 mt-5.5 items-center'>
                        <button
                            onClick={handleSubmit}
                            className='btn success all-unset cursor-pointer text-center bg-[#2aa466] border border-[#2aa466] text-[#fff] box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex'>
                            Save
                        </button>
                        <button
                            onClick={isClose}
                            className='btn danger-light all-unset cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-[#fff] box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex'>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ImportedTagModal;
