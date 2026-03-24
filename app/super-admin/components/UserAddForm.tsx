"use client";

import Link from "next/link";
import React, { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Role } from "../(super-admin)/users-and-roles/roles/page";
import { getRoleList } from "@/app/services/super-admin/roleList";
import { createUser } from "@/app/services/super-admin/usersList";

interface InitialSatate {
    succees: boolean;
    error: string;
    data: string | number;
}

const UserAddForm = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [showMsg, setShowMsg] = useState<string>("");
    const [state, formAction, isPending] = useActionState<Promise<InitialSatate>>(createUser, {
        success: null,
        error: "",
        data: null,
    });

    const {
        register,
        watch,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirm_password: "",
            user_status: "",
            role_id: "",
        },
    });

    const getRoles = async () => {
        const roles = await getRoleList();
        setRoles(roles);
    };

    useEffect(() => {
        getRoles();
    }, []);

    const password = watch("password");

    const onSubmit = async (data: any) => {
        console.log("data: ", data);
        const { confirm_password, ...newData } = data;
        console.log(newData);
        reset();
        setShowMsg("user created suucessfully");
        // startTransition(() => formAction(newData));
    };

    // useEffect(() => {
    //     if (state?.succees) {
    //     }
    // });

    return (
        <div className='mx-auto p-4 mt-10'>
            {" "}
            <form onSubmit={handleSubmit(onSubmit)} className='border-2 border-black p-4 rounded-2xl'>
                {showMsg && <p className='text-xl text-green-800'>{showMsg}</p>}
                <div className='form-header flex justify-between p-4 border-b'>
                    <div className='title'>
                        <h1 className='text-3xl'>Add User</h1>
                    </div>
                    <div className='action'>
                        <Link
                            href={"/super-admin/users-and-roles/users"}
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
                        <div className='fields grid grid-cols-2 gap-4'>
                            <div className='col-span-1'>
                                <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
                                    First Name
                                </label>
                                <input
                                    type='text'
                                    id='first_name'
                                    className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                    {...register("firstname", { required: "First name required" })}
                                />
                            </div>
                            <div className='col-span-1'>
                                <label htmlFor='last_name' className='block text-sm font-medium text-gray-700'>
                                    Last Name
                                </label>
                                <input
                                    type='text'
                                    id='last_name'
                                    {...register("lastname", { required: "Last name required" })}
                                    className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                />
                            </div>
                            <div className='col-span-1'>
                                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                    Email
                                </label>
                                <input
                                    type='text'
                                    id='email'
                                    {...register("email", { required: "Email is required" })}
                                    className='mt-1 block w-full rounded-md border-2 border-gray-500 '
                                />
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
                            </div>
                            <div className='col-span-1'>
                                <label htmlFor='confirm_password' className='block text-sm font-medium text-gray-700'>
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

                            <div className='col-span-1'>
                                <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
                                    Select the Role
                                </label>
                                <select
                                    {...register("role_id")}
                                    className='mt-1 block w-full rounded-md border-2 border-gray-500'>
                                    <option value='' disabled>
                                        Select the Role
                                    </option>
                                    {roles?.map((role) => (
                                        <option value={Number(role.id)} key={role.id}>
                                            {role.role_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='col-span-1'>
                                <label htmlFor='user_status' className='block text-sm font-medium text-gray-700'>
                                    Select the user status
                                </label>
                                <select
                                    {...register("user_status")}
                                    className='mt-1 block w-full rounded-md border-2 border-gray-500'>
                                    <option value='' disabled>
                                        Select the user status
                                    </option>
                                    <option value={Number(1)}>Active</option>
                                    <option value={Number(0)}>Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserAddForm;
