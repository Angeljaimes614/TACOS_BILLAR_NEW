import { defineArrayMember, defineField, defineType } from "sanity";
import { ReceiptIcon } from "@sanity/icons";

const formatMxn = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(n)
    : "";

const STATUS_TITLES: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export const order = defineType({
  name: "order",
  title: "Orden",
  type: "document",
  icon: ReceiptIcon,
  groups: [
    { name: "main", title: "Principal", default: true },
    { name: "customer", title: "Cliente" },
    { name: "items", title: "Productos" },
    { name: "payment", title: "Pago" },
  ],
  fields: [
    defineField({
      name: "orderId",
      title: "ID de orden (UUID)",
      type: "string",
      group: "main",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      group: "main",
      options: {
        list: Object.entries(STATUS_TITLES).map(([value, title]) => ({
          value,
          title,
        })),
        layout: "radio",
      },
      initialValue: "pending",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "customer",
      title: "Datos del cliente",
      type: "object",
      group: "customer",
      fields: [
        defineField({
          name: "email",
          type: "string",
          validation: (R) => R.email(),
        }),
        defineField({ name: "firstName", title: "Nombre", type: "string" }),
        defineField({ name: "lastName", title: "Apellido", type: "string" }),
        defineField({ name: "phone", title: "Teléfono", type: "string" }),
        defineField({
          name: "address",
          title: "Dirección",
          type: "object",
          fields: [
            defineField({ name: "street", title: "Calle", type: "string" }),
            defineField({ name: "number", title: "Número", type: "string" }),
            defineField({ name: "apartment", title: "Interior", type: "string" }),
            defineField({ name: "neighborhood", title: "Colonia", type: "string" }),
            defineField({ name: "city", title: "Ciudad", type: "string" }),
            defineField({ name: "state", title: "Estado", type: "string" }),
            defineField({ name: "zip", title: "CP", type: "string" }),
          ],
        }),
        defineField({ name: "notes", title: "Notas", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "items",
      title: "Productos",
      type: "array",
      group: "items",
      of: [
        defineArrayMember({
          name: "lineItem",
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Producto",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({ name: "productId", title: "ID snapshot", type: "string" }),
            defineField({ name: "name", title: "Nombre snapshot", type: "string" }),
            defineField({ name: "brand", title: "Marca snapshot", type: "string" }),
            defineField({
              name: "quantity",
              title: "Cantidad",
              type: "number",
              validation: (R) => R.integer().min(1),
            }),
            defineField({
              name: "unitPrice",
              title: "Precio unitario (MXN)",
              type: "number",
              validation: (R) => R.min(0),
            }),
            defineField({
              name: "lineTotal",
              title: "Subtotal de línea",
              type: "number",
            }),
          ],
          preview: {
            select: {
              name: "name",
              brand: "brand",
              qty: "quantity",
              total: "lineTotal",
              media: "product.images.0",
            },
            prepare({ name, brand, qty, total, media }) {
              return {
                title: `${qty}× ${name ?? "Producto"}`,
                subtitle: [brand, formatMxn(total)].filter(Boolean).join(" · "),
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      group: "payment",
      validation: (R) => R.min(0),
    }),
    defineField({
      name: "shipping",
      title: "Envío",
      type: "number",
      group: "payment",
      validation: (R) => R.min(0),
    }),
    defineField({
      name: "total",
      title: "Total",
      type: "number",
      group: "payment",
      validation: (R) => R.min(0),
    }),
    defineField({
      name: "currency",
      title: "Moneda",
      type: "string",
      group: "payment",
      initialValue: "MXN",
    }),
    defineField({
      name: "preferenceId",
      title: "Preference ID (Mercado Pago)",
      type: "string",
      group: "payment",
      readOnly: true,
    }),
    defineField({
      name: "paymentId",
      title: "Payment ID (Mercado Pago)",
      type: "string",
      group: "payment",
      readOnly: true,
    }),
    defineField({
      name: "paidAt",
      title: "Pagada el",
      type: "datetime",
      group: "payment",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      orderId: "orderId",
      status: "status",
      first: "customer.firstName",
      last: "customer.lastName",
      email: "customer.email",
      total: "total",
    },
    prepare({ orderId, status, first, last, email, total }) {
      const name = [first, last].filter(Boolean).join(" ") || email || "Cliente";
      const idShort = orderId ? `#${String(orderId).slice(0, 8)}` : "";
      return {
        title: `${name} · ${formatMxn(total)}`,
        subtitle: [STATUS_TITLES[status] ?? status, idShort].filter(Boolean).join(" · "),
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
      title: "Total: mayor a menor",
      name: "totalDesc",
      by: [{ field: "total", direction: "desc" }],
    },
    {
      title: "Estado",
      name: "statusAsc",
      by: [
        { field: "status", direction: "asc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
  ],
});
