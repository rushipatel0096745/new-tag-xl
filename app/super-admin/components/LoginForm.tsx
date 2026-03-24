"use client";
import React, { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../../services/super-admin/auth";
import { useRouter } from "next/navigation";

const LoginForm = ({ loginAction }: { loginAction: (prevState: any, formData: FormData) => Promise<any> }) => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(loginAction, { success: null, error: "" });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        startTransition(() => formAction(formData));
    };

    useEffect(() => {
        if (state.success === true) {
            router.push("/super-admin");
        }
    });

    return (
        <div>
            <div className='bg-gray-50'>
                <div className='min-h-screen flex flex-col items-center justify-center py-6 px-4'>
                    <div className='max-w-120 w-full'>
                        <div className='p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm'>
                            <h1 className='text-slate-900 text-center text-3xl font-semibold'>Log in</h1>
                            <form className='mt-12 space-y-6' onSubmit={handleSubmit(onSubmit)}>
                                {state?.error && <div className='text-red-400'>{state.error}</div>}
                                <div>
                                    <label className='text-slate-900 text-sm font-medium mb-2 block'>Email</label>
                                    <div className='relative flex items-center'>
                                        <input
                                            // name='email'
                                            type='text'
                                            className='w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600'
                                            placeholder='Enter email'
                                            {...register("email", { required: "Email is required" })}
                                        />
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='#bbb'
                                            stroke='#bbb'
                                            className='w-4 h-4 absolute right-4'
                                            viewBox='0 0 24 24'>
                                            <circle cx={10} cy={7} r={6} data-original='#000000' />
                                            <path
                                                d='M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z'
                                                data-original='#000000'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <label className='text-slate-900 text-sm font-medium mb-2 block'>Password</label>
                                    <div className='relative flex items-center'>
                                        <input
                                            // name='password'
                                            type='password'
                                            className='w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600'
                                            placeholder='Enter password'
                                            {...register("password", { required: "Password is required" })}
                                        />
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='#bbb'
                                            stroke='#bbb'
                                            className='w-4 h-4 absolute right-4 cursor-pointer'
                                            viewBox='0 0 128 128'>
                                            <path
                                                d='M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z'
                                                data-original='#000000'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className='flex flex-wrap items-center justify-between gap-4'>
                                    <div className='text-sm'>
                                        <a
                                            href='jajvascript:void(0);'
                                            className='text-blue-600 hover:underline font-semibold'>
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>
                                <div className='mt-2!'>
                                    <button
                                        type='submit'
                                        disabled={isPending}
                                        className='w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer'>
                                        {isPending ? "Logging in...." : "Login"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
