"use client";

import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export interface Role {
    id: number;
    role_name: string;
    description: any;
    permission: Permission;
}

export interface Permission {
    role: string[];
    user: string[];
}

type FormData = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirm_password: string;
    role_id: string | null;
};

type Errors = {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
    role_id?: string;
};

const AddUser = () => {
    const sessionId = getSessionId("company-user-session");
    const companyId = getCompanyId("company-user-session"); 

    const initialFormData: FormData = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirm_password: "",
        role_id: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [roleList, setRoleList] = useState<Role[]>([]);

    const [errors, setErrors] = useState<Errors>();

    const [showMsg, setShowMsg] = useState("");

    async function getRoleList() {
        try {
            const result = await clientFetch("/company/role/list", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page: 1,
                    page_size: 10,
                    filters: [],
                }),
            });

            console.log("API response:", result);

            if (result?.has_error) {
                console.error("roles fetching failed:", result.message);
                return;
            }

            setRoleList(result.roles);
        } catch (error) {
            console.error("roles fetching error:", error);
        }
    }

    async function createUser(data: any): Promise<void> {
        try {
            const result = await clientFetch("/company/create-user", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log("API response:", result);

            if (result?.has_error) {
                console.error("user creation failed:", result.message);
                return;
            }

            setShowMsg("User created succesfully")
            setFormData(initialFormData)

        } catch (error) {
            console.error("user creation error:", error);
        }
    }

    useEffect(() => {
        getRoleList();
    }, []);

    useEffect(() => {
        console.log("roles....", roleList);
    }, [roleList]);

    function validation() {
        const newErrors = {} as Errors;
        if (!formData.firstname) newErrors.firstname = "First name is required";
        if (!formData.lastname) newErrors.lastname = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirm_password) newErrors.confirm_password = "Confirm Password is required";
        if (formData.confirm_password) {
            if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Password does not match";
        }
        if (!formData.role_id) newErrors.role_id = "Select the Role";

        setErrors(newErrors);

        return Object.entries(newErrors).length === 0;
    }

    async function handleSubmit() {
        if (!validation()) return;
        // const {confirm_password, ...data} = formData;
        const data = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            role_id: formData.role_id ? parseInt(formData.role_id) : null,
        };
        console.log("data....", data);

        await createUser(data);
    }

    return (
        <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
            {/* Header */}
            {showMsg && <div className='text-green-600'>{showMsg}</div>}
            <div className='header flex items-center justify-between mb-6'>
                <h4 className='text-xl font-semibold text-gray-800'>Add User</h4>

                <div className='flex gap-2'>
                    <Link
                        href='/company-admin/users-and-roles/users'
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
                <div className='grid grid-cols-2 gap-4'>
                    {/* firstname */}
                    <div className=''>
                        <label className='form-label'>First Name</label>
                        <input
                            type='text'
                            className='form-input'
                            value={formData.firstname}
                            onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                        />
                        {errors?.firstname && <p className='text-red-500'>{errors.firstname}</p>}
                    </div>

                    {/* lastname */}
                    <div className=''>
                        <label className='form-label'>Last Name</label>
                        <input
                            type='text'
                            className='form-input'
                            value={formData.lastname}
                            onChange={(e) => setFormData((prev) => ({ ...prev, lastname: e.target.value }))}
                        />
                        {errors?.lastname && <p className='text-red-500'>{errors.lastname}</p>}
                    </div>

                    {/* email */}
                    <div className=''>
                        <label className='form-label'>Email</label>
                        <input
                            type='email'
                            className='form-input'
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        />
                        {errors?.email && <p className='text-red-500'>{errors.email}</p>}
                    </div>

                    {/* password */}
                    <div className=''>
                        <label className='form-label'>Password</label>
                        <input
                            type='password'
                            className='form-input'
                            value={formData.password}
                            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        />
                        {errors?.password && <p className='text-red-500'>{errors.password}</p>}
                    </div>

                    {/* confirm password */}
                    <div className=''>
                        <label className='form-label'>Confirm Password</label>
                        <input
                            type='password'
                            className='form-input'
                            value={formData.confirm_password}
                            onChange={(e) => setFormData((prev) => ({ ...prev, confirm_password: e.target.value }))}
                        />
                        {errors?.confirm_password && <p className='text-red-500'>{errors.confirm_password}</p>}
                    </div>

                    {/* roles */}
                    <div>
                        <label className='form-label'>Role</label>
                        <select
                            className='form-input'
                            value={Number(formData.role_id)}
                            name='role_id'
                            onChange={(e) => setFormData((prev) => ({ ...prev, role_id: e.target.value }))}>
                            <option value=''>Select role</option>
                            {roleList.map((role) => (
                                <option value={role.id} key={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                        {errors?.role_id && <p className='text-red-500'>{errors.role_id}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddUser;
