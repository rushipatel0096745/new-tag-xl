import React, { Suspense } from "react";
import { getRoleList } from "@/app/services/super-admin/role-action";
import RoleList from "@/app/super-admin/components/users-and-roles/roles/RoleList";

const RolesListPage = async () => {
    const initialRoleData = await getRoleList();
    // console.log(initialCompanyData)

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Roles</h2>
                </div>
                <div className='page-body'>
                    <Suspense fallback={<p>Loading....</p>}>
                        <RoleList roleList={initialRoleData || []} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default RolesListPage;
