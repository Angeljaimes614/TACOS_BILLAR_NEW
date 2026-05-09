import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Package,
  Tag,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge, StockBadge } from "@/components/admin/status-badge";
import { sanityFetch } from "@/sanity/lib/fetch";
import { adminStatsQuery } from "@/sanity/lib/queries";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface AdminStats {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
  onSale: number;
  activePromotions: number;
  pendingOrders: number;
  approvedOrders30d: number;
  revenue30d: number | null;
  lowStockProducts: Array<{
    id: string;
    slug: string;
    name: string;
    brand: string;
    category: string;
    stock: number;
    price: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderId: string;
    status: string;
    total: number;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    itemCount: number;
  }>;
}

export default async function AdminDashboard() {
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const stats = await sanityFetch<AdminStats>({
    query: adminStatsQuery,
    params: { since },
    revalidate: 60,
    tags: ["product", "promotion", "order"],
  });

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Dashboard
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Vista general
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Última actualización · {new Date().toLocaleString("es-MX")}. Métricas de los últimos 30 días.
        </p>
      </header>

      {/* KPIs principales */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ingresos 30d"
          value={formatCurrency(stats.revenue30d ?? 0)}
          icon={CircleDollarSign}
          tone="positive"
          hint={`${stats.approvedOrders30d} órdenes aprobadas`}
        />
        <StatCard
          label="Órdenes pendientes"
          value={stats.pendingOrders}
          icon={Clock}
          tone={stats.pendingOrders > 0 ? "warning" : "default"}
          href="/admin/ordenes?status=pending"
        />
        <StatCard
          label="Productos agotados"
          value={stats.outOfStock}
          icon={AlertTriangle}
          tone={stats.outOfStock > 0 ? "danger" : "default"}
          href="/admin/productos?filter=out"
        />
        <StatCard
          label="Stock bajo"
          value={stats.lowStock}
          icon={Boxes}
          tone={stats.lowStock > 0 ? "warning" : "default"}
          href="/admin/productos?filter=low"
        />
      </section>

      {/* KPIs secundarios */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Productos totales"
          value={stats.totalProducts}
          icon={Package}
          href="/admin/productos"
        />
        <StatCard
          label="Promociones activas"
          value={stats.activePromotions}
          icon={Tag}
          tone="primary"
          href="/admin/promociones?filter=active"
        />
        <StatCard
          label="Productos en oferta"
          value={stats.onSale}
          icon={TrendingUp}
          href="/admin/productos?filter=sale"
        />
      </section>

      {/* Tablas: stock bajo + órdenes recientes */}
      <section className="grid gap-6 lg:grid-cols-12">
        <Card title="Stock bajo / agotados" linkLabel="Ver todos" linkHref="/admin/productos?filter=low" className="lg:col-span-7">
          {stats.lowStockProducts.length === 0 ? (
            <EmptyState icon={CheckCircle2} message="Todo el stock se ve bien." tone="positive" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/studio/intent/edit/id=${p.id};type=product`}
                        target="_blank"
                        rel="noopener"
                        className="font-medium hover:text-primary"
                      >
                        {p.name}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <StockBadge stock={p.stock} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Órdenes recientes" linkLabel="Ver todas" linkHref="/admin/ordenes" className="lg:col-span-5">
          {stats.recentOrders.length === 0 ? (
            <EmptyState message="Aún no hay órdenes." />
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/ordenes/${o.orderId}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{o.customerName || "—"}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {o.customerEmail} · {o.itemCount} ítem{o.itemCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(o.total ?? 0)}
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function Card({
  title,
  children,
  linkHref,
  linkLabel,
  className,
}: {
  title: string;
  children: React.ReactNode;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-card ${className ?? ""}`}
    >
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
        {linkHref ? (
          <Link
            href={linkHref}
            className="text-xs font-medium text-primary hover:opacity-80"
          >
            {linkLabel ?? "Ver más"} →
          </Link>
        ) : null}
      </header>
      {children}
    </div>
  );
}

function EmptyState({
  icon: Icon = Package,
  message,
  tone = "default",
}: {
  icon?: React.ComponentType<{ className?: string }>;
  message: string;
  tone?: "default" | "positive";
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <Icon
        className={`h-6 w-6 ${tone === "positive" ? "text-secondary" : "text-muted-foreground"}`}
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
