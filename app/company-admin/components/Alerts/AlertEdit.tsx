"use client";

import { GetAlert } from "@/app/services/company-admin/alerts";
import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Alert {
    id: number;
    status: number;
    note: string;
    alert_type: string;
    asset: Asset;
    pre_use_answers: PreUseAnswers;
    maintenance_answers: any;
    asset_alert_image: string;
    assigned_by: AssignedBy;
    created_at: string;
    updated_at: string;
}

interface Asset {
    id: number;
    tag: Tag;
    name: string;
    location: Location;
    batch_code: string;
    image: string;
    status: number;
}

interface Tag {
    id: number;
    uid: string;
    tag_type: string;
}

interface Location {
    id: number;
    location_name: string;
}

interface PreUseAnswers {
    id: number;
    answers: Answer[];
    fit_for_use: string;
    remarks: string;
    created_at: string;
}

interface Answer {
    answer: string;
    question: string;
}

interface AssignedBy {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
}

export const AlertEdit = ({ id }: { id: string }) => {
    const [alert, setAlert] = useState<Alert>();
    const [status, setStatus] = useState<number | undefined>();
    const [showMsg, setShowMsg] = useState("");
    const [error, setError] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        async function fetchAlert() {
            const result = await GetAlert(Number(id));

            if (result.has_error && result.error_code == "PERMISSION_DENIED") {
                setError((prev) => ({ ...prev, permission: result.message }));
            }

            if (!result.has_error) {
                setAlert(result.alert);
                setStatus(result.alert.status);
            }
        }
        fetchAlert();
    }, []);

    async function handleSubmit() {
        const companyId = getCompanyId("company-user-session");
        const sessionId = getSessionId("company-user-session");
        console.log("submit");
        const result = await clientFetch("/company/alerts/status/update", {
            method: "POST",
            headers: {
                "X-Session-ID": sessionId,
                "X-Company-ID": companyId,
            },
            body: JSON.stringify({
                alert_id: alert?.id,
                status: status,
            }),
        });

        if (!result.has_error) {
            setShowMsg("alert updated successfully");
        }

        if (result.has_error && result.error_code == "PERMISSION_DENIED") {
            setError((prev) => ({ ...prev, permission: result.message }));
        }
    }

    return (
        <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
            {showMsg && <p className='text-green-600'>{showMsg}</p>}
            {error.permission && <p className='text-red-500'>{error.permission}</p>}

            <div className='header flex items-center justify-between mb-6'>
                <h4 className='text-xl font-semibold text-gray-800'>View Alert</h4>

                <div className='flex gap-2'>
                    <Link
                        href='/company-admin/alerts/all'
                        className='px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded text-sm font-medium'>
                        Back
                    </Link>

                    {status !== 2 && (
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm'>
                            Save
                        </button>
                    )}
                </div>
            </div>
            <div className='body flex flex-col gap-2 justify-between'>
                <div className='inputs flex '>
                    <div className='input'>
                        <label htmlFor='mark-as-in-progress' className='form-label'>
                            <input
                                type='radio'
                                name='mark-as'
                                id='mark-as-in-progress'
                                className='form-input'
                                value={1}
                                checked={status === 1}
                                onChange={() => setStatus(1)}
                            />
                            In Workshop
                        </label>
                    </div>
                    <div className='input'>
                        <label htmlFor='mark-as-done' className='form-label'>
                            <input
                                type='radio'
                                name='mark-as'
                                id='mark-as-done'
                                className='form-input'
                                value={2}
                                checked={status === 2}
                                onChange={() => setStatus(1)}
                            />
                            Fixed
                        </label>
                    </div>
                </div>
                <div className='content flex gap-5'>
                    <div className='img object-contain border-0 rounded-[10px] align-bottom'>
                        <img
                            alt='/images/placeholderimage.png'
                            loading='lazy'
                            width={140}
                            height={140}
                            decoding='async'
                            data-nimg={1}
                            className='product-img'
                            style={{ color: "transparent" }}
                            src={`https://api.tagxl.com/${alert?.asset.image}`}
                        />
                    </div>
                    <div className='info-block-wrapper flex flex-col gap-2.5 w-[calc(100%-160px)]'>
                        <div className='info-block flex flex-col'>
                            <div className='title text-gray-700 text-[12px]'>Product Name</div>
                            <div className='value'>{alert?.asset.name}</div>
                        </div>
                        <div className='info-block flex flex-col'>
                            <div className='title text-gray-700 text-[12px]'>Location</div>
                            <div className='value'>{alert?.asset.location.location_name}</div>
                        </div>
                        <div className='row flex w-full gap-4 flex-wrap'>
                            <div className='col-6 w-[calc(50%-8px)] '>
                                <div className='info-block flex flex-col'>
                                    <div className='title text-gray-700 text-[12px]'>Location</div>
                                    <div className='value'>{alert?.asset.location.location_name}</div>
                                </div>
                            </div>
                            <div className='col-6 w-[calc(50%-8px)] '>
                                <div className='info-block flex flex-col'>
                                    <div className='title text-gray-700 text-[12px]'>Type</div>
                                    <div className='value'>{alert?.alert_type}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {alert?.pre_use_answers && (
                    <div className='col w-full'>
                        <h4 className='text-[18px] font-semibold leading-6'>
                            Pre use check template question and answers
                        </h4>
                        <div className='q-and-a_block-wrapper bg-[#f5f6fa] border-0 rounded-xl flex flex-col mt-4 p-4'>
                            {alert?.pre_use_answers.answers.map((que, index) => (
                                <div className='q-and-a_block flex flex-col gap-1' key={index}>
                                    <div className='que text-[16px] font-semibold'>{que.question}</div>
                                    <div className='ans text-[14px] text-[#7f7f7f]'>{que.answer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertEdit;
