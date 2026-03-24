"use client";

import { clientFetch, getCompanyId, getCompanyUserPermissions, getSessionId } from "@/app/utils/user-helper";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import UpdateQuestionModal from "../UpdateQuestionModal";
import { PreuseEditTemplate } from "@/app/company-admin/(admin)/template-master/pre-use-check-template/edit/[id]/page";
import { GetPreUseTemplate } from "@/app/services/company-admin/preuse_template";

type Question = {
    id?: number;
    question: string;
    type: string;
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
    initialTemplateData: PreuseEditTemplate;
    id: string;
}

const PreuseTemplateEdit = ({ id }: Props) => {
    const [initialData, setInitialData] = useState<PreuseEditTemplate>();
    const [title, setTitle] = useState("");
    const [showMsg, setShowMsg] = useState("");
    const [permitted, setPermitted] = useState<boolean>();

    const sessionId = getSessionId("company-user-session");
    const companyId = getCompanyId("company-user-session");

    async function fetchTemplate() {
        const result = await GetPreUseTemplate(Number(id));
        console.log("response for maintenance template: ", result);
        if (result.has_error && result.error_code == "PERMISSION_DENIED") {
            setPermitted(result.message || "Permission denied to update");
        }
        if (!result.has_error) {
            setInitialData(result?.pre_use_template);
        }
    }

    useEffect(() => {
        fetchTemplate();
    }, []);

    useEffect(() => {
        initialData?.title && setTitle(initialData?.title);

        let initialQuestions = initialData?.questions && reverseFormatQuestionBody(initialData.questions);
        const fixedSet = new Set(fixedQuestions.map((q) => q.question));
        initialQuestions = initialQuestions?.filter((q) => !fixedSet.has(q.question));

        initialQuestions && setNewMaintenanceQuestions(initialQuestions);
    }, [initialData]);

    const questionTypes: Record<string, string> = {
        boolean: "Yes/No",
        text: "Textfield",
        checkbox: "Checkbox",
        select: "Select",
    };

    const fixedQuestions = [
        {
            id: 900,
            question: "Fit for use?",
            type: "boolean",
        },
        { id: 901, question: "Remarks?", type: "text" },
    ];

    const [newMaintenanceQuestions, setNewMaintenanceQuestions] = useState<Question[]>([]);
    const [maintenanceQuestionText, setMaintenanceQuestionText] = useState("");
    const [maintenanceQuestionType, setMaintenanceQuestionType] = useState("");
    const [maintenanceQuestionOptions, setMaintenanceQuestionOptions] = useState<string[]>([]);
    const [maintenanceQuestionOption, setMaintenanceQuestionOption] = useState("");

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
    }, [newMaintenanceQuestions]);

    function handleMaintenanceNewAddQuestion() {
        const questionObj: Question = {
            id: Date.now(),
            question: maintenanceQuestionText,
            type: maintenanceQuestionType,
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

    function reverseFormatQuestionBody(questions: any[]) {
        const newQuestions = questions?.map((q, index) => {
            const newQuestion = {} as Question;
            newQuestion.id = Date.now() + index;
            newQuestion.question = q.question;
            newQuestion.type = q.type;
            if (q.type === "select" || q.type === "checkbox") {
                let options: string[] = [];
                Object.entries(q.multiselect_value).map(([k, v]) => {
                    options.push(k);
                });
                newQuestion.options = options;
            }
            return newQuestion;
        });
        return newQuestions;
    }

    function validate() {
        const newError = {} as Record<string, string>;
        if (!title) newError.title = "Title is required";

        setError(newError);
        return Object.entries(newError).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) {
            return;
        }
        let questions = [] as FormattedQuestion[];
        const defaultQuestions: FormattedQuestion[] = fixedQuestions.map(({ id, ...rest }) => rest);
        if (newMaintenanceQuestions.length !== 0) {
            questions = formatQuestionBody(newMaintenanceQuestions);
        }
        questions.push(...defaultQuestions);
        const data = {
            title: title,
            questions: questions,
        };
        console.log("template create data: ", data);

        await updateTemplate(data);
    }

    async function updateTemplate(data: any) {
        try {
            const result = await clientFetch("/company/pre-use-template/update/" + initialData?.id, {
                method: "PUT",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log("API response:", result);

            if (result.has_error && result.error_code == "PERMISSION_DENIED") {
                setPermitted(result.message || "Permission denied to update");
                return;
            }

            if (result?.has_error) {
                console.error("Template creation failed:", result.message);
                return;
            }

            setShowMsg(result?.message || "Template created successfully");
        } catch (error) {
            console.error("Create template error:", error);
        }
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
            <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
                <div className='header flex items-center justify-between mb-6'>
                    <h4 className='text-xl font-semibold text-gray-800'>Edit Pre Use Template</h4>

                    {showMsg && <p className='text-green-600'>{showMsg}</p>}
                    {permitted && <p className='text-red-500'>{permitted}</p>}

                    <div className='flex gap-2'>
                        <Link
                            href='/company-admin/template-master/pre-use-check-template'
                            className='px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded text-sm font-medium'>
                            Back
                        </Link>
                        {/* <button className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm'>
                            Delete
                        </button> */}
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm'>
                            Save
                        </button>
                    </div>
                </div>

                <form className='flex flex-col gap-6'>
                    <div className='input-text'>
                        <label className='form-label'>Template Title</label>
                        <input
                            type='text'
                            className='form-input'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {error.title && <p className='text-red-600'>Title is required</p>}
                    </div>

                    <div className='selected-pre-use-quetions border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                        <div className='title w-full'>
                            <h5 className='font-semibold'>Add New Asset-Specific Pre Use Template Questions</h5>
                        </div>
                        <div className='new-questions flex flex-col gap-4 justify-between p-2.5 border-2 rounded-xl border-solid border-gray-400 w-full'>
                            <div className='input w-full p-2.5'>
                                <textarea
                                    value={maintenanceQuestionText}
                                    rows={4}
                                    className='form-input resize-none'
                                    placeholder='Type your question here'
                                    onChange={(e) => setMaintenanceQuestionText(e.target.value)}
                                />
                            </div>
                            <div className='select-input w-full'>
                                <label className='form-label'>Select question type</label>
                                <select
                                    className='form-input'
                                    value={maintenanceQuestionType}
                                    onChange={(e) => setMaintenanceQuestionType(e.target.value)}>
                                    <option value={""}>Selct the question type</option>
                                    <option value='boolean'>Yes/No</option>
                                    <option value='text'>Textfield</option>
                                    <option value='checkbox'>Checkbox</option>
                                    <option value='select'>Select</option>
                                </select>
                            </div>
                            {(maintenanceQuestionType === "select" || maintenanceQuestionType === "checkbox") && (
                                <>
                                    {maintenanceQuestionOptions.map((option, index) => (
                                        <div className='select-options flex gap-2 mb-2' key={index}>
                                            <input
                                                type='text'
                                                className='form-input'
                                                value={option}
                                                onChange={(e) => handleUpdateMaintenanceOption(e.target.value, index)}
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
                                        <input
                                            type='text'
                                            className='form-input'
                                            value={maintenanceQuestionOption}
                                            onChange={(e) => setMaintenanceQuestionOption(e.target.value)}
                                            placeholder='Add option'
                                        />

                                        <button
                                            type='button'
                                            onClick={handleMaintenanceQuestionOptions}
                                            className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                            Add Option
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className='action-btn'>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleMaintenanceNewAddQuestion();
                                    }}
                                    className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                    Add Question
                                </button>
                            </div>
                        </div>

                        {/* for all questions */}
                        <div className='title w-full mt-6'>
                            <h5 className='font-semibold'>All Questions</h5>
                        </div>
                        <div className='new-questions flex flex-col gap-4 justify-between p-2.5 border-2 rounded-xl border-solid border-gray-400 w-full'>
                            <div className='input w-full p-2.5'>
                                <div className='selected-questions w-full'>
                                    <h5 className='font-semibold'>Fixed Questions</h5>
                                    {fixedQuestions.map((question) => {
                                        const question_type = questionTypes[question.type];
                                        return (
                                            <div
                                                className='question-content flex justify-between p-2.5 border rounded-xl border-solid border-gray-400'
                                                key={question.id}>
                                                <div className='question-text'>
                                                    <p>{question.question}</p>
                                                </div>
                                                <div className='question-type'>
                                                    <p className='text-black'>
                                                        <span className='text-gray-500'>Type: </span>
                                                        {question_type}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {newMaintenanceQuestions.length !== 0 && (
                                    <div className='selected-pre-use-quetions  border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                                        <div className='title w-full'>
                                            <h5>New Asset-Specific Maintenace Template Questions</h5>
                                        </div>
                                        {/* {newMaintenanceQuestions.map((question) => {
                                            const question_type = questionTypes[question.type];

                                            return (
                                                <div className='selected-questions w-full' key={question.id}>
                                                    <div className='question-content flex justify-between p-2.5 border rounded-xl border-solid border-gray-400'>
                                                        <div className='question-text'>
                                                            <p>{question.question}</p>
                                                        </div>
                                                        <div className='question-type gap-2 flex justify-between'>
                                                            <p className='text-black '>
                                                                <span className='text-gray-500'>Type: </span>
                                                                {question_type}
                                                            </p>
                                                            <div className='action-btn flex justify-between gap-1'>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => setEditingQuestion(question)}
                                                                    className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                                                    Upadate
                                                                </button>
                                                                <button
                                                                    type='button'
                                                                    onClick={() =>
                                                                        deleteNewMaintenaceQuestion(question.id)
                                                                    }
                                                                    className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })} */}

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
                                                                <span className='text-gray-400 ml-2 select-none'>
                                                                    ⠿
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PreuseTemplateEdit;
