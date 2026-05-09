import type { Metadata } from "next";
import { SuccessView } from "./success-view";

export const metadata: Metadata = {
  title: "Pago aprobado",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{
    order?: string;
    payment_id?: string;
    status?: string;
    external_reference?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <SuccessView
      orderId={params.order ?? params.external_reference}
      paymentId={params.payment_id}
    />
  );
}
