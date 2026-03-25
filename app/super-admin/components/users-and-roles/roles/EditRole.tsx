"use client";

import { GetRole, GetSuperUserPermissions } from "@/app/services/super-admin/role";
import { updateRole } from "@/app/services/super-admin/role-action";
import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
import Link from "next/link";
import React, { startTransition, useActionState, useEffect, useState } from "react";

export interface Permission {
    user: string[];
    role: string[];
    company: string[];
}

type Error = {
    role_name?: string;
    permission?: any;
};

const EditRole = ({ id }: { id: string }) => {
    const [permissionsList, setPermissionsList] = useState<Record<string, string[]>>({});

    const [roleName, setRoleName] = useState("");

    const [errors, setErrors] = useState<Error>();

    const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});

    const [showMsg, setShowMsg] = useState("");

    const [permitted, setPermitted] = useState("");

    const [state, formAction, isPending] = useActionState(updateRole.bind(null, Number(id)), {
        success: null,
        error: "",
        data: null,
    });

    async function getRole() {
        const result = await GetRole(Number(id));
        if (result.has_error && result.error_code == "PERMISSION_ERROR") {
            setPermitted("Permission Denied to Update");
        }
        if (!result.has_error) {
            setRoleName(result.role.role_name);
            setSelectedPermissions(result.role.permission);
        }
    }

    function validation() {
        const newErrors = {} as Error;
        if (!roleName) newErrors.role_name = "Role name is required";
        if (Object.entries(selectedPermissions).length === 0) newErrors.permission = "Select the permissions";

        setErrors(newErrors);

        return Object.entries(newErrors).length === 0;
    }

    async function getPermissionList() {
        const result = await GetSuperUserPermissions();
        if (result.has_error && result.error_code == "PERMISSION_DENIED") {
            setPermitted("Permission denied to update");
        }
        if (!result.has_error) {
            setPermissionsList(result.permissions);
        }
    }

    async function handleSubmit() {
        if (!validation()) return;
        const data = {
            role_name: roleName,
            permission: selectedPermissions,
        };
        console.log("data....", data);
        startTransition(() => formAction(data));
    }

    useEffect(() => {
        getPermissionList();
        getRole();
    }, []);

    useEffect(() => {
        if (state?.success) {
            setShowMsg("User updated suucessfully");
            getRole()
        } else {
            setShowMsg("");
        }
    }, [state]);

    useEffect(() => {
        console.log("permissions....", selectedPermissions);
    }, [selectedPermissions]);

    const handleCheckboxChange = (module: string, action: string) => {
        setSelectedPermissions((prev) => {
            const modulePermissions = prev[module] || [];

            if (modulePermissions.includes(action)) {
                // remove
                return {
                    ...prev,
                    [module]: modulePermissions.filter((a) => a !== action),
                };
            } else {
                // add
                return {
                    ...prev,
                    [module]: [...modulePermissions, action],
                };
            }
        });
    };

    const isAllSelected = (module: string, actions: string[]) => {
        return selectedPermissions[module]?.length === actions.length;
    };

    const handleSelectAllChange = (module: string, actions: string[]) => {
        const allSelected = isAllSelected(module, actions);

        setSelectedPermissions((prev) => ({
            ...prev,
            [module]: allSelected ? [] : actions,
        }));
    };

    function transfromName(name: string): string {
        const name_arr = name.split("_").map((name) => name.charAt(0).toUpperCase() + name.slice(1));
        const new_name = name_arr.join(" ");
        return new_name;
    }

    function transfromActionName(name: string): string {
        const name_arr = name.split("-").map((name) => name.charAt(0).toUpperCase() + name.slice(1));
        const new_name = name_arr.join(" ");
        return new_name;
    }

    return (
        <div className='main flex flex-col p-6 bg-white rounded-lg shadow-sm'>
            {/* Header */}
            {showMsg && <div className='text-green-600'>{showMsg}</div>}
            {permitted && <p className='text-red-500'>{permitted}</p>}
            {state?.error && (
                <div className='text-red-500'>
                    <p>{state?.error}</p>
                </div>
            )}

            <div className='header flex items-center justify-between mb-6'>
                <h4 className='text-xl font-semibold text-gray-800'>Edit Role</h4>

                <div className='flex gap-2'>
                    <Link
                        href='/super-admin/users-and-roles/roles'
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
                    {/* role name */}
                    <div className=''>
                        <label className='form-label'>Role Name</label>
                        <input
                            type='text'
                            className='form-input'
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                        />
                    </div>
                </div>
                {errors?.role_name && <p className='text-red-500'>{errors.role_name}</p>}

                {/* permissions */}
                <div className='permission'>
                    <div className='title mb-4'>
                        <h2 className='font-semibold'>Permissions</h2>
                    </div>

                    {Object.entries(permissionsList).map(([module, actions]) => {
                        const moduleName = transfromName(module);
                        return (
                            <div className='mb-6' key={module}>
                                <div className='font-semibold capitalize mb-2'>
                                    <label className='flex items-center gap-2 cursor-pointer' key={module}>
                                        <input
                                            type='checkbox'
                                            checked={isAllSelected(module, actions)}
                                            onChange={() => handleSelectAllChange(module, actions)}
                                        />
                                        Manage {moduleName}
                                    </label>
                                </div>
                                <div className='flex flex-wrap gap-6'>
                                    {actions.map((action) => (
                                        <label className='flex items-center gap-2 cursor-pointer' key={action}>
                                            <input
                                                type='checkbox'
                                                checked={selectedPermissions[module]?.includes(action) || false}
                                                onChange={() => handleCheckboxChange(module, action)}
                                            />
                                            {transfromActionName(action)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {errors?.permission && <p className='text-red-500'>{errors.permission}</p>}
                </div>
            </form>
        </div>
    );
};

export default EditRole;
