# App Migration Template

Gebruik deze template om een bestaande app naar de Moral Maps standaard te migreren.

## A. Intake

- Huidige app:
- Doelgroep:
- Belangrijkste knelpunten:
- Gewenste opleverdatum:

## B. Huidige situatie

- Routes:
- Data-opslag:
- Componentstructuur:
- UI-problemen:
- Toegankelijkheidsproblemen:

## C. Doelarchitectuur

- [ ] Next.js App Router + TypeScript
- [ ] Content in `src/lib/content.ts`
- [ ] Storage in `src/lib/storage.ts`
- [ ] 1 opdracht per pagina (`/opdracht/[promptId]`)
- [ ] Loading state per dynamische route
- [ ] `next/image` configuratie compleet

## D. Migratieplan in fasen

### Fase 1 - Structuur
- [ ] Mappenstructuur aanmaken
- [ ] Data/types centraliseren

### Fase 2 - UX Flow
- [ ] Overzichtspagina bouwen
- [ ] Opdrachtpagina met vorige/volgende
- [ ] Voortgang + autosave

### Fase 3 - UI polish
- [ ] Consistente spacing/typografie
- [ ] Subtiele animaties
- [ ] Responsive controle

### Fase 4 - Validatie
- [ ] Lint/build groen
- [ ] A11y basiscontrole
- [ ] Acceptatietest met 2-3 echte scenario's

## E. Definition of Done

- [ ] Technische checks groen
- [ ] UX-flow compleet en begrijpelijk
- [ ] Visuele stijl consistent
- [ ] Documentatie bijgewerkt
