"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { selectCartCount, useCartStore } from "@/lib/store/cart-store";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const clear = useCartStore((s) => s.clear);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <Section spacing="md">
        <Container size="md">
          <EmptyCart />
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="md">
      <Container>
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Carrito
          </p>
          <h1 className="mt-3 font-display text-display-lg font-semibold tracking-tight">
            Tu selección
          </h1>
          <p className="mt-3 text-muted-foreground">
            {count} {count === 1 ? "artículo" : "artículos"} listos para enviar.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ul className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} variant="full" />
                ))}
              </AnimatePresence>
            </ul>

            <button
              type="button"
              onClick={clear}
              className="mt-6 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Vaciar carrito
            </button>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Resumen
              </h2>
              <div className="mt-5">
                <CartSummary />
              </div>
              <Link href="/checkout" className="mt-6 block">
                <Button size="lg" className="w-full">
                  Ir a checkout
                </Button>
              </Link>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Pagos protegidos · Devoluciones gratuitas en 14 días
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function CartSkeleton() {
  return (
    <Section spacing="md">
      <Container>
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-muted/60" />
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="h-72 animate-pulse rounded-3xl bg-muted/60" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
