"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

interface EmptyCartProps {
  className?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmptyCart({
  className,
  ctaHref = "/productos",
  ctaLabel = "Ir a la tienda",
}: EmptyCartProps) {
  const close = useCartStore((s) => s.close);
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
        <ShoppingBag className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
        Tu carrito está vacío
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Aún no has agregado nada. Echa un ojo a la tienda y arma tu setup.
      </p>
      <Link href={ctaHref} onClick={close} className="mt-8">
        <Button size="lg">{ctaLabel}</Button>
      </Link>
    </div>
  );
}
