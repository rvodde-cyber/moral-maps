# MAPS 2 Crossroads - Session Context

Dit bestand is bedoeld om na elke pauze direct verder te kunnen werken zonder contextverlies.

## Productdoel

MAPS 2: Crossroads is Deel 2 van de trilogie.
Metafoor: de reis door het leven.
Focus: morele keuzes op kruispunten, energiebalans, onderhoud, hulp vragen/geven en koers houden in mist.

## Relatie met Deel 1 en Deel 3

- Deel 1 (The Beginning): bepaalt vertrekpunt en kernwaarden.
- Deel 2 (Crossroads): route, afslagen, herstel en koers.
- Deel 3 (nog te bouwen): bestemming, bijdrage en impact.

## Reeds gebouwd in deze sessie

- Nieuwe app aangemaakt:
  - `apps/moral-maps-2-crossroads`
  - Next.js App Router + TypeScript + Tailwind + ESLint
- Eerste werkende versie van de hoofdflow in:
  - `src/app/page.tsx`
- Ingebouwde modules:
  1. De Kruising
  2. Brandstof
  3. Morele APK
  4. Pech & Hulp
  5. Mist & Zicht
- Per module:
  - 2 reflectie-opdrachten
  - tekstveld per opdracht
  - koerszekerheidsscore (1-5)
- Routeverslag:
  - voortgangspercentage
  - aantal ingevulde opdrachten
  - gemiddelde koersscore
- Sessiepersistentie:
  - autosave in `localStorage` via key `maps2-crossroads-v1`
- Export:
  - download JSON snapshot van ingevulde route

## Nog te bouwen (backlog)

1. Koppeling met data uit Deel 1 (API of importbestand)
2. Visuele "kaart" met echte route-overgangen en micro-interacties
3. Scenario-engine met meerdere keuzepaden en consequenties
4. STARR-koppeling tussen modules en eindreflectie
5. Coach-/docentview (optioneel geanonimiseerd groepsbeeld)
6. Professionele PDF-export in plaats van JSON
7. Voorbereiding op Deel 3 data-overdracht

## Designrichting

- Zakelijk, modern, veel witruimte (Apple-stijl)
- Rustige typografie en duidelijke informatielaag
- Subtiele animaties (later met Framer Motion)

## Praktische vervolgstart

1. Start dev server:
   - `npm run dev` in `apps/moral-maps-2-crossroads`
2. Open `src/app/page.tsx` voor feature-uitbreiding
3. Werk dit contextbestand bij na elke sessie
