import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

export const GetAlertsList = async function (page: number = 1, pageSize: number = 10, filters: Filter[] = []) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/alerts", {
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

export const GetFailureAssetList = async function (page: number = 1, pageSize: number = 20) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/alerts/asset-failure", {
        method: "POST",
        headers: {
            "X-Session-ID": sessionId,
            "X-Company-ID": companyId,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            page,
            pageSize,
        }),
    });
    return result;
};

export const GetMaintenanceAssetList = async function (page: number = 1, pageSize: number = 20) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/alerts/asset-in-maintenance", {
        method: "POST",
        headers: {
            "X-Session-ID": sessionId,
            "X-Company-ID": companyId,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            page,
            pageSize,
        }),
    });
    return result;
};

export const GetAlert = async function (id: number) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/alerts/get/" + id, {
        method: "GET",
        headers: {
            "X-Session-ID": sessionId,
            "X-Company-ID": companyId,
            "Content-Type": "application/json",
        },
    });
    return result;
};
