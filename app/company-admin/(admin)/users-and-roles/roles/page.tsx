import RoleFilter from "@/app/company-admin/components/UsersAndRoles/Roles/RoleFilter";
import RoleList from "@/app/company-admin/components/UsersAndRoles/Roles/RoleList";
import { getComapnyData, getCompanySessionId } from "@/app/services/company-admin/getComapnyData";
import { clientFetch } from "@/app/utils/user-helper";
import React, { Suspense } from "react";

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

interface FilterType {
    field?: string | null;
    condition?: string | null;
    text?: string | null;
}

const RoleListPage = async () => {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    async function getRoleList(page: number = 1, filter: FilterType[] = [{ field: "", condition: "", text: "" }]) {
        const result = await clientFetch("/company/role/list", {
            method: "POST",
            headers: {
                "X-Session-ID": sessionId,
                "X-Company-ID": companyId,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page,
                page_size: 10,
                filter,
            }),
        });
        return result;
    }

    const data = await getRoleList();
    console.log(data);

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-[26px] font-semibold'>Roles</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <RoleFilter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <RoleList tempList={data.roles} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default RoleListPage;
