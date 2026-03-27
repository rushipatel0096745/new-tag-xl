import { clientFetch, getCompanyId, getSessionId } from "@/app/utils/user-helper";

type Filter = {
    field: string;
    condition: string;
    text: string;
};

export const GetUsersList = async function (page: number = 1, pageSize: number = 10, filters: Filter[] = []) {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/users/list", {
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

        // if (!result.ok) {
        //     console.error("API error:", result.status, result.statusText);
        //     return null;
        // }

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};

export const GetUsersCols = async function () {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/table-columns/users", {
            method: "GET",
            headers: {
                "X-Session-ID": sessionId,
                "Content-Type": "application/json",
            },
        });

        // if (!result.ok) {
        //     console.error("API error:", result.status, result.statusText);
        //     return null;
        // }

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};

export const GetUser = async function (id: number) {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/user/get/"+id, {
            method: "GET",
            headers: {
                "X-Session-ID": sessionId,
                "Content-Type": "application/json",
            },
        });

        // if (!result.ok) {
        //     console.error("API error:", result.status, result.statusText);
        //     return null;
        // }

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};

export const DeleteUser = async function (id: number) {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/delete-user/" + id, {
            method: "DELETE",
            headers: {
                "X-Session-ID": sessionId,
                "Content-Type": "application/json",
            },
        });

        // if (!result.ok) {
        //     console.error("API error:", result.status, result.statusText);
        //     return null;
        // }

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};

