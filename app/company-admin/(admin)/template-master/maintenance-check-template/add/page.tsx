import React from "react";
import MaintenaceTemplateAdd from "@/app/company-admin/components/Templates/maintenance-template/MaintenaceTemplateAdd";
import { getCompanyUserPermissions } from "@/app/utils/user-helper";

const MaintenaceTemplateAddPage = () => {
    // function checkPermission() {
    //     const permission = getCompanyUserPermissions();
    //     console.log(permission)
    //     const flag = permission?.maintenance_template.includes("create");
    //     // console.log(flag)
    //     return flag;
    // }
    // const permitted = checkPermission();
    // const permitted = false

    return (  
        <>
          {/* {  permitted ? (<MaintenaceTemplateAdd />) : (<p>Not allowed to create</p>)} */}
          <MaintenaceTemplateAdd/>
        </>
    );
};

export default MaintenaceTemplateAddPage;
