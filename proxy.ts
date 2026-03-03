import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionId, getUserData } from "./app/services/super-admin/companyList";

export async function proxy(request: NextRequest) {
    const sessionId = getSessionId();
    const url = request.nextUrl.pathname;
    const publicPath = ["/super-admin/login"];

    // allowing access to public url
    if (publicPath.includes(url)) {
        return NextResponse.next();
    }

    if (!sessionId) {
        return NextResponse.redirect(new URL("/super-admin/login", request.url));
    }

    try {
        const user = await getUserData();
        const userPermissions = user.role.permission.user;
        const companyPermissions = user.role.permission.company;
        const rolesPermissions = user.role.permission.role;


        if (url.startsWith("/super-admin/company/edit") && !companyPermissions.includes("update")) {
            return NextResponse.redirect(new URL("/super-admin/", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/super-admin/login", request.url));
    }
}

export const config = {
    matcher: ["/super-admin/:path*"],
};
