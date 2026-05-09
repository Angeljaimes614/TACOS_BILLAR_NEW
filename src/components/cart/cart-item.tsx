"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { type CartLine, useCartStore } from "@/lib/store/cart-store";
import { cn, formatCurrency } from "@/lib/utils";

interface CartItemProps {
  item: CartLine;
  variant?: "compact" | "full";
  onNavigate?: () => void;
}

export function CartItem({ item, variant = "compact", onNavigate }: CartItemProps) {
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeItem = useCartStore((s) => s.removeItem);

  const lineTotal = item.price * item.quantity;
  const lineOriginal = (item.originalPrice ?? item.price) * item.quantity;
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const atMaxStock =
    typeof item.maxStock === "number" && item.quantity >= item.maxStock;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 24, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className={cn(
        "flex gap-4 rounded-2xl border border-border/60 bg-card p-3",
        variant === "full" && "p-5",
      )}
    >
      <Link
        href={`/productos/${item.slug}`}
        onClick={onNavigate}
        className="relative aspect-[5/6] w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-24"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.imageAlt ?? item.name}
            fill
            sizes="120px"
            placeholder={item.imageLqip ? "blur" : "empty"}
            blurDataURL={item.imageLqip ?? undefined}
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/20 to-secondary/20 font-display text-2xl text-foreground/60"
          >
            {item.brand.charAt(0)}
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {item.brand}
            </p>
            <Link
              href={`/productos/${item.slug}`}
              onClick={onNavigate}
              className="mt-0.5 block truncate font-display text-sm font-semibold leading-tight tracking-tight hover:text-primary"
            >
              {item.name}
            </Link>
            {item.category ? (
              <p className="mt-1 truncate text-xs text-muted-foreground">{item.category}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Eliminar ${item.name} del carrito`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityControl
            quantity={item.quantity}
            atMax={atMaxStock}
            onDecrement={() => decrement(item.id)}
            onIncrement={() => increment(item.id)}
          />

          <div className="text-right">
            <p className="font-display text-base font-semibold tabular-nums">
              {formatCurrency(lineTotal)}
            </p>
            {hasDiscount ? (
              <p className="text-xs text-muted-foreground line-through tabular-nums">
                {formatCurrency(lineOriginal)}
              </p>
            ) : null}
          </div>
        </div>

        {atMaxStock ? (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Stock máximo alcanzado ({item.maxStock})
          </p>
        ) : null}
      </div>
    </motion.li>
  );
}

function QuantityControl({
  quantity,
  atMax,
  onDecrement,
  onIncrement,
}: {
  quantity: number;
  atMax?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background">
      <QuantityButton
        onClick={onDecrement}
        ariaLabel="Disminuir cantidad"
      >
        <Minus className="h-3.5 w-3.5" />
      </QuantityButton>
      <span
        aria-live="polite"
        className="min-w-[2ch] px-1 text-center text-sm font-semibold tabular-nums"
      >
        {quantity}
      </span>
      <QuantityButton
        onClick={onIncrement}
        ariaLabel="Aumentar cantidad"
        disabled={atMax}
      >
        <Plus className="h-3.5 w-3.5" />
      </QuantityButton>
    </div>
  );
}

function QuantityButton({
  children,
  onClick,
  ariaLabel,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </motion.button>
  );
}
