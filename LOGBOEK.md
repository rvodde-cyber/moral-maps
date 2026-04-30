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
