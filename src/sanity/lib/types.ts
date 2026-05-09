/**
 * Tipos derivados de las proyecciones GROQ.
 *
 * En producción puedes generarlos automáticamente con:
 *   npm run sanity:typegen
 */

export interface SanityImageAsset {
  _id: string;
  url: string;
  lqip?: string | null;
  dimensions?: { width: number; height: number } | null;
}

export interface SanityImage {
  alt?: string | null;
  asset: SanityImageAsset | null;
}

export interface ProductSpec {
  label?: string | null;
  value?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug?: string | null;
  shortDescription: string;
  price: number;
  discount?: number | null;
  category: string;
  categoryLabel?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  stock?: number | null;
  inStock: boolean;
  isNew?: boolean | null;
  isBestSeller?: boolean | null;
  isFeatured?: boolean | null;
  specs?: ProductSpec[] | null;
  image?: SanityImage | null;
  images?: SanityImage[] | null;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  blurb?: string | null;
  icon?: string | null;
  image?: SanityImage | null;
  order?: number | null;
  productCount: number;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  badge?: string | null;
  image?: SanityImage | null;
  discountPercent?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  cta?: { label?: string | null; href?: string | null } | null;
  categorySlug?: string | null;
  isFeatured?: boolean | null;
}
