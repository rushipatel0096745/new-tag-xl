"use client";

import React, { startTransition, useActionState, useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GetCompany } from "@/app/services/super-admin/company";

interface Company {
    id: number;
    company_id: number;
    company_name: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    email: string;
    gst_or_tax_id: string;
    status: boolean;
    allowed_asset_limit: number;
    is_delete: boolean;
    subscription_validity: string;
    created_at: string;
    updated_at: string;
}

const CompanyEdit = ({
    updateAction,
    id,
}: {
    updateAction: (id: number, prevState: any, formData: any) => Promise<any>;
    id: string;
}) => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(updateAction.bind(null, Number(id)), {
        success: null,
        error: "",
        data: null,
    });
    const [companyData, setCompanyData] = useState<Company>();
    const [showMsg, setShowMsg] = useState<string>("");
    const [permitted, setPermitted] = useState("");

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            company_name: companyData?.company_name,
            gst_or_tax_id: companyData?.gst_or_tax_id,
            street: companyData?.street,
            street2: companyData?.street2 ?? "",
            city: companyData?.city,
            state: companyData?.state,
            country: companyData?.country.toLowerCase(),
            postal_code: companyData?.postal_code,
            allowed_asset_limit: companyData?.allowed_asset_limit,
            status: companyData?.status ? "1" : "0",
            subscription_validity: companyData?.subscription_validity.split("T")[0],
        },
    });

    async function getCompany() {
        const result = await GetCompany(Number(id));
        if (result.has_error && result.error_code == "PERMISSION_DENIED") {
            setPermitted("Permission Denied to Update");
        }
        if (!result.has_error) {
            setCompanyData(result.company);
        }
    }

    useEffect(() => {
        if (companyData) {
            reset({
                company_name: companyData?.company_name,
                gst_or_tax_id: companyData?.gst_or_tax_id,
                street: companyData?.street,
                street2: companyData?.street2 ?? "",
                city: companyData?.city,
                state: companyData?.state,
                country: companyData?.country?.toLowerCase(),
                postal_code: companyData?.postal_code,
                allowed_asset_limit: companyData?.allowed_asset_limit,
                status: companyData?.status ? "1" : "0",
                subscription_validity: companyData?.subscription_validity.split("T")[0],
            });
        }
    }, [companyData]);

    useEffect(() => {
        getCompany();
    }, []);

    const onSubmit = async (data: any) => {
        const { confirm_password, ...newData } = data;

        console.log("new data", newData);
        startTransition(() => formAction(newData));
    };

    useEffect(() => {
        if (state?.success) {
            // router.push("/super-admin/company");
            setShowMsg("Company updated successfully");
        } else {
            setShowMsg("");
        }
    }, [state]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='border-2 border-black p-4 rounded-2xl'>
            <div className='form-header flex justify-between p-4 border-b'>
                <div className='title'>
                    <h3>Edit Company</h3>
                </div>
                {showMsg && (
                    <div className='text-green-700'>
                        <p>{showMsg}</p>
                    </div>
                )}

                {state?.error && (
                    <div className='text-red-500'>
                        <p>{state?.error}</p>
                    </div>
                )}

                {permitted && (
                    <div className='text-red-500'>
                        <p>{permitted}</p>
                    </div>
                )}
                <div className='action'>
                    <Link
                        href={"/super-admin/company"}
                        className='border-2 rounded-2xl p-1 mr-2 cursor-pointer'
                        type='button'>
                        Back
                    </Link>
                    <button className='border-2 rounded-2xl p-1 cursor-pointer' type='submit'>
                        Save
                    </button>
                </div>
            </div>
            <div className='form-fields'>
                <div className='basic-info'>
                    <div className='title mb-3'>
                        <h4>Basic Information</h4>
                    </div>
                    <div className='fields grid grid-cols-2 gap-4'>
                        <div className='col-span-1'>
                            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                Company Name
                            </label>
                            <input
                                type='text'
                                id='company_name'
                                className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                {...register("company_name", { required: "company name required" })}
                            />
                            {errors.company_name && (
                                <p className='text-red-500'>{errors.company_name.message as string}</p>
                            )}
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                GST / Tax ID
                            </label>
                            <input
                                type='text'
                                id='gst_or_tax_id'
                                {...register("gst_or_tax_id")}
                                className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                            />
                            {errors.gst_or_tax_id && (
                                <p className='text-red-500'>{errors.gst_or_tax_id.message as string}</p>
                            )}
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                Address Line 1
                            </label>
                            <input
                                type='text'
                                id='street'
                                {...register("street", { required: "Address Line 1 is required" })}
                                className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                            />
                            {errors.street && <p className='text-red-500'>{errors.street.message as string}</p>}
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                Address Line 2
                            </label>
                            <input
                                type='text'
                                id='street2'
                                {...register("street2")}
                                className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                            />
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                City
                            </label>
                            <input
                                type='text'
                                id='city'
                                {...register("city", { required: "City is required" })}
                                className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                            />
                            {errors.street && <p className='text-red-500'>{errors.street.message as string}</p>}
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                State
                            </label>
                            <input
                                type='text'
                                id='state'
                                {...register("state", { required: "State is required" })}
                                className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                            />
                            {errors.state && <p className='text-red-500'>{errors.state.message as string}</p>}
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                Country
                            </label>
                            <select
                                {...register("country")}
                                className='mt-1 block w-full rounded-md border-2 border-gray-500'>
                                <option value='' disabled>
                                    Select the country
                                </option>
                                <option value='india'>India</option>
                                <option value='australia'>Australia</option>
                            </select>
                            {errors.country && <p className='text-red-500'>{errors.country.message as string}</p>}
                        </div>
                        <div className='col-span-1'>
                            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                Zip Code
                            </label>
                            <input
                                type='text'
                                id='postal_code'
                                {...register("postal_code", { required: "Zip code is required" })}
                                className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                            />
                            {errors.postal_code && (
                                <p className='text-red-500'>{errors.postal_code.message as string}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <div className='fields grid grid-cols-2 gap-4'>
                        <div className='col-span-1'>
                            <div className='title mb-3'>
                                <h4>Subscription Information</h4>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='col-span-2'>
                                    <label htmlFor='assetInfo' className='block text-sm font-medium text-gray-700'>
                                        Asset Limit
                                    </label>
                                    <input
                                        type='text'
                                        id='asset_limit'
                                        {...register("allowed_asset_limit", {
                                            required: "Asset Limit is required",
                                        })}
                                        className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                    />
                                    {errors.allowed_asset_limit && (
                                        <p className='text-red-500'>{errors.allowed_asset_limit.message as string}</p>
                                    )}
                                </div>
                                <div className='col-span-1'>
                                    <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                        Status
                                    </label>
                                    <select
                                        {...register("status")}
                                        className='mt-1 block w-full rounded-md border-2 border-gray-500'>
                                        <option value='' disabled>
                                            Select the plan status
                                        </option>
                                        <option value='1'>Active</option>
                                        <option value='0'>Inactive</option>
                                    </select>
                                    {errors.status && <p className='text-red-500'>{errors.status.message as string}</p>}
                                </div>
                                <div className='col-span-1'>
                                    <label
                                        htmlFor='subscription_validity'
                                        className='block text-sm font-medium text-gray-700'>
                                        Valid Till
                                    </label>
                                    <input
                                        type='date'
                                        {...register("subscription_validity", {
                                            required: "Valid date is required",
                                        })}
                                        className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                    />
                                    {errors.subscription_validity && (
                                        <p className='text-red-500'>{errors.subscription_validity.message as string}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CompanyEdit;
