"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import { CreateTag } from "@/app/services/company-admin/tags";
import { CheckTagAssigned } from "@/app/services/company-admin/assets";
import { CreateLocations, getLocation } from "@/app/services/company-admin/location";

type LocationModalProps = {
    isOpen: boolean;
    isClosed: () => void;
    getLocations: () => void;
    updateForm: (name: string, value: any | null) => void;
};

type TagType = "RFID" | "QR" | "Manual" | "";

const LocationModal = ({ isOpen, isClosed, getLocations, updateForm }: LocationModalProps) => {
    const [location, setLocation] = useState("");
    const [assignError, setAssignError] = useState("");

    async function handleSave() {
        if (!location) return;

        const createLocation = await CreateLocations(location);

        if (createLocation.has_error && createLocation.error_code == "PERMISSION_DENIED") {
            setAssignError(createLocation.message);
            return;
        }

        if (createLocation.has_error) {
            setAssignError(createLocation.message);
            return;
        }

        if (!createLocation.has_error) {
            getLocations();
            updateForm("location_id", createLocation.location_id)
            isClosed();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={isClosed}>
            <div className='popup-inner max-w-[710px] bg-white p-5.5 rounded-3xl w-[90%] relative'>
                <div className='popup-head border-b border-solid border-[#ececec] flex items-center justify-between'>
                    <h3 className='h3 text-xl leading-6 font-semibold'>Create Location</h3>
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
                    <div className='row form-row flex wrap gap-4 w-full pb-12'>
                        <div className='col w-full'>
                            <div className='fancy-input relative'>
                                <input
                                    id='name'
                                    placeholder=''
                                    type='text'
                                    value={location}
                                    name='location_name'
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                    }}
                                    className='peer w-full h-11 border border-[#efefef] rounded-[10px] px-3.5 pt-4.5 pb-2'
                                />
                                <label
                                    htmlFor='name'
                                    className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none bg-transparent px-0.5 text-[14px] text-[#676767] transition-all duration-200
                                                peer-placeholder-shown:text-[14px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                                                peer-focus:top-2 peer-focus:text-[10px]'>
                                    Location Name<span className='require ml-px text-red-600 inline-block'>*</span>
                                </label>
                            </div>
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

export default LocationModal;
