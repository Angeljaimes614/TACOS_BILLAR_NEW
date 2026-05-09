import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  productSlugsQuery,
} from "@/sanity/lib/queries";
import type { Category } from "@/types";

export const revalidate = 3600; // refresca el sitemap cada hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_CONFIG.url.replace(/\/$/, "");
  const now = new Date();

  const [slugs, categories] = await Promise.all([
    sanityFetch<string[]>({
      query: productSlugsQuery,
      tags: ["product"],
      revalidate: 3600,
    }),
    sanityFetch<Category[]>({
      query: allCategoriesQuery,
      tags: ["category"],
      revalidate: 3600,
    }),
  ]);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${base}/productos`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${base}/nosotros`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    { url: `${base}/contacto`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
  ];

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/productos?cat=${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: now,
  }));

  const productUrls: MetadataRoute.Sitemap = (slugs ?? [])
    .filter(Boolean)
    .map((slug) => ({
      url: `${base}/productos/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: now,
    }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
