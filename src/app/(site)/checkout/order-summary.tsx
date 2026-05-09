"use client";

import Image from "next/image";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";

export function OrderSummary() {
  const items = useCartStore((s) => s.items);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-7">
      <h2 className="font-display text-lg font-semibold tracking-tight">
        Tu pedido
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {items.length} {items.length === 1 ? "artículo" : "artículos"}
      </p>

      <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative aspect-[5/6] w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt ?? item.name}
                  fill
                  sizes="80px"
                  placeholder={item.imageLqip ? "blur" : "empty"}
                  blurDataURL={item.imageLqip ?? undefined}
                  className="object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/20 to-secondary/20 font-display text-base text-foreground/60"
                >
                  {item.brand.charAt(0)}
                </div>
              )}
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-foreground px-1.5 text-[10px] font-bold tabular-nums text-background">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {item.brand}
              </p>
              <p className="truncate text-sm font-medium leading-snug">
                {item.name}
              </p>
              <p className="mt-1 font-display text-sm font-semibold tabular-nums">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-border pt-6">
        <CartSummary />
      </div>
    </div>
  );
}
