import { defineField, defineType } from "sanity";
import { ThListIcon } from "@sanity/icons";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nombre",
      type: "string",
      validation: (R) => R.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "blurb",
      title: "Descripción corta",
      type: "text",
      rows: 2,
      validation: (R) => R.max(160),
    }),
    defineField({
      name: "icon",
      title: "Icono (lucide-react)",
      type: "string",
      description:
        "Nombre exacto de un icono de lucide-react. Ej: Crosshair, Briefcase, CircleDot, Layers, Sparkles, Wrench.",
    }),
    defineField({
      name: "image",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
      ],
    }),
    defineField({
      name: "order",
      title: "Orden de aparición",
      type: "number",
      description: "Determina el orden en grids y filtros (menor primero).",
      initialValue: 100,
      validation: (R) => R.integer(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "blurb", media: "image" },
  },
  orderings: [
    {
      title: "Manual (campo orden)",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
