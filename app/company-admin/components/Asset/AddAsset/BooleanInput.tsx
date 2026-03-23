import React from "react";

const BooleanInput = () => {
    return (
        <div className='flex gap-4 box-border'>
            <div className='flex gap-2'>
                <input
                    id='yes'
                    className='custom-radio appearance-none vertical-middle cursor-pointer border border-[#111c43] bg-[#f5f6fa] rounded-full outline-0 w-[18px] h-[18px] m-0 relative overflow-hidden'
                    type='radio'
                    name='yesNo'
                />
                <label htmlFor='yes' className='cursor-pointer text-[#111c42b3] text-[14px] font-normal leading-5'>
                    Yes
                </label>
            </div>
            <div className='flex gap-2'>
                <input
                    id='no'
                    className='custom-radio appearance-none vertical-middle cursor-pointer border border-[var(--primary)] bg-[var(--light-blue)] rounded-full outline-0 w-[18px] h-[18px] m-0 relative overflow-hidden'
                    type='radio'
                    name='yesNo'
                />
                <label htmlFor='no' className='cursor-pointer text-[#111c42b3] text-[14px] font-normal leading-5'>
                    No
                </label>
            </div>
        </div>
    );
};

export default BooleanInput;
