import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, parseStaffToken } from "@/lib/admin-auth";

const ADMIN_ONLY = ["/admin/meni", "/admin/stolovi", "/admin/statistika"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const role = parseStaffToken(token)?.role ?? null;

  if (!role) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  // Konobar: samo porudžbine
  if (role === "waiter") {
    const isOrders =
      pathname === "/admin/porudzbine" ||
      pathname === "/admin" ||
      pathname === "/admin/";
    if (!isOrders) {
      return NextResponse.redirect(new URL("/admin/porudzbine", request.url));
    }
  }

  // Admin-only rute
  if (role === "admin" && ADMIN_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
