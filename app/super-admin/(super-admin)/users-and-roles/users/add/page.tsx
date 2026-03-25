import UserAddForm from "@/app/super-admin/components/users-and-roles/users/UserAddForm";
import React, { Suspense } from "react";

const UserAddPage = () => {
    return ( 
        <div className='main w-full min-h-[calc(100vh-60px)] text-[#111c43] mt-15 p-5.5'>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Users</h2>
                </div>
                <div className='page-body'>
                    <UserAddForm />
                </div>
            </div>
        </div>
    );
};

export default UserAddPage