"use server";

interface filter {
    field?: string;
    condition: string;
    text?: string;
}

import { decryptData } from "@/app/utils/encryption";
import { getBySessionName } from "@/app/utils/helper";

export const getCompanyList = async function (page: number = 1, filters: filter[] = []) {
    // const sessionId = await getBySessionName("user-session");
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/company/list", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page: page,
                    pageSize: 10,
                    filters: filters,
                }),
            });

            const result = await response.json();
            return result?.companies;
        } catch (error) {
            console.log("error: ", error);
        }
    }
};

export const getCompanyColumns = async () => {
    // const sessionId = await getBySessionName("user-session");
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/table-columns/company_list", {
                method: "GET",
                headers: {
                    "X-Session-ID": sessionId,
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            const columns = result?.columns;
            const conditions = result?.conditions;
            // console.log(columns, conditions)
            return [columns, conditions];
        } catch (error) {
            console.log("error: ", error);
        }
    }
};

export const getUserData = async () => {
    const encryptedUserData = await getBySessionName("super-user-session");
    const userData = decryptData(encryptedUserData);
    const user = userData?.user;
    return user;
};

export const getSessionId = async () => {
    const encryptedUserData = await getBySessionName("super-user-session");
    const userData = decryptData(encryptedUserData);
    const sessionId = userData?.sid;
    return sessionId;
};

export const createCompany = async (prevState: any, formData: any) => {
    const sessionId = await getSessionId();

    try {
        const response = await fetch("url", {
            method: "POST",
            headers: {
                "X-Session-ID": sessionId,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                formData,
            }),
        });

        const result = await response.json();

        if (result.has_error) {
            return {
                success: false,
                error: "Unable to create company",
            };
        }
        console.log(result);
        return {
            success: true,
            error: "",
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to connect to the server",
        };
    }
};
