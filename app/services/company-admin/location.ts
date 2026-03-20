// "use server";

import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
// import { getComapnyData, getCompanySessionId } from "./getComapnyData";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

export const getAllLocations = async function (page: number = 1, filters: any[] = [], show_all_records: number = 0) {
    // "use server";

    // const sessionId = await getCompanySessionId();
    // const companyData = await getComapnyData();
    // const companyId = companyData?.company_id;

    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

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
    // "use server";

    // const sessionId = await getCompanySessionId();
    // const companyData = await getComapnyData();
    // const companyId = companyData?.company_id;

    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

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


export const getAssetLocations = async function (show_all_records: number = 1) {
    // "use server";

    // const sessionId = await getCompanySessionId();
    // const companyData = await getComapnyData();
    // const companyId = companyData?.company_id;

    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

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

export const GetLocationList = async function (page: number = 1, pageSize: number = 10, filters: Filter[] = []) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/location/list", {
        method: "POST",
        headers: {
            "X-Session-ID": sessionId,
            "X-Company-ID": companyId,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            page,
            pageSize,
            filters,
        }),
    });
    return result;
};
