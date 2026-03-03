import { logout } from "@/app/services/super-admin/auth";
import { getUserData } from "@/app/services/super-admin/companyList";
import React from "react";

const Header = async() => {

    const user = await getUserData();
    const fullName = user?.firstname + ' ' + user?.lastname

    return (
        <div className='flex bg-[#fff] border-b-[#f9f9f9] shadow-2xs shadow-[#3d424508] justify-end'>
            <div className='profile flex'>
                <div className='avatar'>
                    <img
                        alt='Logo'
                        loading='lazy'
                        width='34'
                        height='34'
                        decoding='async'
                        data-nimg='1'
                        style={{'color':'transparent'}}>
                        </img>
                </div>
                <div className="profile-name">
                    {/* Super Admin */}
                    {fullName}
                    <div className="inline ml-2">
                        <button className="border rounded-xl p-2 cursor-pointer" onClick={logout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
