import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, { tone: string; label: string }> = {
  pending: {
    tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    label: "Pendiente",
  },
  approved: {
    tone: "bg-secondary/15 text-secondary",
    label: "Aprobado",
  },
  rejected: {
    tone: "bg-destructive/10 text-destructive",
    label: "Rechazado",
  },
  cancelled: {
    tone: "bg-muted text-muted-foreground",
    label: "Cancelado",
  },
  refunded: {
    tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    label: "Reembolsado",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const cfg = STATUS_STYLES[status] ?? {
    tone: "bg-muted text-muted-foreground",
    label: status,
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        cfg.tone,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}

export function StockBadge({ stock }: { stock: number | null | undefined }) {
  const n = stock ?? 0;
  if (n === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        Agotado
      </span>
    );
  }
  if (n <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        Bajo · {n}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-medium text-secondary">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {n} disp.
    </span>
  );
}
