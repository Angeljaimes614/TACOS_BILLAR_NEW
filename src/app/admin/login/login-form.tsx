"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, inputClass } from "@/components/ui/form-field";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "No pudimos iniciar sesión");
      }
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-7"
    >
      <FormField
        label="Contraseña"
        htmlFor="password"
        required
        error={error ?? undefined}
      >
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={!!error}
            className={`${inputClass} pl-11`}
          />
        </div>
      </FormField>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando…
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
