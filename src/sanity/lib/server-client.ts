import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

let cached: SanityClient | null = null;

/**
 * Cliente con permisos de escritura. Requiere `SANITY_API_WRITE_TOKEN`
 * (Sanity → API → Tokens → role: Editor o superior).
 *
 * Lanza si el token falta — los call-sites deben envolver en try/catch
 * cuando la persistencia es opcional (ej. el checkout no debe fallar
 * si Sanity está caído).
 */
export function getWriteClient(): SanityClient {
  if (cached) return cached;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "SANITY_API_WRITE_TOKEN no configurado. Agrégalo a .env.local para habilitar persistencia de órdenes y stock.",
    );
  }
  cached = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published",
  });
  return cached;
}

/** Variante segura: devuelve `null` si el token no está configurado. */
export function tryGetWriteClient(): SanityClient | null {
  try {
    return getWriteClient();
  } catch (err) {
    console.warn("[sanity write] desactivado:", (err as Error).message);
    return null;
  }
}

export const orderDocId = (orderId: string) => `order.${orderId}`;
