import React, { Suspense } from "react";
import Filter from "../../components/Filter";
import { getAllLocations } from "@/app/services/company-admin/location";
import LocationList from "../../components/Location/LocationList";
import LocationFilter from "../../components/Location/LocationFilter";

export interface Location {
    id: number
    name: string
}

const LocationMasterPage = async () => {
    const locationList: Location[] = await getAllLocations();

    console.log(locationList)

    return (
        <div className='main w-[calc(100%)] min-h-[calc(100vh-60px)] text-[#111c43] mt-15 p-5.5 '>
            <div className='page-content'>
                <div className='page-head mb-6'>
                    <h2 className='text-[20px] leading-6.5 font-semibold'>Location Master</h2>
                </div>
                <div className='page-body'>
                    {/* filter */}
                    <LocationFilter />

                    {/* asset list */}
                    <Suspense fallback={<p>Loading....</p>}>
                        <LocationList locationList={locationList} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default LocationMasterPage;
