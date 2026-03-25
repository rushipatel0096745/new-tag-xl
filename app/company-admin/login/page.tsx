import React from "react";
import CompanyLogin from "../components/CompanyLogin";
import { login } from "@/app/services/company-admin/auth";

const CompanyLoginPage = () => {
    return (
        <div>
            <CompanyLogin loginAction={login} />
        </div>
    );
};

export default CompanyLoginPage;
