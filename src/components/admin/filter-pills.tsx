"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterPillsProps {
  paramName?: string;
  options: FilterOption[];
  /** Valor que cuenta como "todos". Por default `"all"` o `""`. */
  defaultValue?: string;
}

export function FilterPills({
  paramName = "filter",
  options,
  defaultValue = "all",
}: FilterPillsProps) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.get(paramName) ?? defaultValue;

  const buildHref = (value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value === defaultValue) {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav
      aria-label="Filtros"
      className="flex flex-wrap gap-2 overflow-x-auto pb-1"
    >
      {options.map((opt) => {
        const active = current === opt.value;
        return (
          <Link
            key={opt.value}
            href={buildHref(opt.value)}
            scroll={false}
            className={cn(
              "inline-flex items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-warm"
                : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-foreground",
            )}
          >
            {opt.label}
            {typeof opt.count === "number" ? (
              <span
                className={cn(
                  "ml-1.5 tabular-nums",
                  active ? "opacity-80" : "text-muted-foreground",
                )}
              >
                {opt.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
