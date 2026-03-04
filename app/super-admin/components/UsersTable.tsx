// "use client";

// import { getUserData } from "@/app/services/super-admin/companyList";
// import { getUsersColumns, getUsersList } from "@/app/services/super-admin/usersList";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// export interface User {
//   id: number;
//   email: string;
//   firstname: string;
//   lastname: string;
//   user_status: boolean;
//   last_logged_in: string;
// }

// interface Filter {
//   field?: string;
//   condition: string;
//   text?: string;
// }

// interface Column {
//   name: string;
//   type: string;
// }

// const EMPTY_FILTER: Filter = { field: "", condition: "", text: "" };

// export default function UsersTable({ initialUsers }) {

//   const [userList, setUserList] = useState<User[]>(initialUsers);
//   const [page, setPage] = useState<number>(1);

//   const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);
//   const [draftFilters, setDraftFilters] = useState<Filter[]>([{ ...EMPTY_FILTER }]);

//   const [columns, setColumns] = useState<Column[]>([]);
//   const [conditions, setConditions] = useState<any>({});
//   const [showFilter, setShowFilter] = useState<boolean>(false);

//   const [permissions, setPermissions] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   async function getUser() {
//     const user = await getUserData();
//     const permissions = user?.role?.permission?.user;
//     setPermissions(permissions || []);
//   }

//   async function getList() {
//     setLoading(true);

//     const users = await getUsersList(page, appliedFilters);

//     setUserList(users || []);
//     setLoading(false);
//   }

//   async function getColumns() {
//     const [cols, conds] = await getUsersColumns();
//     setColumns(cols);
//     setConditions(conds);
//   }

//   useEffect(() => {
//     getUser();
//     getColumns();
//   }, []);

//   useEffect(() => {
//     if (page !== 1 || appliedFilters.length > 0) {
//       getList();
//     }
//   }, [page, appliedFilters]);

//   function updateDraftFilter(index: number, key: keyof Filter, value: string) {
//     setDraftFilters((prev) => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [key]: value };
//       return updated;
//     });
//   }

//   function addFilterRow() {
//     setDraftFilters((prev) => [...prev, { ...EMPTY_FILTER }]);
//   }

//   function removeFilterRow(index: number) {
//     setDraftFilters((prev) => prev.filter((_, i) => i !== index));
//   }

//   function handleApply() {
//     const valid = draftFilters.filter((f) => f.field && f.condition && f.text);
//     setAppliedFilters(valid);
//     setPage(1);
//   }

//   function handleReset() {
//     setPage(1);
//     setAppliedFilters([]);
//     setDraftFilters([{ ...EMPTY_FILTER }]);
//   }

//   return (
//     <div className="main p-4">

//       {/* Filters */}
//       <div className="filters border-2 border-black p-4 rounded-2xl mb-10">

//         <div className="flex justify-between border-2 border-black p-4 rounded-2xl mb-5">
//           <button
//             className="text-xl cursor-pointer"
//             onClick={() => setShowFilter((prev) => !prev)}
//           >
//             Filters
//           </button>

//           <div>
//             <button
//               className="border-2 rounded-2xl p-1 mr-2"
//               onClick={handleReset}
//             >
//               Reset
//             </button>

//             <button
//               className="border-2 rounded-2xl p-1"
//               onClick={handleApply}
//             >
//               Apply filter
//             </button>
//           </div>
//         </div>

//         {showFilter && (
//           <>
//             {draftFilters.map((filter, index) => (
//               <div key={index} className="grid grid-cols-[1fr_28px] gap-4 items-end mb-4">

//                 <div className="flex gap-6 w-full">

//                   <select
//                     className="mt-1 w-full rounded-md border-2 border-gray-500"
//                     value={filter.field}
//                     onChange={(e) =>
//                       updateDraftFilter(index, "field", e.target.value)
//                     }
//                   >
//                     <option value="">Select column</option>
//                     {columns.map((col) => (
//                       <option value={col.name} key={col.name}>
//                         {col.name}
//                       </option>
//                     ))}
//                   </select>

//                   <select
//                     className="mt-1 w-full rounded-md border-2 border-gray-500"
//                     value={filter.condition}
//                     onChange={(e) =>
//                       updateDraftFilter(index, "condition", e.target.value)
//                     }
//                   >
//                     <option value="">Condition</option>
//                     {Object.entries(conditions).map(([label, value]: any) => (
//                       <option value={value} key={value}>
//                         {label}
//                       </option>
//                     ))}
//                   </select>

//                   <input
//                     type="text"
//                     className="mt-1 w-full rounded-md border-2 border-gray-500"
//                     value={filter.text}
//                     onChange={(e) =>
//                       updateDraftFilter(index, "text", e.target.value)
//                     }
//                   />

//                 </div>

//                 <button
//                   className="text-red-500"
//                   onClick={() => removeFilterRow(index)}
//                 >
//                   ✕
//                 </button>

//               </div>
//             ))}

//             <button className="p-2 border rounded-xl" onClick={addFilterRow}>
//               + Add
//             </button>
//           </>
//         )}

//       </div>

//       {/* Table */}
//       <div className="border-2 border-black rounded-2xl p-4">

//         <div className="flex justify-between border-b mb-2">
//           <h3>User List</h3>

//           <Link
//             href="/super-admin/users-and-roles/users/add"
//             className="border-2 rounded-2xl p-1"
//           >
//             Add User
//           </Link>
//         </div>

//         {loading && <p className="mb-2">Updating list...</p>}

//         <table className="w-full text-sm text-left">

//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Email</th>
//               <th>First Name</th>
//               <th>Lastname</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>

//             {userList.map((user) => (
//               <tr key={user.id}>

//                 <td>{user.id}</td>
//                 <td>{user.email}</td>
//                 <td>{user.firstname}</td>
//                 <td>{user.lastname}</td>

//                 <td>
//                   {user.user_status ? "Active" : "Inactive"}
//                 </td>

//                 <td>

//                   {permissions.includes("update") && (
//                     <Link
//                       href={`/super-admin/users-and-roles/users/edit/${user.id}`}
//                       className="mr-2 border rounded-xl p-1"
//                     >
//                       Update
//                     </Link>
//                   )}

//                   {permissions.includes("delete") && (
//                     <span className="border rounded-xl p-1">
//                       Delete
//                     </span>
//                   )}

//                 </td>

//               </tr>
//             ))}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }