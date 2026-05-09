import { MercadoPagoConfig } from "mercadopago";

/**
 * Cliente singleton de Mercado Pago. Sólo se importa desde código de servidor
 * (route handlers, server actions) — nunca desde un Client Component.
 */
function getAccessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN no está configurado. Revisa .env.local.",
    );
  }
  return token;
}

let cached: MercadoPagoConfig | null = null;

export function getMpClient(): MercadoPagoConfig {
  if (cached) return cached;
  cached = new MercadoPagoConfig({
    accessToken: getAccessToken(),
    options: { timeout: 10_000, idempotencyKey: undefined },
  });
  return cached;
}

/** URL pública del sitio para `back_urls` y `notification_url`. */
export function getBaseUrl(): string {
  return (
    process.env.MERCADOPAGO_BACK_URL_BASE ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}
