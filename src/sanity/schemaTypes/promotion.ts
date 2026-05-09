import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const promotion = defineType({
  name: "promotion",
  title: "Promoción",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "main", title: "Principal", default: true },
    { name: "schedule", title: "Vigencia" },
    { name: "links", title: "Vinculación" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "main",
      validation: (R) => R.required().max(120),
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo",
      type: "string",
      group: "main",
      validation: (R) => R.max(160),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      group: "main",
      rows: 3,
    }),
    defineField({
      name: "badge",
      title: "Etiqueta superior",
      type: "string",
      group: "main",
      description: 'Ej: "Oferta destacada", "Solo este mes", "Bundle".',
    }),
    defineField({
      name: "discountPercent",
      title: "Descuento (%)",
      type: "number",
      group: "main",
      validation: (R) => R.min(0).max(99).integer(),
    }),
    defineField({
      name: "image",
      title: "Imagen",
      type: "image",
      group: "main",
      options: { hotspot: true },
    }),
    defineField({
      name: "cta",
      title: "Botón",
      type: "object",
      group: "main",
      fields: [
        defineField({ name: "label", title: "Texto", type: "string" }),
        defineField({
          name: "href",
          title: "URL relativa o absoluta",
          type: "string",
          description: 'Ej: "/productos?cat=tacos-profesionales"',
        }),
      ],
    }),

    defineField({
      name: "startDate",
      title: "Fecha de inicio",
      type: "datetime",
      group: "schedule",
    }),
    defineField({
      name: "endDate",
      title: "Fecha de fin",
      type: "datetime",
      group: "schedule",
      validation: (R) =>
        R.custom((endDate, ctx) => {
          const start = (ctx.parent as { startDate?: string })?.startDate;
          if (start && endDate && new Date(endDate as string) <= new Date(start)) {
            return "La fecha de fin debe ser posterior a la fecha de inicio.";
          }
          return true;
        }),
    }),

    defineField({
      name: "category",
      title: "Categoría asociada",
      type: "reference",
      group: "links",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "products",
      title: "Productos asociados",
      type: "array",
      group: "links",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),

    defineField({
      name: "isFeatured",
      title: "Mostrar como promo grande",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      group: "main",
      initialValue: 100,
      validation: (R) => R.integer(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      media: "image",
      percent: "discountPercent",
      featured: "isFeatured",
    },
    prepare({ title, subtitle, media, percent, featured }) {
      const parts = [
        featured ? "★ Destacada" : null,
        percent ? `-${percent}%` : null,
        subtitle,
      ].filter(Boolean);
      return { title, subtitle: parts.join(" · "), media };
    },
  },
  orderings: [
    {
      title: "Manual (orden)",
      name: "orderAsc",
      by: [
        { field: "isFeatured", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Vigencia",
      name: "endDateAsc",
      by: [{ field: "endDate", direction: "asc" }],
    },
  ],
});
