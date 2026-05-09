import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border bg-card text-card-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-warm font-bold text-primary-foreground shadow-warm">
              M
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SITE_CONFIG.description}
          </p>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              Navegar
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/carrito" className="transition-colors hover:text-primary">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{SITE_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-primary"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="transition-colors hover:text-primary"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              Horario
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {SITE_CONFIG.schedule.map((s) => (
                <li key={s.day}>
                  <span className="block font-medium text-foreground">{s.day}</span>
                  <span>{s.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {SITE_CONFIG.name}. Precisión, fieltro y código.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={SITE_CONFIG.social.instagram}
              aria-label="Instagram"
              className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </Link>
            <Link
              href={SITE_CONFIG.social.facebook}
              aria-label="Facebook"
              className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link
              href={SITE_CONFIG.social.whatsapp}
              aria-label="WhatsApp"
              className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary"
            >
              <Phone className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
