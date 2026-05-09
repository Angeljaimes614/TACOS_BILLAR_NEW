import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FailureClient } from "./failure-client";

export const metadata: Metadata = {
  title: "Pago no completado",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ order?: string; status?: string }>;
}

export default async function FailurePage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <Section spacing="md">
      <Container size="md" className="text-center">
        <FailureClient orderId={params.order} status={params.status} />
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/checkout">
            <Button>
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </Button>
          </Link>
          <Link
            href="/contacto"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Necesito ayuda
          </Link>
        </div>
      </Container>
    </Section>
  );
}
