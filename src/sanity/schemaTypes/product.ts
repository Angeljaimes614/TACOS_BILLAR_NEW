import { defineArrayMember, defineField, defineType } from "sanity";
import { BasketIcon } from "@sanity/icons";

const formatMxn = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(n)
    : "";

export const product = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  icon: BasketIcon,
  groups: [
    { name: "main", title: "Principal", default: true },
    { name: "pricing", title: "Precio y stock" },
    { name: "media", title: "Imágenes" },
    { name: "specs", title: "Especificaciones" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      group: "main",
      validation: (R) => R.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "main",
      options: { source: "name", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "brand",
      title: "Marca",
      type: "reference",
      group: "main",
      to: [{ type: "brand" }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      group: "main",
      to: [{ type: "category" }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Descripción corta",
      type: "text",
      group: "main",
      rows: 2,
      description: "Aparece en las cards y resultados de búsqueda. Máx 180 caracteres.",
      validation: (R) => R.required().max(180),
    }),
    defineField({
      name: "description",
      title: "Descripción larga",
      type: "array",
      group: "main",
      of: [{ type: "block" }],
      description: "Texto enriquecido para la página de producto.",
    }),

    defineField({
      name: "images",
      title: "Imágenes",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              description: "Para accesibilidad y SEO. Describe la imagen brevemente.",
              validation: (R) => R.max(160),
            }),
          ],
        }),
      ],
      options: { layout: "grid" },
      validation: (R) => R.min(1).warning("Sube al menos una imagen del producto."),
    }),

    defineField({
      name: "price",
      title: "Precio (MXN)",
      type: "number",
      group: "pricing",
      validation: (R) => R.required().min(0).precision(2),
    }),
    defineField({
      name: "discount",
      title: "Descuento (%)",
      type: "number",
      group: "pricing",
      description: "Porcentaje 0–99 sobre el precio base.",
      validation: (R) => R.min(0).max(99).integer(),
    }),
    defineField({
      name: "stock",
      title: "Stock disponible",
      type: "number",
      group: "pricing",
      initialValue: 0,
      validation: (R) => R.required().min(0).integer(),
    }),

    defineField({
      name: "rating",
      title: "Calificación promedio",
      type: "number",
      group: "main",
      description: "0 a 5 con un decimal.",
      validation: (R) => R.min(0).max(5).precision(1),
    }),
    defineField({
      name: "reviewCount",
      title: "Número de reseñas",
      type: "number",
      group: "main",
      validation: (R) => R.min(0).integer(),
    }),

    defineField({
      name: "isNew",
      title: "Marcar como nuevo",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
    defineField({
      name: "isBestSeller",
      title: "Top ventas",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
    defineField({
      name: "isFeatured",
      title: "Destacar en home",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),

    defineField({
      name: "specs",
      title: "Especificaciones",
      type: "array",
      group: "specs",
      of: [
        defineArrayMember({
          type: "object",
          name: "spec",
          fields: [
            defineField({
              name: "label",
              title: "Etiqueta",
              type: "string",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "value",
              title: "Valor",
              type: "string",
              validation: (R) => R.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "title", title: "Título SEO", type: "string" }),
        defineField({
          name: "description",
          title: "Descripción SEO",
          type: "text",
          rows: 2,
          validation: (R) => R.max(160),
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      brand: "brand.name",
      media: "images.0",
      price: "price",
      discount: "discount",
      stock: "stock",
    },
    prepare({ title, brand, media, price, discount, stock }) {
      const base = formatMxn(price);
      const discounted =
        typeof price === "number" && typeof discount === "number" && discount > 0
          ? formatMxn(price * (1 - discount / 100))
          : null;
      const priceLabel = discounted ? `${discounted} (-${discount}%)` : base;
      const stockLabel =
        typeof stock === "number" && stock > 0 ? `${stock} en stock` : "Agotado";
      return {
        title,
        subtitle: [brand, priceLabel, stockLabel].filter(Boolean).join(" · "),
        media,
      };
    },
  },

  orderings: [
    {
      title: "Más recientes",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Precio: menor a mayor",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Precio: mayor a menor",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Mejor calificados",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
  ],
});
