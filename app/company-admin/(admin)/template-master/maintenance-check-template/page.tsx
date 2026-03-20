import Filter from "@/app/company-admin/components/Filter";
import MaintenanceFilter from "@/app/company-admin/components/Templates/maintenance-template/MaintenanceFilter";
import MaintenanceTemplateList from "@/app/company-admin/components/Templates/maintenance-template/MaintenanceTemplateList";
import { getMaintenanceTemplateList } from "@/app/services/company-admin/template-actions";
import React, { Suspense } from "react";

export interface MaintenanceTemplate {
    id: number;
    title: string;
    maintenance_frequency: number;
    questions: MaintenanceQuestion[];
}

export interface MaintenanceQuestion {
    id: number;
    question: string;
    type: string;
    multiselect_value: any;
}

const MaintenanceCheckPage = async () => {
    const list = (await getMaintenanceTemplateList()) || [];

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-[26px] font-semibold'>Maintenance Check List</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <MaintenanceFilter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <MaintenanceTemplateList tmpList={list} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceCheckPage;
