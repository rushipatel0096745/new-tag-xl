import Filter from "@/app/company-admin/components/Filter";
import TagList from "@/app/company-admin/components/TagList";
import { getUnassignedTagList } from "@/app/services/company-admin/tags-actions";
import React, { Suspense } from "react";

const UnassignedTagPage = async () => {
    const tagList = await getUnassignedTagList();

    return (
        <div className='main w-[calc(100%] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Asset</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <Filter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <TagList tagList={tagList} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default UnassignedTagPage;
