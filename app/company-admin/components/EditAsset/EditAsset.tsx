"use client";

import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { AssetData, Question } from "../../(admin)/asset/edit/[id]/page";
import { getAssetLocations } from "@/app/services/company-admin/location";
import {
    getMaintenanceTemplateAssetList,
    getManualTemplateAssetList,
    getPreuseTemplateAssetList,
} from "@/app/services/company-admin/templates";
import { Location } from "../../(admin)/location-master/page";
import { editAsset } from "@/app/services/company-admin/assets";
import { useRouter } from "next/navigation";

interface Props {
    initialData: AssetData;
}

type Question = {
    id: number;
    question: string;
    type: string;
    options?: string[] | null;
};

type QuestionTypes = {
    boolean: string;
    select: string;
    text: string;
    checkbox: string;
};

const EditAsset = ({ initialData }: Props) => {
    const [loactionList, setLocationList] = useState<Location[]>([]);
    const [manualTemplateList, setManualTemplateList] = useState([]);
    const [preuseTemplateList, setPreUseTemplateList] = useState([]);
    const [maintenanceTemplateList, setMaintenanceTemplateList] = useState([]);

    const [preuseTemplateQuestions, setPreuseTemplateQuestions] = useState<Question[]>([]);
    const [maintenanceTemplateQuestions, setMaintenanceTemplateQuestions] = useState<Question[]>([]);

    const [tagUid, setTagUid] = useState(initialData.tag.uid);
    const [name, setName] = useState(initialData.name);
    const [location, setLocation] = useState(Number(initialData.location.id));
    const [batchCode, setBatchCode] = useState(initialData.batch_code);
    const [status, setStatus] = useState(initialData.status);
    const [manualTemplateId, setManualTemplateId] = useState(String(initialData.manual_template.id));
    const [preuseTemplateId, setPreuseTemplateId] = useState(initialData.pre_use_template.id);
    const [maintenanceTemplateId, setMaintenanceTemplateId] = useState(initialData.maintenance_template.id);
    const [image, setImage] = useState<any>();
    const [third_party_certificate, set_third_party_certificate] = useState<any>();

    const [errors, setErrors] = useState<Record<string, string>>();
    const [showMsg, setShowMsg] = useState<string>();

    async function getData() {
        const locations = await getAssetLocations();
        setLocationList(locations);
        const manualTemplates = await getManualTemplateAssetList();
        setManualTemplateList(manualTemplates);
        const preuseTemplates = await getPreuseTemplateAssetList();
        setPreUseTemplateList(preuseTemplates);
        const maintenanceTemplates = await getMaintenanceTemplateAssetList();
        setMaintenanceTemplateList(maintenanceTemplates);
    }

    function validate() {
        const newErrors = {};

        if (!name) newErrors.name = "Name is required";
        if (!location) newErrors.location = "Location is required";
        if (!batchCode) newErrors.batchCode = "Batch code is required";
        // if(!manualTemplateId) newErrors.name = "Select is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handlePreuseQuestions(id: any) {
        // console.log("handler called")
        // console.log("pre use id: ", preuseTemplateId)
        const preUseTemplateObject = preuseTemplateList.find((tmp: any) => tmp.id === Number(id));
        if (preUseTemplateObject) {
            setPreuseTemplateQuestions(preUseTemplateObject.questions);
        } else {
            setPreuseTemplateQuestions([]);
        }
    }

    function handleMaintenanceQuestions(id: any) {
        const maintenaceObject = maintenanceTemplateList.find((tmp: any) => tmp.id === Number(id));
        if (maintenaceObject) {
            setMaintenanceTemplateQuestions(maintenaceObject.questions);
        } else {
            setMaintenanceTemplateQuestions([]);
        }
    }

    useEffect(() => {
        // console.log(typeof initialData.manual_template.id);
        console.log(typeof manualTemplateId);
        getData();
        setPreuseTemplateQuestions(initialData.pre_use_template.questions);
        setMaintenanceTemplateQuestions(initialData.maintenance_template.questions);
        console.log("preuse id: ", preuseTemplateId);
    }, []);

    const questionTypes: QuestionTypes = {
        boolean: "Yes/No",
        select: "Select",
        text: "Textfield",
        checkbox: "Checkbox",
    };
// ---------------------------------------------------------------------------------------
    // for dynamic addtion of maintenace template questions
    // const [existedMaintenanceQuestions, setExistedMaintenanceQuestions] = useState([]);
    const intitalMaintenanceQuestions = reverseFormatQuestionBody(initialData.asset_maintenance_questions) || [];
    const [newMaintenanceQuestions, setNewMaintenanceQuestions] = useState<Question[]>(intitalMaintenanceQuestions);
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
    // -----------------------------------------------------------------------------
    // for dynamic addtion of preuse template questions
    // const [existedMaintenanceQuestions, setExistedMaintenanceQuestions] = useState([]);
    const intitalPreuseQuestions = reverseFormatQuestionBody(initialData.asset_pre_use_questions) || [];
    const [newPreuseQuestions, setNewPreuseQuestions] = useState<Question[]>(intitalPreuseQuestions);
    const [preuseQuestionText, setPreuseQuestionText] = useState("");
    const [preuseQuestionType, setPreuseQuestionType] = useState("");
    const [preuseQuestionOptions, setPreuseQuestionOptions] = useState<string[]>([]);
    const [preuseQuestionOption, setPreuseQuestionOption] = useState("");

    useEffect(() => {
        console.log("new pre use questions: ", newPreuseQuestions);
        console.log("new maintenance questions: ", newMaintenanceQuestions);
    }, [newPreuseQuestions, newMaintenanceQuestions]);

    function handlePreuseNewAddQuestion() {
        const questionObj: Question = {
            id: Date.now(),
            question: preuseQuestionText,
            type: preuseQuestionType,
            options: preuseQuestionType === "boolean" || preuseQuestionType === "text" ? null : preuseQuestionOptions,
        };

        setNewPreuseQuestions((prev) => [...prev, questionObj]);

        // reset form
        setPreuseQuestionText("");
        setPreuseQuestionType("");
        setPreuseQuestionOptions([]);
        setPreuseQuestionOption("");
    }

    function handlePreuseQuestionOptions() {
        if (!preuseQuestionOption.trim()) return;

        setPreuseQuestionOptions((prev) => [...prev, preuseQuestionOption]);
        setPreuseQuestionOption("");
    }

    function deleteNewPreuseQuestion(id: number) {
        setNewPreuseQuestions(newPreuseQuestions.filter((q) => q.id !== id));
    }

    function handleDeleteOption(index: number) {
        setPreuseQuestionOptions((prev) => prev.filter((_, i) => i !== index));
    }

    function handleUpdateOption(value: string, index: number) {
        const updated = [...preuseQuestionOptions];
        updated[index] = value;
        setPreuseQuestionOptions(updated);
    }

    const router = useRouter();

    async function handleSubmit() {
        setShowMsg("");
        if (!validate()) {
            return;
        } else {
            const formData = new FormData();
            name && formData.append("name", name);
            location && formData.append("location_id", String(location));
            batchCode && formData.append("batch_code", batchCode);
            status && formData.append("status", String(status));
            manualTemplateId && formData.append("manual_template_id", String(manualTemplateId));
            preuseTemplateId && formData.append("pre_use_template_id", String(preuseTemplateId));
            maintenanceTemplateId && formData.append("maintenance_template_id", String(maintenanceTemplateId));
            image && formData.append("image", image);
            third_party_certificate && formData.append("third_party_certificate", third_party_certificate);
            newPreuseQuestions.length !== 0 &&
                formData.append("asset_pre_use_questions", JSON.stringify(formatQuestionBody(newPreuseQuestions)));
            newMaintenanceQuestions.length !== 0 &&
                formData.append("asset_maintenance_questions", JSON.stringify(formatQuestionBody(newMaintenanceQuestions)));

            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await editAsset(initialData.id, formData);
            if(response.success) {
                setShowMsg("Asset updated successfully")
                router.refresh()
            } else {
                setShowMsg("Asset not able to update")
            }
        }
    }

    function formatQuestionBody(questions: Question[]) {
        const newQuestions = questions.map((q) => {
            const newQuestion = {};
            newQuestion.question = q.question;
            newQuestion.type = q.type;
            if (q.type === "select" || q.type === "checkbox") {
                let multiselect_value = {};
                if (q.options) {
                    q.options.map((option) => {
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
            const newQuestion = {} as Question
            newQuestion.id = Date.now() + index
            newQuestion.question = q.question;
            newQuestion.type = q.type
            if(q.type === 'select' || q.type === 'checkbox') {
                let options: string[] = [];
                Object.entries(q.multiselect_value).map(([k, v]) => {
                    options.push(k)
                })
                newQuestion.options = options
            }
            return newQuestion
        })
        return newQuestions
    }


    return (
        <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
            {/* Header */}
            {showMsg && (<div className="text-green-600">{showMsg}</div>)}
            <div className='header flex items-center justify-between mb-6'>
                <h4 className='text-xl font-semibold text-gray-800'>Edit Asset</h4>

                <div className='flex gap-2'>
                    <Link
                        href='/company-admin/asset'
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

            {/* Form */}
            <form className='flex flex-col gap-6'>
                <div className='grid grid-cols-2 gap-4'>
                    {/* UID */}
                    <div className='col-span-2'>
                        <label className='form-label'>UID</label>
                        <input type='text' value={tagUid} readOnly className='form-input' />
                    </div>

                    {/* Name */}
                    <div>
                        <label className='form-label'>Name</label>
                        <input
                            type='text'
                            className='form-input'
                            value={name}
                            name='name'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className='form-label'>Location</label>
                        <select
                            className='form-input'
                            value={location}
                            name='location_id'
                            onChange={(e) => setLocation(e.target.value)}>
                            {loactionList.map((location) => (
                                <option value={location.id} key={location.id}>
                                    {location.name}
                                </option>
                            ))}
                            <option>Test</option>
                        </select>
                    </div>

                    {/* Batch Code */}
                    <div>
                        <label className='form-label'>Batch Code</label>
                        <input
                            type='text'
                            className='form-input'
                            value={batchCode}
                            name='batch_code'
                            onChange={(e) => setBatchCode(e.target.value)}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className='form-label'>Status</label>
                        <select
                            className='form-input'
                            value={status}
                            name='status'
                            onChange={(e) => setStatus(e.target.value)}>
                            <option value='1'>Active</option>
                            <option value='0'>Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Upload Section */}
                <div className='grid grid-cols-2 gap-6'>
                    {/* Image Upload */}
                    <div>
                        <h5 className='form-section-title'>Add Image</h5>
                        <div className='upload-box'>
                            <label className='cursor-pointer flex flex-col items-center gap-2 text-gray-500 w-full'>
                                <input
                                    type='file'
                                    className='hidden'
                                    name='image'
                                    onChange={(e) => setImage(e.target.files[0])}
                                />

                                <span className='text-sm font-medium'>Upload Image</span>
                                <span className='text-xs'>Max 5 MB</span>
                            </label>
                        </div>
                        {image && (
                            <div className='show-image'>
                                <p>Asset Image: </p>
                                {image.name}
                            </div>
                        )}
                    </div>

                    {/* Certificate Upload */}
                    <div>
                        <h5 className='form-section-title'>Third Party Certificate</h5>
                        <div className='upload-box'>
                            <label className='cursor-pointer flex flex-col items-center gap-2 text-gray-500 w-full'>
                                <input
                                    type='file'
                                    className='hidden'
                                    name='third_party_certificate'
                                    onChange={(e) => set_third_party_certificate(e.target.files[0])}
                                />

                                <div className='flex flex-col items-center gap-2 text-gray-500'>
                                    <span className='text-sm font-medium'>Upload Certificate</span>
                                    <span className='text-xs'>Max 5 MB</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    {third_party_certificate && (
                        <div className='show-certificate'>
                            <p>Third party certificate: </p>
                            {third_party_certificate.name}
                        </div>
                    )}
                </div>

                {/* oem certificate */}
                <div className='col-6 w-full border-3 border-solid border-[#f5f6fa] p-5.5'>
                    <h3 className='mb-4 font-bold'>OEM Ceritficate</h3>
                    <div className='oem-certificate-block flex justify-between'>
                        <p className='underline text-sm'>{initialData.oem_certificate}</p>
                        <button
                            type='button'
                            className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm'>
                            Download
                        </button>
                    </div>
                </div>

                {/* manual template */}
                <div className='col-6 w-full border-3 border-solid border-[#f5f6fa] p-5.5'>
                    <h3 className='mb-4 font-bold'>Manual Template</h3>
                    <div>
                        <label className='form-label'>Manual Template</label>
                        <select
                            className='form-input'
                            value={manualTemplateId}
                            onChange={(e) => setManualTemplateId(e.target.value)}>
                            <option value=''>Select</option>
                            {manualTemplateList.map((temp) => (
                                <option value={String(temp.id)} key={temp.id}>
                                    {temp.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* pre use template */}
                <div className='col w-full border-3 border-solid border-[#f5f6fa] p-5.5'>
                    <h3 className='mb-4 font-bold'>Selected Pre-use Check Template</h3>
                    <div className='flex flex-col gap-4'>
                        <div className='select-input'>
                            <label className='form-label'>Pre Use Template</label>
                            <select
                                className='form-input'
                                value={preuseTemplateId}
                                onChange={(e) => {
                                    setPreuseTemplateId(e.target.value);
                                    handlePreuseQuestions(e.target.value);
                                }}>
                                <option value=''>Select</option>
                                {preuseTemplateList.map((tmp) => (
                                    <option value={tmp.id} key={tmp.id}>
                                        {tmp.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h5 className='font-semibold'>All Pre Use Check Questions</h5>
                        </div>

                        {preuseTemplateQuestions.length !== 0 && (
                            <div className='selected-pre-use-quetions  border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                                <div className='title w-full'>
                                    <h5>Selected Pre-Use Template Questions</h5>
                                </div>

                                <div className='selected-questions flex flex-col gap-2 w-full'>
                                    {preuseTemplateQuestions?.map((question) => {
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
                            </div>
                        )}

                        {/* new asset questions */}
                        {/* added new questions */}
                        {newPreuseQuestions.length !== 0 && (
                            <div className='selected-pre-use-quetions  border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                                <div className='title w-full'>
                                    <h5>New Asset-Specific Pre-Use Template Questions</h5>
                                </div>
                                {newPreuseQuestions.map((question) => {
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
                                                            onClick={() => deleteNewPreuseQuestion(question.id)}
                                                            className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                                            Upadate
                                                        </button>
                                                        <button
                                                            type='button'
                                                            onClick={() => deleteNewPreuseQuestion(question.id)}
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

                        {/* new asset questions input */}
                        <div className='selected-pre-use-quetions border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                            <div className='title w-full'>
                                <h5 className='font-semibold'>Add New Asset-Specific Pre-Use Template Questions</h5>
                            </div>
                            <div className='new-questions flex flex-col gap-4 justify-between p-2.5 border rounded-xl border-solid border-gray-400 w-full'>
                                <div className='input w-full p-2.5'>
                                    <textarea
                                        value={preuseQuestionText}
                                        rows={4}
                                        className='form-input resize-none'
                                        placeholder='Type your question here'
                                        onChange={(e) => setPreuseQuestionText(e.target.value)}
                                    />
                                </div>
                                <div className='select-input w-full'>
                                    <label className='form-label'>Select question type</label>
                                    <select
                                        className='form-input'
                                        value={preuseQuestionType}
                                        onChange={(e) => setPreuseQuestionType(e.target.value)}>
                                        <option value={""}>Selct the question type</option>
                                        <option value='boolean'>Yes/No</option>
                                        <option value='text'>Textfield</option>
                                        <option value='checkbox'>Checkbox</option>
                                        <option value='select'>Select</option>
                                    </select>
                                </div>
                                {(preuseQuestionType === "select" || preuseQuestionType === "checkbox") && (
                                    <>
                                        {preuseQuestionOptions.map((option, index) => (
                                            <div className='select-options flex gap-2 mb-2' key={index}>
                                                <input
                                                    type='text'
                                                    className='form-input'
                                                    value={option}
                                                    onChange={(e) => handleUpdateOption(e.target.value, index)}
                                                />

                                                <button
                                                    type='button'
                                                    onClick={() => handleDeleteOption(index)}
                                                    className='bg-red-500 text-white py-1 px-2 text-sm rounded'>
                                                    Delete
                                                </button>
                                            </div>
                                        ))}

                                        <div className='flex gap-2'>
                                            <input
                                                type='text'
                                                className='form-input'
                                                value={preuseQuestionOption}
                                                onChange={(e) => setPreuseQuestionOption(e.target.value)}
                                                placeholder='Add option'
                                            />

                                            <button
                                                type='button'
                                                onClick={handlePreuseQuestionOptions}
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
                                            handlePreuseNewAddQuestion();
                                        }}
                                        className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded'>
                                        Add Question
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* maintenance template */}
                <div className='col w-full border-3 border-solid border-[#f5f6fa] p-5.5'>
                    <h3 className='mb-4 font-bold'>Selected Maintenance Template</h3>
                    <div className='flex flex-col gap-4'>
                        <div className='select-input'>
                            <label className='form-label'>Maintenance Template</label>
                            <select
                                className='form-input'
                                value={maintenanceTemplateId}
                                onChange={(e) => {
                                    setMaintenanceTemplateId(e.target.value);
                                    handleMaintenanceQuestions(e.target.value);
                                }}>
                                <option value=''>Select</option>
                                {maintenanceTemplateList.map((item) => (
                                    <option value={item.id} key={item.id}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h5 className='font-semibold'>All Maintenance Template Questions</h5>
                        </div>

                        {/* selected maintenace questions */}
                        {maintenanceTemplateQuestions.length !== 0 && (
                            <div className='selected-pre-use-quetions  border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                                <div className='title w-full'>
                                    <h5>Selected Maintenance Template Questions</h5>
                                </div>
                                <div className='selected-questions w-full'>
                                    {maintenanceTemplateQuestions.map((question) => {
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
                            </div>
                        )}

                        {/* new asset questions */}
                        {/* added new questions for maintanance */}
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

                        {/* maintance input for adding new questions */}
                        <div className='selected-pre-use-quetions border-3 border-solid border-[#f5f6fa] p-5.5 flex flex-wrap'>
                            <div className='title w-full'>
                                <h5 className='font-semibold'>Add New Asset-Specific Maintenance Template Questions</h5>
                            </div>
                            <div className='new-questions flex flex-col gap-4 justify-between p-2.5 border rounded-xl border-solid border-gray-400 w-full'>
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
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditAsset;
