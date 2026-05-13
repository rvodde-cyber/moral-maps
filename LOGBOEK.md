# Logboek Moral APS

## 2026-05-13 — Hervat volgens handoff

- Handoff opgepakt: status bevestigd dat standalone-map `C:\Users\876409\organisatie-lakmoesproef` al een `.git` heeft, maar nog **geen remote `origin`**.
- Ook bevestigd: per ongeluk `.git` in `C:\Users\876409` bestaat nog; eerst verwijderen voordat verdere git-acties op rootniveau verwarring geven.
- `docs/HANDOFF_MORGEN.md` bijgewerkt met actuele statuscheck en veilige volgorde van afronden.
- Nog niet uitgevoerd in deze sessie (accountstap): push van standalone-repo naar GitHub + Vercel-root omzetten, daarna `git rm -r apps/organisatie-lakmoesproef` in monorepo.

## 2026-05-12 — Pauze: handoff morgen

- **Status:** alles wat zonder GitHub-login kan, staat vast in repo + `docs/HANDOFF_MORGEN.md`.
- **Morgen door eigenaar:** standalone `organisatie-lakmoesproef` pushen (`SETUP_GIT.ps1` met echte `$RemoteUrl`), Vercel-root op `.`, daarna `git rm -r apps/organisatie-lakmoesproef` in moral aps + PR/merge.
- **Let op:** geen `git init` in `C:\Users\876409`; alleen `.git` in projectmap. Zie handoff.

## 2026-05-12 — Scheiding Moral Maps ↔ organisatie lakmoesproef

- **Besluit:** organisatie lakmoesproef is **geen onderdeel** van deze monorepo; eigen GitHub-repo + eigen Vercel-root (`.`).
- **Repo-root:** `npm run dev/build/lint:organisatie` verwijderd uit `package.json`; `README.md` herschreven rond Moral Maps-trilogie + persoonlijke integriteitsmeting.
- **Handleiding:** `docs/SCHEIDING_MAPS_EN_ORGANISATIE_LAKMOES.md` + `apps/organisatie-lakmoesproef/MIGRATIE_APARTE_REPOSITORY.md` + `apps/organisatie-lakmoesproef/SETUP_GIT.ps1` (PowerShell-setup zonder `origin`-crash).
- **Nog te doen door eigenaar:** standalone-repo pushen; daarna map uit monorepo verwijderen en Vercel aanpassen (zie `docs/HANDOFF_MORGEN.md`).

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

## 2026-04-24 - Inhoudelijke verrijking trilogie (klaargezet)

### Nieuwe inhoudsvraag van gebruiker
- Alle 3 delen voorzien van morele coachvragen die passen bij de fase.
- Vormgeving in Deel 2 en Deel 3 rijker maken met passende visuals.
- Dit vastleggen voor hervatting na pauze.

### Voorstel morele coachvragen per deel

#### Deel 1 - The Beginning (zelforiëntatie)
- Heb ik in deze keuzes trouw gehandeld aan mijn kernwaarden?
- Welke keuze voelde goed, maar wringt achteraf toch een beetje?
- Waar week ik af van mijn kompas en waarom deed ik dat?
- Welke waarde wil ik in het volgende deel bewuster vasthouden?

#### Deel 2 - Crossroads (onderweg, spanning, bijsturing)
- Heb ik goed gedaan in deze context, of vooral veilig gekozen?
- Welk belang woog ik zwaarder: mezelf, de ander, het systeem?
- Op welk moment stond mijn kernwaarde het meest onder druk?
- Wat veranderde in mijn oordeel nadat ik de ander echt meenam?

#### Deel 3 - Final Destination (integratie, actie)
- Waar ben ik moreel op gegroeid sinds Deel 1?
- Welke terugkerende blinde vlek neem ik nog mee?
- Welke keuze ga ik vanaf nu anders maken in de praktijk?
- Hoe toets ik over 4 weken of ik mijn actieplan ook echt naleef?

### Voorstel visuele verrijking Deel 2
- Routekaart-progressie bovenin: mini-lijn met iconen (Crossroads -> Tankstop -> Omweg -> Ander -> Inzicht).
- Per sub-opdracht een eigen header-illustratie:
  - Tankstop: dashboard/brandstofmeter visual.
  - Omweg: wegafsluiting/omleiding visual.
  - Vreemde Ander: ontmoeting/brug visual.
- Compacte "Kompas in beeld"-badge naast elke opdracht met de 3 kernwaarden.

### Voorstel visuele verrijking Deel 3
- Hero met horizon/uitkijkpunt na brug-moment (visuele afsluiting van reis).
- Kaarten-layout voor:
  - Terugblik
  - Vooruitblik
  - Synthese
  - GROW actieplan
- Eindblok "Commitment card" met datum + mini-checkpoint (2 en 4 weken).

### Implementatievolgorde na pauze
1. Morele coachvragen als vaste callout-blokken in Deel 1, 2, 3.
2. Deel 2 visuele routeprogressie + opdrachtillustraties.
3. Deel 3 kaart-layout en commitment card.
4. Portfolio-export uitbreiden met coachvragen + commitment samenvatting.

## 2026-04-24 - Overzicht MAPS-trilogie (Deel 1, 2, 3)

Doel van deze notitie: in 1 plek terugvinden hoe de 3 onderdelen van de MAPS-trilogie lopen, welke opdrachten erbij horen, en wat de PDF/print oplevert.

Bron/implementatiepad:
- Hoofdflow: `src/MoralMaps.jsx`
- Beeldmateriaal: `public/`

### Deel 1 - The Beginning (Vertrek)
- Hoofdthema:
  - Zelforiëntatie: wie ben ik, welke waarden sturen mij, en hoe handel ik in eerste dilemma's?
- Flow:
  1. Privilegewiel (positionering/zelfbeeld).
  2. Waarden kiezen.
  3. Kernwaarden (kompas) bepalen.
  4. 4 morele dilemma's.
  5. STARR-reflectie.
  6. Rugzak/socialisatie.
  7. Reisverslag + signature SMS-dilemma.
- Opdrachten:
  - Privilegewiel invullen.
  - Waarden + kernwaarden selecteren.
  - Dilemmakeuzes met waardenafweging.
  - STARR (situatie, taak, actie, resultaat, reflectie).
  - Rugzak/socialisatievragen.
  - Einddilemma SMS + reflectie.
- PDF/print output:
  - `exportPDF` -> printbaar Deel 1-verslag met:
    - kernwaarden,
    - dominante veranderkleur,
    - dilemma-keuzes,
    - STARR,
    - SMS-einddilemma.

### Deel 2 - Crossroads (Onderweg)
- Hoofdthema:
  - Kiezen onder druk: routekeuze, energiebalans, omweg en ontmoeting met de ander.
- Flow:
  1. Intro Deel 2.
  2. Signature Crossroads-keuze (4 afslagen + reflectie).
  3. Tankstop-check.
  4. Omweg-dilemma.
  5. De Vreemde Ander (Spiegel, Tussenruimte, Insluiting).
  6. Deel 2 afronding + inzicht + doorgang naar Deel 3.
- Opdrachten:
  - Routekeuze + waardenargumentatie.
  - Energiegevers/lekken/volgende etappe.
  - Tegenslag, bijstelling, lering.
  - Vreemde Ander in 3 stappen.
  - Persoonlijk kerninzicht na Deel 2.
- PDF/print output:
  - `exportPDFDeel2` -> printbaar Deel 2-fragment met:
    - kernwaarden uit Deel 1,
    - crossroads-keuze + reflectie,
    - tankstop,
    - omweg,
    - samenvatting Vreemde Ander,
    - eindreflectie onderweg.

### Deel 3 - Final Destination (Bestemming)
- Hoofdthema:
  - Integratie en vooruitkijken: patroon zien, kompas aanscherpen, commitment maken.
- Flow:
  1. Signature opdracht: Brug in de Mist.
  2. Terugblik (scharnierpunt, patroon, ware noorden).
  3. Vooruitblik (nalatenschap, richting, belofte).
  4. Synthese (persoonlijk kompasplan / Reisverslag 3.0).
  5. Eindopdracht GROW (Goal, Reality, Options, Will).
  6. Opslaan + totaalportfolio export.
- Opdrachten:
  - Brug in de Mist (ballast, meenemen, hoop, kompaswaarde).
  - Terugblik/vooruitblik/synthese.
  - GROW-actieplan met concrete commitment.
- PDF/print output:
  - `exportPDFDeel3Portfolio` -> totaalportfolio t/m Deel 3 met:
    - kernwaarden + dominante kleur,
    - Deel 1 elementen (dilemma's, STARR, socialisatie, SMS),
    - Deel 3 elementen (brug, terugblik, vooruitblik, synthese),
    - volledige GROW-eindpagina.

### Afscheiding bevestigd
- Dit overzicht gaat expliciet alleen over de MAPS-trilogie (Deel 1/2/3).
- Niet-MAPS apps blijven buiten deze trilogie-notitie.

## 2026-04-24 - Pauzestand (lange pauze)

Status veilig opgeslagen. Laatste werk is afgerond en gepusht.

### Laatste afgerond
- Deel 2 en Deel 3 visueel gepolijst in `src/MoralMaps.jsx` (beeldkoppeling, leesbaarheid, spacing mobiel/tablet).
- Nieuwe MAPS-assets geplaatst in `public/` en gekoppeld in de flow.
- Draaiboeken toegevoegd:
  - `DRAAIBOEK_MAPS_TRILOGIE_WORD.md`
  - `DRAAIBOEK_MAPS_TRILOGIE_HANDOUT.md`
- Git:
  - Branch: `feat/maps-flow-update`
  - Commit: `b0003a3`
  - Push naar `origin/feat/maps-flow-update` voltooid.

### Hervatten na pauze (kort)
1. Open branch `feat/maps-flow-update`.
2. Start app en doe end-to-end check van Deel 1 -> Deel 2 -> Deel 3.
3. Controleer vooral beeldcrop op mobiel/iPad en PDF/print-uitvoer per deel.
4. Bij akkoord: PR/merge naar `main`.

## 2026-05-06 - Livegang voorbereiding en hardening

### Uitgevoerd
- Opschoning uitgevoerd in projectroot:
  - `dist/` verwijderd
  - `.vercel/` verwijderd
  - tijdelijk lockbestand verwijderd
- MAPS 2 blocker gefixt:
  - ontbrekende asset toegevoegd in `apps/moral-maps-2-crossroads/public/crossroads-wegomleiding.jpg`
- Validaties uitgevoerd:
  - MAPS 2: `npx eslint src` -> groen
  - MAPS 2: `npm run build` -> groen
  - MAPS 1: `npx vite build` -> groen
- Root `package.json` gestandaardiseerd voor MAPS 1:
  - `dev`: `vite`
  - `build`: `vite build`
  - `lint`: `eslint src`
  - `preview`: `vite preview`
- Bestaande lint-blocker opgelost in `src/MoralMaps.jsx`:
  - `profile is not defined` in `exportPDFDeel2` verwijderd door vaste taalinstelling `lang="nl"`.
- Nieuwe operationele handleiding toegevoegd:
  - `RUNBOOK_MAPS_LIVEGANG.md`
- Lognavigatie bijgewerkt:
  - `START_HIER_LOGS.md` verwijst nu expliciet naar het runbook.

### Huidige live-status
- MAPS 1: technisch klaar voor livegang op Vercel (Vite + env vars).
- MAPS 2 Crossroads: technisch klaar voor livegang op Vercel (Next.js).
- MAPS 3: functioneel aanwezig in MAPS 1, nog geen losse app/deployment.

### Volgende stap (bij eerstvolgende sessie)
1. Deploy MAPS 1 volgens `RUNBOOK_MAPS_LIVEGANG.md`.
2. Deploy MAPS 2 volgens `RUNBOOK_MAPS_LIVEGANG.md`.
3. Productie-URL's en smoke test resultaten vastleggen in dit logboek.

## 2026-05-06 - Livegang afgerond (MAPS 1 + MAPS 2)

### Resultaat
- MAPS 1 deployment op `main` is geslaagd en staat live.
- MAPS 2 Crossroads deployment is geslaagd na root-directory correctie.
- Foutoorzaak tijdens deploy was bevestigd:
  - pad niet gevonden op `main` tijdens eerdere poging;
  - opgelost door merge + juiste Vercel root-config.

### Live URL's
- MAPS 1: `https://moral-maps.vercel.app`
- MAPS 2: `https://moral-maps-2-crossroads.vercel.app`

### Operationele afspraak vanaf nu
- Na elke sessie altijd dit logboek bijwerken met:
  - wat is opgeleverd,
  - wat is gevalideerd (lint/build/deploy),
  - welke blockers er waren en hoe opgelost,
  - eerstvolgende concrete stap.

### Volgende sessie (focus vooruit)
1. Start met `RUNBOOK_MAPS_LIVEGANG.md` als vaste ingang.
2. Voer een korte productie-smoketest uit op beide live URL's:
   - MAPS 1: Deel 1 -> Deel 2 -> Deel 3 + PDF/print + hervatten met code
   - MAPS 2: startflow, routing per opdracht, image check, autosave check
3. Start architectuurstap MAPS 3 als losse app:
   - nieuwe app-map `apps/moral-maps-3-final-destination`
   - Next.js App Router + TypeScript + Tailwind
   - Deel 3-logica modulair overzetten vanuit `src/MoralMaps.jsx`
4. Na die sessie opnieuw logboek updaten met beslissingen en resterende backlog.

## 2026-05-06 - MAPS 3 losse app gestart

### Opgeleverd
- Nieuwe app aangemaakt: `apps/moral-maps-3-final-destination`
- Stack ingericht:
  - Next.js App Router
  - TypeScript
  - Tailwind CSS
  - Framer Motion
- Werkende startflow gebouwd in `src/app/page.tsx` met:
  - Deel 3 intro
  - Signature-opdracht "De Brug in de Mist"
  - Terugblik + vooruitblik
  - Syntheseveld
  - voortgangspercentage
  - autosave in localStorage
- Opslag helper toegevoegd:
  - `src/lib/final-destination-storage.ts`
- Root scripts uitgebreid voor MAPS 3:
  - `dev:maps3`
  - `build:maps3`
  - `lint:maps3`

### Validatie
- In `apps/moral-maps-3-final-destination`:
  - `npm run lint` -> groen
  - `npm run build` -> groen

### Volgende stap
1. Koppel Deel 3-content uit `src/MoralMaps.jsx` één-op-één over (brug, terugblik, vooruitblik, synthese, GROW).
2. Voeg PDF/print export toe voor MAPS 3 portfolio-fragment.
3. Maak Vercel project voor MAPS 3 met root `apps/moral-maps-3-final-destination`.

### Versiebeheerstatus (einde sessie)
- Werkbranch met nieuwste MAPS 3 scaffold: `feat/maps-flow-update`
- Laatste commit op branch: `ca5ffd5`
- Vaste startdocumenten voor volgende sessie:
  - `START_HIER_VERSIONBEHEER_EN_DEPLOY.md`
  - `RUNBOOK_MAPS_LIVEGANG.md`
  - `LOGBOEK.md` (deze sectie)

## 2026-05-06 - MAPS 3 live + paginering per opdracht

### Opgeleverd
- MAPS 3 is live als apart Vercel-project: `https://moral-maps-3-final-destination.vercel.app`
- Deel 3 flow is opgesplitst naar 1 opdracht per pagina:
  - `/opdracht/brug`
  - `/opdracht/terugblik`
  - `/opdracht/vooruitblik`
  - `/opdracht/reisverslag`
- Per opdracht is een eigen afbeelding gekoppeld:
  - Brug: `public/brug-in-de-mist.jpg`
  - Terugblik: `public/images/maps3-terugblik.jpg`
  - Vooruitblik: `public/images/maps3-vooruitblik.jpg`
  - Reisverslag: `public/images/maps3-reisverslag.jpg`
- Terminologie Deel 3 is consistent gemaakt naar: **Je ware koers**.

### Validatie
- `apps/moral-maps-3-final-destination`: `npm run lint` -> groen
- `apps/moral-maps-3-final-destination`: `npm run build` -> groen
- Vercel MAPS 3 deployment status: `Ready` (bevestigd in sessie)

### Volgende stap (direct gepland)
1. Nieuwe landing image maken voor MAPS 3:
   - stijl: smartphone met GPS in dezelfde stijl als eerder
   - boodschap: doel bereikt / aankomst
2. Bestand opslaan als:
   - `apps/moral-maps-3-final-destination/public/images/maps3-landing-smartphone-gps.jpg`
3. Daarna in app koppelen op `src/app/page.tsx` (overzichtspagina Deel 3).
4. Herdeploy MAPS 3 op Vercel en visueel checken op mobiel + desktop.

## 2026-05-07 - Wensenronde MAPS 2 + MAPS 3

### Nieuwe wensen verwerkt
- MAPS 2 inhoudelijk verdiept met een aparte fase **De Wegkeuze**.
- MAPS 3 uitgebreid met een nieuw thema in Laag 2: **Het Panorama - Morele Eerlijkheid**.
- In MAPS 3 per vraag extra duiding toegevoegd zodat velden niet alleen als losse invulvelden aanvoelen.

### Technische aanpassingen
- `apps/moral-maps-2-crossroads/src/lib/crossroads-content.ts`:
  - nieuwe stage `wegkeuze` toegevoegd met 3 prompts:
    - het goede weten maar niet doen,
    - zwijgen waar spreken beter was,
    - verschil tussen moeilijke en foute keuze.
- `apps/moral-maps-3-final-destination/src/lib/final-destination-steps.ts`:
  - nieuwe stap `panorama` toegevoegd in `stepOrder` na `terugblik`.
- `apps/moral-maps-3-final-destination/src/lib/final-destination-storage.ts`:
  - nieuw opslagblok `panorama` toegevoegd met 4 antwoorden.
- `apps/moral-maps-3-final-destination/src/app/opdracht/[step]/page.tsx`:
  - nieuw UI-blok voor `panorama` met 4 morele reflectievragen + korte toelichting per vraag.
  - extra microtoelichtingen toegevoegd boven bestaande stapblokken.
  - voortgangsberekening aangepast naar 17 velden.
- `apps/moral-maps-3-final-destination/src/app/page.tsx`:
  - homepage-voortgang en autosave uitgebreid met de 4 nieuwe panorama-antwoorden.

### Validatie
- MAPS 2 `npm run build`: geslaagd.

### Openstaand
- Live-foutmelding MAPS 2 is nog niet runtime-gereproduceerd in deze sessie (build lokaal is groen).
- Volgende stap: production URL reproduceren, exacte foutmelding/log vastleggen en gericht fixen.

## 2026-05-07 - Tekstfixes, routing en portfolio-export

### Uitgevoerd
- Consistentie tussen Deel 1 en Deel 2 routing verbeterd:
  - in `src/MoralMaps.jsx` stuurt "Start Deel 2" nu naar de live Crossroads-app.
  - queryparams worden meegegeven (groep/leeftijd/kernwaarden).
- MAPS 2 Crossroads (`apps/moral-maps-2-crossroads`) inhoud en UX aangescherpt:
  - scorelabel gewijzigd naar: "In welke mate is jouw keuze volgens jouw kernwaarden?"
  - extra korte uitleg toegevoegd per opdrachtpagina.
  - wording met koersvastheid vervangen in de socialisatieprompt.
  - routeverslag-export toegevoegd als printbare PDF-flow via browser print.
- MAPS 3 Final Destination (`apps/moral-maps-3-final-destination`) titel gecorrigeerd:
  - metadata en paginakoppen aangepast naar "Moral Maps 3: Final Destination".
  - landingtitel en CTA aangepast.
  - knop toegevoegd om verslag van deel 1-2-3 als 1 document te openen/printen voor portfolio.
- In MAPS 1 (`src/MoralMaps.jsx`) tekstfixes doorgevoerd:
  - "veranderkleur" vervangen door "waardenkleur" op relevante plekken.
  - kernwaardenbeschrijving aangepast naar gewenste formulering.
  - crossroads-reflectieprompt aangepast naar kernwaardenformulering.
  - fallback toegevoegd bij geblokkeerde popup voor Deel 2 PDF-export.

### Openstaand
- E2E-check op live URL's met echte deelnemerflow:
  - Deel 1 -> externe Deel 2 start,
  - Deel 2 routeverslag PDF/print openen,
  - Deel 3 gecombineerde trilogie-export openen.

## 2026-05-07 - Pauzestand + vervolgstappen

### Pauzestand nu
- Gevraagde tekstwijzigingen zijn doorgevoerd in MAPS 1, MAPS 2 en MAPS 3.
- Titelcorrectie voor MAPS 3 staat nu op **Final Destination**.
- Deel 2 heeft nu een expliciete routeverslag-knop voor PDF/print.
- Deel 3 heeft nu een knop om een gecombineerd verslag (deel 1-2-3) als 1 document te openen/printen.
- Routing vanuit Deel 1 naar Deel 2 wijst nu naar de live Crossroads-app, zodat gebruikers niet meer in een andere versie belanden.
- Buildvalidatie afgerond:
  - MAPS 2 `npm run build` -> geslaagd.
  - MAPS 3 `npm run build` -> geslaagd.

### Eerstvolgende stappen om af te maken (in volgorde)
1. **Lokale checks afmaken**
   - `apps/moral-maps-2-crossroads`: `npm run lint` (al groen), daarna `npm run build`.
   - `apps/moral-maps-3-final-destination`: `npm run lint` (al groen), daarna `npm run build`.
2. **Functionele E2E test op live**
   - Start in MAPS 1 en klik door naar Deel 2.
   - Controleer of Deel 2 altijd de juiste (nieuwe) appversie opent.
   - Vul minimaal 2 opdrachten in en test **Open routeverslag als PDF/print**.
3. **MAPS 3 validatie**
   - Controleer titelweergave: “Moral Maps 3: Final Destination”.
   - Open meerdere opdrachten en check de korte uitleg + afbeelding per opdracht.
   - Test **Download verslag deel 1-2-3** en controleer print/PDF output.
4. **Inhoudelijke finetune**
   - Tekst “Kies drie kernwaarde die voor jou boven alles staan.” eventueel taalkundig finaliseren naar “kernwaarden” als je dat toch wenst.
   - Controleren of alle “koersvastheid”-verwijzingen nu vervangen zijn op alle zichtbare schermen.
5. **Deploy en afronding**
   - Wijzigingen committen op werkbranch.
   - Deploy van MAPS 2 en MAPS 3.
   - Live smoke test herhalen na deploy.
   - Logboek afsluiten met definitieve live-status.

## 2026-05-08 - Finetuning trilogie (strikt op opdracht)

### Uitgevoerd
- MAPS 1 (`src/MoralMaps.jsx`)
  - Deel 1 heeft nu een aparte **welkomstpagina** met uitleg en een startknop in auto-startstijl.
  - Nieuwe opdracht **Motivatie** toegevoegd als eigen stap/pagina in de flow, vóór Reisverslag.
  - Terminologie aangepast:
    - `Smeed je Kompas` -> `Stel je GPS bij`
    - zinnen met `kompas bijstellen` -> `instellingen van je interne GPS opnieuw bijstellen`
  - Tekstcorrecties:
    - STARR placeholder `Beschrijf het resultaat`
    - `Veranderkleuren` -> `Waardenkleuren`
  - Rugzak-opdracht aangescherpt naar:
    - primaire socialisatie
    - secundaire socialisatie
    - identiteit
    - reflectie
  - Start Deel 3 verwijst nu naar live URL van MAPS 3.
- MAPS 2 (`apps/moral-maps-2-crossroads`)
  - Voortgang met bolletjes toegevoegd op overzichtspagina én opdrachtpagina.
  - GPS-terminologie doorgevoerd in relevante content.
- MAPS 3 (`apps/moral-maps-3-final-destination`)
  - Drie nieuwe opdrachten toegevoegd als **eigen pagina’s** in `stepOrder`:
    - `passie`
    - `mensen`
    - `nalatenschap`
  - Opslagmodel uitgebreid voor nieuwe velden.
  - Voortgang met bolletjes toegevoegd op overzichts- en opdrachtpagina.

### URL-check live (huidige productie)
- MAPS 1: `https://moral-maps.vercel.app`
- MAPS 2: `https://moral-maps-2-crossroads.vercel.app`
- MAPS 3: `https://moral-maps-3-final-destination.vercel.app`

### Opmerking
- Bovenstaande codewijzigingen zijn lokaal aangebracht; productie-URL’s tonen pas de laatste versie na deploy.

## 2026-05-08 - MAPS 1 losgezet + images-map

### Uitgevoerd
- Nieuwe app aangemaakt: `apps/moral-maps-1-the-beginning`.
- Basisbestanden toegevoegd in deze app:
  - `index.html`
  - `vite.config.js`
  - `eslint.config.js`
  - `src/main.jsx`
  - `src/index.css`
  - `package.json`
- Nieuwe afbeeldingsmap toegevoegd:
  - `apps/moral-maps-1-the-beginning/public/images/.gitkeep`
- Root scripts omgezet zodat standaard MAPS 1-app wordt gestart vanuit de nieuwe app-map.
- Assetpaden in `src/MoralMaps.jsx` aangepast naar `/images/...` voor consistente image-resolving.
- Ook op rootniveau een images-map toegevoegd:
  - `public/images/.gitkeep`

## 2026-05-08 - Afbeeldingen opschonen + pauze

### Uitgevoerd
- Fallback voor SMS-afbeelding verwijderd uit `src/MoralMaps.jsx`:
  - `SMS_EVENT_FALLBACK` verwijderd.
  - `onError` fallback op de SMS `<img>` verwijderd.
- MAPS-afbeeldingsset opgeschoond conform instructie:
  - Werkblad-verwijzingen verwijderd uit MAPS-flow.
  - `socialisatie-ui-analyse` niet meer gebruikt in MAPS-flow.
- Naamconventie bevestigd: primair `.jpg` voor illustraties; `trilogie-hero-map.svg` blijft vector.

### Volgende acties (na pauze)
1. Bestand lokaal hernoemen naar de definitieve naam:
   - `moral-maps-sms-dilemma.jp.png` -> `sms-koud-station.jpg`
2. Beelden per app-map plaatsen:
   - `apps/moral-maps-1-the-beginning/public/images`
   - `apps/moral-maps-2-crossroads/public/images`
   - `apps/moral-maps-3-final-destination/public/images`
3. Missende beelden genereren (laatste afgesproken lijst zonder werkbladen/socialisatie-analyse).
4. Per app een smoke test draaien (home + 1 opdracht met afbeelding).
5. Daarna pas committen met korte changelogregel.

## 2026-05-08 - UX finetune trilogie + Deel 3 parity

### Uitgevoerd
- Teksten en terminologie geharmoniseerd op Google Maps-analogie:
  - `kompas` in zichtbare UI-teksten vervangen door `morele GPS`/`interne GPS` waar passend.
  - `Caluwé`-verwijzingen verwijderd uit appbeleving; alleen bronvermelding behouden.
- MAPS 1 (`src/MoralMaps.jsx`):
  - Formuleringen aangescherpt (o.a. privilege-uitleg, GPS-terminologie, routeplan-tekst).
  - Overzichtspagina geoptimaliseerd met beeldplaatsing richting Deel 2.
- MAPS 2:
  - Wegkeuze opgesplitst naar drie eigen afbeeldingnamen voor drie opdrachten:
    - `maps2-wegkeuze-goede-niet-gedaan.jpg`
    - `maps2-wegkeuze-zwijgen.jpg`
    - `maps2-wegkeuze-moeilijk-of-fout.jpg`
- MAPS 3 standalone (`apps/moral-maps-3-final-destination`):
  - Landingtekst herschreven met vriendelijke inleiding.
  - Per opdrachtpagina labels en introblokken verbeterd (scharnierpunt/vooruitblik/reisverslag).
  - Knop toegevoegd: `Opslaan en afsluiten` (lokaal opslaan + veilige sluitmelding).
- Gecombineerde flow (`src/MoralMaps.jsx`) Deel 3 parity:
  - Deel 3 opgesplitst in opeenvolgende pagina’s (brug, terugblik, passie, mensen, nalatenschap, vooruitblik, reisverslag, actieplan).
  - Voortgangsbollen toegevoegd.
  - Vorige/Volgende-knoppen toegevoegd.
  - Per stap eigen visual + passende inleidende teksten toegevoegd.

### Volgende stappen
1. Eind-smoketest op alle 3 URL’s na deploy:
   - `https://moral-maps.vercel.app`
   - `https://moral-maps-2-crossroads.vercel.app`
   - `https://moral-maps-3-final-destination.vercel.app`
2. Checklijst voor testers delen:
   - per opdracht eigen pagina
   - per opdracht eigen afbeelding
   - voortgangsbollen zichtbaar
   - vorige/volgende navigatie werkt
   - PDF/opslaan werkt op overzichtspagina
3. Daarna committen en deploy afronden naar productie.

## 2026-05-11 - Deploypoging MAPS 3 (vanaf agent)

### Uitgevoerd
- Nieuwste logboekstatus opnieuw opgehaald en gecontroleerd.
- In `apps/moral-maps-3-final-destination` deploystappen uitgevoerd:
  - `npm run build`
  - `vercel --prod --yes`
- Extra verificatie geprobeerd op live URL.

### Resultaat
- Commando's eindigden met exit code 0 in deze omgeving, maar zonder zichtbare stdout/stderr.
- Live check toont nog oude titel (`Moral Maps 3: Je ware koers`), dus de nieuwste versie staat nog niet bevestigd live.

### Volgende directe stap
1. In dezelfde map lokaal nogmaals draaien:
   - `vercel --prod --yes`
2. Daarna meteen live verifiëren op:
   - `https://moral-maps-3-final-destination.vercel.app`
   - titel moet zijn: `Moral Maps 3: Final Destination`

## 2026-05-11 - MAPS 3 deploy definitief gelukt

### Resultaat
- Productie staat nu op de nieuwste versie van MAPS 3.
- Live bevestiging zichtbaar met:
  - titel/landing: **Final Destination**
  - CTA: **Start Final Destination**
  - knop: **Download verslag deel 1-2-3**
  - knop: **Opslaan en afsluiten**

### Oorzaak van eerdere deploy-fout
- Vercel project-link en rootdirectory pad stonden niet goed uitgelijnd, waardoor een dubbel pad werd gezocht.
- Opgelost door opnieuw te linken met `vercel link` naar bestaand project en daarna productie deploy uit te voeren.

### Bevestigde live URL
- `https://moral-maps-3-final-destination.vercel.app`

## 2026-05-11 - Algemene ontwerp- en bouwregels (geldig voor MAPS 1, 2 en 3)

Deze sectie is de vaste referentie voor trilogie-consistentie. Wijzigingen in een deel moeten hiertegen getoetst worden.

### 1) UX- en ontwerpregels (gemeenschappelijk)
- Elke app start met een **landingspagina** met:
  - korte context van het deel;
  - duidelijke start-CTA;
  - zichtbare voortgang of route-indicatie.
- **1 opdracht = 1 pagina** (geen multi-opdracht pagina's in de eindversie).
- Elke opdracht heeft een **eigen afbeelding** die inhoudelijk past bij de opdracht.
- Navigatie is lineair en begrijpelijk:
  - **Vorige** / **Volgende**;
  - terug naar overzicht waar logisch;
  - duidelijke CTA's op afrondmomenten.
- Visuele stijl is clean en rustig:
  - veel witruimte;
  - afgeronde cards/secties;
  - zachte schaduwen;
  - consistente spacing en typografie.
- Taal en terminologie blijven consistent binnen de trilogie:
  - GPS/reis-metafoor;
  - professionele, laagdrempelige uitleg;
  - korte microtoelichtingen per opdracht.
- Mobielvriendelijk gedrag is standaard:
  - responsive layout;
  - leesbare inputvelden;
  - knoppen met voldoende tap-target.

### 2) Functionele regels (gemeenschappelijk)
- Invoer wordt automatisch opgeslagen (draft/autosave), minimaal lokaal.
- Deelnemer kan het traject hervatten zonder alles opnieuw in te vullen.
- Voortgang is zichtbaar (percentage en/of voortgangsbollen).
- Exportfunctionaliteit is aanwezig:
  - PDF/print per deel of routeverslag waar van toepassing;
  - portfolio-export over meerdere delen waar voorzien.
- Routing tussen delen (1 -> 2 -> 3) moet altijd naar de juiste live appversie verwijzen.

### 3) Technische regels (gemeenschappelijk)
- Frontendstack per deel:
  - Next.js App Router + TypeScript (MAPS 2 en MAPS 3);
  - MAPS 1 is in transitie, maar volgt dezelfde UX-regels.
- Styling via Tailwind/CSS utility-benadering met consistente design tokens.
- State-opslag:
  - lokale opslag (`localStorage`) voor draft/herstel;
  - waar aanwezig: backend-opslag voor sessie/hervatten.
- Deploystandaard:
  - Vercel per app;
  - correcte rootdirectory per project;
  - preflight: lint + build vóór livegang.

### 4) Sessie, inloggen en data
- "Inloggen" in de trilogie is functioneel opgezet als deelnemeridentificatie:
  - naam/code, groep, leeftijd of participant code (afhankelijk van deel);
  - gericht op hervatten en koppelen van voortgang.
- Geen zware accountflow vereist voor basisgebruik; focus op snelle instap voor deelnemers.
- Data moet veilig en voorspelbaar opgeslagen worden met fallbackgedrag als online opslag faalt.

### 5) Export- en portfolioregels
- Exports zijn printvriendelijk en bruikbaar voor onderwijs/portfolio.
- Inhoud van export is semantisch opgebouwd:
  - kernkeuzes;
  - reflecties per opdracht;
  - eindinzichten/actiepunten.
- Waar mogelijk wordt een gecombineerde export ondersteund voor trilogie-overzicht.

### 6) Kwaliteits- en acceptatiecriteria (voor alle delen)
- Voor livegang:
  - lint groen;
  - build groen;
  - smoke test op productie-URL.
- Minimale smoke test:
  1. landingspagina laadt;
  2. opdrachten openen per pagina;
  3. afbeeldingen tonen correct;
  4. invoer blijft bewaard na refresh;
  5. exportknoppen werken;
  6. navigatie naar volgend deel werkt.
- Elke wijziging wordt vastgelegd in `LOGBOEK.md` met:
  - wat is aangepast;
  - wat is gevalideerd;
  - wat is de eerstvolgende stap.

## 2026-05-11 - Collega-checklist (inhoud & didactiek, niet-technisch)

Gebruik deze lijst bij review van opdrachten en leerervaring (zonder technische beoordeling).

### A) Begrijpelijkheid per opdracht
- Is in 1 oogopslag duidelijk wat de deelnemer moet doen?
- Is de vraagtaal concreet genoeg (niet te abstract, niet te vaag)?
- Is de opdrachttekst niet te lang, maar wel volledig?
- Helpt de korte uitleg de deelnemer echt op weg?
- Is het taalniveau passend voor de doelgroep?

### B) Inhoudelijke passendheid
- Past de opdracht logisch binnen de fase van de reis (begin/onderweg/bestemming)?
- Sluit de opdracht aan op kernwaarden en morele keuzes?
- Is de opdracht relevant voor praktijk/werkcontext van deelnemers?
- Voelt de opdracht als verdieping en niet als herhaling?
- Zijn voorbeelden en woorden inclusief en herkenbaar?

### C) Volgorde en opbouw
- Zit er een duidelijke opbouw in moeilijkheid en reflectiediepte?
- Is de overgang tussen opdrachten logisch en natuurlijk?
- Komt terugblik pas na voldoende ervaring/opdrachten?
- Volgt vooruitblik op een geloofwaardige manier uit eerdere antwoorden?
- Is de eindopdracht een echte synthese van het hele deel?

### D) Volledigheid van het deel
- Missen er opdrachten om van inzicht naar actie te komen?
- Missen er opdrachten die sociale context (anderen/systeem) meenemen?
- Is er voldoende balans tussen persoonlijke en professionele reflectie?
- Is er een concrete vertaalslag naar gedrag of volgende stap?
- Is de set opdrachten samen niet te zwaar of te licht?

### E) Kwaliteit van leerervaring
- Helpt dit deel deelnemers om eerlijker naar keuzes te kijken?
- Ontstaat er door de vragen echte zelfreflectie i.p.v. oppervlakkige invulling?
- Nodigen opdrachten uit tot eigenaarschap en verantwoordelijkheid?
- Geeft het deel vertrouwen om volgende keuzes beter te maken?
- Zou jij deze opdrachtset zelf als deelnemer waardevol vinden?

## 2026-05-11 - Wat Deel 3 goed doet (en toepassen op Deel 1/2)

### Sterktes van Deel 3 (huidige kwaliteit)
- Rustige, volwassen landing met heldere toon en duidelijke route.
- Sterke microcopy: korte toelichting per stap maakt vragen begrijpelijker.
- Duidelijke progressie: deelnemers voelen dat ze "verder in het verhaal" komen.
- Goede balans tussen reflectie (terugkijken) en concrete richting (vooruitkijken).
- Sterke CTA's (start, opslaan, gecombineerd verslag) geven regie en afronding.

### Aanscherping voor Deel 1
- Per opdracht 1 extra "waarom deze vraag" zin toevoegen (zoals Deel 3).
- Nog explicieter onderscheid maken tussen verkennen (waarden) en kiezen (kernwaarden).
- Aan einde van Deel 1 een compacte "tussenbalans" toevoegen:
  - wat heb je ontdekt?
  - wat neem je mee naar Deel 2?
- STARR en Reisverslag laten eindigen met 1 concrete gedragsintentie.

### Aanscherping voor Deel 2
- Bij elke opdracht standaard 1 reflectie-opener toevoegen (consistent met Deel 3-stijl).
- Route-opbouw explicieter maken met "waar sta je nu op de reis?" boven elke stap.
- In wegkeuze/socialisatie scherper verschil aanbrengen tussen:
  - "wat voelde goed"
  - "wat was volgens je kernwaarden juist"
- Afronding van Deel 2 versterken met een mini-syntheseblok:
  - grootste inzicht,
  - grootste spanningspunt,
  - 1 keuze die je in Deel 3 anders wilt maken.

## 2026-05-11 - Snelle 10-vragen review (collega's)

Gebruik deze lijst voor een korte inhoudelijke kwaliteitscheck (niet-technisch).  
Antwoord per vraag met: **Ja / Deels / Nee** + korte opmerking.

1. Is het doel van dit deel (Begin/Onderweg/Bestemming) meteen duidelijk?
2. Is per opdracht direct helder wat de deelnemer moet doen?
3. Is de formulering van de vragen begrijpelijk en niet onnodig abstract?
4. Past elke opdracht logisch bij de fase van de reis?
5. Zitten er opdrachten in die overbodig, dubbel of niet-passend voelen?
6. Mis je een opdracht die nodig is voor een complete leerroute?
7. Is de volgorde van opdrachten logisch opgebouwd (van verkennen naar verdiepen naar kiezen)?
8. Helpen de opdrachten deelnemers om keuzes te koppelen aan kernwaarden?
9. Leidt dit deel tot een concrete volgende stap in gedrag of handelen?
10. Zou jij dit deel, in deze vorm, gebruiken met echte deelnemers?

### Snelle duiding
- **8-10x Ja** -> klaar voor gebruik.
- **5-7x Ja** -> goed, maar eerst aanscherpen.
- **0-4x Ja** -> herontwerp nodig op inhoud/volgorde.

## 2026-05-11 - Lokaal wijzigingsplan vastgelegd

### Opgeleverd
- Uitvoerbaar lokaal plan voor kwaliteitsharmonisatie van alle drie delen opgeslagen als:
  - `LOKAAL_WIJZIGINGSPLAN_TRILOGIE_2026-05-11.md`

### Doel van dit plan
- Niveau van Deel 3 systematisch doortrekken naar Deel 1 en Deel 2 via:
  - microcopy-patroon;
  - tussenbalansmomenten;
  - mini-synthese;
  - consistente doorstroomteksten.

## 2026-05-11 - Teamafspraak anonimiteit en koppeling Deel 1-2-3

Doel: deelnemers anoniem laten werken en toch output uit alle drie delen betrouwbaar koppelen.

### A) Identificatieprincipe
- Elke deelnemer werkt met een unieke **participant code** (geen naam/e-mail als sleutel).
- Deze code is de enige functionele sleutel voor koppeling tussen Deel 1, Deel 2 en Deel 3.
- Optioneel mag een niet-herleidbare **groepcode** gebruikt worden voor klas/cohortanalyse.

### B) Wat we wel en niet opslaan
- Wel opslaan:
  - participant code (of hash ervan);
  - deel-specifieke antwoorden;
  - voortgangsstatus per deel;
  - tijdstempel.
- Niet opslaan:
  - direct herleidbare persoonsgegevens (naam, e-mail, studentnummer) als koppel-ID.

### C) UX-afspraken in alle delen
- Op landingspagina tonen:
  - "Verdergaan met code";
  - korte uitleg waarom code belangrijk is.
- Bij opslaan/export altijd participant code zichtbaar meenemen.
- In elk deel moet hervatten met dezelfde code mogelijk zijn.

### D) Privacy-afspraken
- Participant code wordt als pseudoniem behandeld.
- Als extra privacymaatregel mag code server-side gehasht worden (aanbevolen bij opschaling).
- Dataretentie periodiek uitvoeren volgens onderwijsafspraak (bijv. opschonen na afgesproken termijn).

### E) Operationele consequentie
- Gecombineerde output (portfolio over 1-2-3) wordt altijd opgebouwd op basis van participant code.
- Verlies van code betekent:
  - geen automatische herleiding naar eerdere sessie zonder aparte beheersprocedure.

## Backlog — volgende verbetering (2026)

- **Zachtere fout-UX bij cloud-save in Deel 1 (`MoralMaps.jsx`):** wanneer online opslaan of hervatten via Supabase faalt, nu soms `setSaveErr` + lange melding of `alert`. Voor een volgende ronde: copy korter/vriendelijker, niet-blokkerend (bijv. toast of banner), en duidelijk maken dat **lokale fallback** gewoon werkt zodat gebruikers geen onnodige “fout”-ervaring krijgen. Optioneel: `resumeWithCode` bij DB-fout onderscheiden van “geen sessie” (geen technische ruis tonen).
