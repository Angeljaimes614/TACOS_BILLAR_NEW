/**
 * Layout dedicado para el Studio.
 * Permite que `NextStudio` se monte sin la navbar/footer del sitio público.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
