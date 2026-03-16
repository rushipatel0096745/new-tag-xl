import Cookies from "js-cookie";
import { decryptData } from "./encryption";

function isBrowser() {
    return typeof window !== "undefined";
}

function getDataFromCookie(sessionName: string) {
    const encryptedData = Cookies.get(sessionName);
    if (!encryptedData) return null;

    try {
        const decryptedData = decryptData(encryptedData);
        return decryptedData;
    } catch (error) {
        console.error("Error decrypting/parsing user data:", error);
        return null;
    }
}

export function getSessionId(sessionName: string) {
    if (!isBrowser()) return null;
    const data = getDataFromCookie(sessionName);
    return data.sid;
}
