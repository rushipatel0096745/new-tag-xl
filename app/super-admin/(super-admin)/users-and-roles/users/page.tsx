import React, { Suspense } from "react";
import UserList from "@/app/super-admin/components/users-and-roles/users/UserList";
import { getUsersList } from "@/app/services/super-admin/user-action";
import UserFilter from "@/app/super-admin/components/users-and-roles/users/UserFilter";

const UserListPage = async () => {
    const initialUserData = await getUsersList();
    // console.log(initialCompanyData)

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Users</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <UserFilter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <UserList userList={initialUserData || []} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default UserListPage;
