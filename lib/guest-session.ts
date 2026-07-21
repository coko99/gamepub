import { createHash } from "crypto";
import {
  hmacHex,
  requireGuestSessionSecret,
  timingSafeHexEqual,
} from "@/lib/security";

export const GUEST_COOKIE = "gamepub_guest";
export const GUEST_SESSION_SECONDS = 60 * 60 * 2; // 2 sata

function getSecret() {
  return requireGuestSessionSecret();
}

export function hashIp(ip: string) {
  return createHash("sha256").update(`${getSecret()}:ip:${ip}`).digest("hex").slice(0, 16);
}

export function getClientIp(headers: Headers): string {
  // Prefer platform headers when present (Cloudflare / Vercel edge)
  const cf = headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // Rightmost trusted hop is more reliable behind Vercel; take first for simplicity
    // (Vercel sets XFF from the real client).
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
}

/** cookie = tableToken.exp.ipHash.sig */
export function signGuestSession(tableToken: string, ip: string) {
  const exp = Math.floor(Date.now() / 1000) + GUEST_SESSION_SECONDS;
  const ipHash = hashIp(ip);
  const payload = `${tableToken}.${exp}.${ipHash}`;
  const sig = hmacHex(getSecret(), payload);
  return `${payload}.${sig}`;
}

export function verifyGuestSession(
  cookie: string | undefined,
  ip: string,
  expectedTableToken?: string,
): { tableToken: string; exp: number } | null {
  if (!cookie) return null;
  const parts = cookie.split(".");
  if (parts.length !== 4) return null;

  const [tableToken, expStr, ipHash, sig] = parts;
  if (!tableToken || !sig) return null;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;

  if (ipHash !== hashIp(ip)) return null;

  const payload = `${tableToken}.${exp}.${ipHash}`;
  const expected = hmacHex(getSecret(), payload);
  if (!timingSafeHexEqual(sig, expected)) return null;

  if (expectedTableToken && tableToken !== expectedTableToken) return null;

  return { tableToken, exp };
}

export function guestCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/meni",
    maxAge: GUEST_SESSION_SECONDS,
  };
}

export function guestSessionRemainingMinutes(exp: number) {
  return Math.max(0, Math.ceil((exp - Math.floor(Date.now() / 1000)) / 60));
}
