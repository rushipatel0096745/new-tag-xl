// "use client";

// import { getCompanyColumns, getCompanyList, getUserData } from "@/app/services/super-admin/companyList";
// import Link from "next/link";
// import React, { Suspense, useEffect, useState } from "react";

// interface Company {
//     id: number;
//     company_id: number;
//     company_name: string;
//     street: string;
//     street2: string;
//     city: string;
//     state: string;
//     country: string;
//     postal_code: string;
//     email: string;
//     gst_or_tax_id: string;
//     status: boolean;
//     allowed_asset_limit: number;
//     is_delete: boolean;
//     subscription_validity: string;
//     created_at: string;
//     updated_at: string;
// }

// interface Filter {
//     field?: string;
//     condition: string;
//     text?: string;
// }

// interface Column {
//     name: string;
//     type: string;
// }

// const EMPTY_FILTER: Filter = { field: "", condition: "", text: "" };

// const CompanyPage = () => {
//     const [sessionId, setSessionId] = useState<string>("");
//     const [companyList, setCompanyList] = useState<Company[]>([]);
//     const [page, setPage] = useState<number>(1);
//     // const [filters, setFilters] = useState<filter[]>([]);

//     const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);

//     const [draftFilters, setDraftFilters] = useState<Filter[]>([{ ...EMPTY_FILTER }]);

//     const [columns, setColumns] = useState<Column[]>([]);
//     const [conditions, setConditions] = useState<any>({});
//     const [showFilter, setShowFilter] = useState<boolean>(false);

//     const [permissions, setPermissions] = useState<any[]>([]);

//     async function getUser() {
//         const user = await getUserData();
//         const permissions =user?.role?.permission?.company;
//         setPermissions(permissions);
//     }

//     useEffect(() => {
//         // const fetchSessionId = async () => {
//         //     const id = await getBySessionName("user-session");
//         //     setSessionId(id || "");
//         // };
//         // fetchSessionId();
//         getUser();
//     }, []);

//     async function getList() {
//         const companies = await getCompanyList(page, appliedFilters);
//         setCompanyList(companies || []);
//     }

//     async function getColumns() {
//         const [cols, conds] = await getCompanyColumns();
//         setColumns(cols);
//         setConditions(conds);
//         console.log(conds);
//     }

//     useEffect(() => {
//         getList();
//         console.log('filters: ', appliedFilters)
//     }, [page, appliedFilters, sessionId]);

//     useEffect(() => {
//         getColumns();
//     }, []);

//     function updateDraftFilter(index: number, key: keyof Filter, value: string) {
//         setDraftFilters((prev) => {
//             const updated = [...prev];
//             updated[index] = { ...updated[index], [key]: value };
//             return updated;
//         });
//     }

//     function addFilterRow() {
//         setDraftFilters((prev) => [...prev, { ...EMPTY_FILTER }]);
//     }

//     function removeFilterRow(index: number) {
//         setDraftFilters((prev) => prev.filter((_, i) => i !== index));
//     }

//     function handleApply() {
//         const valid = draftFilters.filter((f) => f.field && f.condition && f.text);
//         setAppliedFilters(valid);
//         setPage(1);
//     }

//     function handleReset() {
//         setPage(1);
//         setAppliedFilters([]);
//         setDraftFilters([{ ...EMPTY_FILTER }]);
//     }

//     return (
//         <div className='main p-4'>
//             <div className='heading mb-3'>
//                 <h2>Companies</h2>
//             </div>

//             <div className='filters  border-2 border-black p-4 rounded-2xl mb-10'>
//                 <div className='flex justify-between border-2 border-black p-4 rounded-2xl mb-5'>
//                     <div className='title items-center'>
//                         <button className='text-xl cursor-pointer' onClick={() => setShowFilter((prev) => !prev)}>
//                             Filters
//                         </button>
//                     </div>
//                     <div className='actions'>
//                         <button
//                             className='border-2 rounded-2xl p-1 mr-2 cursor-pointer'
//                             type='button'
//                             onClick={handleReset}>
//                             Reset
//                         </button>
//                         <button className='border-2 rounded-2xl p-1 cursor-pointer' type='button' onClick={handleApply} >
//                             Apply filter
//                         </button>
//                     </div>
//                 </div>

//                 {showFilter && (
//                     <>
//                         {draftFilters.map((filter, index) => (
//                             <div key={index} className='grid grid-cols-[1fr_28px] gap-4 items-end mb-4'>
//                                 <div className='flex gap-6 w-full'>
//                                     <div className='flex-1'>
//                                         <label className='block text-sm font-medium text-gray-700'>
//                                             Select the column
//                                         </label>
//                                         <select
//                                             className='mt-1 w-full rounded-md border-2 border-gray-500'
//                                             value={filter.field}
//                                             onChange={(e) => updateDraftFilter(index, "field", e.target.value)}>
//                                             <option value=''>Select the column</option>
//                                             {columns.map((col) => (
//                                                 <option value={col.name} key={col.name}>
//                                                     {col.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div className='flex-1'>
//                                         <label className='block text-sm font-medium text-gray-700'>
//                                             Select the condition
//                                         </label>
//                                         <select
//                                             className='mt-1 w-full rounded-md border-2 border-gray-500'
//                                             value={filter.condition}
//                                             onChange={(e) => updateDraftFilter(index, "condition", e.target.value)}>
//                                             <option value=''>Select the condition</option>
//                                             {Object?.entries(conditions).map(([label, value]: any) => (
//                                                 <option value={value} key={value}>
//                                                     {label}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div className='flex-1'>
//                                         <label className='block text-sm font-medium text-gray-700'>Enter value</label>
//                                         <input
//                                             type='text'
//                                             className='mt-1 w-full rounded-md border-2 border-gray-500'
//                                             value={filter.text}
//                                             onChange={(e) => updateDraftFilter(index, "text", e.target.value)}
//                                         />
//                                     </div>
//                                 </div>

//                                 <button
//                                     className='text-red-500 hover:text-red-700'
//                                     onClick={() => removeFilterRow(index)}>
//                                     ✕
//                                 </button>
//                             </div>
//                         ))}

//                         <div className='add-filter-field mt-3'>
//                             <button className='p-2 border rounded-xl' onClick={addFilterRow}>
//                                 + Add
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>

//             <div className='company-list border-2 border-black rounded-2xl p-4'>
//                 <div className='heading flex justify-between border-b border-b-gray-800 mb-2'>
//                     <div className='title'>
//                         <h3>Company List</h3>
//                     </div>
//                     <div className='action'>
//                         <Link href={"/super-admin/company/add"} className='border-2 rounded-2xl p-1 cursor-pointer'>
//                             Add Company
//                         </Link>
//                     </div>
//                 </div>

//                 <div className='list'>
//                     <div className='relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default'>
//                         <table className='w-full text-sm text-left rtl:text-right text-body'>
//                             <thead className='text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default'>
//                                 <tr>
//                                     <th scope='col' className='px-6 py-3 font-medium'>
//                                         Company ID
//                                     </th>
//                                     <th scope='col' className='px-6 py-3 font-medium'>
//                                         Company Name
//                                     </th>
//                                     <th scope='col' className='px-6 py-3 font-medium'>
//                                         Address
//                                     </th>
//                                     <th scope='col' className='px-6 py-3 font-medium'>
//                                         Status
//                                     </th>
//                                     <th scope='col' className='px-6 py-3 font-medium'>
//                                         Asset Limit
//                                     </th>
//                                     <th scope='col' className='px-6 py-3 font-medium'>
//                                         Subscription Validity
//                                     </th>
//                                     <th scope='col' className='px-6 py-3 font-medium'>
//                                         Action
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {companyList.map((company) => (
//                                     <Suspense
//                                         fallback={<p className='text-3xl'>Loading....</p>}
//                                         key={company.company_id}>
//                                         <tr className='bg-neutral-primary border-b border-default'>
//                                             <th
//                                                 scope='row'
//                                                 className='px-6 py-4 font-medium text-heading whitespace-nowrap'>
//                                                 {company.company_id}
//                                             </th>
//                                             <td className='px-6 py-4'>{company.company_name}</td>
//                                             <td className='px-6 py-4'>
//                                                 {company.country}•{company.state},{company.city},{company.postal_code}
//                                             </td>
//                                             <td className='px-6 py-4'>
//                                                 {company.status ? (
//                                                     <span className='bg-success-soft text-fg-success-strong text-sm font-medium px-2 py-1 rounded'>
//                                                         Active
//                                                     </span>
//                                                 ) : (
//                                                     <span className='bg-danger-soft text-fg-danger-strong text-sm font-medium px-2 py-1 rounded'>
//                                                         Inactive
//                                                     </span>
//                                                 )}
//                                             </td>
//                                             <td className='px-6 py-4'>{company.allowed_asset_limit}</td>
//                                             <td className='px-6 py-4'>{company.subscription_validity}</td>
//                                             <td className='px-6 py-4'>
//                                                 {permissions?.includes('update') && <span className="mr-2 border rounded-xl p-1">Update</span>}
//                                                 {permissions?.includes('delete') && <span>Delete</span>}
//                                             </td>
//                                         </tr>
//                                     </Suspense>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CompanyPage;

import React, { Suspense } from "react";
import CompanyList from "../../components/company/CompanyList";
import { getCompanyList } from "@/app/services/super-admin/companyList";
import CompanyFilter from "../../components/company/CompanyFilter";

const CompanyListPage = async () => {
    const initialCompanyData = await getCompanyList();
    // console.log(initialCompanyData)

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Tags</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <CompanyFilter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <CompanyList companyList={initialCompanyData || []} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default CompanyListPage;
