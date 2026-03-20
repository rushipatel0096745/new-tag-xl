import EditAsset from "@/app/company-admin/components/EditAsset/EditAsset";
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
    third_party_certificate: any[];
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

    const initialAssetData = await getAssetById(Number(id));
    // console.log("inintial data: ",initialAssetData)

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-[26px] font-semibold'>Asset</h2>
                </div>
                <div className='page-body'>
                    <div className='card-box bg-[#fff] border-gray-700 rounded-[18px] shadow-3xl shadow-white px-3 py-5.5'>
                        {/* <div className='card-box_head border-b border-b-[#ededed] px-4 py-5.5 flex justify-between items-center'>
                            <h3 className='h3 text-[18px] font-semibold leading-6'>Add Asset</h3>
                            <div className='actions-btn flex gap-2 items-center'>
                                <Link
                                    className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'
                                    href='/company-admin/asset'>
                                    <span className='icon-circle'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width={20}
                                            height={20}
                                            viewBox='0 0 20 20'
                                            fill='none'>
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M10 4C10.355 4 10.6429 4.28782 10.6429 4.64286V9.35714H15.3571C15.7122 9.35714 16 9.64496 16 10C16 10.355 15.7122 10.6429 15.3571 10.6429H10.6429V15.3571C10.6429 15.7122 10.355 16 10 16C9.64496 16 9.35714 15.7122 9.35714 15.3571V10.6429H4.64286C4.28782 10.6429 4 10.355 4 10C4 9.64496 4.28782 9.35714 4.64286 9.35714H9.35714V4.64286C9.35714 4.28782 9.64496 4 10 4Z'
                                                fill='#845ADF'
                                            />
                                        </svg>
                                    </span>
                                    <span className='button-label text-[#1a1a1a] capitalize ml-2'>Back</span>
                                </Link>
                                <button className='icon-text-button primary cursor-pointer bg-[#fff] border border-solid border-[#845adf26] rounded-4xl inline-flex items-center text-[14px] pt-1 pr-3 pb-1 pl-1 font-medium'>
                                    <span className='icon-circle'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width={20}
                                            height={20}
                                            viewBox='0 0 20 20'
                                            fill='none'>
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M10 4C10.355 4 10.6429 4.28782 10.6429 4.64286V9.35714H15.3571C15.7122 9.35714 16 9.64496 16 10C16 10.355 15.7122 10.6429 15.3571 10.6429H10.6429V15.3571C10.6429 15.7122 10.355 16 10 16C9.64496 16 9.35714 15.7122 9.35714 15.3571V10.6429H4.64286C4.28782 10.6429 4 10.355 4 10C4 9.64496 4.28782 9.35714 4.64286 9.35714H9.35714V4.64286C9.35714 4.28782 9.64496 4 10 4Z'
                                                fill='#845ADF'
                                            />
                                        </svg>
                                    </span>
                                    <span className='button-label text-[#1a1a1a] capitalize ml-2'>Save</span>
                                </button>
                            </div>
                        </div> */}
                        <div className='card-box-body p-5.5'>
                            <div className='asset-content'>
                                <Suspense fallback={<p>Loading....</p>}>
                                    <EditAsset initialData={initialAssetData} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetEditPage;
