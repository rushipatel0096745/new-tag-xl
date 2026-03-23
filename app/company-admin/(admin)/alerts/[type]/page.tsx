import AlertsFilter from "@/app/company-admin/components/Alerts/AlertFilter";
import AlertsList from "@/app/company-admin/components/Alerts/AlertsList";
import AssetFailureList from "@/app/company-admin/components/Alerts/AssetFailureList";
import MaintenanceAssetList from "@/app/company-admin/components/Alerts/MaintenanceAssetList";
import MaintenanceDueAssetList from "@/app/company-admin/components/Alerts/MaintenanceDueAssetList";
import RecertificationAlertsList from "@/app/company-admin/components/Alerts/RecertificationAlertsList";
import TagFilter from "@/app/company-admin/components/TagFilter";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const AlertsPage = async ({ params }: { params: Promise<{ type: string }> }) => {
    const { type } = await params;

    function getAlertComp(type: string) {
        switch (type) {
            case "all":
                return <AlertsList />;
            case "asset-failure":
                return <AssetFailureList />;
            case "recertification-needed":
                return <RecertificationAlertsList />;
            case "maintenance-check-due":
                return <MaintenanceDueAssetList />;
            case "asset-in-maintenance":
                return <MaintenanceAssetList />;
            default:
                return notFound();
        }
    }

    return (
        <div className='main w-[calc(100%)] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5'>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Alerts</h2>
                </div>

                <div className='page-body'>
                    <AlertsFilter />

                    <Suspense fallback={<p>Loading....</p>}>{getAlertComp(type)}</Suspense>
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;
