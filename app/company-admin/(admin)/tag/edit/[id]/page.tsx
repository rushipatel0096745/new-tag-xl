import EditTag from "@/app/company-admin/components/EditTag";
import Filter from "@/app/company-admin/components/Filter";
import { getAssetList } from "@/app/services/company-admin/asset-actions";
import { getTag, updateTag } from "@/app/services/company-admin/tags-actions";
import React, { Suspense } from "react";

export interface Tag {
    id: number;
    uid: string;
    tag_type: string;
    is_assigned: boolean;
    created_at: string;
    updated_at: any;
    logs: any[];
}

export interface Asset {
    id: number;
    tag: {
        id: number;
        uid: string;
        tag_type: string;
    };
    name: string;
    location: Location;
    batch_code: string;
    image: any;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: number;
    location_name: string;
}

const EditTagPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // const tag: Tag = {userId: null}

    let tag = {} as Tag;
    let asset = {} as Asset;
    let assetList = [] as Asset[];

    const res = await getTag(Number(id));
    if (res.success) {
        tag = res.data;
    }

    if (tag.is_assigned) {
        const filter = [
            {
                field: "tag_id",
                condition: "equals",
                text: tag.id,
            },
        ];
        [asset] = await getAssetList(1, filter);
    }
    assetList = await getAssetList();
    // console.log(assetList);

    return (
        <div className='main w-[calc()100%] min-h-[calc(100vh-60px)] text-[#111c43] mt-15 p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Tag</h2>
                </div>
                <div className='page-body'>
                    <Suspense fallback={<p>Loading....</p>}>
                        <EditTag
                            id={Number(id)}
                            initialData={tag}
                            action={updateTag}
                            asset={asset}
                            assetList={assetList}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default EditTagPage;
