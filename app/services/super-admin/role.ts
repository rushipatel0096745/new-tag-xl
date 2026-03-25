import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

export const GetRolesList = async function (page: number = 1, pageSize: number = 10, filters: Filter[] = []) {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/role/list", {
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

export const GetRole = async function (id: number) {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/role/get/"+id, {
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

export const GetSuperUserPermissions = async function () {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/permission-list", {
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
