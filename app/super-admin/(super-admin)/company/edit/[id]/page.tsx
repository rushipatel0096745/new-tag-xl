import React from "react";
import { updateCompany } from "@/app/services/super-admin/company-action";
import CompanyEdit from "@/app/super-admin/components/company/CompanyEdit";

const CompanyEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <div className='main p-4'>
            <div className='heading-mb-3'>
                <h2>Company</h2>
            </div>
            <CompanyEdit updateAction={updateCompany} id={id} />
        </div>
    );
};

export default CompanyEditPage;
