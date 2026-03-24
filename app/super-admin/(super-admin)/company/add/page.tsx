import React from "react";
import { createCompany } from "@/app/services/super-admin/createCompany";
import CompanyAddForm from "@/app/super-admin/components/company/CompanyAddForm";

const AddCompany = () => {
    return (
        <div className="main p-4">
            <div className="heading-mb-3">
                <h2>Company</h2>
            </div>
            <CompanyAddForm createAction={createCompany}/>
        </div>
    );
};

export default AddCompany;
