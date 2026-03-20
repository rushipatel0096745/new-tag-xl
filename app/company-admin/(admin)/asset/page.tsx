import Link from "next/link";
import React, { Suspense } from "react";
import AssetList from "../../components/AssetList";
import Filter from "../../components/Filter";
import { getAssetList } from "@/app/services/company-admin/asset-actions";
import AssetFilter from "../../components/AssetFilter";

export interface Asset {
    id: number;
    tag: Tag;
    name: string;
    location: Location;
    batch_code: string;
    image: any;
    status: number;
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

const AssetListPage = async () => {
    const assets = (await getAssetList()) || [];
    // console.log("assets: ", assets);

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-[26px] font-semibold'>Asset</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <AssetFilter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <AssetList assets={assets} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default AssetListPage;
