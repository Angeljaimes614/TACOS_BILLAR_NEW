import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/sections/contact-form";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Visita nuestra showroom en CDMX o escríbenos por WhatsApp para asesoría.",
};

export default function ContactPage() {
  return (
    <Section spacing="md">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Contacto
            </p>
            <h1 className="mt-3 font-display text-display-lg font-semibold tracking-tight">
              Asesoría experta
            </h1>
            <p className="mt-4 text-muted-foreground">
              Dudas sobre flechas, juntas, peso o personalización. Respondemos en menos de 24
              horas.
            </p>

            <ul className="mt-10 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Ubicación</p>
                  <p className="text-muted-foreground">{SITE_CONFIG.contact.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Teléfono</p>
                  <a
                    href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, "")}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {SITE_CONFIG.contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Correo</p>
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Horario</p>
                  <ul className="text-muted-foreground">
                    {SITE_CONFIG.schedule.map((s) => (
                      <li key={s.day}>
                        {s.day}: {s.hours}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
