"use server";

import { getSessionId } from "../super-admin/company-action";

export const getRoleList = async () => {
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/role/list", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filters: [],
                }),
            });

            const result = await response.json();
            return result?.roles;
        } catch (error) {
            console.log("error: ", error);
        }
    }
};

export const getRole = async (id: number) => {
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/role/get/" + id, {
                method: "GET",
                headers: {
                    "X-Session-ID": sessionId,
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.log("error: ", error);
        }
    }
};

export const createRole = async function (
    prevState: any,
    formData: any
): Promise<{ success: boolean | null; error: string; data: any }> {
    const sessionId = await getSessionId();

    if (sessionId) {
        console.log("data to be posted: ", formData);

        try {
            const response = await fetch("https://tagxl.com/api/super-user/role/create", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            // console.log(result);

            if (result.has_error && result.error_code === "PERMISSION_DENIED") {
                return {
                    success: false,
                    error: result.message,
                    data: null,
                };
            }

            if (result.has_error) {
                return {
                    success: false,
                    error: result.message,
                    data: "",
                };
            }
            return {
                success: true,
                error: "",
                data: result.role_id,
            };
        } catch (error) {
            console.log("error: ", error);
            return {
                success: false,
                error: "Failed to connect to the server",
                data: "",
            };
        }
    } else {
        return {
            success: false,
            error: "Session ID is Missing",
            data: null,
        };
    }
};

export const updateRole = async (
    id: number,
    prevState: any,
    formData: any
): Promise<{ success: boolean | null; error: string; data: any }> => {
    const sessionId = await getSessionId();

    if (sessionId) {
        console.log("data to be posted: ", formData);

        try {
            const response = await fetch("https://tagxl.com/api/super-user/role/update/" + Number(id), {
                method: "PUT",
                headers: {
                    "X-Session-ID": sessionId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            console.log("update action called");

            const result = await response.json();

            if (result.has_error && result.error_code === "PERMISSION_DENIED") {
                return {
                    success: false,
                    error: result.message,
                    data: null,
                };
            }

            if (result.has_error) {
                return {
                    success: false,
                    error: result.message,
                    data: "",
                };
            }
            return {
                success: true,
                error: "",
                data: result.role_id,
            };
        } catch (error) {
            console.log("error: ", error);
            return {
                success: false,
                error: "Failed to connect to the server",
                data: "",
            };
        }
    } else {
        return {
            success: false,
            error: "Session ID is Missing",
            data: null,
        };
    }
};
