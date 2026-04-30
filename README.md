# Morele Lakmoesproef Apps

Deze repository bevat de Moral Maps trilogie-shell en drie gescheiden productie-apps:

- `apps/persoonlijke-integriteitsmeting`
- `apps/organisatie-lakmoesproef`
- `apps/moral-maps-2-crossroads`

De Vite-apps zijn gebouwd met:

- React + Vite
- TypeScript
- Tailwind CSS (via `@tailwindcss/vite`)

## Lokale ontwikkeling

Installeer dependencies per app (eenmalig):

```bash
npm install
cd apps/persoonlijke-integriteitsmeting && npm install
cd ../organisatie-lakmoesproef && npm install
cd ../moral-maps-2-crossroads && npm install
```

Starten:

```bash
# Trilogie-shell
npm run dev

# Persoonlijke integriteitsmeting
npm run dev:persoonlijk

# Organisatie lakmoesproef
npm run dev:organisatie

# Moral Maps 2 Crossroads
npm run dev:crossroads
```

Builden:

```bash
npm run build
npm run build:persoonlijk
npm run build:organisatie
npm run build:crossroads
npm run build:all
```

Linten:

```bash
npm run lint:persoonlijk
npm run lint:organisatie
npm run lint:crossroads
npm run lint:all
```

## Vercel deployment

Deploy elke app als apart Vercel-project.

### Project 1: Persoonlijke integriteitsmeting
- **Root Directory**: `apps/persoonlijke-integriteitsmeting`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Project 2: Organisatie lakmoesproef
- **Root Directory**: `apps/organisatie-lakmoesproef`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Project 3: Moral Maps 2 Crossroads
- **Root Directory**: `apps/moral-maps-2-crossroads`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## Inhoud

- De individuele app is hernoemd naar **Persoonlijke integriteitsmeting**.
- De organisatie-app bevat de **complete 21-vragen Organisatie lakmoesproef** met:
  - professionele vraagformulering,
  - ondertitel per vraag,
  - heldere uitlegtekst per vraag,
  - 1-5 scoremodel en totaalscore.
- De trilogie-shell bevat de route door **Deel 1: Vertrek**, **Deel 2: Onderweg/Crossroads** en **Deel 3: Bestemming**.
- De Crossroads-app biedt een modulaire Next.js App Router-uitwerking voor Moral Maps 2 met opdrachtpagina's, lokale draftopslag en micro-interacties.
