"use client";

import { logout as CompanyLogout } from "@/app/services/company-admin/auth";
import { logout as SuperUserLogout } from "@/app/services/super-admin/auth";

async function handleLogout(module: string) {
    // module === "company" ? await CompanyLogout() : await SuperUserLogout()
    if (module === "company") await CompanyLogout();
    if (module === "superuser") await SuperUserLogout();
}

const LogoutButton = ({ module }: { module: string }) => {
    return (
        <button className='border rounded-xl p-2 cursor-pointer' onClick={() => handleLogout(module)}>
            Logout
        </button>
    );
};

export default LogoutButton;
