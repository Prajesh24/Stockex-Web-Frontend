import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Read cookies — names must match cookie.ts: 'auth_token' and 'user_data'
    const token = req.cookies.get("auth_token")?.value;
    const userDataRaw = req.cookies.get("user_data")?.value;

    const isLoggedIn = !!token;
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    const role: "admin" | "user" | null = userData?.role ?? null;

    // -------------------------------------------------------
    // 1. Redirect already-logged-in users away from auth pages
    // -------------------------------------------------------
    const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");

    if (isLoggedIn && isAuthPage) {
        if (role === "admin") {
            return NextResponse.redirect(new URL("/admin/users", req.url));
        }
        return NextResponse.redirect(new URL("/user/market", req.url));
    }

    // -------------------------------------------------------
    // 2. Protect /admin routes — must be logged in AND admin
    // -------------------------------------------------------
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (role !== "admin") {
            // Logged in as regular user — send to user dashboard
            return NextResponse.redirect(new URL("/user/market", req.url));
        }
    }

    // -------------------------------------------------------
    // 3. Protect /user routes — must be logged in AND not admin
    // -------------------------------------------------------
    if (pathname.startsWith("/user")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (role === "admin") {
            // Admin trying to access user pages — send to admin dashboard
            return NextResponse.redirect(new URL("/admin/users", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/admin/:path*",
        "/user/:path*",
    ],
};