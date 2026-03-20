import { clientFetch, getCompanyId, getDataFromCookie, getSessionId } from "@/app/utils/user-helper";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

export const GetPreUseTemplateList = async function (page: number = 1, pageSize: number = 10, filters: Filter[] = []) {
    const companyId = getCompanyId("company-user-session");
    const sessionId = getSessionId("company-user-session");

    // console.log("company id: ", companyId);

    const result = await clientFetch("/company/pre-use-template/list", {
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

