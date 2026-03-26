import { decryptData } from "@/app/utils/encryption";
import { cookies } from "next/headers";

export const getDataFromCookie = async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("company-user-session");
    if (!cookie) return null;

    const encryptedCompanySession = cookie.value;

    try {
        const decryptedComapnySession = decryptData(encryptedCompanySession);
        return decryptedComapnySession;
    } catch (err) {
        return null;
    }
};

export const getCompanySessionId = async() => {
    const data = await getDataFromCookie();
    return data?.sid;
}

export const getComapnyData = async () => {
    const data = await getDataFromCookie();
    return data?.company;
};

export const getCompanyUserData = async () => {
    const data = await getDataFromCookie();
    // console.log("user data", data)
    return data?.user;
};
