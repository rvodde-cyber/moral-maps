# Morele Lakmoesproef Apps

Deze repository bevat nu twee gescheiden productie-apps:

- `apps/persoonlijke-integriteitsmeting`
- `apps/organisatie-lakmoesproef`

Beide apps zijn gebouwd met:

- React + Vite
- TypeScript
- Tailwind CSS (via `@tailwindcss/vite`)

## Lokale ontwikkeling

Installeer dependencies per app (eenmalig):

```bash
cd apps/persoonlijke-integriteitsmeting && npm install
cd ../organisatie-lakmoesproef && npm install
```

Starten:

```bash
# Persoonlijke integriteitsmeting
npm run dev:persoonlijk

# Organisatie lakmoesproef
npm run dev:organisatie
```

Builden:

```bash
npm run build:persoonlijk
npm run build:organisatie
```

Linten:

```bash
npm run lint:persoonlijk
npm run lint:organisatie
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

## Inhoud

- De individuele app is hernoemd naar **Persoonlijke integriteitsmeting**.
- De organisatie-app bevat de **complete 21-vragen Organisatie lakmoesproef** met:
  - professionele vraagformulering,
  - ondertitel per vraag,
  - heldere uitlegtekst per vraag,
  - 1-5 scoremodel en totaalscore.
