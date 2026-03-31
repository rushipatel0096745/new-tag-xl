"use client";

import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ManualTemplateAdd = () => {
    const [showMsg, setShowMsg] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [error, setError] = useState<Record<string, string>>({});
    const [permitted, setPermitted] = useState("");

    const sessionId = getSessionId("company-user-session");
    const companyId = getCompanyId("company-user-session");

    function validate() {
        const newError = {} as Record<string, string>;

        if (!title) newError.title = "Title is required";

        if (files.length === 0) {
            newError.files = "Document is required";
        } else {
            let temp: string[] = [];

            files.forEach((file) => {
                if (file instanceof File) {
                    if (!["image/png", "image/jpg", "image/jpeg", "application/pdf"].includes(file.type)) {
                        temp.push(`${file.name} type not valid`);
                    } else if (file.size > 5 * 1024 * 1024) {
                        temp.push(`${file.name} is more than 5mb`);
                    }
                }
            });

            if (temp.length > 0) {
                newError.files = temp.join(", ");
            }
        }

        setError(newError);

        return Object.keys(newError).length === 0;
    }

    // function validate() {
    //     const newError = {} as Record<string, string>;
    //     if (!title) newError.title = "Title is required";
    //     if (files.length === 0) newError.files = "Document is required";
    //     let temp = [];
    //     files.forEach((file) => {
    //         if (file instanceof File) {
    //             if (!["image/png", "image/jpg", "image/jpeg", "pdf"].includes(file.type)) {
    //                 temp.push(`${file.name} type not valid`);
    //             } else if (file.size > 5 * 1024 * 1024) {
    //                 temp.push(`${file.name} is more than 5mb`);
    //             }
    //         }
    //     });

    //     setError(newError);

    //     return Object.entries(newError).length === 0;
    // }

    useEffect(() => {
        console.log("files: ", files);
    }, [files]);

    async function handleSubmit() {
        if (!validate()) {
            return;
        }
        const formData = new FormData();
        formData.append("name", title);
        description && formData.append("description", description);
        files.forEach((file: File) => {
            formData.append("files", file);
        });

        for (const [name, value] of formData) {
            console.log(`${name}: ${value}`);
        }

        await createTemplate(formData);
    }

    async function createTemplate(data: any) {
        try {
            const result = await clientFetch("/company/manual-template/create", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                },
                body: data,
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
            setError({});
        } catch (error) {
            console.error("Create template error:", error);
        }
    }

    return (
        <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
            <div className='header flex items-center justify-between mb-6'>
                <h4 className='text-xl font-semibold text-gray-800'>Add Manual Template</h4>

                {showMsg && <p className='text-green-600'>{showMsg}</p>}
                {permitted && <p className='text-red-500'>{permitted}</p>}

                <div className='flex gap-2'>
                    <Link
                        href='/company-admin/template-master/maintenance-check-template'
                        className='px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded text-sm font-medium'>
                        Back
                    </Link>

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
                        onChange={(e) => {
                            setError((prev) => ({ ...prev, title: "" }));
                            setTitle(e.target.value);
                        }}
                    />
                    {error.title && <p className='text-red-600'>{error.title}</p>}
                </div>
                <div className='input-text'>
                    <label className='form-label'>Template Description</label>
                    <input
                        type='text'
                        className='form-input'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <h5 className='form-section-title'>Upload Document</h5>
                    <div className='upload-box'>
                        <label className='cursor-pointer flex flex-col items-center gap-2 text-gray-500 w-full'>
                            <input
                                type='file'
                                className='hidden'
                                name='files'
                                // onChange={(e) => {
                                //     if (!e.target.files) return;
                                //     // setFiles((prev) => [...prev, e.target.files[0]]);
                                //     setFiles(e.target.files[0]);
                                // }}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.files || []);
                                    setFiles((prev) => [...prev, ...selected]);
                                }}
                            />

                            <span className='text-sm font-medium'>Upload Document</span>
                            <span className='text-xs'>Max 5 MB</span>
                        </label>
                    </div>
                    {error.files && <p className='text-red-600'>{error.files}</p>}

                    {files.length !== 0 && (
                        <div className='show-image'>
                            <p>Uploaded Document: </p>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index} className='flex items-center gap-2'>
                                        {file.name}
                                        <button
                                            type='button'
                                            onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                                            className='text-red-500 hover:text-red-700 cursor-pointer border-0 bg-none p-0 text-2xl float-right'>
                                            {/* Remove */}
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ManualTemplateAdd;
