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
    role_id: number | null;
};

type Errors = {
    firstname?: string;
    lastname?: string;
    role_id?: string;
};

export interface User {
    has_error: boolean;
    message: string;
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    last_logged_in: any;
    role: UserRole;
}

export interface UserRole {
    id: number;
    role_name: string;
    permission: Permission;
}

const EditUser = ({ id }: { id: string }) => {
    const sessionId = getSessionId("company-user-session");
    const companyId = getCompanyId("company-user-session");

    const initialFormData: FormData = {
        firstname: "",
        lastname: "",
        role_id: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [roleList, setRoleList] = useState<Role[]>([]);
    const [permitted, setPermitted] = useState<string>();
    const [errors, setErrors] = useState<Errors>();

    const [showMsg, setShowMsg] = useState("");

    async function getUser(id: number | string) {
        try {
            const result = await clientFetch("/company/user/get/" + Number(id), {
                method: "GET",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
            });

            console.log("API response:", result);

            if (result.has_error && result.error_code == "PERMISSION_DENIED") {
                setPermitted(result.message || "Permission denied to delete");
                return;
            }

            if (result?.has_error) {
                console.error("user fetching failed:", result.message);
                return;
            }

            // setUser(result);
            setFormData({
                firstname: result.firstname,
                lastname: result.lastname,
                role_id: result.role?.id,
            });
        } catch (error) {
            console.error("user fetching error:", error);
        }
    }

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

            if (result.has_error && result.error_code == "PERMISSION_DENIED") {
                setPermitted(result.message || "Permission denied to update User");
                return;
            }

            if (result?.has_error) {
                console.error("roles fetching failed:", result.message);
                return;
            }

            setRoleList(result.roles);
        } catch (error) {
            console.error("roles fetching error:", error);
        }
    }

    async function updateUser(data: any): Promise<void> {
        try {
            const result = await clientFetch("/company/update-user/" + Number(id), {
                method: "PUT",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log("API response:", result);

            if (result.has_error && result.error_code == "PERMISSION_DENIED") {
                setPermitted(result.message || "Permission denied to Update User");
                return;
            }

            if (result?.has_error) {
                console.error("user updation failed:", result.message);
                return;
            }

            setShowMsg("User Updated succesfully");
        } catch (error) {
            console.error("user updation error:", error);
        }
    }

    useEffect(() => {
        getRoleList();
    }, []);

    useEffect(() => {
        getUser(id);
    }, []);

    useEffect(() => {
        // console.log("roles....", roleList);
    }, [roleList]);

    function validation() {
        const newErrors = {} as Errors;
        if (!formData.firstname) newErrors.firstname = "First name is required";
        if (!formData.lastname) newErrors.lastname = "Last name is required";
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
            role_id: formData.role_id ? parseInt(String(formData.role_id)) : null,
        };
        console.log("data....", data);

        await updateUser(data);
    }

    return (
        <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
            {/* Header */}
            {showMsg && <div className='text-green-600'>{showMsg}</div>}
            {permitted && <p className='text-red-500'>{permitted}</p>}

            <div className='header flex items-center justify-between mb-6'>
                <h4 className='text-xl font-semibold text-gray-800'>Edit User</h4>

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

                    {/* roles */}
                    <div>
                        <label className='form-label'>Role</label>
                        <select
                            className='form-input'
                            value={Number(formData.role_id)}
                            name='role_id'
                            onChange={(e) => setFormData((prev) => ({ ...prev, role_id: Number(e.target.value) }))}>
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

export default EditUser;
