/**
 * Re-export de los tipos del cliente de Sanity para uso en componentes.
 * Mantiene `@/types` como punto único de imports.
 */
export type {
  Product,
  Category,
  Promotion,
  ProductSpec,
  SanityImage,
  SanityImageAsset,
} from "@/sanity/lib/types";
