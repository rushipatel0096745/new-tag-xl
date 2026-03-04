"use client";

import { getUserData } from "@/app/services/super-admin/companyList";
import { getUsersColumns, getUsersList } from "@/app/services/super-admin/usersList";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    user_status: boolean;
    last_logged_in: string;
    role: Role;
}

export interface Role {
    id: number;
    role_name: string;
    permission: Permission;
}

export interface Permission {
    role: string[];
    user: string[];
    company: string[];
}

interface Filter {
    field?: string;
    condition: string;
    text?: string;
}

interface Column {
    name: string;
    type: string;
}

const EMPTY_FILTER: Filter = { field: "", condition: "", text: "" };

const Users = () => {
    const [sessionId, setSessionId] = useState<string>("");
    const [userList, setUserList] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    // const [filters, setFilters] = useState<filter[]>([]);

    const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);

    const [draftFilters, setDraftFilters] = useState<Filter[]>([{ ...EMPTY_FILTER }]);

    const [columns, setColumns] = useState<Column[]>([]);
    const [conditions, setConditions] = useState<any>({});
    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [permissions, setPermissions] = useState<any[]>([]);

    async function getUser() {
        const user = await getUserData();
        const permissions = user?.role?.permission?.user
        setPermissions(permissions);
    }

    useEffect(() => {
        // const fetchSessionId = async () => {
        //     const id = await getBySessionName("user-session");
        //     setSessionId(id || "");
        // };
        // fetchSessionId();
        getUser();
        permissions && console.log(permissions);
    }, []);

    async function getList() {
        const companies = await getUsersList(page, appliedFilters);
        setUserList(companies || []);
    }

    async function getColumns() {
        const [cols, conds] = await getUsersColumns();
        setColumns(cols);
        setConditions(conds);
        console.log(conds);
    }

    useEffect(() => {
        getList();
        console.log("filters: ", appliedFilters);
    }, [page, appliedFilters, sessionId]);

    useEffect(() => {
        getColumns();
    }, []);

    function updateDraftFilter(index: number, key: keyof Filter, value: string) {
        setDraftFilters((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [key]: value };
            return updated;
        });
    }

    function addFilterRow() {
        setDraftFilters((prev) => [...prev, { ...EMPTY_FILTER }]);
    }

    function removeFilterRow(index: number) {
        setDraftFilters((prev) => prev.filter((_, i) => i !== index));
    }

    function handleApply() {
        const valid = draftFilters.filter((f) => f.field && f.condition && f.text);
        setAppliedFilters(valid);
        setPage(1);
    }

    function handleReset() {
        setPage(1);
        setAppliedFilters([]);
        setDraftFilters([{ ...EMPTY_FILTER }]);
    }

    return (
        <div className='main p-4'>
            <div className='heading mb-3'>
                <h2>Users</h2>
            </div>

            <div className='filters  border-2 border-black p-4 rounded-2xl mb-10'>
                <div className='flex justify-between border-2 border-black p-4 rounded-2xl mb-5'>
                    <div className='title items-center'>
                        <button className='text-xl cursor-pointer' onClick={() => setShowFilter((prev) => !prev)}>
                            Filters
                        </button>
                    </div>
                    <div className='actions'>
                        <button
                            className='border-2 rounded-2xl p-1 mr-2 cursor-pointer'
                            type='button'
                            onClick={handleReset}>
                            Reset
                        </button>
                        <button className='border-2 rounded-2xl p-1 cursor-pointer' type='button' onClick={handleApply}>
                            Apply filter
                        </button>
                    </div>
                </div>

                {showFilter && (
                    <>
                        {draftFilters.map((filter, index) => (
                            <div key={index} className='grid grid-cols-[1fr_28px] gap-4 items-end mb-4'>
                                <div className='flex gap-6 w-full'>
                                    <div className='flex-1'>
                                        <label className='block text-sm font-medium text-gray-700'>
                                            Select the column
                                        </label>
                                        <select
                                            className='mt-1 w-full rounded-md border-2 border-gray-500'
                                            value={filter.field}
                                            onChange={(e) => updateDraftFilter(index, "field", e.target.value)}>
                                            <option value=''>Select the column</option>
                                            {columns.map((col) => (
                                                <option value={col.name} key={col.name}>
                                                    {col.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='flex-1'>
                                        <label className='block text-sm font-medium text-gray-700'>
                                            Select the condition
                                        </label>
                                        <select
                                            className='mt-1 w-full rounded-md border-2 border-gray-500'
                                            value={filter.condition}
                                            onChange={(e) => updateDraftFilter(index, "condition", e.target.value)}>
                                            <option value=''>Select the condition</option>
                                            {Object?.entries(conditions).map(([label, value]: any) => (
                                                <option value={value} key={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='flex-1'>
                                        <label className='block text-sm font-medium text-gray-700'>Enter value</label>
                                        <input
                                            type='text'
                                            className='mt-1 w-full rounded-md border-2 border-gray-500'
                                            value={filter.text}
                                            onChange={(e) => updateDraftFilter(index, "text", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    className='text-red-500 hover:text-red-700'
                                    onClick={() => removeFilterRow(index)}>
                                    ✕
                                </button>
                            </div>
                        ))}

                        <div className='add-filter-field mt-3'>
                            <button className='p-2 border rounded-xl' onClick={addFilterRow}>
                                + Add
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className='company-list border-2 border-black rounded-2xl p-4'>
                <div className='heading flex justify-between border-b border-b-gray-800 mb-2'>
                    <div className='title'>
                        <h3>User List</h3>
                    </div>
                    <div className='action'>
                        <Link href={"/super-admin/users-and-roles/users/add"} className='border-2 rounded-2xl p-1 cursor-pointer'>
                            Add User
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
                                        Email
                                    </th>
                                    <th scope='col' className='px-6 py-3 font-medium'>
                                        First Name
                                    </th>
                                    <th scope='col' className='px-6 py-3 font-medium'>
                                        Lastname
                                    </th>
                                    <th scope='col' className='px-6 py-3 font-medium'>
                                        Status
                                    </th>
                                    <th scope='col' className='px-6 py-3 font-medium'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList.map((user) => (
                                    <Suspense fallback={<p className='text-3xl'>Loading....</p>} key={user.id}>
                                        <tr className='bg-neutral-primary border-b border-default'>
                                            <th
                                                scope='row'
                                                className='px-6 py-4 font-medium text-heading whitespace-nowrap'>
                                                {user.id}
                                            </th>
                                            <td className='px-6 py-4'>{user.email}</td>
                                            <td className='px-6 py-4'>{user.firstname}</td>
                                            <td className='px-6 py-4'>{user.lastname}</td>
                                            <td className='px-6 py-4'>
                                                {user.user_status ? (
                                                    <span className='bg-success-soft text-fg-success-strong text-sm font-medium px-2 py-1 rounded'>
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className='bg-danger-soft text-fg-danger-strong text-sm font-medium px-2 py-1 rounded'>
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            <td className='px-6 py-4'>
                                                {permissions?.includes("update") && (
                                                    <Link href={`/super-admin/users-and-roles/users/edit/${user.id}`} className='mr-2 border rounded-xl p-1 cursor-pointer'>Update</Link>
                                                )}
                                                {permissions?.includes("delete") && <span className="border rounded-xl p-1">Delete</span>}
                                            </td>
                                        </tr>
                                    </Suspense>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;



// import { Suspense } from "react";
// import { getUsersList } from "@/app/services/super-admin/usersList";
// import UsersTable from "../../components/UsersTable";

// export default async function Page() {
//   const users = await getUsersList(1, []);

//   return (
//     <Suspense fallback={<p className="text-2xl">Loading users...</p>}>
//       <UsersTable initialUsers={users || []} />
//     </Suspense>
//   );
// }