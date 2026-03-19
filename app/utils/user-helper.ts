import Cookies from "js-cookie";
import { decryptData } from "./encryption";

function isBrowser() {
    return typeof window !== "undefined";
}

export function getDataFromCookie(sessionName: string) {
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

export function getCompanyId(sessionName: string) {
    if (!isBrowser()) return null;
    const data = getDataFromCookie(sessionName);
    return data.company_id;
}

const API_BASE_URL = 'https://tagxl.com/api'

export async function clientFetch(endpoint: string, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    // Handle error states (e.g., 400-500 range)
    const errorData = await response.json();
    console.log("error....", errorData)
    throw new Error(errorData.message || 'Something went wrong with the API request');
  }

  // Built-in JSON parsing
  return response.json();
}

export function getCompanyUserPermissions() {
    if (!isBrowser()) return null;
    const data = getDataFromCookie('company-user-session');
    console.log(data.user.role.permission)
    return data.user.role.permission;
}
