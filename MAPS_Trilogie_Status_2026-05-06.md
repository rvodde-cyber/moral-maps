# MAPS Trilogie Statuslogboek

**Datum:** 6 mei 2026  
**Scope van deze scan:** `C:\Users\876409\moral aps` + bekende verwante mappen (`crossroads`, `moral-maps`, `dilemmagenerator`)  
**Doel:** actuele status van MAPS 1, MAPS 2 en MAPS 3 vastleggen.

---

## MAPS 1 — MoralMaps.jsx (React/Vite, moral-maps.vercel.app)

### 1) Wat is gebouwd en werkend
- Hoofdapp bestaat en draait als Vite React-app met trilogie-homeflow in één grote component (`src/MoralMaps.jsx`).
- Deel 1-flow (waarden, dilemma’s, STARR, SMS-signature) is aanwezig, inclusief PDF/print-export voor Deel 1.
- Deel 2-flow is in deze app ook aanwezig (Crossroads + De Vreemde Ander), inclusief PDF/print-export voor Deel 2.
- Deel 3-flow is in deze app aanwezig (De Brug in de Mist, terugblik/vooruitblik/synthese), inclusief totaalportfolio PDF/print.
- Opslaan/hervatten via Supabase is ingebouwd (`dbSave`, `dbLoadByParticipantCode`) met fallback naar lokale opslag bij save-failure.
- Visuele assets voor Deel 1/2/3 staan in `public/` en worden in de flow gebruikt.

### 2) Wat nog ontbreekt of niet af is
- Technische basis is nog niet gemigreerd naar Next.js + TypeScript (dit is nog React + JSX in één groot bestand).
- Architectuur is monolithisch (`MoralMaps.jsx` is zeer groot), waardoor onderhoud, testen en uitbreiden risicovoller blijft.
- Voor productie hangt betrouwbaarheid af van correcte Supabase-env vars en schema; zonder die configuratie is alleen lokale fallback beschikbaar.
- Er is geen zichtbare geautomatiseerde testset (unit/integration/e2e) voor de volledige trilogieflow.

### 3) Welke bestanden de kern vormen
- `src/MoralMaps.jsx`
- `src/main.jsx`
- `package.json`
- `public/` (met o.a. `sms-koud-station.jpg`, `crossroads-omleiding.jpg`, `brug-in-de-mist.jpg`)
- `MAPS_TRILOGIE_OVERZICHT.md`

### 4) Wat nodig is om live te gaan via GitHub + Vercel
- Repository in GitHub met duidelijke branchstrategie (`main` + feature branches).
- In Vercel project koppelen op root `moral aps` (Vite-detectie), build command `npm run build`, output `dist`.
- Environment variables in Vercel zetten:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY` (of fallback `VITE_SUPABASE_KEY`)
- Controleren dat Supabase-tabel `moralmaps_results` en kolommen aansluiten op de huidige payload-varianten.
- Preflight checks vóór productie:
  - `npm install`
  - `npm run build`
  - handmatige volledige flowtest Deel 1 -> Deel 2 -> Deel 3 -> PDF exports -> hervatten met participant code.

---

## MAPS 2 — Crossroads (Next.js/TypeScript, 1 opdracht per pagina, eigen afbeelding per opdracht)

### 1) Wat is gebouwd en werkend
- Bestaat als aparte app in `apps/moral-maps-2-crossroads` met Next.js App Router + TypeScript + Tailwind.
- Home-overzicht is aanwezig met voortgangsindicatie en start naar eerste opdracht.
- Dynamische route `src/app/opdracht/[promptId]/page.tsx` werkt als “1 opdracht per pagina”.
- Contentmodel met opdrachten en afbeeldingsvelden staat in `src/lib/crossroads-content.ts`.
- Autosave/local persistence is aanwezig via `src/lib/crossroads-storage.ts` (`localStorage` key `maps2-crossroads-v2`).
- Subtiele page transition met Framer Motion is geïmplementeerd.

### 2) Wat nog ontbreekt of niet af is
- Open punten staan expliciet in `WORKLOG.md`:
  - progress bar op opdrachtpagina,
  - autosave micro-feedback,
  - evt. shadcn/ui componentlaag,
  - volledige E2E gebruikersflowtest.
- In `PROJECT_CONTEXT.md` staat aanvullende backlog (koppeling met Deel 1-data, professionele PDF-export, data-overdracht naar Deel 3, etc.).
- Kritische asset-gap: lokale afbeelding `/crossroads-wegomleiding.jpg` wordt gebruikt in content, maar staat niet in deze app-`public/` map; dit veroorzaakt gebroken afbeelding in standalone deployment.
- Deel 3 is volgens context voor deze app “nog te bouwen” als vervolgfase in de trilogie.

### 3) Welke bestanden de kern vormen
- `apps/moral-maps-2-crossroads/src/app/page.tsx`
- `apps/moral-maps-2-crossroads/src/app/opdracht/[promptId]/page.tsx`
- `apps/moral-maps-2-crossroads/src/lib/crossroads-content.ts`
- `apps/moral-maps-2-crossroads/src/lib/crossroads-storage.ts`
- `apps/moral-maps-2-crossroads/next.config.ts`
- `apps/moral-maps-2-crossroads/WORKLOG.md`
- `apps/moral-maps-2-crossroads/PROJECT_CONTEXT.md`

### 4) Wat nodig is om live te gaan via GitHub + Vercel
- Aparte GitHub repo of monorepo-subpath deployment met root directory: `apps/moral-maps-2-crossroads`.
- In Vercel:
  - Framework preset: Next.js
  - Build command: standaard `next build` (of leeg laten voor auto)
  - Output: automatisch door Next.js
- Voor livegang eerst blockers oplossen:
  - ontbrekende lokale assets in `public/` aanvullen,
  - open UX-punten afronden,
  - volledige smoke/E2E flow uitvoeren.
- Deploy-check:
  - `npm install`
  - `npm run lint`
  - `npm run build`

---

## MAPS 3 — Final Destination (De Aankomst)

### 1) Wat is gebouwd en werkend
- In MAPS 1 (`src/MoralMaps.jsx`) is Deel 3 functioneel aanwezig als “Deel 3 — Bestemming” met:
  - signature-opdracht “De Brug in de Mist”,
  - terugblik, vooruitblik, synthese,
  - opslaan van voortgang,
  - totaalportfolio PDF/print.
- Bijbehorende assets zijn aanwezig in `moral aps/public/` (o.a. `brug-in-de-mist.jpg`, `mockup-deel3-bridge.jpg`, `deel3-hero-bestemming-horizon.jpg`).

### 2) Wat nog ontbreekt of niet af is
- Er is op dit moment **geen aparte MAPS 3-appmap** gevonden (geen `apps/...` project voor Final Destination).
- In de MAPS 2 context staat Deel 3 expliciet als “nog te bouwen” in die app-lijn.
- Architectuurdoel “drie losse apps” is dus nog niet volledig gerealiseerd; Deel 3 zit nu functioneel in de MAPS 1 monolith.

### 3) Welke bestanden de kern vormen
- `src/MoralMaps.jsx` (Deel 3 UI + state + save + export)
- `public/brug-in-de-mist.jpg`
- `public/mockup-deel3-bridge.jpg`
- `public/deel3-hero-bestemming-horizon.jpg`
- `MAPS_TRILOGIE_OVERZICHT.md`

### 4) Wat nodig is om live te gaan via GitHub + Vercel
- Keuze maken tussen twee routes:
  - **Route A (snel):** Deel 3 live houden binnen huidige MAPS 1 deployment.
  - **Route B (doelarchitectuur):** aparte Next.js/TypeScript app `apps/moral-maps-3-final-destination` opzetten en migreren.
- Voor Route B:
  - basisproject maken (Next App Router + TS + Tailwind + ESLint),
  - Deel 3 logica modulair overzetten uit `MoralMaps.jsx`,
  - koppeling definiëren met Deel 1/2 data (import/API/storage contract),
  - aparte Vercel deployment inrichten op de nieuwe app-root.

---

## Samenvattende trilogie-status (6 mei 2026)

- MAPS 1: functioneel rijk en inzetbaar, maar technisch nog monolithisch (React/Vite/JSX).
- MAPS 2: goede Next.js/TypeScript basis met juiste opdrachtstructuur; nog UX/backlogpunten en minimaal één asset-blocker.
- MAPS 3: inhoudelijk functioneel aanwezig binnen MAPS 1, maar nog niet als zelfstandige app opgeleverd.

---

## Geraadpleegde bestanden

- `moral aps/README.md`
- `moral aps/package.json`
- `moral aps/MAPS_TRILOGIE_OVERZICHT.md`
- `moral aps/src/MoralMaps.jsx`
- `moral aps/apps/moral-maps-2-crossroads/README.md`
- `moral aps/apps/moral-maps-2-crossroads/package.json`
- `moral aps/apps/moral-maps-2-crossroads/WORKLOG.md`
- `moral aps/apps/moral-maps-2-crossroads/PROJECT_CONTEXT.md`
- `moral aps/apps/moral-maps-2-crossroads/src/app/page.tsx`
- `moral aps/apps/moral-maps-2-crossroads/src/app/opdracht/[promptId]/page.tsx`
- `moral aps/apps/moral-maps-2-crossroads/src/app/layout.tsx`
- `moral aps/apps/moral-maps-2-crossroads/src/lib/crossroads-content.ts`
- `moral aps/apps/moral-maps-2-crossroads/src/lib/crossroads-storage.ts`
- `moral aps/apps/moral-maps-2-crossroads/next.config.ts`
- `moral aps/public/` (assetinventaris)
- `moral aps/apps/moral-maps-2-crossroads/public/` (assetinventaris)
- `crossroads/package.json` (controle op mogelijke duplicaatapp)
- `crossroads/README.md` (controle op mogelijke duplicaatapp)
- `dilemmagenerator/package.json` (controle op mogelijke MAPS-relatie)
- `dilemmagenerator/README.md` (controle op mogelijke MAPS-relatie)
