import { encryptData } from "@/app/utils/encryption";
import { clientFetch, getCompanyId, getDataFromCookie, getSessionId } from "@/app/utils/user-helper";
import Cookies from "js-cookie";

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

export const GetCompany = async function (id: number) {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/company/get/" + id, {
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

export const DeleteCompany = async function (id: number) {
    try {
        const sessionId = getSessionId("super-user-session");

        const result = await fetch("/proxy/super-user/company/delete/" + id, {
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

export const LoginToCompany = async function (companyId: number) {
    try {
        const sessionId = getSessionId("super-user-session");
        const sessionData = getDataFromCookie("super-user-session");
        const superUserEmail = sessionData.user.email;

        const result = await fetch("/proxy/super-user/login-to-company", {
            method: "POST",
            headers: {
                "X-Session-ID": sessionId,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                company_id: companyId,
                email: superUserEmail,
            }),
        });

        // if (!result.ok) {
        //     console.error("API error:", result.status, result.statusText);
        //     return null;
        // }

        const data = await result.json();

        if (data.has_error && data.error_code == "PERMISSION_DENIED") {
            return {
                success: false,
                error: data.message,
                data: null,
            };
        }

        if (!data.has_error && data.message == "Login successful") {
            // console.log("login to company data: ", data)
            const encryptedData = encryptData(data);

            if (Cookies.get("company-user-session")) {
                Cookies.remove("company-user-session");
            }
            Cookies.set("company-user-session", encryptedData, {
                expires: 7,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
            });
            return {
                success: true,
                error: null,
                data: data.message,
            };
        }

        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};
