"use server";

import { getSessionId } from "./company-action";

interface Filter {
    field?: string;
    condition: string;
    text?: string;
}

export const getUsersList = async (page: number = 1, filters: Filter[] = []) => {
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/users/list", {
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
            return result?.users;
        } catch (error) {
            console.log("error: ", error);
        }
    }
};

export const getUser = async (id: number) => {
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/user/get/" + id, {
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

export const getUsersColumns = async () => {
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/table-columns/users", {
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

export const createUser = async (
    prevState: any,
    formData: any
): Promise<{ success: boolean | null; error: string; data: any }> => {
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-ID": sessionId,
                },
                body: JSON.stringify(formData),
            });

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
                    error: "Unable to create User",
                    data: result.message,
                };
            }
            console.log(result);
            return {
                success: true,
                error: "",
                data: result.user_id,
            };
        } catch (error) {
            console.log("error: ", error);
            return {
                success: false,
                error: "Failed to connect to the server",
                data: error,
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

export const updateUser = async (
    id: number,
    prevState: any,
    formData: any
): Promise<{ success: boolean | null; error: string; data: any }> => {
    const sessionId = await getSessionId();

    if (sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/super-user/update-user/" + id, {
                method: "PUT",
                headers: {
                    "X-Session-ID": sessionId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    role_id: Number(formData.role_id),
                }),
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
                    error: "Unable to create User",
                    data: result.message,
                };
            }
            console.log(result);
            return {
                success: true,
                error: "",
                data: result.user_id,
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
