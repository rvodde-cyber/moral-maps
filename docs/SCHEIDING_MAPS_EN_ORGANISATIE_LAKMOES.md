# Scheiding: Moral Maps (trilogie) ↔ Organisatie lakmoesproef

**Pauze / morgen verder:** zie **`docs/HANDOFF_MORGEN.md`** (checklist + wat al klaarstaat).

## Doel

- **Deze repository (`moral-maps` / `moral aps`)** is bedoeld voor de **Moral Maps-trilogie** en gerelateerde apps (zoals `persoonlijke-integriteitsmeting`), **niet** voor de organisatiescan.
- **Organisatie lakmoesproef** hoort in een **eigen GitHub-repository** en een **eigen Vercel-project**, zonder code te delen met Maps.

## Wat jij eenmalig doet (handmatig, lokaal)

### 1. Nieuwe repo op GitHub

Maak bijvoorbeeld: `rvodde-cyber/organisatie-lakmoesproef` (of gebruik bestaande `Lakmoesproef` / `morele-lakmoesproef` als die bedoeld is als thuisbasis).

### 2. Code uit deze monorepo halen

**Optie A — kopiëren (eenvoudig)**

1. Kopieer de map `apps/organisatie-lakmoesproef/` naar een nieuwe map op je schijf (bijv. `C:\Users\876409\organisatie-lakmoesproef`).
2. Verwijder daarin `node_modules` en `dist` als die meegekomen zijn.
3. In die nieuwe map:
   ```bash
   git init
   git add .
   git commit -m "Initial: organisatie lakmoesproef (standalone)"
   git branch -M main
   git remote add origin https://github.com/JOUW-ORG/organisatie-lakmoesproef.git
   git push -u origin main
   ```

**Optie B — uit git-historie (als je alleen die map wilt behouden)**

Gebruik `git filter-repo` (aanbevolen door Git) of een subtree-split; vraag desnoods hulp bij een eenmalige extractie.

### 3. Vercel aanpassen

Voor project `organisatie-morele-lakmoestest` (of nieuw project):

- **Root Directory:** `.` (repo-root van de **nieuwe** repo, niet meer `apps/organisatie-lakmoesproef`)
- **Build:** `npm run build`
- **Output:** `dist`

### 4. Uit **deze** monorepo verwijderen

Als de nieuwe repo goed staat en buildt:

```bash
git rm -r apps/organisatie-lakmoesproef
git commit -m "chore: verwijder organisatie-lakmoesproef (eigen repository)"
git push
```

Controleer daarna dat root-`package.json` en `README.md` geen verwijzingen meer naar `dev:organisatie` / die map bevatten (zie huidige versie in `main`).

### 5. Documentatie organisatie-app

Alle projectdocs blijven **in de organisatie-repo** (`README`, `BESCHRIJVING`, `ANALYSE`, `LOGBOEK`, `VERCEL_PROFESSIONALISERING.md`).  
Het Moral Maps-`LOGBOEK.md` op monorepo-niveau beschrijft **geen** lakmoesproef-details meer.

---

*Aangemaakt om verwarring tussen GitHub-repo’s (moral-maps vs Lakmoesproef) te voorkomen.*
