"use server";

import { cookies } from "next/headers";

export const createCompany = async (prevState: any, formData: any) => {
    try {
        const response = await fetch("url", {
            method: "POST",
            headers: {
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
