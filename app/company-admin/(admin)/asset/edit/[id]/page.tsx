import EditAsset from "@/app/company-admin/components/Asset/EditAsset";
import { getAssetById } from "@/app/services/company-admin/asset-actions";
import Link from "next/link";
import React, { Suspense } from "react";

export interface AssetData {
    id: number;
    tag: Tag;
    name: string;
    location: Location;
    batch_code: string;
    image: any;
    manual_template: ManualTemplate;
    status: number;
    oem_certificate: string;
    third_party_certificate?: ThirdPartyCertificate;
    pre_use_template: PreUseTemplate;
    maintenance_template: MaintenanceTemplate;
    asset_pre_use_questions: any;
    asset_maintenance_questions: any;
    last_maintenance_check: any;
    last_pre_use_check: any;
    is_maintenance_required: boolean;
    is_asset_fail: boolean;
    is_certificate_expired: boolean;
    created_at: string;
    updated_at: string;
}

export interface ThirdPartyCertificate {
    id: string;
    third_party_certificate: string;
    third_party_start_date: string;
    third_party_expiry_date: string;
    created_at: string;
}

export interface Tag {
    id: number;
    uid: string;
    tag_type: string;
}

export interface Location {
    id: number;
    location_name: string;
}

export interface ManualTemplate {
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

export interface PreUseTemplate {
    id: number;
    title: string;
    questions: Question[];
}

export interface Question {
    id: number;
    question: string;
    type: string;
    multiselect_value: any;
}

export interface MaintenanceTemplate {
    id: number;
    title: string;
    maintenance_frequency: number;
    questions: Question[];
}

const AssetEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    let error = "";
    let initialAssetData = null;
    const data = await getAssetById(Number(id));
    if (data.has_error && data.error_code === "PERMISSION_DENIED") {
        error = data.message;
        return (
            <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
                <div className='page-content'>
                    <div className='page-head mb-6'>
                        <h2 className='text-[20px] leading-[26px] font-semibold'>Asset</h2>
                    </div>
                    <div className='page-body'>
                        <div className='card-box bg-[#fff] border-gray-700 rounded-[18px] shadow-3xl shadow-white px-3 py-5.5'>
                            <div className='card-box-body p-5.5'>
                                <div className='asset-content'>{error && <p className='text-red-500'>{error}</p>}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        initialAssetData = data.asset;

        return (
            <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
                <div className='page-content'>
                    <div className='page-head mb-6'>
                        <h2 className='text-[20px] leading-[26px] font-semibold'>Asset</h2>
                    </div>
                    <div className='page-body'>
                        {error && <p className='text-red-500'>{error}</p>}
                        <div className='card-box bg-[#fff] border-gray-700 rounded-[18px] shadow-3xl shadow-white px-3 py-5.5'>
                            <div className='card-box-body p-5.5'>
                                <div className='asset-content'>
                                    <Suspense fallback={<p>Loading....</p>}>
                                        <EditAsset initialAssetData={initialAssetData} id={id} />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // console.log("inintial data: ",data)
};

export default AssetEditPage;
