import React, { useEffect, useRef, useState } from "react";
import BooleanInput from "./BooleanInput";
import TextInput from "./TextInput";
import {
    getMaintenanceTemplateList,
    getMaintenanceTemplateQuestions,
    PreUseTemplate,
} from "@/app/services/company-admin/template-actions";
import UpdateQuestionModal from "../../Templates/UpdateQuestionModal";

type QuestionType = "boolean" | "text" | "checkbox" | "select";

type Question = {
    id: number;
    question: string;
    type: QuestionType;
    options?: string[] | null;
};

interface OptionMap {
    [key: string]: string;
}

type FormattedQuestion = {
    id?: number;
    question: string;
    type: string;
    multiselect_value?: OptionMap;
};

interface Props {
    updateForm: (name: string, value: any) => void;
    errors: any;
    formData: any;
}

const MaintenanceTemplate = ({ updateForm, errors, formData }: Props) => {
    const [list, setList] = useState<PreUseTemplate[]>([]);

    const [selectOption, setSelectOption] = useState<string>();

    const [questions, setQuestions] = useState<any>([]);

    const questionTypes: Record<string, string> = {
        boolean: "Yes/No",
        text: "Textfield",
        checkbox: "Checkbox",
        select: "Select",
    };

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

    useEffect(() => {
        if (formData.maintenance_template_id) {
            getQuestions(formData.maintenance_template_id);
        }
    }, []);

    const [newMaintenanceQuestions, setNewMaintenanceQuestions] = useState<Question[]>([]);
    const [maintenanceQuestionText, setMaintenanceQuestionText] = useState("");
    const [maintenanceQuestionType, setMaintenanceQuestionType] = useState("");
    const [maintenanceQuestionOptions, setMaintenanceQuestionOptions] = useState<string[]>([]);
    const [maintenanceQuestionOption, setMaintenanceQuestionOption] = useState("");
    const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({});

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    function handleDragSort() {
        const items = [...newMaintenanceQuestions];
        const draggedItem = items.splice(dragItem.current!, 1)[0];
        items.splice(dragOverItem.current!, 0, draggedItem);
        dragItem.current = null;
        dragOverItem.current = null;
        setNewMaintenanceQuestions(items);
    }

    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [error, setError] = useState<Record<string, string>>({});

    // Save updated question from modal
    function handleSaveUpdatedQuestion(updated: Question) {
        setNewMaintenanceQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
        setEditingQuestion(null);
    }

    useEffect(() => {
        console.log("new maintenace questions: ", newMaintenanceQuestions);
        const formattedQuestions = formatQuestionBody(newMaintenanceQuestions);
        updateForm("asset_maintenance_questions", JSON.stringify(formattedQuestions));
    }, [newMaintenanceQuestions]);

    useEffect(() => {
        if (maintenanceQuestionType === "select" || maintenanceQuestionType === "checkbox") {
            setMaintenanceQuestionOptions((prev: string[]) => (prev.length === 0 ? [""] : prev));
        }
    }, [maintenanceQuestionType]);

    function questionValidate() {
        const newErrors: Record<string, string> = {};
        if (!maintenanceQuestionText.trim()) newErrors.maintenanceQuestionText = "Question Text is required";
        if (!maintenanceQuestionType) newErrors.maintenanceQuestionType = "Question Type is required";

        if (maintenanceQuestionType === "select" || maintenanceQuestionType === "checkbox") {
            if (maintenanceQuestionOptions.filter((opt) => opt.trim() !== "").length === 0) {
                newErrors.maintenanceQuestionOptions = "At least one option is required";
            }
        }

        const hasEmpty = maintenanceQuestionOptions.some((opt) => !opt.trim());
        if (hasEmpty) {
            newErrors.maintenanceQuestionOptions = "Options can not be empty";
        }

        const uniqueOptions = new Set(maintenanceQuestionOptions);

        if (uniqueOptions.size !== maintenanceQuestionOptions.length) {
            newErrors.maintenanceQuestionOptions = "Remove the duplicate options";
        }

        setQuestionErrors(newErrors);
        return Object.entries(newErrors).length === 0;
    }

    function handleMaintenanceNewAddQuestion() {
        if (!questionValidate()) return;

        const questionObj: Question = {
            id: Date.now(),
            question: maintenanceQuestionText,
            type: maintenanceQuestionType as QuestionType,
            options:
                maintenanceQuestionType === "boolean" || maintenanceQuestionType === "text"
                    ? null
                    : maintenanceQuestionOptions,
        };

        setNewMaintenanceQuestions((prev) => [...prev, questionObj]);

        // reset form
        setMaintenanceQuestionText("");
        setMaintenanceQuestionType("");
        setMaintenanceQuestionOptions([]);
        setMaintenanceQuestionOption("");
    }

    function handleMaintenanceQuestionOptions() {
        if (!maintenanceQuestionOption.trim()) return;

        setMaintenanceQuestionOptions((prev) => [...prev, maintenanceQuestionOption]);
        setMaintenanceQuestionOption("");
    }

    function deleteNewMaintenaceQuestion(id: number) {
        setNewMaintenanceQuestions(newMaintenanceQuestions.filter((q) => q.id !== id));
    }

    function handleDeleteMaintenanceOption(index: number) {
        setMaintenanceQuestionOptions((prev) => prev.filter((_, i) => i !== index));
    }

    function handleUpdateMaintenanceOption(value: string, index: number) {
        const updated = [...maintenanceQuestionOptions];
        updated[index] = value;
        setMaintenanceQuestionOptions(updated);
    }

    function formatQuestionBody(questions: Question[]): FormattedQuestion[] {
        const newQuestions = questions.map((q) => {
            const newQuestion: FormattedQuestion = {
                question: q.question,
                type: q.type,
            };

            if (q.type === "select" || q.type === "checkbox") {
                const multiselect_value: Record<string, string> = {};

                if (q.options) {
                    q.options.forEach((option: string) => {
                        multiselect_value[option] = option;
                    });
                }

                newQuestion.multiselect_value = multiselect_value;
            }

            return newQuestion;
        });

        return newQuestions;
    }

    return (
        <>
            {/* Update Modal */}
            {editingQuestion && (
                <UpdateQuestionModal
                    question={editingQuestion}
                    onClose={() => setEditingQuestion(null)}
                    onSave={handleSaveUpdatedQuestion}
                />
            )}

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
                                            value={formData.maintenance_template_id}
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
                                        <h3 className='h3 title mb-4 text-[18px] font-semibold leading-6'>
                                            All Questions
                                        </h3>

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
                            </div>

                            {newMaintenanceQuestions.length !== 0 && (
                                <div className='selected-pre-use-quetions  border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                                    <div className='title w-full'>
                                        <h5>New Asset-Specific Maintenace Template Questions</h5>
                                    </div>

                                    {newMaintenanceQuestions.map((question, index) => {
                                        const question_type = questionTypes[question.type];

                                        return (
                                            <div
                                                className='selected-questions w-full'
                                                key={question.id}
                                                draggable
                                                onDragStart={() => (dragItem.current = index)}
                                                onDragEnter={() => (dragOverItem.current = index)}
                                                onDragEnd={handleDragSort}
                                                onDragOver={(e) => e.preventDefault()}
                                                style={{ cursor: "grab" }}>
                                                <div className='question-content flex justify-between p-2.5 border rounded-xl border-solid border-gray-400'>
                                                    <div className='question-text'>
                                                        <p>{question.question}</p>
                                                    </div>
                                                    <div className='question-type gap-2 flex justify-between'>
                                                        <p className='text-black'>
                                                            <span className='text-gray-500'>Type: </span>
                                                            {question_type}
                                                        </p>
                                                        <div className='action-btn flex justify-between gap-1'>
                                                            <button
                                                                type='button'
                                                                onClick={() => setEditingQuestion(question)}
                                                                className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                                                Update
                                                            </button>
                                                            <button
                                                                type='button'
                                                                onClick={() =>
                                                                    deleteNewMaintenaceQuestion(question.id!)
                                                                }
                                                                className='bg-red-500 hover:bg-red-600 text-white py-1 px-2 text-sm rounded'>
                                                                Delete
                                                            </button>
                                                            <span className='text-gray-400 mr-2 select-none'>⠿</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
                                                value={maintenanceQuestionText}
                                                onChange={(e) => setMaintenanceQuestionText(e.target.value)}
                                            />
                                        </div>
                                        <div className='col w-full'>
                                            <div className='fancy-input select relative'>
                                                <select
                                                    id='question_type_pre'
                                                    value={maintenanceQuestionType}
                                                    onChange={(e) => setMaintenanceQuestionType(e.target.value)}
                                                    className='form-select text-[#17181a] box-border bg-[#f5f6fa] border border-[#efefef] rounded-[10px] w-full h-[44px] pt-[18px] px-[14px] pb-[8px] font-sans text-[14px] font-medium'>
                                                    <option value=''>Select the question type</option>
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
                                            {(maintenanceQuestionType === "select" ||
                                                maintenanceQuestionType === "checkbox") && (
                                                <>
                                                    {maintenanceQuestionOptions.map((option, index) => (
                                                        <div className='select-options flex gap-2 mb-2' key={index}>
                                                            <input
                                                                type='text'
                                                                className='form-input'
                                                                value={option}
                                                                placeholder={`Option ${index + 1}`}
                                                                onChange={(e) =>
                                                                    handleUpdateMaintenanceOption(e.target.value, index)
                                                                }
                                                            />
                                                            <button
                                                                type='button'
                                                                onClick={() => handleDeleteMaintenanceOption(index)}
                                                                className='bg-red-500 text-white py-1 px-2 text-sm rounded'>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <div className='flex gap-2'>
                                                        <button
                                                            type='button'
                                                            onClick={() =>
                                                                setMaintenanceQuestionOptions((prev) => [...prev, ""])
                                                            }
                                                            className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                                            Add Option
                                                        </button>
                                                    </div>
                                                    {questionErrors.maintenanceQuestionOptions && (
                                                        <p className='text-red-500'>
                                                            {questionErrors.maintenanceQuestionOptions}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className='actions-btn mt-4 flex items-center gap-2'>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleMaintenanceNewAddQuestion();
                                            }}
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
        </>
    );
};

export default MaintenanceTemplate;
