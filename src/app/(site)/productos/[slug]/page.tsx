import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  productBySlugQuery,
  productSlugsQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, productSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import type { Product } from "@/types";
import { ProductDetail } from "./product-detail";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: productSlugsQuery,
    revalidate: 3600,
  });
  return (slugs ?? []).filter(Boolean).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await sanityFetch<Product | null>({
    query: productBySlugQuery,
    params: { slug },
    tags: ["product"],
  });

  if (!product) {
    return { title: "Producto no encontrado", robots: { index: false } };
  }

  const url = `${SITE_CONFIG.url}/productos/${product.slug}`;
  const image = product.image?.asset
    ? (urlFor(product.image)?.width(1200).height(630).fit("crop").url() ?? null)
    : null;

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: {
      type: "website",
      url,
      title: product.name,
      description: product.shortDescription,
      images: image ? [{ url: image, width: 1200, height: 630, alt: product.name }] : undefined,
      siteName: SITE_CONFIG.name,
      locale: "es_MX",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await sanityFetch<Product | null>({
    query: productBySlugQuery,
    params: { slug },
    tags: ["product"],
    revalidate: 60,
  });

  if (!product) notFound();

  return (
    <>
      <JsonLd data={productSchema(product)} id={`product-jsonld-${product.id}`} />
      <JsonLd data={breadcrumbSchema(product)} id={`breadcrumb-jsonld-${product.id}`} />
      <ProductDetail product={product} />
    </>
  );
}
