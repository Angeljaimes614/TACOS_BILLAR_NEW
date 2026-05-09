export const SITE_CONFIG = {
  name: "Maestro",
  tagline: "Tacos de billar y accesorios premium",
  description:
    "Tacos profesionales, estuches y accesorios para jugadores serios. Marcas seleccionadas como Predator, Mezz, McDermott y Aramith, con servicio de personalización.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    phone: "+52 55 4012 3344",
    email: "hola@maestrobillar.mx",
    address: "Av. Insurgentes Sur 1602, Crédito Constructor, CDMX",
  },
  schedule: [
    { day: "Lunes a viernes", hours: "11:00 — 21:00" },
    { day: "Sábado", hours: "11:00 — 20:00" },
    { day: "Domingo", hours: "12:00 — 18:00" },
  ],
  social: {
    instagram: "https://instagram.com/maestrobillar",
    facebook: "https://facebook.com/maestrobillar",
    youtube: "https://youtube.com/@maestrobillar",
    whatsapp: "https://wa.me/525540123344",
  },
  brands: ["Predator", "Mezz", "McDermott", "Cuetec", "Aramith", "Kamui", "Master"],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Tienda" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;
