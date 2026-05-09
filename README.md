# Maestro · Tacos de billar

Tienda web premium con CMS embebido. Stack:

- **Next.js 15** (App Router · Server Components · Turbopack)
- **TypeScript** estricto + aliases `@/*`
- **Tailwind CSS 3.4** (HSL theming, dark mode por clase, paleta brass / felt / walnut / ivory)
- **Framer Motion** para animaciones de scroll, stagger y hover
- **Sanity v3** como CMS embebido en `/studio`, con CRUD completo de productos, categorías, marcas y promociones
- **next-sanity** para client tipado, queries GROQ y revalidación ISR vía webhooks
- **next-themes**, **lucide-react**, **CVA + clsx + tailwind-merge**, ESLint flat + Prettier

---

## Arranque rápido

```powershell
# 1. Instala dependencias (incluye Sanity, Framer Motion, etc.)
npm install   # si peers chocan: npm install --legacy-peer-deps

# 2. Crea un proyecto en https://www.sanity.io/manage
#    Copia el Project ID y elige dataset "production".

# 3. Variables de entorno
copy .env.example .env.local
#    Edita .env.local y rellena:
#    NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
#    NEXT_PUBLIC_SANITY_DATASET=production
#    SANITY_API_READ_TOKEN=skXXXX  (Sanity → API → Tokens → Viewer)
#    SANITY_REVALIDATE_SECRET=$(openssl rand -base64 32)

# 4. Importa el catálogo de demo (categorías, marcas, productos, promos)
npm run sanity:seed
#    Equivale a: sanity dataset import sanity/seed.ndjson production --replace

# 5. Levanta el sitio (Studio incluido en /studio)
npm run dev
```

- Sitio: http://localhost:3000
- Studio (admin): http://localhost:3000/studio

---

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Sitio + Studio en `localhost:3000` |
| `npm run build` | Build de producción |
| `npm run start` | Sirve build de producción |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier |
| `npm run sanity:dev` | Studio en standalone (puerto 3333) |
| `npm run sanity:build` | Build estático del Studio |
| `npm run sanity:deploy` | Despliega Studio a `<host>.sanity.studio` |
| `npm run sanity:seed` | Importa `sanity/seed.ndjson` al dataset |
| `npm run sanity:typegen` | Extrae schema y genera tipos TS desde GROQ |

---

## Estructura del proyecto

```
.
├── sanity.config.ts            # Configuración del Studio (basePath /studio)
├── sanity.cli.ts               # Configuración del CLI de Sanity
├── sanity/
│   └── seed.ndjson             # Catálogo demo importable con sanity:seed
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (html/body, fuentes, ThemeProvider)
│   │   ├── globals.css
│   │   ├── (site)/             # Sitio público — Navbar + Footer
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Home (fetch a Sanity)
│   │   │   ├── productos/      # Catálogo + filtro por categoría
│   │   │   ├── nosotros/, contacto/, carrito/
│   │   │   ├── loading.tsx, not-found.tsx
│   │   ├── studio/[[...tool]]/ # Sanity Studio embebido
│   │   └── api/revalidate/     # Webhook de Sanity → revalidateTag
│   ├── components/
│   │   ├── ui/                 # Button, Card, Badge, Container, Section, ProductCard, ThemeToggle
│   │   ├── layout/             # Navbar, Footer, NewsletterForm
│   │   ├── motion/             # FadeInUp, Stagger primitives Framer Motion
│   │   ├── sections/           # Hero, PromoBanner, Categories, FeaturedProducts, Promotions, CTA, ContactForm
│   │   └── providers/          # ThemeProvider
│   ├── sanity/
│   │   ├── env.ts              # Variables de entorno tipadas
│   │   ├── structure.ts        # Sidebar custom del Studio
│   │   ├── schemaTypes/        # product, category, brand, promotion
│   │   └── lib/                # client, image (urlFor), fetch (ISR + tags), queries (GROQ), types
│   ├── lib/                    # cn, formatCurrency, slugify, constants
│   ├── hooks/                  # use-mounted
│   └── types/                  # re-exports desde sanity/lib/types
└── tailwind.config.ts
```

---

## CMS · Sanity

### Schemas

Definidos en `src/sanity/schemaTypes/`. Cada documento tiene grupos, validaciones, previews y orderings.

| Tipo | Propósito | Campos clave |
| --- | --- | --- |
| `product` | Producto | name, slug, brand (ref), category (ref), shortDescription, description (PT), images[] (hotspot + alt), price, discount, stock, rating, reviewCount, isNew/isBestSeller/isFeatured, specs[], seo |
| `category` | Categoría | title, slug, blurb, icon (lucide), image, order |
| `brand` | Marca | name, slug, logo, description, website |
| `promotion` | Promoción | title, subtitle, description, badge, image, discountPercent, startDate, endDate (validación cruzada), cta {label, href}, category (ref), products[] (ref), isFeatured, order |

### Studio

El Studio se monta en `src/app/studio/[[...tool]]/` y queda disponible en `/studio` sin Navbar/Footer (route group `(site)` aísla el cascarón público).

`structure.ts` reorganiza el sidebar: Productos → Categorías → Marcas → Promociones, con orderings por defecto.

### Fetch tipado en el frontend

`src/sanity/lib/fetch.ts` envuelve `client.fetch` con caché de Next.js:

```ts
import { sanityFetch } from "@/sanity/lib/fetch"
import { allProductsQuery } from "@/sanity/lib/queries"
import type { Product } from "@/types"

const products = await sanityFetch<Product[]>({
  query: allProductsQuery,
  tags: ["product"],     // invalidate por _type
  revalidate: 60,        // ISR — 60s por defecto
})
```

Las queries (`src/sanity/lib/queries.ts`) usan `defineQuery` y un fragmento `PRODUCT_FRAGMENT` reutilizable para mantener proyecciones consistentes.

### Imágenes

`urlFor()` (`src/sanity/lib/image.ts`) construye URLs optimizadas. `cdn.sanity.io` ya está permitido en `next.config.ts`, así que `next/image` funciona out-of-the-box. `ProductCard` usa `placeholder="blur"` con LQIP que viene en la proyección (`metadata.lqip`).

### Revalidación con webhooks

`src/app/api/revalidate/route.ts` recibe webhooks GROQ de Sanity y dispara `revalidateTag(_type)`. Configurar en Sanity → API → Webhooks:

```
URL:        https://<dominio>/api/revalidate
Trigger:    Create / Update / Delete
Filter:     _type in ["product", "category", "brand", "promotion"]
Projection: { _type, _id, "slug": slug }
Secret:     valor de SANITY_REVALIDATE_SECRET
```

Cuando se publica un cambio, Next invalida sólo las cachés con ese tag — sin rebuilds.

### Generación de tipos (opcional)

```bash
npm run sanity:typegen
```

Crea `sanity.types.ts` a partir de `sanity.config.ts` + las queries con `defineQuery`. Puedes reemplazar `src/sanity/lib/types.ts` por imports de los tipos generados.

---

## Sistema de diseño

### Paleta (HSL tokens)

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| `primary` | brass `#b8915a` | brass claro `#d4ad6f` | CTAs, badges premium |
| `secondary` | felt green `#1f6b4f` | felt claro `#2c8268` | acentos, status |
| `accent` | ivory `#f4ebd9` | walnut oscuro | superficies cálidas |
| `background` | marfil `#f6f1e6` | charcoal `#0e0d0b` | fondo |
| `foreground` | walnut deep | ivory | texto |

Escalas decorativas: `brass-50..900`, `felt-*`, `walnut-*`, `ivory-*`. Gradientes `bg-gradient-brass`, `bg-gradient-felt`, `bg-felt-cloth`.

### Tipografía

- `font-display` → Playfair Display (titulares editoriales)
- `font-sans` → Inter (UI)
- `font-script` → Caveat (acentos manuscritos)

### Animaciones (Framer Motion)

- `FadeInUp` — wrapper `whileInView` con cubic-bezier custom
- `Stagger` + `StaggerItem` — revelado escalonado de grids
- `whileHover` con spring en cards de producto y promo

### Componentes reutilizables

- `Button` (CVA, 6 variantes × 4 tamaños)
- `ProductCard` con imagen Sanity + LQIP + fallback SVG
- `Card`, `Badge`, `Container` (polimórfico), `Section` (espaciados)
- `ThemeToggle` SSR-safe

---

## Mejores prácticas aplicadas

1. **Server Components por defecto.** `"use client"` solo donde hay estado/eventos/Framer Motion.
2. **Route groups** `(site)` aísla el chrome del Studio sin duplicar layouts.
3. **GROQ con fragmentos** para mantener proyecciones consistentes y tipos derivables.
4. **`sanityFetch` + tags** en lugar de revalidación por tiempo plano — invalidación quirúrgica vía webhook.
5. **`useCdn: true`** para lecturas públicas; el read token sólo se usa cuando se requiera draft mode.
6. **LQIP automático** desde `metadata.lqip` para placeholders de imagen sin trabajo extra.
7. **Validación en schema** (Rule API) — precios ≥ 0, descuento 0–99, `endDate > startDate`, etc.
8. **Previews ricas** en Studio que muestran precio formateado MXN, descuento aplicado y stock.
9. **Aliases TS** (`@/*`) y tipos centralizados en `@/types`.
10. **Accesibilidad** en navbar (`aria-expanded`, `aria-controls`), foco visible, `alt` requerido en imágenes.

---

## Cómo extender

- **Nuevo schema**: crea `src/sanity/schemaTypes/<tipo>.ts`, exporta y añádelo a `schemaTypes/index.ts`.
- **Nueva query**: en `src/sanity/lib/queries.ts` con `defineQuery` y proyección tipada; consume con `sanityFetch`.
- **Página de detalle de producto**: crea `src/app/(site)/productos/[slug]/page.tsx` y consume `productBySlugQuery` + `productSlugsQuery` para `generateStaticParams`.
- **Live preview** (draft mode): añade un cliente con `perspective: "previewDrafts"` y un read token, e implementa `next-sanity/live`.
- **Pagos**: descomenta variables Stripe en `.env.example` y monta `/api/checkout`.

---

## Producción · checklist final

### SEO

- `app/sitemap.ts` genera el sitemap con todos los productos, categorías y rutas estáticas. ISR cada hora.
- `app/robots.ts` bloquea `/admin`, `/studio`, `/api`, `/checkout` y `/carrito`.
- `app/manifest.ts` para PWA básica.
- `app/opengraph-image.tsx` (edge runtime) genera la imagen OG default 1200×630.
- Cada página de producto genera su propio OG con `generateMetadata` usando la imagen del producto.
- JSON-LD `Organization` + `WebSite` (con SearchAction) en el root layout.
- JSON-LD `Product` + `BreadcrumbList` por producto en `/productos/[slug]`.
- `formatDetection` desactivado en el layout (evita iOS auto-formatting).
- `googleBot` con `max-image-preview: large` y `max-snippet: -1`.

### Performance

- ISR + caché por tags: `revalidateTag('product')` desde el webhook de Sanity.
- `next/image` AVIF/WebP, `minimumCacheTTL: 7d`, LQIP automático en cards.
- `optimizePackageImports`: lucide-react, framer-motion, @sanity/icons.
- Cache `immutable` en `/_next/static/*`.
- Páginas de producto pre-renderizadas con `generateStaticParams`.
- Edge runtime para la OG image.

### Seguridad

- Headers globales: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` (HSTS preload), `Permissions-Policy` cerrando camera/microphone/geolocation.
- Rate limit en `/api/admin/login` (8 intentos / minuto / IP, devuelve 429 con `Retry-After`).
- Cookie de admin: `httpOnly` + `secure` + `sameSite: lax` + HMAC SHA-256 con secreto rotable.
- Verificación de firma HMAC en webhooks de Sanity y Mercado Pago (timing-safe + ventana anti-replay).
- Schema validation en cada API route (Zod) — precios siempre se recalculan en server desde Sanity.
- `poweredByHeader: false`, `productionBrowserSourceMaps: false`.

### Accesibilidad

- Skip link `Saltar al contenido` visible al recibir foco.
- `lang="es-MX"` en `<html>`, `aria-modal` en sheet del carrito, `role="dialog"`, `aria-live` en quantity controls.
- `alt` requerido en schema de imágenes de Sanity.
- `aria-invalid` + ring rojo en formularios.
- Focus visible heredado del sistema con `focus-visible:ring-ring`.

### Error boundaries

- `app/error.tsx` para errores de página (con `reset()`).
- `app/global-error.tsx` para fallas del root layout.
- `notFound()` en producto inexistente.

### Variables requeridas en producción

```bash
NEXT_PUBLIC_SITE_URL=https://maestrobillar.mx
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=...     # Viewer
SANITY_API_WRITE_TOKEN=...    # Editor (órdenes + decremento de stock)
SANITY_REVALIDATE_SECRET=...  # firma webhook Sanity → /api/revalidate
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_WEBHOOK_SECRET=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

---

## Deploy en Vercel

```bash
# 1. Vincular el repo
npx vercel link

# 2. Subir variables desde .env.local
vercel env pull .env.production.local
# o configurarlas vía dashboard: https://vercel.com/<team>/<project>/settings/environment-variables

# 3. Deploy
vercel --prod
```

`vercel.json` ya configura:

- `regions: ["iad1"]` — más cercano a México de los planes free/pro
- `maxDuration: 15s` para `/api/checkout/preference` y `/api/checkout/webhook` (necesario por la llamada a Mercado Pago)
- `maxDuration: 10s` para `/api/revalidate`

Después del deploy:

1. **Sanity webhook** → URL: `https://<dominio>/api/revalidate`, filter: `_type in ["product","category","brand","promotion","order"]`, secret: `SANITY_REVALIDATE_SECRET`.
2. **Mercado Pago webhook** → URL: `https://<dominio>/api/checkout/webhook`, eventos: `payment.created` + `payment.updated`, secreto: `MERCADOPAGO_WEBHOOK_SECRET`.
3. **Studio** → ya queda en `https://<dominio>/studio`. Para Studio standalone, `npm run sanity:deploy`.
4. **Crear el primer admin**: configura `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET`, y entra en `https://<dominio>/admin/login`.

### Hardening adicional (recomendado)

- **CSP estricto**: añadir `Content-Security-Policy` en `next.config.ts`. Permitir `'self'`, `https://cdn.sanity.io`, `https://*.mercadopago.com`, `https://fonts.gstatic.com`. Probar primero con `Content-Security-Policy-Report-Only`.
- **Rate limit distribuido**: reemplazar `lib/rate-limit.ts` por `@upstash/ratelimit` cuando haya múltiples regiones (en serverless el `Map` en memoria no se comparte).
- **Sentry** o equivalente: capturar el `error` en `app/error.tsx` y `global-error.tsx`.
- **Vercel Analytics + Speed Insights**: `npm i @vercel/analytics @vercel/speed-insights` y montar los componentes en el root layout.
- **Email transaccional**: hook el webhook de pago aprobado a Resend / Postmark para enviar comprobante.

---

Precisión, fieltro y código.
