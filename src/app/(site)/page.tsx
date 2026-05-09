import { Hero } from "@/components/sections/hero";
import { PromoBanner } from "@/components/sections/promo-banner";
import { Categories } from "@/components/sections/categories";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { Promotions } from "@/components/sections/promotions";
import { CTA } from "@/components/sections/cta";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  featuredProductsQuery,
  featuredPromotionsQuery,
} from "@/sanity/lib/queries";
import type { Category, Product, Promotion } from "@/types";

export default async function HomePage() {
  const [categories, products, promotions] = await Promise.all([
    sanityFetch<Category[]>({
      query: allCategoriesQuery,
      tags: ["category", "product"],
    }),
    sanityFetch<Product[]>({
      query: featuredProductsQuery,
      tags: ["product"],
    }),
    sanityFetch<Promotion[]>({
      query: featuredPromotionsQuery,
      tags: ["promotion"],
    }),
  ]);

  return (
    <>
      <Hero />
      <PromoBanner />
      <Categories categories={categories} />
      <FeaturedProducts products={products} />
      <Promotions promotions={promotions} />
      <CTA />
    </>
  );
}
