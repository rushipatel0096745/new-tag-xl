"use client";

import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface ColumnItem {
    name: string;
    type: string;
}

const LocationFilter = () => {
    const [toggle, setToggle] = useState(false);
    const [columns, setColumns] = useState<ColumnItem[]>([]);
    const [conditions, setConditions] = useState<Record<string, string>>({});

    const router = useRouter();

    type Filter = {
        field: string;
        condition: string;
        text: string | string[];
    };

    type DraftFilter = {
        field: string;
        condition?: string;
        text: string | string[];
    };

    const [filters, setFilters] = React.useState<Filter[]>([]);
    const [draftFilters, setDraftFilters] = useState<DraftFilter[]>([]);

    const sessionId = getSessionId("company-user-session");
    const companyId = getCompanyId("company-user-session");

    async function getLocationCols() {
        try {
            const result = await clientFetch("/company/table-columns/locations", {
                method: "GET",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
            });

            console.log("ROLE COLUMN API response:", result);

            if (result?.has_error) {
                console.error("roles fetching failed:", result.message);
                return;
            }

            setColumns(result.columns);
            setConditions(result.conditions);
        } catch (error) {
            console.error("Column fetching error:", error);
        }
    }

    const applyFilter = function () {
        let filtersArr = draftFilters.map((filter) => {
            if (Array.isArray(filter.text)) {
                const text = filter.text.filter(Boolean); 
                return {
                    ...filter,
                    text: text.length === 1 ? text[0] : text, 
                };
            }
            return filter;
        });
        console.log("filters: ", draftFilters);
        console.log("formated filters: ", filtersArr);
        Cookies.set("company_location_filter", JSON.stringify(filtersArr));
        window.dispatchEvent(new Event("LocationFiltersChanged"));
    };

    const resetFilter = function () {
        setToggle(false);
        setDraftFilters([]);
        Cookies.remove("company_location_filter");
        window.dispatchEvent(new Event("LocationFiltersChanged"));
    };

    useEffect(() => {
        getLocationCols();
    }, []);

    // load values from cookie
    useEffect(() => {
        setToggle(true);
        const savedFilters = Cookies.get("company_location_filter");
        if (!savedFilters) return;

        try {
            const parsed: DraftFilter[] = JSON.parse(savedFilters);

            const restored = parsed.map((filter) => {
                if (filter.condition === "gte" && typeof filter.text === "string") {
                    return { ...filter, text: [filter.text, ""] };
                }
                if (filter.condition === "lte" && typeof filter.text === "string") {
                    return { ...filter, text: ["", filter.text] };
                }
                return filter;
            });

            setDraftFilters(restored);
        } catch (e) {
            console.error("Failed to restore filters from cookie", e);
        }
    }, []);

    function handleFilterChange(colName: string, type: string, value: string, date_index: number) {
        setDraftFilters((prev) => {
            const existingFilter = prev.find((fil) => fil.field === colName);

            if (!value && type !== "DATETIME") {
                return prev.filter((fil) => fil.field !== colName);
            }

            const buildDateFilter = (existing: DraftFilter | undefined): DraftFilter | null => {
                const prevDates = Array.isArray(existing?.text) ? existing.text : ["", ""];
                const updatedDates: [string, string] = date_index === 0 ? [value, prevDates[1]] : [prevDates[0], value];

                const [from, to] = updatedDates;

                if (!from && !to) return null;

                const condition = from && to ? "between" : from ? "gte" : "lte";
                return { field: colName, condition, text: updatedDates };
            };

            const buildTextFilter = (): DraftFilter => ({
                field: colName,
                condition: "contains",
                text: value,
            });

            const newFilter = type === "DATETIME" ? buildDateFilter(existingFilter) : buildTextFilter();

            if (newFilter === null) {
                return prev.filter((fil) => fil.field !== colName);
            }

            if (existingFilter) {
                return prev.map((fil) => (fil.field === colName ? newFilter : fil));
            }

            return [...prev, newFilter];
        });
    }

    // get the draft filter for a column
    const getDraftFilter = (colName: string) => draftFilters.find((fil) => fil.field === colName);

    // get text value
    const getTextValue = (colName: string): string => {
        const filter = getDraftFilter(colName);
        if (!filter) return "";
        return typeof filter.text === "string" ? filter.text : "";
    };

    // get date value by index
    const getDateValue = (colName: string, index: number): string => {
        const filter = getDraftFilter(colName);
        if (!filter || !Array.isArray(filter.text)) return "";
        return filter.text[index] ?? "";
    };

    return (
        <>
            <div className='card-box bg-[#fff] border-gray-700 rounded-[18px] shadow-3xl shadow-white px-3 py-5.5 filter-section mb-16'>
                <div className='card-box_head  filter-head grid grid-cols-[1fr_auto]'>
                    <div
                        className='title-wrapper filter-trigger cursor-pointer h-full w-full flex items-center'
                        onClick={() => setToggle((prev) => !prev)}>
                        <h3 className='title h3 h3 text-[18px] font-semibold leading-6'>Filters</h3>
                    </div>{" "}
                    <div className='actions-btn flex items-center gap-2 icon-text-button primary cursor-pointer'>
                        <button
                            onClick={resetFilter}
                            className='icon-text-button default bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'
                            type='button'>
                            <span className='icon-circle'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width={24}
                                    height={24}
                                    viewBox='0 0 24 24'
                                    fill='none'>
                                    <path
                                        d='M2 21V16C2 15.4477 2.44772 15 3 15H8C8.55228 15 9 15.4477 9 16C9 16.5523 8.55228 17 8 17H5.41406L5.95508 17.541L6.26562 17.8271C7.84922 19.2168 9.88571 19.9906 12.002 19.999C14.123 19.9985 16.1574 19.1571 17.6572 17.6572C19.1575 16.1569 20 14.1217 20 12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12C22 14.6522 20.9467 17.1959 19.0713 19.0713C17.1959 20.9467 14.6522 22 12 22H11.9961C9.22205 21.9895 6.5599 20.9066 4.56543 18.9785L5.27441 18.2441L5.25977 18.2598L4.56543 18.9785C4.56138 18.9746 4.55672 18.9708 4.55273 18.9668L4 18.4141V21C4 21.5523 3.55228 22 3 22C2.44772 22 2 21.5523 2 21ZM2 12C2 9.34784 3.05335 6.80407 4.92871 4.92871C6.80407 3.05335 9.34784 2 12 2H12.0039L12.5225 2.01465C14.9359 2.14027 17.2373 3.07585 19.0537 4.66992L19.4473 5.0332L20 5.58594V3C20 2.44772 20.4477 2 21 2C21.5523 2 22 2.44772 22 3V8C22 8.55228 21.5523 9 21 9H16C15.4477 9 15 8.55228 15 8C15 7.44772 15.4477 7 16 7H18.5859L18.0449 6.45898L17.7344 6.17285C16.1505 4.78301 14.1137 4.00816 11.9971 4C9.8764 4.00078 7.84237 4.84317 6.34277 6.34277C4.84248 7.84306 4 9.87827 4 12C4 12.5523 3.55228 13 3 13C2.44772 13 2 12.5523 2 12Z'
                                        fill='#919191'
                                    />
                                </svg>
                            </span>
                            <span className='button-label text-[#1a1a1a] capitalize ml-2'>Reset</span>
                        </button>
                        <button
                            onClick={applyFilter}
                            className='icon-text-button primary bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'
                            type='button'>
                            <span className='icon-circle'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width={24}
                                    height={24}
                                    viewBox='0 0 24 24'
                                    fill='none'>
                                    <path
                                        d='M19 17C19 15.8954 18.1046 15 17 15C15.8954 15 15 15.8954 15 17C15 18.1046 15.8954 19 17 19C18.1046 19 19 18.1046 19 17ZM7 3C8.86657 3 10.4336 4.27874 10.875 6.00781C10.916 6.00271 10.9577 6 11 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H11C10.9576 8 10.916 7.99633 10.875 7.99121C10.4339 9.72075 8.8669 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3ZM21 17C21 19.2091 19.2091 21 17 21C15.1362 21 13.57 19.7252 13.126 18H5C4.44772 18 4 17.5523 4 17C4 16.4477 4.44772 16 5 16H13.126C13.57 14.2748 15.1362 13 17 13C19.2091 13 21 14.7909 21 17ZM5 7C5 8.10457 5.89543 9 7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7Z'
                                        fill='#845ADF'
                                    />
                                </svg>
                            </span>
                            <span className='button-label text-[#1a1a1a] capitalize ml-2'>Apply filter</span>
                        </button>
                    </div>
                </div>

                {toggle && (
                    <form className='flex flex-col gap-6'>
                        <div className='grid grid-cols-2 gap-4'>
                            {columns.map((col) =>
                                col.type === "DATETIME" ? (
                                    <div className='col-span-3' key={col.name}>
                                        <label>
                                            {col.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </label>
                                        <div className='grid grid-cols-2 gap-2'>
                                            <input
                                                type='date'
                                                className='form-input'
                                                value={getDateValue(col.name, 0)}
                                                onChange={(e) => {
                                                    handleFilterChange(col.name, col.type, e.target.value, 0);
                                                }}
                                            />
                                            <input
                                                type='date'
                                                className='form-input'
                                                value={getDateValue(col.name, 1)}
                                                onChange={(e) => {
                                                    handleFilterChange(col.name, col.type, e.target.value, 1);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : col.type === "INTEGER" || col.type === "BIGINT" ? (
                                    <div className='col-span-1' key={col.name}>
                                        <label>
                                            {col.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </label>
                                        <input
                                            type='number'
                                            className='form-input'
                                            value={getTextValue(col.name)}
                                            onChange={(e) => {
                                                handleFilterChange(col.name, col.type, e.target.value, 0);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className='col-span-1' key={col.name}>
                                        <label>
                                            {col.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </label>
                                        <input
                                            type='text'
                                            className='form-input'
                                            value={getTextValue(col.name)}
                                            onChange={(e) => {
                                                handleFilterChange(col.name, col.type, e.target.value, 0);
                                            }}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default LocationFilter;
