# Moral APS — Moral Maps monorepo

Deze repository is ingericht voor de **Moral Maps-trilogie** en aanverwante tools.  
**Organisatie lakmoesproef** (organisatiescan) hoort in een **eigen repository** — zie `docs/SCHEIDING_MAPS_EN_ORGANISATIE_LAKMOES.md`.

## Apps in deze monorepo

| Map | Product |
|-----|---------|
| `apps/moral-maps-1-the-beginning` | Moral Maps 1 (Vite/React) |
| `apps/moral-maps-2-crossroads` | Moral Maps 2 (Next.js) |
| `apps/moral-maps-3-final-destination` | Moral Maps 3 (Next.js) |
| `apps/persoonlijke-integriteitsmeting` | Persoonlijke integriteitsmeting |

## Lokale ontwikkeling

Installeer dependencies **per app** (eenmalig), bijvoorbeeld:

```bash
cd apps/moral-maps-1-the-beginning && npm install
cd ../moral-maps-2-crossroads && npm install
cd ../moral-maps-3-final-destination && npm install
cd ../persoonlijke-integriteitsmeting && npm install
```

### Scripts vanaf repo-root

```bash
# Moral Maps 1 (default: npm run dev)
npm run dev:maps1
npm run build:maps1
npm run lint:maps1

# Moral Maps 2
npm run dev:maps2
npm run build:maps2
npm run lint:maps2

# Moral Maps 3
npm run dev:maps3
npm run build:maps3
npm run lint:maps3

# Persoonlijke integriteitsmeting
npm run dev:persoonlijk
npm run build:persoonlijk
npm run lint:persoonlijk
```

## Vercel

Deploy **elke app** als **apart Vercel-project**. Stel per project de **root directory** in op de bijbehorende `apps/...`-map.

**Organisatie lakmoesproef:** niet uit deze repo — eigen project, root `.` op de organisatie-repo. Zie scheidingsdocument.

## Repo-brede stackafspraak

- Nieuwe apps bij voorkeur: **Next.js (App Router) + TypeScript + Tailwind**.
- Bestaande Vite-apps (Maps 1, persoonlijk) blijven tot nader order op Vite.

## Scheiding organisatiescan

→ **`docs/SCHEIDING_MAPS_EN_ORGANISATIE_LAKMOES.md`**
