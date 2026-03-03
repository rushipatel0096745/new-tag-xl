"use server"

import { getSessionId } from "./companyList";

export const getRoleList = async() => {
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
}


