import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

export const GetAssetList = async function (page: number = 1, pageSize: number = 10, filters: Filter[] = []) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/asset/list", {
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

export const GetAsset = async function (id: number): Promise<{ success: boolean; error: string; data: any | null }> {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/asset/get/" + id, {
        method: "GET",
        headers: {
            "X-Session-ID": sessionId,
            "X-Company-ID": companyId,
            "Content-Type": "application/json",
        },
    });

    if (result.has_error && result.error_code == "PERMISSION_DENIED") {
        return {
            success: false,
            error: result.error,
            data: null,
        };
    }
    if (!result.has_error) {
        return {
            success: true,
            error: "",
            data: result.asset,
        };
    }

    return result;
};

export const DeleteAsset = async function (id: number): Promise<{ success: boolean; error: string; data: any | null }> {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    return {
        success: true,
        error: "",
        data: "asset deleted",
    };

    // console.log("company id: ", companyId);

    // const result = await clientFetch("/company/asset/delete/" + id, {
    //     method: "DELETE",
    //     headers: {
    //         "X-Session-ID": sessionId,
    //         "X-Company-ID": companyId,
    //         "Content-Type": "application/json",
    //     },
    // });

    // if (result.has_error && result.error_code == "PERMISSIO_DENIED") {
    //     return {
    //         success: false,
    //         error: result.message,
    //         data: null,
    //     };
    // }
    // if (!result.has_error) {
    //     return {
    //         success: true,
    //         error: "",
    //         data: result.message,
    //     };
    // }

    // return result;
};
