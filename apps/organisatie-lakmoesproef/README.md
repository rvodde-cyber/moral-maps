# Organisatie lakmoesproef

Organisatiescan op basis van 21 vragen over voorbeeldig en ethisch organiseren.

## Stack
- React + Vite
- TypeScript
- Tailwind CSS

## Inhoud
- 21 professioneel geformuleerde vragen
- Onderwerp + ondertitel + uitleg per vraag
- Scoringsmodel van 1 tot 5
- Integriteitsscore en observatieveld

## Scripts
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`
- `npm run test`

## Lokaal en live URL

- **Lokaal:** `npm run dev` → meestal [http://localhost:5173](http://localhost:5173) (Vite-standaard). Vanuit monorepo-root: `npm run dev:organisatie`.
- **Productie (Vercel):** [https://organisatie-morele-lakmoestest.vercel.app](https://organisatie-morele-lakmoestest.vercel.app)  
  - Vercel-projectnaam: `organisatie-morele-lakmoestest`  
  - *Let op:* een kleine **dashboard-preview** kan “Forbidden” tonen terwijl de site in een normale browser gewoon laadt (bekend gedrag bij sommige Vercel-thumbnails / fetch bots).

## Vercel
- Root directory: `apps/organisatie-lakmoesproef`
- Build command: `npm run build`
- Output directory: `dist`

## Notities
- Instrumentversie in UI/rapport: `v1.1`
- Sessies worden lokaal opgeslagen in browser (`localStorage`) om later te hervatten.
- Vercel-accounttaken (custom domain/analytics): zie `VERCEL_PROFESSIONALISERING.md`.
