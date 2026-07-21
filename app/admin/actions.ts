"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  resolveStaffSession,
  signStaffToken,
} from "@/lib/admin-auth";
import { getClientIp } from "@/lib/guest-session";
import { rateLimit } from "@/lib/rate-limit";
import { safeEqualString } from "@/lib/security";
import type { StaffRole } from "@/lib/types/menu";

function homeForRole(role: StaffRole) {
  return role === "admin" ? "/admin/stolovi" : "/admin/porudzbine";
}

export async function loginWithPin(formData: FormData) {
  const pin = String(formData.get("pin") ?? "");
  const next = String(formData.get("next") ?? "");
  const adminPin = process.env.ADMIN_PIN;
  const waiterPin = process.env.WAITER_PIN;

  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const rl = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!rl.ok) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next || "/admin")}`);
  }

  let role: StaffRole | null = null;
  if (adminPin && safeEqualString(pin, adminPin)) role = "admin";
  else if (waiterPin && safeEqualString(pin, waiterPin)) role = "waiter";

  if (!role) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next || "/admin")}`);
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, signStaffToken(role, pin), adminCookieOptions());

  if (role === "waiter") {
    redirect("/admin/porudzbine");
  }

  if (
    next.startsWith("/admin") &&
    !next.startsWith("/admin/login") &&
    next !== "/admin" &&
    next !== "/admin/"
  ) {
    redirect(next);
  }

  redirect(homeForRole(role));
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function getStaffRole(): Promise<StaffRole | null> {
  const jar = await cookies();
  return resolveStaffSession(jar.get(ADMIN_COOKIE)?.value);
}

/** Konobar ili admin — porudžbine */
export async function requireStaff(): Promise<StaffRole> {
  const role = await getStaffRole();
  if (!role) redirect("/admin/login");
  return role;
}

/** Samo glavni admin — meni, stolovi, QR */
export async function requireAdmin(): Promise<void> {
  const role = await getStaffRole();
  if (role === "admin") return;
  if (role === "waiter") redirect("/admin/porudzbine");
  redirect("/admin/login");
}

/** Samo konobar (opciono) */
export async function requireWaiter(): Promise<void> {
  const role = await getStaffRole();
  if (role === "waiter" || role === "admin") return;
  redirect("/admin/login");
}
