import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  GUEST_COOKIE,
  getClientIp,
  guestCookieOptions,
  signGuestSession,
} from "@/lib/guest-session";
import { rateLimit } from "@/lib/rate-limit";

/** QR ulaz: /meni/session?t=TOKEN → cookie 2h + redirect /meni */
export async function GET(request: NextRequest) {
  const tableToken = request.nextUrl.searchParams.get("t")?.trim();

  if (!tableToken || tableToken.length < 16 || tableToken.length > 64) {
    return NextResponse.redirect(new URL("/meni", request.url));
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.redirect(new URL("/meni", request.url));
  }

  const ip = getClientIp(request.headers);
  const rl = rateLimit(`session:${ip}`, 30, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.redirect(new URL("/meni?error=invalid", request.url));
  }

  const supabase = createServiceClient();
  const { data: table } = await supabase
    .from("tables")
    .select("id")
    .eq("token", tableToken)
    .eq("active", true)
    .maybeSingle();

  if (!table) {
    return NextResponse.redirect(new URL("/meni?error=invalid", request.url));
  }

  const response = NextResponse.redirect(new URL("/meni", request.url));
  response.cookies.set(GUEST_COOKIE, signGuestSession(tableToken, ip), guestCookieOptions());
  return response;
}
