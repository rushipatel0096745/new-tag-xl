import AlertEdit from "@/app/company-admin/components/Alerts/AlertEdit";
import React from "react";

const AlertsEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return (
        <div>
            <div className='main w-[calc()100%] min-h-[calc(100vh-60px)] text-[#111c43] mt-15 p-5.5'>
                <div className='page-content'>
                    <div className='page-head mb-6'>
                        <h2 className='text-[20px] leading-6.5 font-semibold'>Alert</h2>
                    </div>
                    <div className='page-body'>
                        <AlertEdit id={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertsEditPage;
