"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Sparkles, CreditCard } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Envío gratis en pedidos +$5,000 MXN" },
  { icon: CreditCard, label: "Hasta 18 MSI con tarjetas participantes" },
  { icon: ShieldCheck, label: "Garantía oficial 2 años en tacos profesionales" },
  { icon: Sparkles, label: "Personaliza tu taco con tus iniciales grabadas" },
];

export function PromoBanner() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-border bg-foreground text-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-foreground to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-foreground to-transparent"
      />
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap py-3.5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2.5 text-sm font-medium tracking-wide text-background/85"
          >
            <item.icon className="h-4 w-4 text-primary" />
            {item.label}
            <span aria-hidden className="ml-12 text-primary/60">
              ◆
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
