import Filter from "@/app/company-admin/components/Filter";
import ManualFilter from "@/app/company-admin/components/Templates/manual-templates/ManualFilter";
import ManualTemplateList from "@/app/company-admin/components/Templates/manual-templates/ManualTemplateList";
import { getManualTemplateList } from "@/app/services/company-admin/template-actions";
import React, { Suspense } from "react";

export interface ManualTemplate {
    id: number;
    name: string;
    description: string;
    files: File[];
}

export interface File {
    id: number;
    file_name: string;
    file_path: string;
}

const ManualMasterPage = async () => {
    const manualTemplateList = (await getManualTemplateList()) || [];

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-[26px] font-semibold'>Manual Template</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <ManualFilter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <ManualTemplateList tempList={manualTemplateList} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default ManualMasterPage;
