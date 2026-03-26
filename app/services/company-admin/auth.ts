"use server";

import { encryptData } from "@/app/utils/encryption";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginResponse = {
    success: boolean;
    error: string | null;
};

export async function login(prevState: any, formData: FormData): Promise<any> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const companyId = formData.get("companyId") as string;

    console.log("company login action called");

    try {
        const response = await fetch("https://tagxl.com/api/company/company-login", {
            method: "POST",
            headers: {
                "X-Company-ID": companyId,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const result = await response.json();

        if (result.has_error) {
            return {
                success: false,
                error: "Incorrect email or password",
            };
        }
        // console.log(result);

        const encryptedData = encryptData(result);

        const cookieStore = await cookies();
        cookieStore.set("company-user-session", encryptedData, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return {
            success: true,
            error: "",
        };
    } catch (error) {
        console.log("error message: ", error);
        return {
            success: false,
            error: "Failed to connect to the server",
        };
    }
}

export const logout = async function () {
    const cookieStore = await cookies();
    cookieStore.delete("company-user-session");
    redirect("/company-admin/login");
};
