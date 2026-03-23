import React, { useEffect, useState } from "react";
import BooleanInput from "./BooleanInput";
import TextInput from "./TextInput";
import {
    getMaintenanceTemplateList,
    getMaintenanceTemplateQuestions,
    PreUseTemplate,
} from "@/app/services/company-admin/template-actions";

interface Props {
    updateForm: (name: string, value: any) => void;
    errors: any;
}

const MaintenanceTemplate = ({ updateForm, errors }: Props) => {
    const [list, setList] = useState<PreUseTemplate[]>([]);

    const [selectOption, setSelectOption] = useState<string>();

    const [questions, setQuestions] = useState<any>([]);

    const questionRenderer = function (questionType: string): React.ReactNode {
        // console.log("question renderer called");
        switch (questionType) {
            case "boolean":
                return <BooleanInput />;
            case "text":
                return <TextInput />;
            default:
                return <TextInput />;
        }
    };

    function handleSelection(e: any) {
        const value = e.target.value;
        if (value == "") {
            setQuestions([]);
            return;
        }

        getQuestions(value);
        setSelectOption(value);
        console.log("questions: ", questions);
    }

    async function getQuestions(id: number) {
        const result = await getMaintenanceTemplateQuestions(Number(id));
        setQuestions(result);
    }

    async function getList() {
        const result = await getMaintenanceTemplateList();
        setList(result);
    }

    useEffect(() => {
        getList();
        // console.log("list: ", list)
    }, []);

    return (
        <div className='card-box-inner border-3 solid border-[#f5f6fa] rounded-[18px] p-5.5'>
            <div className='card-box-block pre-use-template is-active block'>
                <div className='card-box-block_head mb-4'>
                    <h4 className='h3 title text-[18px] font-semibold leading-6'>Maintenance check template</h4>
                </div>
                <div className='card-box-block_body'>
                    <div className='row flex gap-4 w-full flex-wrap'>
                        <div className='col w-full'>
                            <div className='card-box-inner  border-3 solid border-[#f5f6fa] rounded-[18px] p-5.5'>
                                <h4 className='h5 title mb-3 text-[14px] font-semibold leading-6'>Template</h4>
                                <div className='fancy-input select relative'>
                                    <select
                                        id='maintenance_template_id'
                                        name='maintenance_template_id'
                                        onChange={(e) => {
                                            updateForm("maintenance_template_id", e.target.value);
                                            handleSelection(e);
                                        }}
                                        className='form-select text-[#17181a] box-border bg-[#f5f6fa] border border-[#efefef] rounded-[10px] w-full h-[44px] pt-[18px] px-[14px] pb-[8px] font-sans text-[14px] font-medium'>
                                        <option value=''>Select</option>
                                        {list.map((item) => (
                                            <option value={item.id} key={item.id}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                    <label
                                        htmlFor='pre_use_template_id'
                                        className='form-label text-[#676767] pointer-events-none bg-transparent px-[2px] text-[14px] transition-all duration-200 absolute top-1/2 left-[12px] -translate-y-1/2'>
                                        Select Template<span className='require'>*</span>
                                    </label>
                                    {errors.maintenance_template_id && (
                                        <div className='text-red-500'>
                                            <p>{errors.maintenance_template_id}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='col w-full'>
                            {questions.length !== 0 && (
                                <div className='card-box-inner border-3 solid border-[#f5f6fa] rounded-[18px] p-5.5'>
                                    <h3 className='h3 title mb-4 text-[18px] font-semibold leading-6'>All Questions</h3>

                                    <div className='all-questions-wrapper'>
                                        <h5 className='h5 title mb-3 text-[14px] font-semibold leading-6'>
                                            Template Questions
                                        </h5>

                                        <ul className='template-questions bg-[#f5f6fa] border border-solid border-[#efefef] px-4 pt-4 pl-8 flex flex-col gap-[6px] list-none'>
                                            {questions.map((q: any) => (
                                                <li key={q.id} className='list-item'>
                                                    <div className='template-question-item w-full'>
                                                        <p className='question font-semibold'>{q.question}</p>

                                                        <div className='template-question-item-type mt-4'>
                                                            <div className='template-question-item-type_label mb-2.5 text-[#797979]'>
                                                                Question Type :
                                                            </div>

                                                            {questionRenderer(q.type)}

                                                            <hr className='border-0 m-4 border-t border-solid border-[#ebebeb]' />
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* <div className='card-box-inner border-3 solid border-[#f5f6fa] rounded-[18px] p-5.5'>
                                <h3 className='h3 title mb-4 title text-[18px] font-semibold leading-6'>
                                    All Questions
                                </h3>
                                <div className='all-questions-wrapper'>
                                    <h5 className='h5 title mb-3 text-[14px] font-semibold leading-6'>
                                        Template Questions
                                    </h5>
                                    <ul className='template-questions bg-[#f5f6fa] border border-solid border-[#efefef] px-4 pt-4 pl-8 flex flex-col gap-[6px] list-none'>
                                        <li className='list-item'>
                                            <div className='template-question-item w-full'>
                                                <p className='question font-semibold'>Fit for use?</p>
                                                <div className='template-question-item-type mt-4'>
                                                    <div className='template-question-item-type_label mb-2.5 text-[#797979]'>
                                                        Question Type :
                                                    </div>
                                                    <div className='flex gap-4 box-border'>
                                                        <div className='flex gap-2'>
                                                            <input
                                                                id='yes'
                                                                className='custom-radio appearance-none vertical-middle cursor-pointer border border-[#111c43] bg-[#f5f6fa] rounded-full outline-0 w-[18px] h-[18px] m-0 relative overflow-hidden'
                                                                type='radio'
                                                                name='yesNo'
                                                            />
                                                            <label
                                                                htmlFor='yes'
                                                                className='cursor-pointer text-[#111c42b3] text-[14px] font-normal leading-5'>
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
                                                            <label
                                                                htmlFor='no'
                                                                className='cursor-pointer text-[#111c42b3] text-[14px] font-normal leading-5'>
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <hr className='border-0 m-4 border-t border-solid border-[#ebebeb] h-px p-0 block' />
                                                </div>
                                            </div>
                                        </li>
                                        <li className='list-item'>
                                            <div className='template-question-item w-full'>
                                                <p className='question font-semibold'>Remarks?</p>
                                                <div className='template-question-item-type mt-4'>
                                                    <div className='template-question-item-type_label mb-2.5 text-[#797979]'>
                                                        Question Type :
                                                    </div>
                                                    <div className='fancy-input relative'>
                                                        <input
                                                            placeholder='Text field'
                                                            disabled
                                                            type='text'
                                                            className='w-[320px] bg-white p-3.5 text-[#b5b4b4] box-border border border-solid border-[#efefef] rounded-[10px] h-11 text-[14px] font-medium'
                                                        />
                                                    </div>
                                                    <hr className='border-0 border-t border-solid border-[#ebebeb] h-px p-0 block m-4' />
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}
                        </div>
                        <div className='col w-full'>
                            <div className='card-box-inner  border-3 solid border-[#f5f6fa] rounded-[18px] p-5.5'>
                                <h4 className='h5 title mb-3 text-[14px] font-semibold leading-6'>Add Question</h4>
                                <div className='add-question-wrapper row flex gap-2.5 w-full flex-wrap '>
                                    <div className='col w-full'>
                                        <textarea
                                            id='question_box_pre'
                                            name='question_box'
                                            className='form-textarea min-h-25 align-bottom bg-[#f5f6fa] border border-solid border-[#efefef] rounded-[10px] w-full text-[14px] py-2.5 px-3'
                                            placeholder='Type your question here'
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className='col w-full'>
                                        <div className='fancy-input select relative'>
                                            <select
                                                id='question_type_pre'
                                                className='form-select text-[#17181a] box-border bg-[#f5f6fa] border border-[#efefef] rounded-[10px] w-full h-[44px] pt-[18px] px-[14px] pb-[8px] font-sans text-[14px] font-medium'>
                                                <option value='text'>Text Field</option>
                                                <option value='boolean'>Yes / No</option>
                                                <option value='select'>Select</option>
                                                <option value='checkbox'>Checkbox</option>
                                            </select>
                                            <label
                                                htmlFor='question_type_pre'
                                                className='form-label text-[#676767] pointer-events-none bg-transparent px-[2px] text-[14px] transition-all duration-200 absolute top-1/2 left-[12px] -translate-y-1/2'>
                                                Select Question Type
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='actions-btn mt-4 flex items-center gap-2'>
                                    <button
                                        className='inline-flex items-center justify-center gap-[6px] h-[38px] px-[14px] py-[10px] cursor-pointer text-center bg-[#263f94] border border-[#263f94] text-[white] box-border rounded-[40px] text-[14px] font-medium transition-all duration-200 focus:outline-none'
                                        type='button'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='align-bottom'
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
    );
};

export default MaintenanceTemplate;
