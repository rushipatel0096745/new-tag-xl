import Filter from "@/app/company-admin/components/Filter";
import PreuseTemplateList from "@/app/company-admin/components/Templates/preuse-template/PreuseTemplateList";
import { getPreuseTemplateList } from "@/app/services/company-admin/templates";
import React, { Suspense } from "react";

export interface PreuseTemplate {
  id: number
  title: string
  questions: PreuseQuestion[]
}

export interface PreuseQuestion {
  id: number
  question: string
  type: string
  multiselect_value?: any
}



const PreuseTemplatePage = async () => {
    const list = (await getPreuseTemplateList()) || [];

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-[26px] font-semibold'>Pre Use Template List</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <Filter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <PreuseTemplateList tempList={list} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default PreuseTemplatePage;
