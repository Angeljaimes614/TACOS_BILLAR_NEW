import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminSearch } from "@/components/admin/admin-search";
import { FilterPills } from "@/components/admin/filter-pills";
import { StockBadge } from "@/components/admin/status-badge";
import { sanityFetch } from "@/sanity/lib/fetch";
import { adminProductsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatCurrency } from "@/lib/utils";
import type { SanityImage } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Admin · Productos",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  discount?: number | null;
  stock?: number | null;
  isNew?: boolean | null;
  isBestSeller?: boolean | null;
  isFeatured?: boolean | null;
  image?: SanityImage | null;
}

const FILTERS = [
  { value: "all", label: "Todos" },
  { value: "out", label: "Agotados" },
  { value: "low", label: "Stock bajo" },
  { value: "sale", label: "En oferta" },
  { value: "new", label: "Nuevos" },
  { value: "featured", label: "Destacados" },
];

interface PageProps {
  searchParams: Promise<{ q?: string; filter?: string }>;
}

export default async function AdminProductosPage({ searchParams }: PageProps) {
  const { q = "", filter = "all" } = await searchParams;

  const products = await sanityFetch<AdminProduct[]>({
    query: adminProductsQuery,
    params: { q, filter },
    revalidate: 0,
    tags: ["product"],
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Inventario
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Productos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "resultado" : "resultados"}
          {filter !== "all" ? ` · filtro: ${FILTERS.find((f) => f.value === filter)?.label}` : ""}
        </p>
      </header>

      <div className="space-y-4">
        <AdminSearch placeholder="Buscar por nombre o marca…" />
        <FilterPills options={FILTERS} />
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
          No hay productos que coincidan con los filtros.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3">Etiquetas</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const imageUrl = p.image?.asset
                    ? urlFor(p.image)?.width(80).height(96).url()
                    : null;
                  const finalPrice = p.discount
                    ? Math.round(p.price * (1 - p.discount / 100))
                    : p.price;
                  return (
                    <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={p.image?.alt ?? p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-semibold text-foreground/60">
                                {p.brand?.charAt(0) ?? "?"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3 text-right">
                        {p.discount ? (
                          <div className="flex flex-col items-end leading-tight">
                            <span className="font-semibold tabular-nums">
                              {formatCurrency(finalPrice)}
                            </span>
                            <span className="text-[11px] text-muted-foreground line-through tabular-nums">
                              {formatCurrency(p.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold tabular-nums">
                            {formatCurrency(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.isFeatured ? (
                            <Tag tone="primary">Destacado</Tag>
                          ) : null}
                          {p.isBestSeller ? <Tag tone="secondary">Top</Tag> : null}
                          {p.isNew ? <Tag tone="accent">Nuevo</Tag> : null}
                          {p.discount ? <Tag tone="danger">-{p.discount}%</Tag> : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/studio/intent/edit/id=${p.id};type=product`}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                        >
                          Editar
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Tag({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "primary" | "secondary" | "accent" | "danger";
}) {
  const tones = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/15 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    accent: "bg-accent text-accent-foreground",
    danger: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
