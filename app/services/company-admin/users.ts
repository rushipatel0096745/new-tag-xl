import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

const companyId = getCompanyId("company-user-session");
const sessionId = getSessionId("company-user-session");

export const GetUserList = async function (page: number = 1, pageSize: number = 10, filters: Filter[] = []) {
    const result = await clientFetch("/company/users/list", {
        method: "POST",
        headers: {
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
        },
    });
    return result;
};
