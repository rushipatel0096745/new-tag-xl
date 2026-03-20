import MaintenanceTemplateEdit from "@/app/company-admin/components/Templates/maintenance-template/MaintenaceTemplateEdit";
import PreuseTemplateEdit from "@/app/company-admin/components/Templates/preuse-template/PreuseTemplateEdit";
import { getPreuseTemplate } from "@/app/services/company-admin/template-actions";

export interface PreuseEditTemplate {
    id: number;
    title: string;
    maintenance_frequency: number;
    questions: PreuseEditQuestion[];
}

export interface PreuseEditQuestion {
    id: number;
    question: string;
    type: string;
    multiselect_value: any;
}

const PreuseTemplateEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const initialData = await getPreuseTemplate(Number(id));
    // console.log(initialData);
    return (
        <div>
            <PreuseTemplateEdit initialData={initialData} />
        </div>
    );
};

export default PreuseTemplateEditPage;
