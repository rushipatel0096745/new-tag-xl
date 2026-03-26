import React, { useState } from "react";

interface Props {
    next: () => void;
    prev: () => void;
    updateForm: (name: string, value: any) => void;
    validate: () => boolean;
    errors: any;
    formData: any;
}

const Step3 = ({ next, prev, updateForm, formData, validate, errors }: Props) => {
    function handleSave(e: any) {
        e.preventDefault();
        if (!validate()) {
            return;
        } else {
            next();
        }
        // next();
    }

    const SELECT_TRIGGER = "CUSTOM";

    const [selectOption, setSelectOption] = useState<string>();

    function handleSelectChange(e: any) {
        if (!formData.third_party_start_date) return;
        const value = e.target.value;

        if (value === "") {
            return;
        }

        setSelectOption(value);

        if (value !== SELECT_TRIGGER) {
            const startDate = new Date(formData.third_party_start_date);
            const newDate = new Date(startDate);

            newDate.setMonth(startDate.getMonth() + Number(value));
            newDate.setDate(newDate.getDate() - 1); 

            const newFormattedDate = newDate.toISOString().split("T")[0];

            console.log("start date:", formData.third_party_start_date);
            console.log("new date:", newFormattedDate);

            updateForm("third_party_expiry_date", newFormattedDate);
        }
    }

    // function handleSelectChange(e) {
    //     const value = e.target.value;

    //     if (value == "") {
    //         return;
    //     }

    //     setSelectOption(value);

    //     if (value !== SELECT_TRIGGER) {
    //         const date = new Date(formData.third_party_start_date);
    //         const newDate = new Date();
    //         newDate.setDate(date.getMonth() + value);
    //         const newFormattedDate = newDate.toISOString().split("T")[0];

    //         console.log("start date: ", formData.third_party_start_date);
    //         console.log("new date: ", newFormattedDate);

    //         updateForm("third_party_expiry_date", newFormattedDate);
    //     }
    // }

    return (
        <form action='' method='POST' className='block'>
            <div className='card-box-inner border-3 border-solid border-[#f5f6fa] rounded-3xl p-5.5'>
                <div className='card-box-block'>
                    <div className='card-box-head mb-4'>
                        <h4 className='title h3 text-[18px] font-semibold leading-6'>Certificates</h4>
                    </div>
                </div>
            </div>
            <div className='card-box-block_body'>
                <div className='card-box-block_body'>
                    <div className='oem-certificate'>
                        <div className='form-group gap-12'>
                            <h4 className='h5 mb-3 text-[14px] font-semibold leading-5'>
                                OEM Certificate<span className='require'>*</span>
                            </h4>
                            <div className='image-upload-block certificate-upload-block flex flex-col items-center gap-4'>
                                <div className='upload-block-wrapper w-full'>
                                    <div className='upload-block w-full cursor-pointer text-[#333] text-center border-2 border-dashed border-[#c9d5ff] rounded-[10px] flex-col justify-center items-center gap-[10px] h-[180px] transition-[background] duration-200 flex relative overflow-hidden'>
                                        <input
                                            className='file-input opacity-0 cursor-pointer absolute inset-0'
                                            id='oem_certificate'
                                            type='file'
                                            name='oem_certificate'
                                            onChange={(e) => updateForm("oem_certificate", e.target.files && e.target.files[0])}
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
                                            Upload file <br /> no more 5 Mb
                                        </span>
                                        <button className='btn min-w-19 h-auto px-[5px] appearance-none cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-white box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex '>
                                            Upload
                                        </button>
                                    </div>
                                    {errors?.oem_certificate && (
                                        <div className='text-red-600'>
                                            <p>{errors.oem_certificate}</p>
                                        </div>
                                    )}
                                </div>
                                {formData.oem_certificate && (
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
                                                    {formData.oem_certificate.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className='border-0 border-t border-[#ebebeb] h-[1px] my-[22px] p-0 block' />

                    <div className='third-party-certificate'>
                        <div className='form-group gap-12'>
                            <h4 className='h5 mb-3 text-[14px] font-semibold leading-5'>Third Party Certificate</h4>
                            <div className='image-upload-block certificate-upload-block flex flex-col items-center gap-4'>
                                <div className='upload-block w-full cursor-pointer text-[#333] text-center border-2 border-dashed border-[#c9d5ff] rounded-[10px] flex-col justify-center items-center gap-[10px] h-[180px] transition-[background] duration-200 flex relative overflow-hidden'>
                                    <input
                                        className='file-input opacity-0 cursor-pointer absolute inset-0'
                                        id='third_party_certificate'
                                        type='file'
                                        name='third_party_certificate'
                                        onChange={(e) => updateForm("third_party_certificate", e.target.files && e.target.files[0])}
                                    />
                                    <div className='upload-icon bg-[#d7e0f9] rounded-[6px] justify-center items-center w-[40px] h-[40px] transition-colors duration-200 flex'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width={25}
                                            height={24}
                                            viewBox='0 0 25 24'
                                            fill='none'>
                                            <path
                                                d='M18.5313 22V20.0313H16.5625C16.0103 20.0312 15.5625 19.5835 15.5625 19.0313C15.5625 18.479 16.0103 18.0313 16.5625 18.0313H18.5313V16.0625C18.5313 15.5103 18.979 15.0625 19.5313 15.0625C20.0835 15.0625 20.5312 15.5103 20.5313 16.0625V18.0313H22.5C23.0523 18.0313 23.5 18.479 23.5 19.0313C23.5 19.5836 23.0523 20.0313 22.5 20.0313H20.5313V22C20.5312 22.5523 20.0835 23 19.5313 23C18.979 23 18.5313 22.5523 18.5313 22ZM15 12.5C15 11.1193 13.8807 10 12.5 10C11.1193 10 10 11.1193 10 12.5C10.0001 13.8807 11.1193 15 12.5 15C13.8807 15 15 13.8807 15 12.5ZM20.5 12.75V9.25686L20.4951 8.86526C20.432 7.92922 19.7296 7.17191 18.8194 7.02542L18.6338 7.00491C18.5753 7.00099 18.4971 7.00003 18.2432 7.00003L18.0205 6.99808C17.2355 6.97353 16.4777 6.7185 15.8399 6.26858L15.5742 6.0635L15.4063 5.91702L15.208 5.73929C15.0663 5.61257 14.9742 5.53104 14.9072 5.47366L14.7569 5.35354C14.5181 5.18534 14.2454 5.07114 13.959 5.01956L13.835 5.00198C13.7334 4.9902 13.6216 4.98831 13.2412 4.98831H11.7588C11.5687 4.98831 11.4456 4.9884 11.3574 4.99026L11.1651 5.00198C10.875 5.03571 10.5956 5.13176 10.3477 5.28421L10.2432 5.35354C10.2014 5.38299 10.1597 5.41635 10.0928 5.47366L9.79201 5.73929L9.59377 5.91702L9.4258 6.0635C8.82402 6.56859 8.08911 6.88408 7.31349 6.97366L6.97951 6.99808C6.91362 7.00013 6.84703 7.00003 6.75685 7.00003L6.36623 7.00491C5.36758 7.07208 4.5723 7.86668 4.5049 8.86526C4.50096 8.92384 4.50002 9.00242 4.50002 9.25686V14.7002C4.50002 15.5566 4.50036 16.1389 4.53713 16.5889C4.57295 17.0273 4.6381 17.2518 4.71779 17.4082L4.79494 17.5459C4.98709 17.8592 5.26259 18.1145 5.59181 18.2823L5.72463 18.3389C5.87419 18.3924 6.08257 18.4351 6.41115 18.4619C6.8612 18.4987 7.44339 18.5 8.29982 18.5H12.5C13.0523 18.5 13.5 18.9477 13.5 19.5C13.5 20.0523 13.0523 20.5 12.5 20.5H8.29982C7.47633 20.5 6.79844 20.5011 6.24806 20.4561C5.75609 20.4159 5.29903 20.3347 4.8672 20.1494L4.68361 20.0635C4.02532 19.728 3.47408 19.2182 3.08986 18.5918L2.93556 18.3155C2.6885 17.8303 2.58988 17.3138 2.54396 16.752C2.499 16.2016 2.50002 15.5237 2.50002 14.7002V9.25686C2.50002 9.03493 2.49922 8.87398 2.50881 8.73147C2.64317 6.73391 4.23391 5.14323 6.23146 5.00882L6.46388 5.001C6.54966 4.99994 6.64572 5.00003 6.75685 5.00003C6.85923 5.00003 6.88947 4.99991 6.91701 4.99905L7.084 4.98636C7.47183 4.94155 7.83975 4.78386 8.14064 4.53128L8.26076 4.42581L8.45802 4.24905L8.79396 3.95218C8.89578 3.86538 8.99177 3.78927 9.09181 3.71878L9.3008 3.58108C9.79653 3.2763 10.3536 3.08212 10.9336 3.01468L11.1182 2.99905C11.3059 2.98755 11.5074 2.98831 11.7588 2.98831H13.2412C13.5764 2.98831 13.823 2.98637 14.0664 3.01468C14.7294 3.09177 15.3626 3.33435 15.9082 3.71878L16.0567 3.82913C16.2044 3.94576 16.3545 4.08139 16.542 4.24905L16.7393 4.42581L16.8594 4.53128L16.9922 4.63382C17.3112 4.85901 17.6903 4.98677 18.083 4.99905L18.2432 5.00003C18.4651 5.00003 18.6261 4.99923 18.7686 5.00882L18.9541 5.02542C20.8639 5.24258 22.3611 6.79615 22.4912 8.73147L22.499 8.9639C22.5001 9.04965 22.5 9.14577 22.5 9.25686V12.75C22.5 13.3023 22.0523 13.75 21.5 13.75C20.9478 13.75 20.5001 13.3023 20.5 12.75ZM17 12.5C17 14.9853 14.9853 17 12.5 17C10.0148 17 8.00007 14.9853 8.00002 12.5C8.00002 10.0147 10.0147 8.00003 12.5 8.00003C14.9853 8.00003 17 10.0147 17 12.5Z'
                                                fill='#263f94'
                                            />
                                        </svg>
                                    </div>
                                    <span className='upload-text'>
                                        Upload file <br /> no more 5 Mb
                                    </span>
                                    <button className='min-w-19 h-auto px-[5px] appearance-none cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-white box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-medium transition-all duration-200 inline-flex '>
                                        Upload
                                    </button>
                                </div>
                                <div className='row flex flex-wrap gap-4 w-full'>
                                    <div className='col-6 w-[calc(50%-8px)]'>
                                        {formData.third_party_certificate && (
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
                                                            {formData.third_party_certificate.name}
                                                        </span>
                                                        <div className='actions-btn flex items-center gap-2'>
                                                            <button
                                                                className='icon-button delete cursor-pointer'
                                                                type='button'
                                                                onClick={() =>
                                                                    updateForm("third_party_certificate", "")
                                                                }>
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
                                                                            d='M6.71967 6.71967C7.01256 6.42678 7.48744 6.42678 7.78033 6.71967L10 8.93934L12.2197 6.71967C12.5126 6.42678 12.9874 6.42678 13.2803 6.71967C13.5732 7.01256 13.5732 7.48744 13.2803 7.78033L11.0607 10L13.2803 12.2197C13.5732 12.5126 13.5732 12.9874 13.2803 13.2803C12.9874 13.5732 12.5126 13.5732 12.2197 13.2803L10 11.0607L7.78033 13.2803C7.48744 13.5732 7.01256 13.5732 6.71967 13.2803C6.42678 12.9874 6.42678 12.5126 6.71967 12.2197L8.93934 10L6.71967 7.78033C6.42678 7.48744 6.42678 7.01256 6.71967 6.71967Z'
                                                                            fill='#F56262'
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className='col-6 w-[calc(50%-8px)]'>
                                        <div className='input-date-wrapper row flex justify-end gap-4 w-full flex-wrap'>
                                            <div className='col-4 w-[calc(33.33%-11px)]'>
                                                <div className='form-group flex flex-col gap-2'>
                                                    <div className='fancy-input start-date relative'>
                                                        <input
                                                            id='third_party_start_date'
                                                            className='form-input text-[#17181a] box-border bg-[#f5f6fa] border border-[#efefef] rounded-[10px] w-full h-[44px] pt-[18px] px-[14px] pb-[8px] font-sans text-[14px] font-medium'
                                                            type='date'
                                                            // defaultValue='2026-03-10'
                                                            value={formData.third_party_start_date}
                                                            name='third_party_start_date'
                                                            onChange={(e) =>
                                                                updateForm("third_party_start_date", e.target.value)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor='third_party_start_date'
                                                            className='form-label text-[#676767] pointer-events-none bg-transparent px-[2px] text-[14px] transition-all duration-200 absolute top-1/2 left-[12px] -translate-y-1/2'>
                                                            Start :
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-4'>
                                                <div className='form-group'>
                                                    <div className='fancy-input select'>
                                                        <select
                                                            id='days'
                                                            name='days'
                                                            // onChange={(e) => setSelectOption(e.target.value)}
                                                            onChange={handleSelectChange}
                                                            className='form-select text-[#17181a] box-border bg-[#f5f6fa] border border-[#efefef] rounded-[10px] w-full h-[44px] pt-[18px] px-[14px] pb-[8px] font-sans text-[14px] font-medium'>
                                                            <option value=''>Select Frequency</option>
                                                            <option value={1}>1 Month</option>
                                                            <option value={3}>3 Months</option>
                                                            <option value={6}>6 Months</option>
                                                            <option value={12}>12 Months</option>
                                                            <option value={SELECT_TRIGGER}>Custom</option>
                                                        </select>
                                                        <label
                                                            htmlFor='days'
                                                            className='form-label text-[#676767] pointer-events-none bg-transparent px-[2px] text-[14px] transition-all duration-200 absolute top-1/2 left-[12px] -translate-y-1/2'>
                                                            Select Expiry Frequency
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-4  w-[calc(33.33%-11px)]'>
                                                <div className='form-group flex flex-col gap-2'>
                                                    <div className='fancy-input end-date relative'>
                                                        <input
                                                            disabled={selectOption !== SELECT_TRIGGER}
                                                            id='third_party_expiry_date'
                                                            className='form-input text-[#17181a] box-border bg-[#f5f6fa] border border-[#efefef] rounded-[10px] w-full h-[44px] pt-[18px] px-[14px] pb-[8px] font-sans text-[14px] font-medium'
                                                            min='2026-03-12'
                                                            type='date'
                                                            value={formData.third_party_expiry_date}
                                                            name='third_party_expiry_date'
                                                            onChange={(e) =>
                                                                updateForm("third_party_expiry_date", e.target.value)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor='third_party_expiry_date'
                                                            className='form-label text-[#676767] pointer-events-none bg-transparent px-[2px] text-[14px] transition-all duration-200 absolute top-1/2 left-[12px] -translate-y-1/2'>
                                                            Expiry :
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className='border-0 border-t border-[#ebebeb] h-[1px] my-[22px] p-0 block' />
                        <div className='actions-btn next_step-btn flex items-center justify-between gap-2 mt-6 '>
                            <button
                                onClick={prev}
                                type='button'
                                className='btn continue py-2.5 pr-3 pl-3.5 all-unset text-[#111c43] cursor-pointer text-center bg-[#41414126] border border-[#0000 box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-500 transition-all duration-200 inline-flex'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width={18}
                                    height={18}
                                    viewBox='0 0 18 18'
                                    fill='none'>
                                    <path
                                        fillRule='evenodd'
                                        clipRule='evenodd'
                                        d='M8.5771 14.2023C8.3135 14.4659 7.88611 14.4659 7.62251 14.2023L2.89751 9.47732C2.6339 9.21372 2.6339 8.78633 2.89751 8.52273L7.6225 3.79773C7.88611 3.53412 8.3135 3.53412 8.5771 3.79773C8.8407 4.06133 8.8407 4.48872 8.5771 4.75232L5.0044 8.32502L14.6248 8.32502C14.9976 8.32502 15.2998 8.62723 15.2998 9.00002C15.2998 9.37282 14.9976 9.67502 14.6248 9.67502L5.0044 9.67502L8.5771 13.2477C8.8407 13.5113 8.8407 13.9387 8.5771 14.2023Z'
                                        fill='#111c42'
                                    />
                                </svg>
                                Back
                            </button>
                            <button
                                // onClick={handleSubmit}
                                type='submit'
                                onClick={handleSave}
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
                </div>
            </div>
        </form>
    );
};

export default Step3;
