import type { StructureResolver } from "sanity/structure";
import {
  BasketIcon,
  CalendarIcon,
  CheckmarkCircleIcon,
  ClockIcon,
  CloseCircleIcon,
  ErrorOutlineIcon,
  PackageIcon,
  ReceiptIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
  ThListIcon,
  WarningOutlineIcon,
} from "@sanity/icons";

/**
 * Sidebar del Studio con vistas filtradas para el equipo de operación.
 * Cada listado usa un filtro GROQ para destacar lo que requiere atención.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Maestro · Operación")
    .items([
      S.listItem()
        .title("Productos")
        .icon(BasketIcon)
        .child(
          S.list()
            .title("Productos")
            .items([
              S.listItem()
                .title("Todos")
                .icon(BasketIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Todos los productos")
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Agotados")
                .icon(ErrorOutlineIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Agotados (stock = 0)")
                    .filter("coalesce(stock, 0) == 0")
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Stock bajo")
                .icon(WarningOutlineIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Stock bajo (1–5 unidades)")
                    .filter("stock > 0 && stock <= 5")
                    .defaultOrdering([{ field: "stock", direction: "asc" }]),
                ),
              S.listItem()
                .title("En oferta")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Productos con descuento")
                    .filter("coalesce(discount, 0) > 0")
                    .defaultOrdering([{ field: "discount", direction: "desc" }]),
                ),
              S.listItem()
                .title("Destacados")
                .icon(StarIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Destacados en home")
                    .filter("isFeatured == true"),
                ),
              S.listItem()
                .title("Nuevos")
                .icon(SparklesIcon)
                .child(
                  S.documentTypeList("product")
                    .title("Nuevos")
                    .filter("isNew == true"),
                ),
            ]),
        ),

      S.listItem()
        .title("Categorías")
        .icon(ThListIcon)
        .child(
          S.documentTypeList("category")
            .title("Categorías")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.listItem()
        .title("Marcas")
        .icon(PackageIcon)
        .child(S.documentTypeList("brand").title("Marcas")),

      S.listItem()
        .title("Promociones")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Promociones")
            .items([
              S.listItem()
                .title("Activas")
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentTypeList("promotion")
                    .title("Activas (vigentes)")
                    .filter(
                      `(!defined(startDate) || startDate <= now()) && (!defined(endDate) || endDate >= now())`,
                    ),
                ),
              S.listItem()
                .title("Programadas")
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList("promotion")
                    .title("Programadas (inician en el futuro)")
                    .filter(`defined(startDate) && startDate > now()`),
                ),
              S.listItem()
                .title("Vencidas")
                .icon(ClockIcon)
                .child(
                  S.documentTypeList("promotion")
                    .title("Vencidas")
                    .filter(`defined(endDate) && endDate < now()`),
                ),
              S.divider(),
              S.listItem()
                .title("Todas")
                .icon(TagIcon)
                .child(S.documentTypeList("promotion").title("Todas las promos")),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Órdenes")
        .icon(ReceiptIcon)
        .child(
          S.list()
            .title("Órdenes")
            .items([
              S.listItem()
                .title("Pendientes")
                .icon(ClockIcon)
                .child(
                  S.documentTypeList("order")
                    .title("Órdenes pendientes")
                    .filter(`status == "pending"`),
                ),
              S.listItem()
                .title("Aprobadas")
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentTypeList("order")
                    .title("Órdenes aprobadas")
                    .filter(`status == "approved"`),
                ),
              S.listItem()
                .title("Rechazadas")
                .icon(CloseCircleIcon)
                .child(
                  S.documentTypeList("order")
                    .title("Órdenes rechazadas")
                    .filter(`status == "rejected"`),
                ),
              S.divider(),
              S.listItem()
                .title("Todas")
                .icon(ReceiptIcon)
                .child(
                  S.documentTypeList("order")
                    .title("Todas las órdenes")
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
                ),
            ]),
        ),
    ]);
