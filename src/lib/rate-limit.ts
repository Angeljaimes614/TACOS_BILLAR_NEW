/**
 * Rate limiter en memoria — sliding window por bucket.
 *
 * NOTA DE PRODUCCIÓN: En Vercel cada instancia serverless tiene su propio
 * proceso, así que esto es best-effort. Para protección global usa Upstash
 * Ratelimit (`@upstash/ratelimit` + Redis) y reemplaza el `Map` interno.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  /** Segundos para reintento si `ok` es false. */
  retryAfter: number;
  /** Cuántas requests quedan en la ventana actual. */
  remaining: number;
}

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
      remaining: 0,
    };
  }

  bucket.count += 1;
  return {
    ok: true,
    retryAfter: 0,
    remaining: Math.max(0, limit - bucket.count),
  };
}

/** Limpia buckets expirados — llamarlo periódicamente si la app vive mucho. */
export function pruneRateLimits() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/** Extrae IP cliente respetando proxies (Vercel, Cloudflare). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}
