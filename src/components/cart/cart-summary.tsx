"use client";

import { Truck } from "lucide-react";
import {
  SHIPPING_THRESHOLD_MXN,
  selectCartSavings,
  selectCartSubtotal,
  selectCartTotal,
  selectShipping,
  useCartStore,
} from "@/lib/store/cart-store";
import { cn, formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  className?: string;
}

export function CartSummary({ className }: CartSummaryProps) {
  const subtotal = useCartStore(selectCartSubtotal);
  const shipping = useCartStore(selectShipping);
  const total = useCartStore(selectCartTotal);
  const savings = useCartStore(selectCartSavings);

  const remaining = Math.max(0, SHIPPING_THRESHOLD_MXN - subtotal);
  const progress = Math.min(100, (subtotal / SHIPPING_THRESHOLD_MXN) * 100);
  const freeShippingUnlocked = subtotal > 0 && remaining === 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-primary" />
          {freeShippingUnlocked ? (
            <span className="font-medium">¡Envío gratis desbloqueado!</span>
          ) : (
            <span>
              Te faltan{" "}
              <span className="font-semibold tabular-nums">{formatCurrency(remaining)}</span>{" "}
              para envío gratis
            </span>
          )}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        {savings > 0 ? (
          <Row
            label="Descuentos"
            value={`− ${formatCurrency(savings)}`}
            tone="positive"
          />
        ) : null}
        <Row
          label="Envío"
          value={shipping === 0 ? "Gratis" : formatCurrency(shipping)}
          tone={shipping === 0 ? "positive" : "default"}
        />
        <div className="!mt-4 border-t border-border pt-4">
          <div className="flex items-baseline justify-between">
            <dt className="font-display text-base font-semibold">Total</dt>
            <dd className="font-display text-2xl font-semibold tabular-nums">
              {formatCurrency(total)}
            </dd>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">IVA incluido · MXN</p>
        </div>
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive";
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "tabular-nums",
          tone === "positive" ? "font-medium text-secondary" : "font-medium text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
