import { defineQuery } from "next-sanity";

/**
 * Fragmentos GROQ reusables. Se interpolan en las queries de abajo.
 * Para que `defineQuery` capture el string para typegen, las queries
 * finales son strings literales construidos por concatenación.
 */
const IMAGE_FRAGMENT = /* groq */ `{
  "alt": alt,
  "asset": asset->{
    _id,
    "url": url,
    "lqip": metadata.lqip,
    "dimensions": metadata.dimensions
  }
}`;

const PRODUCT_FRAGMENT = /* groq */ `
  "id": _id,
  "slug": slug.current,
  "name": name,
  "brand": brand->name,
  "brandSlug": brand->slug.current,
  "shortDescription": shortDescription,
  "price": price,
  "discount": discount,
  "category": category->slug.current,
  "categoryLabel": category->title,
  "rating": rating,
  "reviewCount": reviewCount,
  "stock": stock,
  "inStock": coalesce(stock, 0) > 0,
  "isNew": isNew,
  "isBestSeller": isBestSeller,
  "isFeatured": isFeatured,
  "specs": specs[]{ label, value },
  "image": images[0]${IMAGE_FRAGMENT}
`;

export const allProductsQuery = defineQuery(`
  *[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    ${PRODUCT_FRAGMENT}
  }
`);

export const productsByCategoryQuery = defineQuery(`
  *[_type == "product" && category->slug.current == $cat && !(_id in path("drafts.**"))]
    | order(isBestSeller desc, _createdAt desc) {
    ${PRODUCT_FRAGMENT}
  }
`);

export const featuredProductsQuery = defineQuery(`
  *[_type == "product"
    && !(_id in path("drafts.**"))
    && (isFeatured == true || isBestSeller == true || isNew == true || coalesce(discount, 0) > 0)
  ] | order(isFeatured desc, isBestSeller desc, _createdAt desc) [0...8] {
    ${PRODUCT_FRAGMENT}
  }
`);

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_FRAGMENT},
    "description": description,
    "images": images[]${IMAGE_FRAGMENT}
  }
`);

export const productSlugsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current)][].slug.current
`);

export const productsByIdsQuery = defineQuery(`
  *[_type == "product" && _id in $ids] {
    ${PRODUCT_FRAGMENT}
  }
`);

// ──────────────────────────────────────────────────────────
// Admin queries
// ──────────────────────────────────────────────────────────

/**
 * Estadísticas agregadas para el dashboard.
 * `$since` debe ser un ISO string (Date.toISOString()).
 */
export const adminStatsQuery = defineQuery(`
  {
    "totalProducts": count(*[_type == "product"]),
    "outOfStock": count(*[_type == "product" && coalesce(stock, 0) == 0]),
    "lowStock": count(*[_type == "product" && stock > 0 && stock <= 5]),
    "onSale": count(*[_type == "product" && coalesce(discount, 0) > 0]),
    "activePromotions": count(*[_type == "promotion"
      && (!defined(startDate) || startDate <= now())
      && (!defined(endDate) || endDate >= now())
    ]),
    "pendingOrders": count(*[_type == "order" && status == "pending"]),
    "approvedOrders30d": count(*[_type == "order" && status == "approved" && _createdAt >= $since]),
    "revenue30d": math::sum(*[_type == "order" && status == "approved" && _createdAt >= $since].total),
    "lowStockProducts": *[_type == "product" && coalesce(stock, 0) <= 5]
      | order(stock asc)
      [0...8] {
        "id": _id,
        "slug": slug.current,
        "name": name,
        "brand": brand->name,
        "category": category->title,
        "stock": stock,
        "price": price
      },
    "recentOrders": *[_type == "order"]
      | order(_createdAt desc)
      [0...8] {
        "id": _id,
        "orderId": orderId,
        "status": status,
        "total": total,
        "createdAt": _createdAt,
        "customerName": customer.firstName + " " + customer.lastName,
        "customerEmail": customer.email,
        "itemCount": count(items)
      }
  }
`);

/** Lista de productos para el admin con búsqueda y filtros server-side. */
export const adminProductsQuery = defineQuery(`
  *[_type == "product"
    && (!defined($q) || $q == ""
        || lower(name) match ("*" + lower($q) + "*")
        || lower(brand->name) match ("*" + lower($q) + "*"))
    && (
      !defined($filter) || $filter == "" || $filter == "all"
      || ($filter == "out" && coalesce(stock, 0) == 0)
      || ($filter == "low" && stock > 0 && stock <= 5)
      || ($filter == "sale" && coalesce(discount, 0) > 0)
      || ($filter == "new" && isNew == true)
      || ($filter == "featured" && isFeatured == true)
    )
  ] | order(_updatedAt desc) {
    "id": _id,
    "slug": slug.current,
    "name": name,
    "brand": brand->name,
    "category": category->title,
    "categorySlug": category->slug.current,
    "price": price,
    "discount": discount,
    "stock": stock,
    "isNew": isNew,
    "isBestSeller": isBestSeller,
    "isFeatured": isFeatured,
    "image": images[0]{
      "alt": alt,
      "asset": asset->{ _id, url, "lqip": metadata.lqip }
    }
  }
`);

/** Lista de órdenes para el admin con búsqueda y filtros server-side. */
export const adminOrdersQuery = defineQuery(`
  *[_type == "order"
    && (!defined($status) || $status == "" || $status == "all" || status == $status)
    && (!defined($q) || $q == ""
        || lower(customer.email) match ("*" + lower($q) + "*")
        || lower(customer.firstName) match ("*" + lower($q) + "*")
        || lower(customer.lastName) match ("*" + lower($q) + "*")
        || lower(orderId) match ("*" + lower($q) + "*"))
  ] | order(_createdAt desc) [0...100] {
    "id": _id,
    "orderId": orderId,
    "status": status,
    "subtotal": subtotal,
    "shipping": shipping,
    "total": total,
    "paymentId": paymentId,
    "paidAt": paidAt,
    "createdAt": _createdAt,
    "customerName": customer.firstName + " " + customer.lastName,
    "customerEmail": customer.email,
    "itemCount": count(items)
  }
`);

/** Detalle completo de una orden por orderId. */
export const adminOrderByIdQuery = defineQuery(`
  *[_type == "order" && orderId == $orderId][0] {
    "id": _id,
    "orderId": orderId,
    "status": status,
    "subtotal": subtotal,
    "shipping": shipping,
    "total": total,
    "currency": currency,
    "paymentId": paymentId,
    "preferenceId": preferenceId,
    "paidAt": paidAt,
    "createdAt": _createdAt,
    "customer": customer,
    "items": items[]{
      productId,
      name,
      brand,
      quantity,
      unitPrice,
      lineTotal,
      "slug": product->slug.current,
      "image": product->images[0]{
        "alt": alt,
        "asset": asset->{ _id, url, "lqip": metadata.lqip }
      }
    }
  }
`);

export const adminPromotionsQuery = defineQuery(`
  *[_type == "promotion"
    && (
      !defined($filter) || $filter == "" || $filter == "all"
      || ($filter == "active"
          && (!defined(startDate) || startDate <= now())
          && (!defined(endDate) || endDate >= now()))
      || ($filter == "scheduled"
          && defined(startDate) && startDate > now())
      || ($filter == "expired"
          && defined(endDate) && endDate < now())
    )
  ] | order(isFeatured desc, order asc, _createdAt desc) {
    "id": _id,
    "title": title,
    "subtitle": subtitle,
    "badge": badge,
    "discountPercent": discountPercent,
    "startDate": startDate,
    "endDate": endDate,
    "isFeatured": isFeatured,
    "categoryTitle": category->title,
    "productCount": count(products)
  }
`);

export const allCategoriesQuery = defineQuery(`
  *[_type == "category"] | order(order asc, title asc) {
    "id": _id,
    "slug": slug.current,
    "title": title,
    "blurb": blurb,
    "icon": icon,
    "order": order,
    "image": image${IMAGE_FRAGMENT},
    "productCount": count(*[_type == "product" && references(^._id) && !(_id in path("drafts.**"))])
  }
`);

export const featuredPromotionsQuery = defineQuery(`
  *[_type == "promotion"
    && (!defined(startDate) || startDate <= now())
    && (!defined(endDate) || endDate >= now())
  ] | order(isFeatured desc, order asc, _createdAt desc) [0...3] {
    "id": _id,
    "title": title,
    "subtitle": subtitle,
    "description": description,
    "badge": badge,
    "discountPercent": discountPercent,
    "startDate": startDate,
    "endDate": endDate,
    "cta": cta{label, href},
    "categorySlug": category->slug.current,
    "isFeatured": isFeatured,
    "image": image${IMAGE_FRAGMENT}
  }
`);
