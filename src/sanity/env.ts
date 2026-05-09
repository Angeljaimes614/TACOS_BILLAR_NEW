/**
 * Variables de entorno tipadas para Sanity.
 * Lanza error en build/runtime si falta algo crítico.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Falta NEXT_PUBLIC_SANITY_DATASET en el entorno",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Falta NEXT_PUBLIC_SANITY_PROJECT_ID en el entorno",
);

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "/studio";

/** Token con permiso Viewer; sólo en server. */
export const readToken = process.env.SANITY_API_READ_TOKEN;

/** Secreto compartido con el webhook de Sanity. */
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
