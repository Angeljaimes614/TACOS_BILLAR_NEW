import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin · Iniciar sesión",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brass font-display text-xl font-bold text-walnut-900 shadow-warm">
            M
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            Panel administrativo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acceso restringido al equipo de Maestro.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
