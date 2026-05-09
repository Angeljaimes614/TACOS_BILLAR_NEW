"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  ExternalLink,
  LogOut,
  Receipt,
  Sparkles,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: BarChart3, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Box },
  { href: "/admin/ordenes", label: "Órdenes", icon: Receipt },
  { href: "/admin/promociones", label: "Promociones", icon: Tag },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5 p-3" aria-label="Admin">
      <p className="mb-2 px-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Operación
      </p>
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}

      <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Atajos
      </p>
      <Link
        href="/studio"
        target="_blank"
        rel="noopener"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
      >
        <Sparkles className="h-4 w-4" />
        Sanity Studio
        <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-50" />
      </Link>
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
      >
        <ExternalLink className="h-4 w-4" />
        Ver tienda
      </Link>
    </nav>
  );
}

export function LogoutButton({ className }: { className?: string }) {
  const [pending, setPending] = React.useState(false);
  async function onClick() {
    setPending(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
    >
      <LogOut className="h-4 w-4" />
      {pending ? "Cerrando…" : "Cerrar sesión"}
    </button>
  );
}
