import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Tag } from "lucide-react";
import { FilterPills } from "@/components/admin/filter-pills";
import { sanityFetch } from "@/sanity/lib/fetch";
import { adminPromotionsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Admin · Promociones",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface AdminPromotion {
  id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  discountPercent?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  isFeatured?: boolean | null;
  categoryTitle?: string | null;
  productCount: number;
}

const FILTERS = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "scheduled", label: "Programadas" },
  { value: "expired", label: "Vencidas" },
];

function getStatus(p: AdminPromotion): "active" | "scheduled" | "expired" {
  const now = Date.now();
  const start = p.startDate ? new Date(p.startDate).getTime() : null;
  const end = p.endDate ? new Date(p.endDate).getTime() : null;
  if (start && start > now) return "scheduled";
  if (end && end < now) return "expired";
  return "active";
}

const STATUS_TONE = {
  active: "bg-secondary/15 text-secondary",
  scheduled: "bg-primary/15 text-primary",
  expired: "bg-muted text-muted-foreground",
} as const;

const STATUS_LABEL = {
  active: "Activa",
  scheduled: "Programada",
  expired: "Vencida",
} as const;

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AdminPromocionesPage({ searchParams }: PageProps) {
  const { filter = "all" } = await searchParams;

  const promotions = await sanityFetch<AdminPromotion[]>({
    query: adminPromotionsQuery,
    params: { filter },
    revalidate: 60,
    tags: ["promotion"],
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Marketing
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Promociones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {promotions.length} {promotions.length === 1 ? "promoción" : "promociones"}
        </p>
      </header>

      <FilterPills options={FILTERS} />

      {promotions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
          No hay promociones con este filtro.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {promotions.map((p) => {
            const status = getStatus(p);
            return (
              <article
                key={p.id}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-soft-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${STATUS_TONE[status]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {STATUS_LABEL[status]}
                      </span>
                      {p.isFeatured ? (
                        <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Destacada
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold leading-tight tracking-tight">
                      {p.title}
                    </h3>
                    {p.subtitle ? (
                      <p className="mt-0.5 text-sm text-muted-foreground">{p.subtitle}</p>
                    ) : null}
                  </div>
                  {typeof p.discountPercent === "number" && p.discountPercent > 0 ? (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 font-display text-base font-bold text-primary">
                      −{p.discountPercent}%
                    </span>
                  ) : (
                    <Tag className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {p.startDate ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em]">Inicio</dt>
                      <dd className="text-foreground">
                        {new Date(p.startDate).toLocaleDateString("es-MX")}
                      </dd>
                    </div>
                  ) : null}
                  {p.endDate ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em]">Fin</dt>
                      <dd className="text-foreground">
                        {new Date(p.endDate).toLocaleDateString("es-MX")}
                      </dd>
                    </div>
                  ) : null}
                  {p.categoryTitle ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.18em]">Categoría</dt>
                      <dd className="text-foreground">{p.categoryTitle}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em]">Productos</dt>
                    <dd className="text-foreground">{p.productCount}</dd>
                  </div>
                </dl>

                <Link
                  href={`/studio/intent/edit/id=${p.id};type=promotion`}
                  target="_blank"
                  rel="noopener"
                  className="mt-auto inline-flex items-center gap-1.5 self-start rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  Editar en Studio
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
