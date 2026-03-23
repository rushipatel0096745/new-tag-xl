// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getSessionId } from "./app/utils/user-helper";

// export async function proxy(request: NextRequest) {
//     const superAdminSessionId = getSessionId("super-user-session");
//     const companySessionId = getSessionId("company-user-session");
//     const url = request.nextUrl.pathname;
//     const publicPath = ["/super-admin/login", "/company-admin/login"];

//     console.log("middleware is working");

//     // allowing access to public ur;
//     if (publicPath.includes(url)) {
//         return NextResponse.next();
//     }

//     if (!superAdminSessionId) {
//         return NextResponse.redirect(new URL("/super-admin/login", request.url));
//     }

//     try {
//         // const user = await getUserData();
//         // const userPermissions = user.role.permission.user;
//         // const companyPermissions = user.role.permission.company;
//         // const rolesPermissions = user.role.permission.role;
//         // console.log("company permissions ", companyPermissions);
//         // if (url.startsWith("/super-admin/company/edit") && !companyPermissions.includes("update")) {
//         //     return NextResponse.redirect(new URL("/super-admin/", request.url));
//         // }
//         // return NextResponse.next();
//     } catch (error) {
//         // return NextResponse.redirect(new URL("/super-admin/login", request.url));
//     }
// }

// export const config = {
//     matcher: "/about/:path*",
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionId } from "./app/utils/user-helper";


const PUBLIC_PATHS = ["/super-admin/login", "/company-admin/login"];

const SUPER_ADMIN_PREFIX = "/super-admin";
const COMPANY_ADMIN_PREFIX = "/company-admin";


function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

function isStaticAsset(pathname: string): boolean {
    return (
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/api/") ||
        /\.\w+$/.test(pathname)
    );
}

function redirectTo(url: string, request: NextRequest): NextResponse {
    return NextResponse.redirect(new URL(url, request.url));
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static assets & API routes — no auth needed
    if (isStaticAsset(pathname)) {
        return NextResponse.next();
    }

    // const superAdminSessionId = getSessionId("super-user-session");
    // const companySessionId = getSessionId("company-user-session");

    const superAdminSessionId = request.cookies.get('super-user-session')?.value
    const companySessionId = request.cookies.get('company-user-session')?.value

    const hasSuperAdminSession = Boolean(superAdminSessionId);
    const hasCompanySession = Boolean(companySessionId);

    // console.log(`[Middleware] ${pathname}`, {
    //     hasSuperAdminSession,
    //     hasCompanySession,
    // });

    // ── Allow public paths unconditionally ──────────────────────────────────────
    if (isPublicPath(pathname)) {
        // If already authenticated, redirect away from login pages
        if (pathname.startsWith(SUPER_ADMIN_PREFIX) && hasSuperAdminSession) {
            return redirectTo("/super-admin/dashboard", request);
        }
        if (pathname.startsWith(COMPANY_ADMIN_PREFIX) && hasCompanySession) {
            return redirectTo("/company-admin/", request);
        }
        return NextResponse.next();
    }

    // ── Super-admin routes (/super-admin/*) ─────────────────────────────────────
    if (pathname.startsWith(SUPER_ADMIN_PREFIX)) {
        if (!hasSuperAdminSession) {
            const loginUrl = new URL("/super-admin/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname); // preserve intended destination
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // ── Company-admin routes (/company-admin/*) ─────────────────────────────────
    if (pathname.startsWith(COMPANY_ADMIN_PREFIX)) {
        if (!hasCompanySession) {
            const loginUrl = new URL("/company-admin/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico)$).*)"],
};
