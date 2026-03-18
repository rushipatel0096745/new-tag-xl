import Filter from "@/app/company-admin/components/Filter";
import PreuseTemplateList from "@/app/company-admin/components/Templates/preuse-template/PreuseTemplateList";
import UserList from "@/app/company-admin/components/UsersAndRoles/Users/UserList";
import { getComapnyData, getCompanySessionId } from "@/app/services/company-admin/getComapnyData";
import { clientFetch } from "@/app/utils/user-helper";
import React, { Suspense } from "react";

interface FilterType {
    field?: string | null;
    condition?: string | null;
    text?: string | null;
}

export interface User {
  id: number
  email: string
  firstname: string
  lastname: string
  last_logged_in: string
  role: Role
}

export interface Role {
  id: number
  role_name: string
  permission: Permission
}

export interface Permission {
  role: string[]
  tags: string[]
  user: string[]
  asset: string[]
  alerts: string[]
  location: string[]
  manual_template: string[]
  pre_use_template: string[]
  maintenance_template: string[]
}


const UserListPage = async () => {
    // const sessionId = getSessionId("company-user-session");
    // const companyId = getCompanyId("company-user-session");

    // console.log("session id....", sessionId)
    // console.log("company id....", companyId)

    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    async function getUserList(page: number = 1, filter: FilterType[] = [{ field: "", condition: "", text: "" }]) {
        const result = await clientFetch("/company/users/list", {
            method: "POST",
            headers: {
                "X-Session-ID": sessionId,
                "X-Company-ID": companyId,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page,
                page_size: 10,
                filter
            })
        });
        return result;
    }

    const data = await getUserList();
    // console.log(data);

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-[26px] font-semibold'>Users</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    {/* <Filter /> */}

                    {/* asset list */}
                    {/* <UserList tempList={data.users} /> */}
                    <Suspense fallback={<p>Loading....</p>}><UserList tempList={data.users}/></Suspense>
                </div>
            </div>
        </div>
    );
};

export default UserListPage;
