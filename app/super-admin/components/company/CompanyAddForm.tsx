"use client";
import React, { startTransition, useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Form, useForm } from "react-hook-form";
import { login } from "../../../services/super-admin/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CompanyAddForm = ({ createAction }: any) => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createAction, { success: null, error: "" });
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data: any) => {
        const { confirm_password, ...newData } = data;

        console.log("new data", newData);
        startTransition(() => formAction(newData));
    };

    useEffect(() => {
        if (state?.success) {
            router.push("/super-admin/company");
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='border-2 border-black p-4 rounded-2xl'>
            <div className='form-header flex justify-between p-4 border-b'>
                <div className='title'>
                    <h3>Add Company</h3>
                </div>
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
                            {errors.company_name && <p className='text-red-500'>{errors.company_name.message}</p>}
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
                            {errors.gst_or_tax_id && <p className='text-red-500'>{errors.gst_or_tax_id.message}</p>}
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
                            {errors.street && <p className='text-red-500'>{errors.street.message}</p>}
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
                            {errors.street && <p className='text-red-500'>{errors.street.message}</p>}
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
                            {errors.state && <p className='text-red-500'>{errors.state.message}</p>}
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
                            {errors.country && <p className='text-red-500'>{errors.country.message}</p>}
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
                            {errors.postal_code && <p className='text-red-500'>{errors.postal_code.message}</p>}
                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <div className='fields grid grid-cols-2 gap-4'>
                        <div className='col-span-1'>
                            <div className='title mb-3'>
                                <h4>Login Information</h4>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='col-span-2'>
                                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                        Email
                                    </label>
                                    <input
                                        type='email'
                                        id='email'
                                        {...register("email", { required: "Email is required" })}
                                        className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                    />
                                    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                                </div>
                                <div className='col-span-1'>
                                    <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                                        Password
                                    </label>
                                    <input
                                        type='password'
                                        id='password'
                                        {...register("password", { required: "Password is required" })}
                                        className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                    />
                                    {errors.password && <p>{errors.password.message}</p>}
                                </div>
                                <div className='col-span-1'>
                                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                        Confirm Password
                                    </label>
                                    <input
                                        type='password'
                                        id='confirm_password'
                                        {...register("confirm_password", {
                                            required: "Confirm password is required",
                                            validate: (value) => value === password || "password do not match",
                                        })}
                                        className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                    />
                                    {errors.confirm_password && <p>{errors.confirm_password?.message}</p>}
                                </div>
                            </div>
                        </div>

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
                                        <p className='text-red-500'>{errors.allowed_asset_limit.message}</p>
                                    )}
                                </div>
                                <div className='col-span-1'>
                                    <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                        Country
                                    </label>
                                    <select
                                        {...register("status")}
                                        className='mt-1 block w-full rounded-md border-2 border-gray-500'>
                                        <option value='' disabled>
                                            Select the plan status
                                        </option>
                                        <option value='true'>Active</option>
                                        <option value='false'>Inactive</option>
                                    </select>
                                    {errors.status && <p className='text-red-500'>{errors.status.message}</p>}
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
                                        <p className='text-red-500'>{errors.subscription_validity.message}</p>
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

export default CompanyAddForm;
