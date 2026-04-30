# Moral Maps Quick Start

Gebruik dit als startprompt voor elke nieuwe educatieve app.

## 1) Doel en scope

- Formuleer 1 leerdoel voor de app.
- Definieer 6-12 opdrachten.
- Elke opdracht krijgt:
  - 1 unieke `id`
  - 1 reflectievraag
  - 1 afbeelding (`imageSrc`, `imageAlt`)

## 2) Basisskelet

- `src/lib/content.ts`: alle opdrachten en fasen
- `src/lib/storage.ts`: localStorage helpers
- `src/app/page.tsx`: overzicht/start
- `src/app/opdracht/[promptId]/page.tsx`: detailpagina per opdracht
- `src/app/opdracht/[promptId]/loading.tsx`: loading state

## 3) UX-regels

- 1 opdracht per pagina
- vorige/volgende navigatie
- voortgang zichtbaar
- autosave actief
- duidelijke afronding/terug naar overzicht

## 4) UI-regels

- rustige cards, veel witruimte
- maximaal 1 primaire accentkleur
- subtiele animaties (Framer Motion)
- afbeeldingen via `next/image`

## 5) Quality gate (verplicht)

- `npm run lint`
- `npm run build`
- mobiel/desktop check
- toetsenbordnavigatie check
- alt-teksten check
