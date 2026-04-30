# Worklog

## 2026-04-30 - Sessie status

### Opgeleverd
- App omgezet naar 1 opdracht per pagina met dynamische route: `src/app/opdracht/[promptId]/page.tsx`
- Loading state toegevoegd: `src/app/opdracht/[promptId]/loading.tsx`
- Eigen afbeelding per opdracht via contentmodel in `src/lib/crossroads-content.ts`
- Local storage helper gecentraliseerd in `src/lib/crossroads-storage.ts`
- Home/overzicht vernieuwd in `src/app/page.tsx`
- `framer-motion` toegevoegd en subtiele page transition ingebouwd
- `next/image` geactiveerd + externe image host toegestaan in `next.config.ts`
- Documentatieset toegevoegd:
  - `APP_STANDARD.md`
  - `APP_QUICKSTART.md`
  - `APP_MIGRATION_TEMPLATE.md`

### Laatste naming update
- Naam van de standaard gewijzigd naar: **Standaard app structuur**
- Verwerkt in:
  - `APP_STANDARD.md` (titel + intro)
  - `README.md` (verwijzing)

### Open punten voor volgende sessie
- Progress bar component op opdrachtpagina toevoegen
- "Autosave opgeslagen" micro-feedback tonen
- Eventueel shadcn/ui componentenlaag introduceren voor knoppen/cards
- E2E gebruikersflow testen (start -> alle opdrachten -> afronding)
