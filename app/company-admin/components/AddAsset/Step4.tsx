import React, { useEffect } from "react";
import PreuseTemplate from "./PreuseTemplate";
import MaintenanceTemplate from "./MaintenanceTemplate";
import BooleanInput from "./BooleanInput";
import TextInput from "./TextInput";

interface Props {
    next: () => void;
    prev: () => void;
    updateForm: (name: string, value: any) => void;
    handleSubmit: () => void;
    validate: () => boolean;
    errors: any;
    formData: any;
}

const Step4 = ({ prev, next, updateForm, formData, validate, errors, handleSubmit }: Props) => {
    const handleTemplateSubmit = function (e: React.SubmitEvent<HTMLFormElement>): void {
        e.preventDefault();
        handleSubmit();
    };

    useEffect(() => console.log(formData));
    return (
        <form action='' method='POST' className='block'>
            <div className='row flex gap-4 w-full flex-wrap'>
                <div className='col w-full'>
                    <div className='card-box-inner border-3 solid border-[#f5f6fa] rounded-[18px] p-5.5'>
                        <div className='card-box-block pre-use-template is-active block '>
                            <div className='card-box-block_head mb-4 '>
                                <h4 className='h3 title text-[18px] font-semibold leading-6'>Manual Guide</h4>
                            </div>
                            <div className='card-box-block_body'>
                                <div className='row flex gap-4 w-full flex-wrap'>
                                    <div className='col w-full'>
                                        <div className='card-box-inner border-3 solid border-[#f5f6fa] rounded-[18px] p-5.5'>
                                            <h4 className='h5 title mb-3 text-[14px] font-semibold leading-6'>
                                                Template
                                            </h4>
                                            <div className='fancy-input select relative'>
                                                <select
                                                    name='manual_template_id'
                                                    id='manual_template_id'
                                                    onChange={(e) => updateForm("manual_template_id", e.target.value)}
                                                    className='form-select text-[#17181a] box-border bg-[#f5f6fa] border border-[#efefef] rounded-[10px] w-full h-[44px] pt-[18px] px-[14px] pb-[8px] font-sans text-[14px] font-medium'>
                                                    <option value=''>Select Manual Template</option>
                                                    <option value={2}>asd</option>
                                                    <option value={1}>Test manual template</option>
                                                </select>
                                                <label
                                                    className='form-label text-[#676767] pointer-events-none bg-transparent px-[2px] text-[14px] transition-all duration-200 absolute top-1/2 left-[12px] -translate-y-1/2'
                                                    htmlFor='manual_template_id'>
                                                    Manuals
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col w-full'>
                    <PreuseTemplate updateForm={updateForm} errors={errors} />
                </div>

                <div className='col w-full'>
                    <MaintenanceTemplate updateForm={updateForm} errors={errors} />
                </div>
            </div>
            <div className='actions-btn next_step-btn flex items-center justify-between gap-2 mt-6 '>
                <button
                    onClick={prev}
                    type='button'
                    className='btn continue py-2.5 pr-3 pl-3.5 all-unset text-[#111c43] cursor-pointer text-center bg-[#41414126] border border-[#0000 box-border rounded-[40px] justify-center items-center gap-[6px] h-[38px] px-[14px] py-[10px] text-[14px] font-500 transition-all duration-200 inline-flex'>
                    <svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} viewBox='0 0 18 18' fill='none'>
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
                    onClick={(e) => handleTemplateSubmit(e)}
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
        </form>
    );
};

export default Step4;

{
    /* <div className='col'>
                    <div className='card-box-inner border-3 solid border-[#f5f6fa] rounded-[18px] p-5.5'>
                        <div className='card-box-block pre-use-template is-active block'>
                            <div className='card-box-block_head'>
                                <h4 className='h3 title'>Maintenance check template</h4>
                            </div>
                            <div className='card-box-block_body'>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='card-box-inner'>
                                            <h4 className='h5 title mb-12'>Template</h4>
                                            <div className='fancy-input select'>
                                                <select
                                                    id='maintenance_template_id'
                                                    className='form-select'
                                                    name='maintenance_template_id'>
                                                    <option value=''>Select</option>
                                                    <option value={2}>xzcxcz</option>
                                                    <option value={1}>Default</option>
                                                </select>
                                                <label htmlFor='maintenance_template_id' className='form-label'>
                                                    Select Template<span className='require'>*</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='card-box-inner'>
                                            <h3 className='h3 title mb-12'>All Questions</h3>
                                            <div className='all-questions-wrapper'>
                                                <h5 className='h5 title mb-12'>Template Questions</h5>
                                                <ul className='template-questions'>
                                                    <li>
                                                        <div className='template-question-item'>
                                                            <p className='question'>Fit for use?</p>
                                                            <div className='template-question-item-type mt-12'>
                                                                <div className='template-question-item-type_label mb-10'>
                                                                    Question Type :
                                                                </div>
                                                                <div className='d-flex gap-16'>
                                                                    <div className='d-flex gap-8'>
                                                                        <input
                                                                            id='yes'
                                                                            className='custom-radio'
                                                                            type='radio'
                                                                            name='yesNo'
                                                                        />
                                                                        <label htmlFor='yes'>Yes</label>
                                                                    </div>
                                                                    <div className='d-flex gap-8'>
                                                                        <input
                                                                            id='no'
                                                                            className='custom-radio'
                                                                            type='radio'
                                                                            name='yesNo'
                                                                        />
                                                                        <label htmlFor='no'>No</label>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className='template-question-item'>
                                                            <p className='question'>Remarks?</p>
                                                            <div className='template-question-item-type mt-12'>
                                                                <div className='template-question-item-type_label mb-10'>
                                                                    Question Type :
                                                                </div>
                                                                <div className='fancy-input'>
                                                                    <input
                                                                        placeholder='Text field'
                                                                        disabled=''
                                                                        type='text'
                                                                    />
                                                                </div>
                                                                <hr />
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='card-box-inner'>
                                            <h4 className='h5 title mb-12'>Add Question</h4>
                                            <div className='add-question-wrapper row gap-10'>
                                                <div className='col'>
                                                    <textarea
                                                        id='question_box_maintenance'
                                                        name='question_box_maintenance'
                                                        className='form-textarea'
                                                        placeholder='Type your question here'
                                                        defaultValue={""}
                                                    />
                                                </div>
                                                <div className='col'>
                                                    <div className='fancy-input select'>
                                                        <select
                                                            id='question_type_maintenance'
                                                            name='question_type_maintenance'
                                                            className='form-select'>
                                                            <option value='text'>Text Field</option>
                                                            <option value='boolean'>Yes / No</option>
                                                            <option value='select'>Select</option>
                                                            <option value='checkbox'>Checkbox</option>
                                                        </select>
                                                        <label
                                                            htmlFor='question_type_maintenance'
                                                            className='form-label'>
                                                            Select Question Type
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='actions-btn mt-16'>
                                                <button className='btn' type='button'>
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
                                                            fill='#ffffffff'
                                                        />
                                                    </svg>
                                                    Add Question
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */
}
