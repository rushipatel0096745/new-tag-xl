import MaintenanceTemplateEdit from "@/app/company-admin/components/Templates/maintenance-template/MaintenaceTemplateEdit";
import { getMaintenanceTemplate } from "@/app/services/company-admin/template-actions";
import { clientFetch } from "@/app/utils/user-helper";
import React from "react";

export interface MaintenaceEditTemplate {
    id: number;
    title: string;
    maintenance_frequency: number;
    questions: MaintenaceEditQuestion[];
}

export interface MaintenaceEditQuestion {
    id: number;
    question: string;
    type: string;
    multiselect_value: any;
}

const MaintenanceTemplateEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const initialData = await getMaintenanceTemplate(Number(id));
    // console.log(initialData)
    return (
        <div>
            <MaintenanceTemplateEdit initialData={initialData} />
        </div>
    );
};

export default MaintenanceTemplateEditPage;
