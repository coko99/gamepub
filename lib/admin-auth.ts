import type { StaffRole } from "@/lib/types/menu";
import {
  hmacHex,
  requireSessionSecret,
  timingSafeHexEqual,
} from "@/lib/security";

export const ADMIN_COOKIE = "gamepub_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

export function signStaffToken(role: StaffRole, _pin: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${role}.${exp}`;
  const sig = hmacHex(requireSessionSecret(), payload);
  return `${payload}.${sig}`;
}

/** @deprecated use signStaffToken */
export function signAdminToken(pin: string) {
  return signStaffToken("admin", pin);
}

export function parseStaffToken(
  token: string | undefined,
): { role: StaffRole; exp: number; sig: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [role, expStr, sig] = parts;
  if (role !== "admin" && role !== "waiter") return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  return { role, exp, sig };
}

export function verifyStaffToken(
  token: string | undefined,
  role: StaffRole,
): boolean {
  const parsed = parseStaffToken(token);
  if (!parsed || parsed.role !== role) return false;
  const payload = `${parsed.role}.${parsed.exp}`;
  const expected = hmacHex(requireSessionSecret(), payload);
  return timingSafeHexEqual(parsed.sig, expected);
}

export function resolveStaffSession(token: string | undefined): StaffRole | null {
  if (verifyStaffToken(token, "admin")) return "admin";
  if (verifyStaffToken(token, "waiter")) return "waiter";
  return null;
}

/** @deprecated */
export function verifyAdminToken(token: string | undefined, _pin: string | undefined) {
  return verifyStaffToken(token, "admin");
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}
