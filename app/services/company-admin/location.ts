"use server";

import { getComapnyData, getCompanySessionId } from "./getComapnyData";

export const getAllLocations = async function (page: number = 1, filters: any[] = [], show_all_records: number = 0) {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/location/list", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page: page,
                    pageSize: 20,
                    filters: filters,
                    show_all_records: show_all_records,
                }),
            });

            const result = await response.json();
            // console.log(result);
            return result?.locations || [];
        } catch (error) {
            console.log("error: ", error);
            return [];
        }
    }
    return [];
};

export const getLocation = async function (id: number) {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/location/get/" + id, {
                method: "GET",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            // console.log(result);
            return result?.location || {};
        } catch (error) {
            console.log("error: ", error);
            return [];
        }
    }
    return [];
};

export const createLocation = async function (prevState: any, formData: any) {
    "use server";

    console.log("data to be posted: ", formData);

    // const sessionId = await getCompanySessionId();
    // const companyData = await getComapnyData();
    // const companyId = companyData?.company_id;

    // if (companyId && sessionId) {
    //     try {
    //         const response = await fetch("https://tagxl.com/api/company/location/create", {
    //             method: "POST",
    //             headers: {
    //                 "X-Session-ID": sessionId,
    //                 "X-Company-ID": companyId,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(formData),
    //         });

    //         const result = await response.json();

    //         if(result.has_error) {
    //             console.log(result);
    //             return {
    //                 success: false,
    //                 error: "Unable to Update User",
    //                 data: "",
    //             };
    //         }
    //         console.log(result);
    //         return {
    //             success: true,
    //             error: "",
    //             data: "",
    //         };

    //     } catch (error) {
    //         console.log("error: ", error);
    //         return {
    //             success: false,
    //             error: "Failed to connect to the server",
    //             data: "",
    //         };
    //     }
    // } else {
    //      return {
    //             success: false,
    //             error: "companyId or sessionId not found",
    //             data: "",
    //         };
    // }
};

export const updateLocation = async function (id: number, prevState: any, formData: any) {
    "use server";

    console.log("data to be posted for update: ", formData);

    // const sessionId = await getCompanySessionId();
    // const companyData = await getComapnyData();
    // const companyId = companyData?.company_id;

    // if (companyId && sessionId) {
    //     try {
    //         const response = await fetch("https://tagxl.com/api/company/location/update/"+id, {
    //             method: "POST",
    //             headers: {
    //                 "X-Session-ID": sessionId,
    //                 "X-Company-ID": companyId,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(formData),
    //         });

    //         const result = await response.json();

    //         if(result.has_error) {
    //             console.log(result);
    //             return {
    //                 success: false,
    //                 error: "Unable to Update User",
    //                 data: "",
    //             };
    //         }
    //         console.log(result);
    //         return {
    //             success: true,
    //             error: "",
    //             data: "",
    //         };

    //     } catch (error) {
    //         console.log("error: ", error);
    //         return {
    //             success: false,
    //             error: "Failed to connect to the server",
    //             data: "",
    //         };
    //     }
    // } else {
    //      return {
    //             success: false,
    //             error: "companyId or sessionId not found",
    //             data: "",
    //         };
    // }
};

export const getAssetLocations = async function (show_all_records: number = 1) {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/asset/location/list", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    show_all_records: show_all_records,
                }),
            });

            const result = await response.json();
            // console.log(result);
            return result?.locations || [];
        } catch (error) {
            console.log("error: ", error);
            return [];
        }
    }
    return [];
};
