import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "La historia detrás de Maestro: jugadores curando equipo profesional para la comunidad billarista de México.",
};

export default function AboutPage() {
  return (
    <Section spacing="md">
      <Container size="md">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Nuestra historia
        </p>
        <h1 className="mt-3 font-display text-display-lg font-semibold tracking-tight">
          Jugadores curando equipo para jugadores
        </h1>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            Maestro nació en 2018 cuando Andrés y Lucía, ambos jugadores de pool desde
            adolescentes, se cansaron de comprar tacos profesionales con dos meses de espera y
            cero asesoría real.
          </p>
          <p>
            Hoy somos distribuidores oficiales de <strong>Predator, Mezz, McDermott, Cuetec,
            Aramith</strong> y <strong>Kamui</strong> en México. Probamos cada modelo antes de
            traerlo, ofrecemos personalización en sitio y enviamos con seguro a toda la
            república.
          </p>
          <p>
            Creemos en pagar precios justos a las marcas, asesorar sin esnobismo y construir una
            comunidad alrededor del juego — no solo del producto.
          </p>
        </div>
      </Container>
    </Section>
  );
}
