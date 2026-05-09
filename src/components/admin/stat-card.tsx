import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  default: "bg-muted text-foreground/70",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
  positive: "bg-secondary/15 text-secondary",
  primary: "bg-primary/15 text-primary",
} as const;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: keyof typeof TONES;
  href?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
  href,
}: StatCardProps) {
  const body = (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300",
        href && "hover:-translate-y-0.5 hover:shadow-soft-lg",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl",
            TONES[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        {href ? (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        ) : null}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 font-display text-3xl font-semibold tabular-nums tracking-tight">
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {body}
      </Link>
    );
  }
  return body;
}
