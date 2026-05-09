"use client";

import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
import { useCartStore } from "@/lib/store/cart-store";

export function CheckoutClient() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return <Skeleton />;
  }

  if (items.length === 0) {
    return (
      <Section spacing="md">
        <Container size="md" className="text-center">
          <h1 className="font-display text-display-md font-semibold tracking-tight">
            Tu carrito está vacío
          </h1>
          <p className="mt-3 text-muted-foreground">
            Agrega algún producto antes de pasar al checkout.
          </p>
          <Link href="/productos" className="mt-8 inline-block">
            <Button size="lg">Ir a la tienda</Button>
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="md">
      <Container>
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Checkout
          </p>
          <h1 className="mt-3 font-display text-display-lg font-semibold tracking-tight">
            Completa tu pedido
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pago seguro procesado por Mercado Pago. Tus datos viajan cifrados.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <OrderSummary />
              <ul className="mt-6 grid gap-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-secondary" />
                  Conexión cifrada de extremo a extremo
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                  Mercado Pago no comparte tus datos de tarjeta
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function Skeleton() {
  return (
    <Section spacing="md">
      <Container>
        <div className="h-10 w-56 animate-pulse rounded-xl bg-muted" />
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/60" />
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="h-80 animate-pulse rounded-3xl bg-muted/60" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
