"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetUsersCols } from "@/app/services/super-admin/user";

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

const UserFilter = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const [conditions, setConditions] = useState<Record<string, string>>({});
    const [draftFilters, setDraftFilters] = useState<Filter[]>([{ ...EMPTY_FILTER }]);
    const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);
    const [showFilter, setShowFilter] = useState<boolean>(false);

    useEffect(() => {
        async function getUserCols() {
            const result = await GetUsersCols();
            setColumns(result.columns ?? []);
            setConditions(result.conditions ?? {});
        }

        getUserCols();
    }, []);

    useEffect(() => {
        const saved = Cookies.get("super_user_filter");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.length > 0) {
                    setDraftFilters(parsed);
                    setAppliedFilters(parsed);
                    setShowFilter(true);
                }
            } catch {
                Cookies.remove("super_user_filter");
            }
        }
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
        Cookies.set("super_user_filter", JSON.stringify(valid));
        window.dispatchEvent(new Event("SuperUserFiltersChanged"));
    }

    function handleReset() {
        setAppliedFilters([]);
        // setDraftFilters([{ ...EMPTY_FILTER }]);
        setDraftFilters([]);
        Cookies.remove("super_user_filter");
        window.dispatchEvent(new Event("SuperUserFiltersChanged"));
    }

    useEffect(() => {
        console.log("applied filters: ", appliedFilters);
    }, [appliedFilters]);

    return (
        <div className='filters border-2 border-black p-4 rounded-2xl mb-10'>
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
                                    <label className='block text-sm font-medium text-gray-700'>Select the column</label>
                                    <select
                                        className='mt-1 w-full rounded-md border-2 border-gray-500'
                                        value={filter.field}
                                        onChange={(e) => updateDraftFilter(index, "field", e.target.value)}>
                                        <option value=''>Select the column</option>
                                        {columns
                                            .filter((col) => !["password", "role_id"].includes(col.name))
                                            .map((col) => (
                                                <option value={col.name} key={col.name}>
                                                    {col.name
                                                        .replace(/_/g, " ")
                                                        .replace(/\b\w/g, (c) => c.toUpperCase())}
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
                                        {Object.entries(conditions).map(([label, value]) => (
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

                            <button className='text-red-500 hover:text-red-700' onClick={() => removeFilterRow(index)}>
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
    );
};

export default UserFilter;
