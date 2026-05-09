import { createHmac, timingSafeEqual } from "node:crypto";

interface VerifyArgs {
  /** Header `x-signature` recibido. Formato: `ts=...,v1=...`. */
  signature: string | null;
  /** Header `x-request-id` recibido. */
  requestId: string | null;
  /** `data.id` que viene en el query string del webhook. */
  dataId: string | null;
  /** Secreto compartido configurado en MP → Webhooks. */
  secret: string;
  /** Tolerancia máxima de antigüedad del timestamp en segundos. */
  maxAgeSeconds?: number;
}

/**
 * Valida la firma HMAC-SHA256 del webhook de Mercado Pago.
 *
 * Manifest: `id:<dataId>;request-id:<requestId>;ts:<ts>;`
 * Firma:    HMAC-SHA256(manifest, secret) en hex
 *
 * Comparación con `timingSafeEqual` para evitar timing attacks.
 *
 * @see https://www.mercadopago.com.mx/developers/es/docs/your-integrations/notifications/webhooks
 */
export function verifyMercadoPagoSignature({
  signature,
  requestId,
  dataId,
  secret,
  maxAgeSeconds = 600,
}: VerifyArgs): boolean {
  if (!signature || !requestId || !dataId || !secret) return false;

  const parts = Object.fromEntries(
    signature
      .split(",")
      .map((p) => p.split("=").map((s) => s.trim()))
      .filter((kv): kv is [string, string] => kv.length === 2),
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const tsNumber = Number(ts);
  if (!Number.isFinite(tsNumber)) return false;
  const ageSeconds = Math.abs(Date.now() / 1000 - tsNumber);
  if (ageSeconds > maxAgeSeconds) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  let a: Buffer;
  let b: Buffer;
  try {
    a = Buffer.from(expected, "hex");
    b = Buffer.from(v1, "hex");
  } catch {
    return false;
  }
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
