import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
import { Shadows_Into_Light } from "next/font/google";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

export const GetAssetList = async function (
    page: number = 1,
    pageSize: number = 10,
    filters: Filter[] = [],
    show_all_records: number = 0
) {
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
            show_all_records: show_all_records,
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

export const DeleteAsset = async function (id: number) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    try {
        const result = await fetch("/proxy/company/asset/delete/" + id, {
            method: "DELETE",
            headers: {
                "X-Session-ID": sessionId,
                "X-Company-ID": companyId,
                "Content-Type": "application/json",
            },
        });

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};

export const CheckTagAssigned = async function (tagId: string) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/tag/check-assigned", {
        method: "POST",
        headers: {
            "X-Session-ID": sessionId,
            "X-Company-ID": companyId,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: tagId }),
    });
    return result;
};

export const CreateAsset = async function (formData: FormData) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    const response = await fetch("/proxy/company/asset/create", {
        method: "POST",
        headers: {
            "X-Session-ID": sessionId,
            "X-Company-ID": companyId,
        },
        body: formData,
    });
    const result = await response.json();
    console.log(result);

    if (result.has_error && result.error_code === "PERMISSION_DENIED") {
        return {
            success: false,
            error: "PERMISSION DENIED",
            data: "",
        };
    }

    if (result.has_error && result.error_code === "VALIDATION_ERROR") {
        return {
            success: false,
            error: result.message,
            data: "",
        };
    }

    if (!result.has_error) {
        return {
            success: true,
            error: "",
            data: "",
        };
    }
};
