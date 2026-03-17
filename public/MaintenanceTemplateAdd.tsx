"use client";

import { getSessionId } from "@/app/utils/user-helper";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Question = {
    id: number;
    question: string;
    type: string;
    options: string[] | null;
};

const questionTypes: Record<string, string> = {
    boolean: "Yes/No",
    text: "Textfield",
    checkbox: "Checkbox",
    select: "Select",
};

/* ─────────────────────────────────────────────
   Update-Question Modal
───────────────────────────────────────────── */
type UpdateModalProps = {
    question: Question;
    onClose: () => void;
    onSave: (updated: Question) => void;
};

const UpdateQuestionModal = ({ question, onClose, onSave }: UpdateModalProps) => {
    const [text, setText] = useState(question.question);
    const [type, setType] = useState(question.type);
    const [options, setOptions] = useState<string[]>(question.options ?? []);
    const [newOption, setNewOption] = useState("");

    const needsOptions = type === "select" || type === "checkbox";

    function handleAddOption() {
        if (!newOption.trim()) return;
        setOptions((prev) => [...prev, newOption.trim()]);
        setNewOption("");
    }

    function handleDeleteOption(index: number) {
        setOptions((prev) => prev.filter((_, i) => i !== index));
    }

    function handleUpdateOption(value: string, index: number) {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    }

    function handleSave() {
        if (!text.trim() || !type) return;
        onSave({
            ...question,
            question: text.trim(),
            type,
            options: needsOptions ? options : null,
        });
    }

    // Close on backdrop click
    function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={handleBackdrop}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Update Question</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none">
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-5 flex flex-col gap-5">
                    {/* Question Text */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Question Text</label>
                        <textarea
                            rows={3}
                            className="form-input resize-none"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type your question here"
                        />
                    </div>

                    {/* Question Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Question Type</label>
                        <select
                            className="form-input"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setOptions([]);
                            }}>
                            <option value="">Select the question type</option>
                            <option value="boolean">Yes/No</option>
                            <option value="text">Textfield</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="select">Select</option>
                        </select>
                    </div>

                    {/* Options (only for select / checkbox) */}
                    {needsOptions && (
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-gray-700">Options</label>

                            {options.length === 0 && (
                                <p className="text-xs text-gray-400 italic">No options added yet.</p>
                            )}

                            {options.map((opt, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        className="form-input flex-1"
                                        value={opt}
                                        onChange={(e) => handleUpdateOption(e.target.value, index)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteOption(index)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 text-sm rounded transition-colors">
                                        Delete
                                    </button>
                                </div>
                            ))}

                            {/* Add new option row */}
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    className="form-input flex-1"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddOption())}
                                    placeholder="New option…"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-3 text-sm rounded transition-colors whitespace-nowrap">
                                    Add Option
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!text.trim() || !type}
                        className="px-4 py-2 rounded text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */
const MaintenanceTemplateAdd = () => {
    const [maintenanceFrequency, setMaintenanceFrequency] = useState("");
    const [customFrequency, setCustomFrequency] = useState("");

    useEffect(() => {
        const sessionId = getSessionId("company-user-session");
        console.log("session id: ", sessionId);
    }, []);

    const fixedQuestions = [
        { id: 900, question: "Fit for use?", type: "text" },
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

    // Modal state
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    useEffect(() => {
        console.log("new maintenance questions: ", newMaintenanceQuestions);
    }, [newMaintenanceQuestions]);

    function handleMaintenanceNewAddQuestion() {
        if (!maintenanceQuestionText.trim() || !maintenanceQuestionType) return;

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

    function deleteNewMaintenanceQuestion(id: number) {
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

    // Save updated question from modal
    function handleSaveUpdatedQuestion(updated: Question) {
        setNewMaintenanceQuestions((prev) =>
            prev.map((q) => (q.id === updated.id ? updated : q))
        );
        setEditingQuestion(null);
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

            <div className="main flex flex-col p-6 bg-white rounded-lg shadow-sm">
                <div className="header flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold text-gray-800">Edit Asset</h4>

                    <div className="flex gap-2">
                        <Link
                            href="/company-admin/template-master/maintenance-check-template"
                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded text-sm font-medium">
                            Back
                        </Link>
                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
                            Delete
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                            Save
                        </button>
                    </div>
                </div>

                <form className="flex flex-col gap-6">
                    <div className="input-text">
                        <label className="form-label">Template Title</label>
                        <input type="text" className="form-input" />
                    </div>

                    <div className="input-select flex flex-col justify-between gap-2">
                        <label className="form-label">Maintenance Frequency</label>
                        <select
                            className="form-input"
                            onChange={(e) => setMaintenanceFrequency(e.target.value)}>
                            <option value="7">7</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="60">60</option>
                            <option value="custom">Custom</option>
                        </select>
                        {SELECT_TRIGGER === maintenanceFrequency && (
                            <input
                                type="number"
                                className="form-input"
                                onChange={(e) => setCustomFrequency(e.target.value)}
                            />
                        )}
                    </div>

                    {/* ── Add New Question ── */}
                    <div className="selected-pre-use-questions border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap">
                        <div className="title w-full">
                            <h5 className="font-semibold">Add New Asset-Specific Maintenance Template Questions</h5>
                        </div>
                        <div className="new-questions flex flex-col gap-4 justify-between p-2.5 border-2 rounded-xl border-solid border-gray-400 w-full">
                            <div className="input w-full p-2.5">
                                <textarea
                                    value={maintenanceQuestionText}
                                    rows={4}
                                    className="form-input resize-none"
                                    placeholder="Type your question here"
                                    onChange={(e) => setMaintenanceQuestionText(e.target.value)}
                                />
                            </div>
                            <div className="select-input w-full">
                                <label className="form-label">Select question type</label>
                                <select
                                    className="form-input"
                                    value={maintenanceQuestionType}
                                    onChange={(e) => {
                                        setMaintenanceQuestionType(e.target.value);
                                        setMaintenanceQuestionOptions([]);
                                    }}>
                                    <option value="">Select the question type</option>
                                    <option value="boolean">Yes/No</option>
                                    <option value="text">Textfield</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="select">Select</option>
                                </select>
                            </div>

                            {(maintenanceQuestionType === "select" || maintenanceQuestionType === "checkbox") && (
                                <>
                                    {maintenanceQuestionOptions.map((option, index) => (
                                        <div className="select-options flex gap-2 mb-2" key={index}>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={option}
                                                onChange={(e) => handleUpdateMaintenanceOption(e.target.value, index)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteMaintenanceOption(index)}
                                                className="bg-red-500 text-white py-1 px-2 text-sm rounded">
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={maintenanceQuestionOption}
                                            onChange={(e) => setMaintenanceQuestionOption(e.target.value)}
                                            placeholder="Add option"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleMaintenanceQuestionOptions}
                                            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded">
                                            Add Option
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="action-btn">
                                <button
                                    type="button"
                                    onClick={handleMaintenanceNewAddQuestion}
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded">
                                    Add Question
                                </button>
                            </div>
                        </div>

                        {/* ── All Questions ── */}
                        <div className="title w-full mt-6">
                            <h5 className="font-semibold">All Questions</h5>
                        </div>
                        <div className="new-questions flex flex-col gap-4 justify-between p-2.5 border-2 rounded-xl border-solid border-gray-400 w-full">
                            <div className="input w-full p-2.5">
                                {/* Fixed Questions */}
                                <div className="selected-questions w-full">
                                    <h5 className="font-semibold mb-2">Fixed Questions</h5>
                                    <div className="flex flex-col gap-2">
                                        {fixedQuestions.map((question) => (
                                            <div
                                                key={question.id}
                                                className="question-content flex justify-between p-2.5 border rounded-xl border-solid border-gray-400">
                                                <p>{question.question}</p>
                                                <p className="text-black">
                                                    <span className="text-gray-500">Type: </span>
                                                    {questionTypes[question.type]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* New Questions */}
                                {newMaintenanceQuestions.length > 0 && (
                                    <div className="mt-5 flex flex-col gap-2">
                                        <h5 className="font-semibold">
                                            New Asset-Specific Maintenance Template Questions
                                        </h5>
                                        {newMaintenanceQuestions.map((question) => (
                                            <div
                                                key={question.id}
                                                className="question-content flex justify-between items-center p-2.5 border rounded-xl border-solid border-gray-400">
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-sm font-medium">{question.question}</p>
                                                    {question.options && question.options.length > 0 && (
                                                        <p className="text-xs text-gray-400">
                                                            Options: {question.options.join(", ")}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-black text-sm">
                                                        <span className="text-gray-500">Type: </span>
                                                        {questionTypes[question.type]}
                                                    </p>
                                                    <div className="flex gap-1">
                                                        {/* ── Update button opens modal ── */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingQuestion(question)}
                                                            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded transition-colors">
                                                            Update
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteNewMaintenanceQuestion(question.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 text-sm rounded transition-colors">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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

export default MaintenanceTemplateAdd;
