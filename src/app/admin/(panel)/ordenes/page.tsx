import type { Metadata } from "next";
import Link from "next/link";
import { AdminSearch } from "@/components/admin/admin-search";
import { FilterPills } from "@/components/admin/filter-pills";
import { StatusBadge } from "@/components/admin/status-badge";
import { sanityFetch } from "@/sanity/lib/fetch";
import { adminOrdersQuery } from "@/sanity/lib/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin · Órdenes",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface AdminOrder {
  id: string;
  orderId: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
}

const FILTERS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
  { value: "cancelled", label: "Canceladas" },
  { value: "refunded", label: "Reembolsadas" },
];

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminOrdenesPage({ searchParams }: PageProps) {
  const { q = "", status = "all" } = await searchParams;

  const orders = await sanityFetch<AdminOrder[]>({
    query: adminOrdersQuery,
    params: { q, status },
    revalidate: 0,
    tags: ["order"],
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Pedidos
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Órdenes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "resultado" : "resultados"}
        </p>
      </header>

      <div className="space-y-4">
        <AdminSearch placeholder="Buscar por nombre, correo o ID…" />
        <FilterPills paramName="status" options={FILTERS} />
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
          No hay órdenes que coincidan con los filtros.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-4 py-3">Orden</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-right">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/ordenes/${o.orderId}`}
                        className="font-mono text-xs hover:text-primary"
                      >
                        #{o.orderId.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customerName || "—"}</p>
                      <p className="text-[11px] text-muted-foreground">{o.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString("es-MX", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{o.itemCount}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(o.total ?? 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/ordenes/${o.orderId}`}
                        className="text-xs font-medium text-primary hover:opacity-80"
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
