import React, { Suspense } from "react";
import CompanyList from "../../components/company/CompanyList";
import { getCompanyList } from "@/app/services/super-admin/company-action";
import CompanyFilter from "../../components/company/CompanyFilter";

const CompanyListPage = async () => {
    const initialCompanyData = await getCompanyList();
    // console.log(initialCompanyData)

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Company</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <CompanyFilter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <CompanyList companyList={initialCompanyData || []} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default CompanyListPage;
