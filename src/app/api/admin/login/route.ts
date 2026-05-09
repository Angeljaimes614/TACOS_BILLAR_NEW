import { NextResponse } from "next/server";
import { isAuthConfigured, login } from "@/lib/admin/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const LOGIN_RATE_LIMIT = 8;
const LOGIN_RATE_WINDOW_MS = 60_000;

export async function POST(req: Request) {
  // Rate limit por IP — frena fuerza bruta en /admin/login.
  const ip = getClientIp(req);
  const rl = rateLimit(`admin-login:${ip}`, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Demasiados intentos. Reintenta en ${rl.retryAfter}s.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfter),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        error: "Auth no configurada. Define ADMIN_PASSWORD y ADMIN_SESSION_SECRET.",
      },
      { status: 500 },
    );
  }

  let password = "";
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    password = String(body.password ?? "");
  } else {
    const fd = await req.formData();
    password = String(fd.get("password") ?? "");
  }

  const ok = await login(password);
  if (!ok) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      {
        status: 401,
        headers: { "X-RateLimit-Remaining": String(rl.remaining) },
      },
    );
  }

  return NextResponse.json({ ok: true });
}
