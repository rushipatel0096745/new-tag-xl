// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getSessionId, getUserData } from "./app/services/super-admin/companyList";

// export async function proxy(request: NextRequest) {
//     const sessionId = await getSessionId();
//     const url = request.nextUrl.pathname;
//     const publicPath = ["/super-admin/login"];

//     // allowing access to public url
//     if (publicPath.includes(url)) {
//         return NextResponse.next();
//     }

//     if (!sessionId) {
//         return NextResponse.redirect(new URL("/super-admin/login", request.url));
//     }

//     try {
//         const user = await getUserData();
//         const userPermissions = user.role.permission.user;
//         const companyPermissions = user.role.permission.company;
//         const rolesPermissions = user.role.permission.role;


//         if (url.startsWith("/super-admin/company/edit") && !companyPermissions.includes("update")) {
//             return NextResponse.redirect(new URL("/super-admin/", request.url));
//         }

//         return NextResponse.next();
//     } catch (error) {
//         return NextResponse.redirect(new URL("/super-admin/login", request.url));
//     }
// }

// export const config = {
//     matcher: ["/super-admin/:path*"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptData } from "./app/utils/encryption";

export function proxy(request: NextRequest) {

  const path = request.nextUrl.pathname;

  const publicRoutes = ["/super-admin/login"];

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  const encryptedSession = request.cookies.get("user-session")?.value;

  if (!encryptedSession) {
    return NextResponse.redirect(new URL("/super-admin/login", request.url));
  }

  const sessionData = decryptData(encryptedSession);

  if (!sessionData?.sid) {
    return NextResponse.redirect(new URL("/super-admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*"],
};