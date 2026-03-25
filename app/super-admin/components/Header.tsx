import LogoutButton from "@/app/company-admin/components/LogoutButton";
import { getCompanyUserData } from "@/app/services/company-admin/getComapnyData";
import React from "react";

const Header = async () => {
    const user = await getCompanyUserData();
    const fullName = user?.firstname + " " + user?.lastname;

    return (
        <div className='flex bg-[#fff] border-b-[#f9f9f9] shadow-2xs shadow-[#3d424508] justify-end'>
            <div className='profile flex items-center gap-3 p-3'>
                <div className='avatar'>
                    <img
                        src='/default-avatar.png'
                        alt='Avatar'
                        width='34'
                        height='34'
                        className='rounded-full object-cover w-[34px] h-[34px]'
                    />
                </div>
                <div className='profile-name flex items-center gap-2'>
                    {fullName}
                    <LogoutButton module='superuser' />
                </div>
            </div>
        </div>
    );
};

export default Header;
