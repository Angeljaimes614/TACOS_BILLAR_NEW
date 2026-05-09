import { SITE_CONFIG } from "@/lib/constants";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types";

/**
 * Schema.org JSON-LD builders. Se renderizan vía `<JsonLd data={...} />`
 * en cada página relevante. Los buscadores los usan para rich results.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.contact.phone,
      contactType: "customer service",
      email: SITE_CONFIG.contact.email,
      areaServed: "MX",
      availableLanguage: ["Spanish"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.contact.address,
      addressCountry: "MX",
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.youtube,
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    inLanguage: "es-MX",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/productos?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product: Product) {
  const url = `${SITE_CONFIG.url}/productos/${product.slug}`;
  const imageUrl = product.image?.asset
    ? (urlFor(product.image)?.width(1200).height(1500).url() ?? undefined)
    : undefined;
  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
  const inStock = (product.stock ?? 0) > 0;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.id,
    mpn: product.slug,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "MXN",
      price: finalPrice,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: new Date(Date.now() + 90 * 86_400_000)
        .toISOString()
        .slice(0, 10),
    },
  };

  if (imageUrl) schema.image = [imageUrl];

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export function breadcrumbSchema(product: Product) {
  const items: Array<{ "@type": string; position: number; name: string; item: string }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: SITE_CONFIG.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tienda",
      item: `${SITE_CONFIG.url}/productos`,
    },
  ];

  if (product.categoryLabel && product.category) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: product.categoryLabel,
      item: `${SITE_CONFIG.url}/productos?cat=${product.category}`,
    });
  }

  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: product.name,
    item: `${SITE_CONFIG.url}/productos/${product.slug}`,
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
