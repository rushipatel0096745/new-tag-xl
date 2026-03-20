import ManualTemplateEdit from "@/app/company-admin/components/Templates/manual-templates/ManualTemplateEdit";
import { getManualTemplate } from "@/app/services/company-admin/template-actions";
import React from "react";

export interface EditManualTemplate {
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

const ManualTemplateEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const initialData = await getManualTemplate(Number(id));
    // console.log(initialData)

    return (
        <div>
            <ManualTemplateEdit initialData={initialData} />
        </div>
    );
};

export default ManualTemplateEditPage;
