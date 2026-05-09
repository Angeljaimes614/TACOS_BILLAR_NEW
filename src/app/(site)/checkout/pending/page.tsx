import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PendingClient } from "./pending-client";

export const metadata: Metadata = {
  title: "Pago pendiente",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function PendingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <Section spacing="md">
      <Container size="md" className="text-center">
        <PendingClient orderId={params.order} />
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
          <Link
            href="/contacto"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Tengo una duda
          </Link>
        </div>
      </Container>
    </Section>
  );
}
