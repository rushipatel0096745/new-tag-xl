import React from "react";

const TextInput = () => {
    return (
        <div className='fancy-input relative'>
            <input
                placeholder='Text field'
                disabled
                type='text'
                className='w-[320px] bg-white p-3.5 text-[#b5b4b4] box-border border border-solid border-[#efefef] rounded-[10px] h-11 text-[14px] font-medium'
            />
        </div>
    );
};

export default TextInput;
