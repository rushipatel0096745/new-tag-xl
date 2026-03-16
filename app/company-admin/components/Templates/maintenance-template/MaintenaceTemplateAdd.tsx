"use client";

import { getSessionId } from "@/app/utils/user-helper";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Question = {
    id: number,
    question: string,
    type: string,
    options: string[] | null
}

const MaintenaceTemplateAdd = () => {
    const [maintenaceFrequency, setMaintenanceFrequency] = useState("");
    const [customFrequency, setCustomFrequency] = useState("");

    useEffect(() => {
        const sessionId = getSessionId("company-user-session");
        console.log("session id: ", sessionId)
    }, []);

    const questionTypes = {
        boolean: "Yes/No",
        text: "Textfield",
        checkbox: "Checkbox",
        select: "Select",
    };

    const fixedQuestions = [
        {
            id: 900,
            question: "Fit for use?",
            type: "text",
        },
        { id: 901, question: "Remarks?", type: "boolean" },
    ];

    function handleSubmit() {
        console.log("submit");
    }

    const SELECT_TRIGGER = "custom";

    const [newMaintenanceQuestions, setNewMaintenanceQuestions] = useState<Question[]>([]);
    const [maintenanceQuestionText, setMaintenanceQuestionText] = useState("");
    const [maintenanceQuestionType, setMaintenanceQuestionType] = useState("");
    const [maintenanceQuestionOptions, setMaintenanceQuestionOptions] = useState<string[]>([]);
    const [maintenanceQuestionOption, setMaintenanceQuestionOption] = useState("");

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

    return (
        <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
            <div className='header flex items-center justify-between mb-6'>
                <h4 className='text-xl font-semibold text-gray-800'>Edit Asset</h4>

                <div className='flex gap-2'>
                    <Link
                        href='/company-admin/template-master/maintenance-check-template'
                        className='px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded text-sm font-medium'>
                        Back
                    </Link>

                    <button className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm'>Delete</button>

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
                    <input type='text' className='form-input' />
                </div>

                <div className='input-select flex flex-col justify-between gap-2'>
                    <label className='form-label'>Maintenance Frequency</label>
                    <select
                        name=''
                        className='form-input'
                        id='form-label'
                        onChange={(e) => setMaintenanceFrequency(e.target.value)}>
                        <option value='7'>7</option>
                        <option value='15'>15</option>
                        <option value='30'>30</option>
                        <option value='60'>60</option>
                        <option value='custom'>Custom</option>
                    </select>
                    {SELECT_TRIGGER === maintenaceFrequency && (
                        <input
                            type='number'
                            className='form-input'
                            onChange={(e) => setCustomFrequency(e.target.value)}
                        />
                    )}
                </div>

                <div className='selected-pre-use-quetions border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                    <div className='title w-full'>
                        <h5 className='font-semibold'>Add New Asset-Specific Maintenance Template Questions</h5>
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
                                    {newMaintenanceQuestions.map((question) => {
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
                                                                onClick={() => deleteNewMaintenaceQuestion(question.id)}
                                                                className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                                                Upadate
                                                            </button>
                                                            <button
                                                                type='button'
                                                                onClick={() => deleteNewMaintenaceQuestion(question.id)}
                                                                className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                                                Delete
                                                            </button>
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
    );
};

export default MaintenaceTemplateAdd;
