import AddRole from "@/app/super-admin/components/users-and-roles/roles/AddRole";
import EditRole from "@/app/super-admin/components/users-and-roles/roles/EditRole";
import React, { Suspense } from "react";

const RoleEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-[26px] font-semibold'>Role</h2>
                </div>
                <div className='page-body'>
                    <div className='card-box bg-[#fff] border-gray-700 rounded-[18px] shadow-3xl shadow-white px-3 py-5.5'>
                        <div className='card-box-body p-5.5'>
                            <div className='asset-content'>
                                <Suspense fallback={<p>Loading....</p>}>
                                    <EditRole id={id} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleEditPage;
