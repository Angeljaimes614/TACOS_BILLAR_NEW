import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Mail, MapPin, Phone, Receipt } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { sanityFetch } from "@/sanity/lib/fetch";
import { adminOrderByIdQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin · Detalle de orden",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface AdminOrderDetail {
  id: string;
  orderId: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  paymentId?: string | null;
  preferenceId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  customer: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    notes?: string;
    address?: {
      street?: string;
      number?: string;
      apartment?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
  items: Array<{
    productId: string;
    name: string;
    brand?: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    slug?: string;
    image?: {
      alt?: string;
      asset?: { _id: string; url: string; lqip?: string | null };
    } | null;
  }>;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await sanityFetch<AdminOrderDetail | null>({
    query: adminOrderByIdQuery,
    params: { orderId: id },
    revalidate: 0,
    tags: ["order"],
  });

  if (!order) notFound();

  const fullName = [order.customer?.firstName, order.customer?.lastName]
    .filter(Boolean)
    .join(" ");
  const addr = order.customer?.address;
  const fullAddress = addr
    ? [
        [addr.street, addr.number].filter(Boolean).join(" "),
        addr.apartment ? `Int. ${addr.apartment}` : null,
        addr.neighborhood,
        [addr.city, addr.state, addr.zip].filter(Boolean).join(", "),
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  return (
    <div className="space-y-8">
      <Link
        href="/admin/ordenes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a órdenes
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Orden{" "}
            <code className="font-mono text-foreground">
              #{order.orderId.slice(0, 8)}
            </code>
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {fullName || order.customer?.email || "Cliente"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Creada el{" "}
            {new Date(order.createdAt).toLocaleString("es-MX", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={order.status} className="text-xs" />
          <Link
            href={`/studio/intent/edit/id=${order.id};type=order`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            Abrir en Studio
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <header className="border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-semibold tracking-tight">
                Productos
              </h2>
            </header>
            <ul className="divide-y divide-border">
              {order.items.map((it) => {
                const imageUrl = it.image?.asset
                  ? urlFor(it.image)?.width(120).height(150).url()
                  : null;
                return (
                  <li key={it.productId} className="flex gap-4 px-5 py-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={it.image?.alt ?? it.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/20 to-secondary/20 font-display text-base font-semibold text-foreground/60">
                          {it.brand?.charAt(0) ?? "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {it.brand}
                        </p>
                        {it.slug ? (
                          <Link
                            href={`/productos/${it.slug}`}
                            target="_blank"
                            rel="noopener"
                            className="block truncate text-sm font-medium hover:text-primary"
                          >
                            {it.name}
                          </Link>
                        ) : (
                          <p className="truncate text-sm font-medium">{it.name}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {it.quantity} × {formatCurrency(it.unitPrice)}
                        </p>
                      </div>
                      <p className="text-right font-display text-base font-semibold tabular-nums">
                        {formatCurrency(it.lineTotal)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <dl className="mt-6 space-y-2 rounded-2xl border border-border bg-card p-6 text-sm">
            <Row label="Subtotal" value={formatCurrency(order.subtotal ?? 0)} />
            <Row
              label="Envío"
              value={
                (order.shipping ?? 0) === 0
                  ? "Gratis"
                  : formatCurrency(order.shipping ?? 0)
              }
            />
            <div className="!mt-3 border-t border-border pt-3">
              <div className="flex items-baseline justify-between">
                <dt className="font-display text-base font-semibold">Total</dt>
                <dd className="font-display text-2xl font-semibold tabular-nums">
                  {formatCurrency(order.total ?? 0)}
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <aside className="space-y-6 lg:col-span-4">
          <Card title="Cliente">
            <ul className="space-y-3 text-sm">
              {order.customer?.email ? (
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="hover:text-primary"
                  >
                    {order.customer.email}
                  </a>
                </li>
              ) : null}
              {order.customer?.phone ? (
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="hover:text-primary"
                  >
                    {order.customer.phone}
                  </a>
                </li>
              ) : null}
              {fullAddress ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{fullAddress}</span>
                </li>
              ) : null}
            </ul>
            {order.customer?.notes ? (
              <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs italic text-muted-foreground">
                “{order.customer.notes}”
              </p>
            ) : null}
          </Card>

          <Card title="Pago">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Receipt className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    ID Mercado Pago
                  </p>
                  <p className="break-all font-mono text-xs">
                    {order.paymentId ?? "—"}
                  </p>
                </div>
              </li>
              {order.paidAt ? (
                <li className="text-xs text-muted-foreground">
                  Pagada el{" "}
                  {new Date(order.paidAt).toLocaleString("es-MX", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </li>
              ) : null}
              {order.preferenceId ? (
                <li className="text-[11px] text-muted-foreground">
                  Pref:{" "}
                  <code className="font-mono">{order.preferenceId.slice(0, 16)}…</code>
                </li>
              ) : null}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="border-b border-border px-5 py-4">
        <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}
