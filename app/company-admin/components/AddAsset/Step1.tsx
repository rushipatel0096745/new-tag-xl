import { checkTagAssigned } from "@/app/services/company-admin/tags";
import React, { startTransition, useActionState, useEffect, useState } from "react";

type TagType = "RFID" | "QR" | "Manual" | "";

interface TagItem {
    tag_type: TagType;
    uid: string;
}

interface Props {
    next: () => void;
    updateForm: (name: string, value: any) => void;
    validate: () => boolean;
    errors: any;
    formData: any;
}

interface Tag {
    id: number;
    uid: string;
    tag_type: string;
    is_assigned: boolean;
    created_at: string;
    updated_at: any;
}

const Step1 = ({ next, updateForm, validate, errors, formData }: Props) => {
    const initialList: TagItem = {
        tag_type: "",
        uid: "",
    };
    const [tagList, setTagList] = useState<TagItem>(initialList);

    const [showMsg, setShowMsg] = useState<string>("");

    const [assignError, setAssignError] = useState("");

    const [tagData, setTagData] = useState<Tag>();

    const [tagId, setTagId] = useState<number>();

    // const [error, setError] = useState<string | undefined>("");

    const handleUidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // setError("");
        const { value } = event.target;
        setTagList({ ...tagList, uid: value });
    };

    const handleTagTypeSelect = (type: TagType) => {
        // setError("");
        setTagList({ ...tagList, tag_type: type });
    };

    const handleSave = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        // if (tagList.tag_type === "" || tagList.uid === "") {
        //     // console.log("form data", tagList);
        //     setError("Please fill required fields");
        //     return;
        // }

        const flag = validate();
        if (!flag) {
            return;
        }

        const checkAssigned = await checkTagAssigned(formData.uid);

        if (!checkAssigned?.success) {
            setAssignError(checkAssigned?.message || "");
            return;
        }

        if (checkAssigned?.success) {
            setTagList(initialList);

            // tag is created but not assigned to any asset
            if (checkAssigned?.data) {
                setTagData(checkAssigned.data);
                setTagId(checkAssigned.data);
                // console.log("tag id: ", tagId)
                updateForm("tag_id", checkAssigned.data);
                console.log("form data", formData);
                next();
                return;
            }

            // create the new tag as it is not assigned with any assets

            // setShowMsg("Tag created successfully");
            // // setError("");
            // setAssignError("");
            // next();
        }
        // next()
    };

    const tagTypeOptions: { label: string; value: TagType; text: string }[] = [
        { label: "RFID", value: "RFID", text: "Scan or enter RFID tag" },
        { label: "QR", value: "QR", text: "Scan or enter QR code" },
        { label: "Manual", value: "Manual", text: "Enter the unique ID" },
    ];
    return (
        <form action='' method='POST' className='block'>
            <div className='tab-content border bg-white border-solid border-[#ededed] rounded-2xl p-5.5'>
                {showMsg && (
                    <div className='text-green-700'>
                        <p>{showMsg}</p>
                    </div>
                )}

                {errors.tag_type && (
                    <div className='text-red-600'>
                        <p>{errors.tag_type}</p>
                    </div>
                )}

                {/* {errors.tag_id && (
                    <div className='text-red-600'>
                        <p>{errors.tag_id}</p>
                    </div>
                )} */}
                <div className='block'>
                    <div className='add-one-by-one_content'>
                        <h4 className='title h4 mb-5 text-[16px] font-semibold leading-5.5'>Select Tag</h4>
                        <div className='add-one-by-one_items flex flex-col gap-2.5'>
                            <div className='add-one-by-one_item grid grid-cols-[316px_1fr_28px] gap-2.5'>
                                {/* Tag Type Selector */}
                                <div className='actions-btn flex items-center justify-between gap-2'>
                                    {tagTypeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type='button'
                                            // onClick={() => handleTagTypeSelect(option.value)}
                                            onClick={() => updateForm("tag_type", option.value)}
                                            className={`btn min-w-25 cursor-pointer text-center rounded-4xl justify-center items-center gap-[6px] h-[38px] px-[10px] py-[14px] text-[14px] font-medium inline-flex border border-solid transition-all duration-150
                                                ${
                                                    formData.tag_type === option.value
                                                        ? "bg-[#263f94] border-[#263f94] text-white"
                                                        : "bg-[#f5f6fa] border-[#c9d5ff] text-[#111c43]"
                                                }`}>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {/* UID Input */}
                                <div className='fancy-input relative'>
                                    <input
                                        placeholder=''
                                        type='text'
                                        value={formData.uid}
                                        name='uid'
                                        className='text-[#17181a] bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full h-11 text-[14px] font-medium pt-[18px] px-[14px] pb-[8px]'
                                        // onChange={(event) => handleUidChange(event)}
                                        onChange={(e) => updateForm("uid", e.target.value)}
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
                        </div>
                    </div>
                </div>

                <div className='actions-btn next_step-btn flex items-center justify-between gap-2 mt-6 '>
                    {assignError && (
                        <div className='assign-error bg-yellow-400 text-[14px] text-amber-900'>
                            <p>{assignError}</p>
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        type='submit'
                        className='btn continue py-2.5 pr-3 pl-3.5 ml-auto all-unset cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-white box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-500 transition-all duration-200 inline-flex'>
                        Continue
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='align-bottom'
                            width={18}
                            height={18}
                            viewBox='0 0 18 18'
                            fill='none'>
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M9.4229 3.79768C9.6865 3.53407 10.1139 3.53407 10.3775 3.79768L15.1025 8.52268C15.3661 8.78628 15.3661 9.21367 15.1025 9.47727L10.3775 14.2023C10.1139 14.4659 9.6865 14.4659 9.4229 14.2023C9.1593 13.9387 9.1593 13.5113 9.4229 13.2477L12.9956 9.67498H3.3752C3.0024 9.67498 2.7002 9.37277 2.7002 8.99998C2.7002 8.62718 3.0024 8.32498 3.3752 8.32498H12.9956L9.4229 4.75227C9.1593 4.48867 9.1593 4.06128 9.4229 3.79768Z'
                                fill='white'
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Step1;
