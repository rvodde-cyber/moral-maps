# Start Hier - Versiebeheer & Deploy

Gebruik dit bestand als snelle ingang voor GitHub + Vercel status.

## 1) Huidige hoofdstatus

- MAPS 1 live: `https://moral-maps.vercel.app`
- MAPS 2 live: `https://moral-maps-2-crossroads.vercel.app`
- MAPS 3: app-skeleton staat klaar in `apps/moral-maps-3-final-destination` (nog deployen)

## 2) Waar je eerst kijkt

1. `LOGBOEK.md` (laatste sessie + volgende stap)
2. `RUNBOOK_MAPS_LIVEGANG.md` (operationeel stappenplan)
3. GitHub branch `feat/maps-flow-update` (laatste werkbranch)

## 3) Snelle GitHub workflow

1. Push branch updates.
2. Maak/merge PR naar `main`.
3. Controleer dat `main` de nieuwste commit bevat.
4. Start daarna pas Vercel deploy.

## 4) Snelle Vercel workflow

- MAPS 1 project:
  - root: `moral aps`
- MAPS 2 project:
  - root: `apps/moral-maps-2-crossroads`
- MAPS 3 project (nieuw):
  - root: `apps/moral-maps-3-final-destination`

## 5) Afsluitregel na elke sessie

Werk altijd bij in `LOGBOEK.md`:
- wat is opgeleverd;
- welke checks groen zijn (lint/build/deploy);
- URL/status per app;
- eerstvolgende concrete stap.
