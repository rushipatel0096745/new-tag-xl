import { useState } from "react";

type QuestionType = "boolean" | "text" | "checkbox" | "select";

type Question = {
    id: number;
    question: string;
    type: QuestionType;
    options?: string[] | null;
};

const questionTypes: Record<QuestionType, string> = {
    boolean: "Yes/No",
    text: "Textfield",
    checkbox: "Checkbox",
    select: "Select",
};

type UpdateModalProps = {
    question: Question;
    onClose: () => void;
    onSave: (updated: Question) => void;
};

export const UpdateQuestionModal = ({ question, onClose, onSave }: UpdateModalProps) => {
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

    function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
            onClick={handleBackdrop}>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in'>
                <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
                    <h3 className='text-lg font-semibold text-gray-800'>Update Question</h3>
                    <button
                        type='button'
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none'>
                        ✕
                    </button>
                </div>

                <div className='px-6 py-5 flex flex-col gap-5'>
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-sm font-medium text-gray-700'>Question Text</label>
                        <textarea
                            rows={3}
                            className='form-input resize-none'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder='Type your question here'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-sm font-medium text-gray-700'>Question Type</label>
                        <select
                            className='form-input'
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value as QuestionType);
                                setOptions([]);
                            }}>
                            <option value=''>Select the question type</option>
                            <option value='boolean'>Yes/No</option>
                            <option value='text'>Textfield</option>
                            <option value='checkbox'>Checkbox</option>
                            <option value='select'>Select</option>
                        </select>
                    </div>

                    {needsOptions && (
                        <div className='flex flex-col gap-3'>
                            <label className='text-sm font-medium text-gray-700'>Options</label>

                            {options.length === 0 && (
                                <p className='text-xs text-gray-400'>Add options</p>
                            )}

                            {options.map((opt, index) => (
                                <div key={index} className='flex gap-2 items-center'>
                                    <input
                                        type='text'
                                        className='form-input flex-1'
                                        value={opt}
                                        onChange={(e) => handleUpdateOption(e.target.value, index)}
                                    />
                                    <button
                                        type='button'
                                        onClick={() => handleDeleteOption(index)}
                                        className='bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 text-sm rounded transition-colors'>
                                        Delete
                                    </button>
                                </div>
                            ))}

                            <div className='flex gap-2 items-center'>
                                <input
                                    type='text'
                                    className='form-input flex-1'
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddOption())}
                                    placeholder='New option…'
                                />
                                <button
                                    type='button'
                                    onClick={handleAddOption}
                                    className='bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-3 text-sm rounded transition-colors whitespace-nowrap'>
                                    Add Option
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className='flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='px-4 py-2 rounded text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors'>
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleSave}
                        disabled={!text.trim() || !type}
                        className='px-4 py-2 rounded text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateQuestionModal;
