import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Super Admin",
    description: "Super Admin",
};

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-screen '>
            {/* sidebar */}
            <aside className='w-64 h-full top-0 left-0 bg-[#111c43] border-r'>
                <Sidebar />
            </aside>
            {/* main content */}
            <main className='flex-1 overflow-y-auto bg-[#f5f6fa]'>
                <Header />
                {children}
            </main>
        </div>
    );
};

export default SuperAdminLayout;
