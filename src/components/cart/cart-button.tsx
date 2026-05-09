"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { selectCartCount, useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

interface CartButtonProps {
  variant?: "icon" | "full";
  className?: string;
}

/**
 * Detonador del CartSheet con badge de cantidad.
 *
 * Render condicional del badge gobernado por `hasHydrated` para evitar
 * mismatch entre SSR (items=[]) y el estado real cargado de localStorage.
 */
export function CartButton({ variant = "icon", className }: CartButtonProps) {
  const open = useCartStore((s) => s.open);
  const count = useCartStore(selectCartCount);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const showBadge = hasHydrated && count > 0;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label={`Abrir carrito${showBadge ? ` con ${count} artículos` : ""}`}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium transition-colors hover:bg-muted",
          className,
        )}
      >
        <span className="relative inline-flex">
          <ShoppingBag className="h-4 w-4" />
          <Badge show={showBadge} count={count} compact />
        </span>
        Carrito
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Abrir carrito${showBadge ? ` con ${count} artículos` : ""}`}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      <ShoppingBag className="h-5 w-5" />
      <Badge show={showBadge} count={count} />
    </button>
  );
}

function Badge({
  show,
  count,
  compact = false,
}: {
  show: boolean;
  count: number;
  compact?: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 480, damping: 26 }}
          className={cn(
            "absolute grid place-items-center rounded-full bg-primary text-[10px] font-bold tabular-nums leading-none text-primary-foreground ring-2 ring-background",
            compact
              ? "-right-1.5 -top-1.5 h-4 min-w-[1rem] px-1"
              : "right-1 top-1 h-5 min-w-[1.25rem] px-1.5",
          )}
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
