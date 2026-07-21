import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export function requireSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set (min 32 chars) in production");
  }

  // Dev fallback only — never used in production builds on Vercel
  return "dev-only-session-secret-change-me!!";
}

export function requireGuestSessionSecret(): string {
  const secret = process.env.GUEST_SESSION_SECRET?.trim() || process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("GUEST_SESSION_SECRET or SESSION_SECRET must be set in production");
  }

  return "dev-only-guest-secret-change-me!!!!";
}

/** Opaque QR token — 24 bytes → ~32 url-safe chars */
export function makeOpaqueTableToken(): string {
  return randomBytes(24)
    .toString("base64url")
    .replace(/=+$/, "");
}

export function safeEqualString(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function hmacHex(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function timingSafeHexEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}
