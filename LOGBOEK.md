# Logboek Moral APS

## 2026-04-20
- Nieuw project aangemaakt: `C:\Users\876409\moral aps` (kopie van `moral-maps`).
- Terminologie in de actieve flow geneutraliseerd naar `collega`, `medewerker` en `leidinggevende`.
- Stap 6 en 7 uit de appflow gehaald voor Deel 1:
  - `Socialisatieverslag` niet meer in de route.
  - eindverslagfase vervangen door een aparte afrondingspagina (`screen = done`).
- De route is nu gericht op Deel 1 (Vertrek), met een 5-stops communicatie op de landing.
- Afronding na STARR gaat nu direct via opslaan + done-scherm.
- Extra guard toegevoegd in dilemmaflow om door te gaan naar de volgende fase als de laatste vraag is bereikt.
- Build-check uitgevoerd: `npm run build` geslaagd.
- Projectnaam in `package.json` aangepast naar `moral-aps`.

## Trilogie-opzet
- Deel 1: Vertrek (huidige appflow).
- Deel 2: Onderweg (Crossroads) - later op basis van verwijderde onderdelen.
- Deel 3: Aankomst en terugblik (Final Destination) - later uit te werken.

## 2026-04-23
- Bestaande opdrachten uit Moral Maps 1 opnieuw als leidend kader bevestigd.
- Flow in `src/MoralMaps.jsx` opnieuw uitgelijnd op trilogie-gedachte (Deel 1 -> Deel 2 -> Deel 3).
- Deel 1-route hersteld met:
  - Privilegewiel, waarden, kompas, 4 dilemma's, STARR, rugzak, reisverslag.
  - Signature SMS-opdracht terug in de afsluiting.
- Deel 2 en Deel 3 in route opgenomen met eigen voortgang en exportmomenten.
- Basis voor hervatten met participant code toegevoegd:
  - code genereren, tonen en sessie opzoeken.
  - save uitgebreid met stage-info.
- Opslag robuuster gemaakt met fallback als DB-kolommen nog ontbreken.
- Asset-/mockup-koppelingen gecorrigeerd en verkeerde visual in Deel 1 vervangen.
- Organisatie-lakmoesproef uit de trilogie-route gehaald (landing + routing opgeschoond).
- Plan- en terugvinddocument vastgelegd in:
  - `MAPS_TRILOGIE_OVERZICHT.md`

### Openstaand
- Laatste visuele/tekstuele checks op preview.
- End-to-end testrun Deel 1 -> Deel 2 -> Deel 3.
- Na akkoord: commit/push laatste wijzigingen en merge naar `main`.

## 2026-04-23 - Incidentlog Supabase save-fout

### Situatie
- Deel 1 flow, vormgeving en vraagverduidelijkingen lopen goed.
- Vastloper blijft terugkomen bij overgang `Rugzak -> Reisverslag`.
- Foutmelding in UI: `Opslaan mislukt. Controleer je Supabase-instellingen.`

### Wat vandaag bevestigd is
- Tabel: `public.moralmaps_results` bestaat en wordt gebruikt.
- RLS staat aan.
- Policies aanwezig voor role `anon`:
  - `INSERT` (anoniem invoegen toegestaan)
  - `SELECT` (lezen toegestaan)
- Kolommen gecontroleerd en aanwezig:
  - `group_code`
  - `age`
  - `core_values`
  - `dilemma_responses`
  - `starr`
  - `dominant_color`
  - `socialisatie`
  - `participant_code`
  - `current_stage`
- Vercel variabelen aanwezig:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_KEY`
  - Advies toegepast om ook `VITE_SUPABASE_ANON_KEY` te zetten.

### Code-aanpassingen die al zijn gedaan
- `dbSave()` in `src/MoralMaps.jsx` uitgebreid met meerdere fallback-inserts voor schema-compatibiliteit:
  - volledige payload
  - zonder resume-velden
  - zonder `socialisatie`
  - stringified varianten voor oudere kolomtypes
- Middenpositie in privilegewiel herschreven naar duidelijkere tussenvorm:
  - `Tussenpositie (combinatie van beide uitersten)`
  - `Middenring -> Tussenvorm`

### Wat nog NIET definitief is vastgesteld
- Exacte Supabase error-response op runtime (HTTP/code/message) tijdens falende save.
- Of preview altijd nieuwste deployment draait op juiste branch zonder cache/omgevingsmix.
- Of er naast RLS nog DB constraints/triggers actief zijn op `moralmaps_results`.

### Startplan voor morgen (direct uitvoerbaar)
1. Reproduceer fout op nieuwste preview: `Rugzak -> Naar Reisverslag`.
2. Pak browser console-regel met exacte fout:
   - zoek op `Supabase save:` of network error rond insert.
3. Open DevTools Network en inspecteer mislukte request:
   - statuscode
   - response body
   - request payload
4. Controleer in Supabase SQL:
   - triggers op `moralmaps_results`
   - extra constraints (not null/check/type mismatch)
5. Fix op basis van exacte fout en direct hertest in preview.

### Doel morgen
- Save op `Rugzak -> Reisverslag` stabiel werkend.
- Daarna pas afronden van end-to-end testrun en merge.
