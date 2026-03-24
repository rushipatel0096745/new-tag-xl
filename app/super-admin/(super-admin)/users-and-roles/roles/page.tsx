"use client";

import { getUserData } from "@/app/services/super-admin/companyList";
import { getRoleList } from "@/app/services/super-admin/roleList";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

export interface Role {
    id: number;
    role_name: string;
    description: any;
    permission: Permission;
}

export interface Permission {
    role: string[];
    user: string[];
    company: string[];
}

const Roles = () => {
    const [roleList, setRoleList] = useState<Role[]>([]);

    const [permissions, setPermissions] = useState<any[]>([]);

    async function getUser() {
        const user = await getUserData();
        const permissions = user?.role?.permission?.role;
        setPermissions(permissions);
    }

    async function getList() {
        const companies = await getRoleList();
        setRoleList(companies || []);
    }

    useEffect(() => {
        getUser();
        getList();
    }, []);

    return (
        <div className='mx-auto p-4 border-2 border-black rounded-2xl'>
            <div className='heading flex justify-between border-b border-b-gray-800 mb-2'>
                <div className='title'>
                    <h3>Role List</h3>
                </div>
                <div className='action'>
                    <Link
                        href={"/super-admin/users-and-roles/roles/add"}
                        className='border-2 rounded-2xl p-1 cursor-pointer'>
                        Add Role
                    </Link>
                </div>
            </div>

            <div className='list'>
                <div className='relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default'>
                    <table className='w-full text-sm text-left rtl:text-right text-body'>
                        <thead className='text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default'>
                            <tr>
                                <th scope='col' className='px-6 py-3 font-medium'>
                                    ID
                                </th>
                                <th scope='col' className='px-6 py-3 font-medium'>
                                    Role Name
                                </th>
                                <th scope='col' className='px-6 py-3 font-medium'>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {roleList.map((role) => (
                                <Suspense fallback={<p className='text-3xl'>Loading....</p>} key={role.id}>
                                    <tr className='bg-neutral-primary border-b border-default'>
                                        <th
                                            scope='row'
                                            className='px-6 py-4 font-medium text-heading whitespace-nowrap'>
                                            {role.id}
                                        </th>
                                        <td className='px-6 py-4'>{role.role_name}</td>
                                        <td className='px-6 py-4'>
                                            {permissions?.includes("update") && (
                                                <span className='mr-2 border rounded-xl p-1'>Update</span>
                                            )}
                                            {permissions?.includes("delete") && (
                                                <span className='border rounded-xl p-1'>Delete</span>
                                            )}
                                        </td>
                                    </tr>
                                </Suspense>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Roles;
