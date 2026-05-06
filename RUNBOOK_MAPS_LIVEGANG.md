# RUNBOOK MAPS Livegang

**Laatste update:** 2026-05-06  
**Projectroot:** `C:\Users\876409\moral aps`  
**Doel:** met minimale fouten MAPS 1 en MAPS 2 live zetten, MAPS 3 correct positioneren.

---

## 1) Huidige status (kort)

- MAPS 1 (Vite/React): live op `https://moral-maps.vercel.app`.
- MAPS 2 Crossroads (Next.js/TS): live op `https://moral-maps-2-crossroads.vercel.app`.
- MAPS 3 Final Destination: functioneel in MAPS 1, nog geen losse app-directory/deployment.

---

## 2) Preflight checks (altijd eerst)

Voer uit in `C:\Users\876409\moral aps`:

```bash
npm install
npm run lint
npm run build
```

Voer uit in `C:\Users\876409\moral aps\apps\moral-maps-2-crossroads`:

```bash
npm install
npm run lint
npm run build
```

Pas live zetten als beide builds slagen.

---

## 3) Deployvolgorde (aanbevolen)

1. MAPS 1 live (snelste waarde, complete trilogieflow aanwezig).
2. MAPS 2 Crossroads live als aparte app.
3. MAPS 3 later uitknippen naar eigen Next.js app (optioneel, architectuurstap).

---

## 4) Vercel-config per app

### MAPS 1

- **Repo/root directory:** `moral aps`
- **Framework:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables:**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### MAPS 2 Crossroads

- **Repo/root directory:** `apps/moral-maps-2-crossroads`
- **Framework:** Next.js
- **Build command:** `next build` (of default)
- **Output directory:** automatisch via Next.js
- **Opmerking:** `public/crossroads-wegomleiding.jpg` moet aanwezig blijven.

---

## 5) Smoke test na deploy

### MAPS 1

- Start flow Deel 1 -> Deel 2 -> Deel 3.
- Check PDF/print knoppen:
  - Deel 1 export
  - Deel 2 export
  - Totaalportfolio export
- Check hervatten met participant code.

### MAPS 2

- Home -> eerste opdracht -> volgende opdracht routing.
- Check opdracht met image `crossroads-wegomleiding.jpg`.
- Check autosave door refresh tijdens ingevulde opdracht.

---

## 6) Wat jij volgende keer direct moet doen

1. Open dit bestand: `RUNBOOK_MAPS_LIVEGANG.md`.
2. Voer de smoke test uit sectie 5 uit op beide live URL's.
3. Start daarna MAPS 3 als losse app (Next.js/TS) in `apps/moral-maps-3-final-destination`.
4. Noteer resultaat, blockers en eerstvolgende stap in `LOGBOEK.md`.

---

## 8) Vooruitblik: eerstvolgende implementatiestap

Doel volgende bouwsessie:
- MAPS 3 los trekken uit de monolith en voorbereiden als apart deployment-project.

Minimum scope:
1. app-skeleton maken (`apps/moral-maps-3-final-destination`);
2. basisroutes + layout + styling;
3. Deel 3 signature-opdracht "Brug in de Mist";
4. lokale draft-opslag (localStorage) + voortgangsindicator;
5. build/lint groen + logboekupdate.

---

## 7) Niet verwijderen bij opschonen

- `public/` assets gebruikt door MAPS 1 en MAPS 3 flow.
- `apps/moral-maps-2-crossroads/public/crossroads-wegomleiding.jpg`.
- `MAPS_Trilogie_Status_2026-05-06.md` (statusmoment).
- `RUNBOOK_MAPS_LIVEGANG.md` (operationeel startpunt).
