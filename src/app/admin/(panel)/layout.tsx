import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin/auth";
import { AdminNav, LogoutButton } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

/**
 * Layout protegido. Si no hay sesión válida redirige a /admin/login.
 */
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brass font-display text-base font-bold text-walnut-900 shadow-warm">
              M
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold tracking-tight">Maestro</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Admin panel
              </p>
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminNav />
        </div>
        <div className="border-t border-border p-3">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brass font-display text-sm font-bold text-walnut-900">
              M
            </span>
            <span className="font-display text-sm font-semibold">Admin</span>
          </Link>
          <LogoutButton className="!w-auto" />
        </header>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
