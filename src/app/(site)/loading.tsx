export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
      </div>
    </div>
  );
}
