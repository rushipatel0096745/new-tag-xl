"use client";

import Link from "next/link";
import React, { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Role } from "../(super-admin)/users-and-roles/roles/page";
import { getRoleList } from "@/app/services/super-admin/roleList";
import { createUser, updateUser } from "@/app/services/super-admin/usersList";
import { UserProfile, Permission } from "../(super-admin)/users-and-roles/users/edit/[id]/page";

interface InitialSatate {
    success: boolean;
    error: string;
    data: string | number;
}

const UserEditForm = ({ userData, id }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [showMsg, setShowMsg] = useState<string>("");
    const [state, formAction, isPending] = useActionState<Promise<InitialSatate>>(updateUser.bind(null, id), {
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
            firstname: userData?.firstname,
            lastname: userData?.lastname,
            user_status: userData?.user_status ? "1" : "0",
            role_id: String(userData?.role?.id),
        },
    });

    const getRoles = async () => {
        const roles = await getRoleList();
        setRoles(roles);
    };

    // useEffect(() => {
    //   console.log("userData:", userData);
    //   console.log("roles:", roles);
    //   console.log("user_status value:", String(userData?.user_status));
    //   console.log("role_id value:", String(userData?.role_id));
    // }, [userData, roles]);

    useEffect(() => {
        if (userData && roles.length > 0) {
            reset({
                firstname: userData.firstname,
                lastname: userData.lastname,
                user_status: userData.user_status ? "1" : "0",
                role_id: String(userData.role.id),
            });
        }
    }, [userData, roles]);

    useEffect(() => {
        getRoles();
    }, []);

    const onSubmit = async (data: any) => {
        console.log("data: ", data);
        startTransition(() => formAction(data));
    };

    useEffect(() => {
        if (state?.success) {
            console.log(state);
            setShowMsg("user updated sucessfully");
        }
    }, [state]);

    return (
        <div className='mx-auto p-4 mt-10'>
            {" "}
            <form onSubmit={handleSubmit(onSubmit)} className='border-2 border-black p-4 rounded-2xl'>
                {showMsg && <p className='text-xl text-green-800'>{showMsg}</p>}
                <div className='form-header flex justify-between p-4 border-b'>
                    <div className='title'>
                        <h1 className='text-3xl'>Edit User</h1>
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
                                    {...register("firstname", {
                                        required: "First name required",
                                    })}
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
                                        <option value={String(role.id)} key={role.id}>
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
                                    <option value='1'>Active</option>
                                    <option value='0'>Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserEditForm;
