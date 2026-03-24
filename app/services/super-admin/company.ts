import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";
import { json } from "stream/consumers";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

export const GetCompanyList = async function (page: number = 1, pageSize: number = 10, filters: Filter[] = []) {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/company/list", {
            method: "POST",
            headers: {
                "X-Session-ID": sessionId,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page,
                pageSize,
                filters: filters ?? [],
            }),
        });

        if (!result.ok) {
            console.error("API error:", result.status, result.statusText);
            return null;
        }

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};


export const GetCompanyCols = async function () {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/table-columns/company_list", {
            method: "GET",
            headers: {
                "X-Session-ID": sessionId,
                "Content-Type": "application/json",
            },
        });

        if (!result.ok) {
            console.error("API error:", result.status, result.statusText);
            return null;
        }

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};

