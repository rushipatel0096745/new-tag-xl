"use server";

import { getComapnyData, getCompanySessionId } from "./getComapnyData";


export const createLocation = async function (prevState: any, formData: any) {
    "use server";

    // const companyId = getCompanyId("company-user-session");
    // const sessionId = getSessionId("company-user-session");

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

export const updateLocation = async function (id: number, prevState: any, formData: any): Promise<any> {
    "use server";

    console.log("data to be posted for update: ", formData);

    // const companyId = getCompanyId("company-user-session");
    // const sessionId = getSessionId("company-user-session");

    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/location/update/"+id, {
                method: "PUT",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if(result.has_error) {
                console.log(result);
                return {
                    success: false,
                    error: "Unable to Update User",
                    data: "",
                };
            }
            console.log(result);
            return {
                success: true,
                error: "",
                data: "",
            };

        } catch (error) {
            console.log("error: ", error);
            return {
                success: false,
                error: "Failed to connect to the server",
                data: "",
            };
        }
    } else {
         return {
                success: false,
                error: "companyId or sessionId not found",
                data: "",
            };
    }
};
