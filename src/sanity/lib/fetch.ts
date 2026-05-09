import type { QueryParams } from "next-sanity";
import { client } from "./client";

interface SanityFetchOptions<TParams extends QueryParams = QueryParams> {
  query: string;
  params?: TParams;
  /** Tags para invalidación selectiva. Usa el `_type` del documento. */
  tags?: string[];
  /** Segundos de revalidación ISR. `false` = sin caché. Default 60. */
  revalidate?: number | false;
}

/**
 * Wrapper tipado sobre `client.fetch` con caché de Next.js.
 *
 * @example
 *   const products = await sanityFetch<Product[]>({
 *     query: allProductsQuery,
 *     tags: ['product'],
 *   })
 */
export async function sanityFetch<TResult>({
  query,
  params,
  tags = [],
  revalidate = 60,
}: SanityFetchOptions): Promise<TResult> {
  return client.fetch<TResult>(query, params ?? {}, {
    next:
      revalidate === false
        ? { revalidate: 0, tags }
        : { revalidate, tags },
  });
}
