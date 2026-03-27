"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import { UnassignTag } from "@/app/services/company-admin/tags";

interface Props {
    isOpen: boolean;
    isClose: () => void;
    uid: string;
    permError: Dispatch<SetStateAction<string>>;
    showMsg: Dispatch<SetStateAction<string>>;
    fetchTag: () => void;
}

const UnassignTagModal = ({ isOpen, isClose, uid, permError, showMsg, fetchTag }: Props) => {
    // const [reason, setReason] = useState<string>();
    const [reason, setReason] = useState<string>("Physically broken");
    const [otherReason, setOtherReason] = useState<string>();

    const TRIGGER_VALUE = "Other reason";

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        if (otherReason) setOtherReason("");
        setReason(e.target.value);
    };

    async function handleSave() {
        const data = {
            uid,
            reason: reason,
            remarks: otherReason ?? "",
        };
        console.log(data);

        const unassignedTag = await UnassignTag(data);

        if (unassignedTag.has_error && unassignedTag.error_code == "PERMISSION_DENIED") {
            permError("Permissoin Denied to Unassign Tag");
            isClose();
        }

        if (!unassignedTag.has_error) {
            showMsg("Tag Unassigned Succesfully");
            fetchTag();
            isClose();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={isClose}>
            <div className='popup-inner max-w-[710px] bg-white p-5.5 rounded-3xl w-[90%] relative'>
                <div className='popup-head border-b border-solid border-[#ededed] flex items-center justify-between'>
                    <h3 className='h3 text-xl leading-6 font-semibold'>Unassign Tag</h3>
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
                    <form>
                        <div className='unassign-new-tag flex flex-col items-center gap-4 w-full'>
                            <div className='fancy-input select col w-full relative'>
                                <select
                                    name='reason'
                                    id='reason'
                                    value={reason}
                                    onChange={handleChange}
                                    className='form-select cursor-pointer text-[#17181a] box-border bg-[#f5f6fa] border border-[#efefef] rounded-[10px] w-full h-[44px] pt-[18px] px-[14px] pb-[8px] font-sans text-[14px] font-medium'>
                                    <option value='Physically broken'>Physically broken</option>
                                    <option value='Unreadable'>Unreadable</option>
                                    <option value='Heat damage'>Heat damage</option>
                                    <option value='Detached from asset'>Detached from asset</option>
                                    <option value={TRIGGER_VALUE}>Other reason</option>
                                </select>
                                <label
                                    htmlFor=''
                                    className='form-label text-[#878d99] text-[11px] top-4 bg-[#0000] py-0.5 absolute left-3 transform -translate-y-1/2'>
                                    Reason
                                </label>
                            </div>

                            {reason === TRIGGER_VALUE && (
                                <div className='other-reason-block col w-full'>
                                    <h5 className='title h4 mb-3 text-[16px] font-semibold leading-5.5'>
                                        Other Reason
                                    </h5>
                                    <textarea
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        className='form-textarea min-h-[100px] align-bottom bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full px-2.5 py-3 text-[14px]'
                                        placeholder='Type your question here'
                                        defaultValue={""}
                                    />
                                </div>
                            )}
                        </div>
                        <div className='actions-btn flex justify-end gap-2.5 mt-5.5 items-center'>
                            <button
                                onClick={handleSave}
                                type='button'
                                className='btn success all-unset cursor-pointer text-center bg-[#2aa466] border border-[#2aa466] text-[#fff] box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex'>
                                Save
                            </button>
                            <button
                                onClick={isClose}
                                className='btn danger-light all-unset cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-[#fff] box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex'>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default UnassignTagModal;
