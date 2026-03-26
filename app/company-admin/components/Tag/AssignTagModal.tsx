"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import Select from "react-select";
import { Asset } from "../../(admin)/tag/edit/[id]/page";
import { GetAssetList } from "@/app/services/company-admin/assets";
import { AssignTag } from "@/app/services/company-admin/tags";

const AssignTagModal = ({
    isOpen,
    isClose,
    assetList,
    uid,
    permError,
    showMsg,
    fetchTag,
}: {
    isOpen: boolean;
    isClose: () => void;
    assetList: Asset[];
    uid: string;
    permError: Dispatch<SetStateAction<string>>;
    showMsg: Dispatch<SetStateAction<string>>;
    fetchTag: () => void;
}) => {
    const [selected, setSelected] = useState<{ value: number; label: string }>();

    const [list, setList] = useState<Asset[]>();

    async function fetchAssets() {
        const assets = await GetAssetList(1, 100, [{ field: "tag_id", condition: "is_null", text: "" }], 1);
        setList(assets.assets);
    }

    useEffect(() => {
        fetchAssets();
    }, []);

    function handleChange(selectedOptions: any) {
        setSelected(selectedOptions);
    }

    async function saveSelection() {
        console.log("selected options: ", selected);
        const data = {
            asset_id: selected?.value,
            uid: uid,
        };
        // console.log(data)

        const assignTag = await AssignTag(data);

        if (assignTag.has_error && assignTag.error_code == "PERMISSION_DENIED") {
            permError(assignTag.message);
        }

        if (!assignTag.has_error) {
            showMsg("Tag Assigned Succesfully");
            fetchTag();
            isClose();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={isClose}>
            <div className='popup-inner max-w-[710px] bg-white p-5.5 rounded-3xl w-[90%] relative'>
                <div className='popup-head border-b border-solid border-[#ececec] flex items-center justify-between'>
                    <h3 className='h3 text-xl leading-6 font-semibold'>Assign Tag</h3>
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
                    <div className='new-question-item-details'>
                        <div className='add-question-wrapper'>
                            <div className='fancy-input relative'>
                                <Select
                                    options={list?.map((asset) => ({
                                        value: asset.id,
                                        label: asset.name,
                                    }))}
                                    onMenuOpen={() => console.log("menu is open")}
                                    onChange={handleChange}
                                    placeholder='Search Assets'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='actions-btn flex justify-end gap-2.5 mt-5.5 items-center'>
                        <button
                            onClick={saveSelection}
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

export default AssignTagModal;
