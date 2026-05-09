/**
 * Wrapper "admin": no aplica navbar/footer del sitio.
 * Sub-layouts (`login/`, `(panel)/`) deciden qué chrome agregar.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-muted/30">{children}</div>;
}
