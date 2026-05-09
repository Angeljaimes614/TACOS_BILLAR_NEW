import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-semibold text-primary">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Página no encontrada</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Esa bola se salió del paño. Vuelve a la portada y prueba con otra carambola.
      </p>
      <Link href="/" className="mt-8">
        <Button>Volver al inicio</Button>
      </Link>
    </Container>
  );
}
