"use server";

import { decryptData, encryptData } from "@/app/utils/encryption";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getDataFromCookie = async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("super-user-session");
    if (!cookie) return null;

    const encryptedCompanySession = cookie.value;

    try {
        const decryptedComapnySession = decryptData(encryptedCompanySession);
        return decryptedComapnySession;
    } catch (err) {
        return null;
    }
};

export const getSuperUserData = async function () {
    const userData = await getDataFromCookie()
    return userData;
};

export const login = async function (prevState: any, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("login action called");

    try {
        const response = await fetch("https://tagxl.com/api/super-user/login", {
            method: "POST",
            headers: {
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
        cookieStore.set("super-user-session", encryptedData, {
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
};

export const logout = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("super-user-session");
    redirect("/super-admin/login");
};
