import LocationForm from "@/app/company-admin/components/Location/LocationForm";
import { getLocation } from "@/app/services/company-admin/location";
import { updateLocation } from "@/app/services/company-admin/location-actions";
import React, { Suspense } from "react";

const LocationEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const initialData = await getLocation(Number(id));
    return (
        <div className='main w-[calc(100%)] min-h-[calc(100vh_-_60px)] text-[#111c43] mt-[60px] p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Location Master</h2>
                </div>
                <div className='page-body'>
                    <Suspense fallback={<p>Loading....</p>}>
                        <LocationForm action={updateLocation} locationId={Number(id)}/>
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default LocationEditPage;
