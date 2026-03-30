"use server";

import { getComapnyData, getCompanySessionId } from "./getComapnyData";

export const getAssetList = async function (page: number = 1, filters: any[] = []) {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/asset/list", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page: page,
                    pageSize: 10,
                    filters: filters,
                }),
            });

            const result = await response.json();
            // console.log(result);
            return result?.assets || [];
        } catch (error) {
            console.log("error: ", error);
            return [];
        }
    }
    return [];
};

export const getAssetById = async function (id: number) {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/asset/get/" + id, {
                method: "GET",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            // console.log(result.asset);
            return result;
        } catch (error) {
            console.log("error: ", error);
            return [];
        }
    }
    return [];
};

export const createAsset = async function (formData: FormData) {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/asset/create", {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    // "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            const result = await response.json();
            console.log(result);

            if (result.has_error && result.error_code === "PERMISSION_DENIED") {
                // console.log(result);
                return {
                    success: false,
                    error: "PERMISSION DENIED",
                    data: "",
                };
            }

            if (result.has_error && result.error_code === "VALIDATION_ERROR") {
                // console.log(result);
                return {
                    success: false,
                    error: result.message,
                    data: "",
                };
            }
            // console.log(result);
            return {
                success: true,
                error: "",
                data: "",
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
            error: "companyId or sessionId not found",
            data: "",
        };
    }
};

export const deleteAsset = async function (id: number) {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;
    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/asset/delete/" + id, {
                method: "DELETE",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    // "Content-Type": "multipart/form-data",
                },
            });

            const result = await response.json();

            if (result.has_error) {
                console.log(result);
                return {
                    success: false,
                    error: "Unable to delete asset",
                    data: "",
                };
            }
            console.log(result);
            return {
                success: true,
                error: "",
                data: "",
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
            error: "companyId or sessionId not found",
            data: "",
        };
    }
};

export const editAsset = async function (id: number, formData: FormData) {
    const sessionId = await getCompanySessionId();
    const companyData = await getComapnyData();
    const companyId = companyData?.company_id;

    console.log("Form data for edit asset: ", Object.fromEntries(formData));

    if (companyId && sessionId) {
        try {
            const response = await fetch("https://tagxl.com/api/company/asset/update/" + id, {
                method: "PUT",
                headers: {
                    "X-Session-ID": sessionId,
                    "X-Company-ID": companyId,
                    // "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            const result = await response.json();

            if (result.has_error && result.error_code === "PERMISSION_DENIED") {
                return {
                    success: false,
                    error: "PERMISSION DENIED",
                    data: "",
                };
            }

            if (result.has_error && result.error_code === "EXCEPTION") {
                return {
                    success: false,
                    error: result.message,
                    data: "",
                };
            }

            console.log(result);
            return {
                success: true,
                error: "",
                data: "",
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
            error: "companyId or sessionId not found",
            data: "",
        };
    }
};
