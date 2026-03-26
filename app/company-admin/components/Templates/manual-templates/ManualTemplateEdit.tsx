"use client";

import { EditManualTemplate } from "@/app/company-admin/(admin)/template-master/manual-template/edit/[id]/page";
import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
    initialData: EditManualTemplate;
}

const ManualTemplateEdit = ({ initialData }: Props) => {
    const [showMsg, setShowMsg] = useState("");
    const [title, setTitle] = useState(initialData.name);
    const [description, setDescription] = useState(initialData.description || "");
    const [files, setFiles] = useState<any[]>([]);
    const [initialFiles, setInitialFiles] = useState<any[]>(initialData.files || []);
    const [error, setError] = useState<Record<string, string>>({});
    const [permitted, setPermitted] = useState("");

    const router = useRouter();

    const sessionId = getSessionId("company-user-session");
    const companyId = getCompanyId("company-user-session");

    function validate() {
        const newError = {} as Record<string, string>;
        if (!title) newError.title = "Title is required";
        if (files.length === 0 && initialFiles.length === 0) newError.files = "Document is required";

        setError(newError);

        return Object.entries(newError).length === 0;
    }

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

        await updateTemplate(formData);
    }

    async function getTemplate(id: any) {
        try {
            const result = await clientFetch("/company/manual-template/get/" + Number(id), {
                method: "GET",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                },
            });

            console.log("API response:", result);

            if (result.has_error && result.error_code == "PERMISSION_DENIED") {
                setPermitted(result.message || "Permission denied to update");
                return;
            }

            if (result?.has_error) {
                console.error("Template updation failed:", result.message);
                return;
            }

            const data = result.manual_template as EditManualTemplate;
            setDescription(data.description);
            setTitle(data.name);
            setInitialFiles(data.files);
        } catch (error) {
            console.error("Create template error:", error);
        }
    }

    async function updateTemplate(data: any) {
        try {
            const result = await clientFetch("/company/manual-template/update/"+initialData.id, {
                method: "PUT",
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

    async function deleteFile(id: number | string) {
        try {
            const result = await clientFetch("/company/manual-template/file/delete/" + Number(id), {
                method: "DELETE",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                },
            });

            console.log("API response:", result);

            if (result.has_error && result.error_code == "PERMISSION_DENIED") {
                setPermitted(result.message || "Permission denied to delete");
                return;
            }

            if (result?.has_error) {
                console.error("File deletion failed:", result.message);
                return;
            }

            setInitialFiles(initialFiles.filter((file) => file.id !== Number(id)));
            // router.refresh();
            await getTemplate(initialData.id);
        } catch (error) {
            console.error("File delete error:", error);
        }
    }

    return (
        <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
            <div className='header flex items-center justify-between mb-6'>
                <h4 className='text-xl font-semibold text-gray-800'>Edit Manual Template</h4>

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

                {initialFiles.length !== 0 && (
                    <div className='uploaded-files flex flex-col gap-2'>
                        <h5 className='font-medium'>Existing Files</h5>
                        {initialFiles.map((file) => (
                            <div className='flex gap-2' key={file.id}>
                                <p>{file.file_name}</p>
                                <button
                                    onClick={() => deleteFile(file.id)}
                                    type='button'
                                    className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm'>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div></div>
                <div>
                    <h5 className='form-section-title'>Upload Document</h5>
                    <div className='upload-box'>
                        <label className='cursor-pointer flex flex-col items-center gap-2 text-gray-500 w-full'>
                            <input
                                type='file'
                                className='hidden'
                                name='files'
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
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ManualTemplateEdit;
