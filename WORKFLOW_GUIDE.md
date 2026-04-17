# Workflow Guide (Gemini + Cursor + GitHub + Vercel)

## Idee naar live in stappen

1. Werk je idee kort uit (doel, scope, acceptatiecriteria).
2. Laat Cursor 1 concrete taak tegelijk bouwen.
3. Test lokaal:
   - `npm run lint`
   - `npm run build`
4. Commit en push:
   - `git add .`
   - `git commit -m "korte beschrijving"`
   - `git push`
5. Controleer Vercel deploy (preview/production).
6. Noteer kort wat gedaan is en wat de volgende stap is.

## Projecten gescheiden houden

- 1 project = 1 map
- 1 project = 1 GitHub repo
- 1 project = 1 Vercel project
- Per project eigen `.env` en `.env.example`
- Werk met branches: `feature/...`, `fix/...`, `chore/...`
- Zorg dat `.gitignore` minimaal bevat:
  - `node_modules/`
  - `dist/`
  - `.env`
  - `.vercel`

## Werken met meerdere projecten

- Gebruik 3 statussen: Now / Next / Later.
- Verdeel tijd:
  - 70% hoofdproject (bijna live / grootste impact)
  - 20% onderhoudproject
  - 10% vroeg project (kleine stap voor momentum)
- Houd per project een kort statusbestand bij met:
  - Fase
  - Huidige focus
  - Volgende taak
  - Blockers

## Deploy checklist

- Lint groen
- Build groen
- Juiste Vercel env vars aanwezig
- Kernflow getest
- Push naar `main`
- Productie URL getest

