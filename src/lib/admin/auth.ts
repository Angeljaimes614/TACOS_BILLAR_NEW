import "server-only";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "maestro-admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

/**
 * Token de sesión derivado de password + secreto. Rotar `ADMIN_SESSION_SECRET`
 * invalida todas las sesiones existentes sin necesidad de blacklist.
 */
function expectedSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return null;
  return createHash("sha256").update(`${password}|${secret}`).digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  const expected = expectedSessionToken();
  if (!expected) return false;

  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;

  // Comparación timing-safe.
  try {
    const a = Buffer.from(value, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function login(password: string): Promise<boolean> {
  const expected = expectedSessionToken();
  if (!expected) return false;
  if (password !== process.env.ADMIN_PASSWORD) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return true;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}
