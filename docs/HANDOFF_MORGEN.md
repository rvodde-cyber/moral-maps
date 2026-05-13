# Handoff — scheiding uitvoeren (bijgewerkt 2026-05-13)

Dit document vat vast wat **al in de Moral APS-repo** is gedaan zonder jouw GitHub-login, en wat jij nu nog in een paar stappen afmaakt.

---

## Statuscheck vandaag (2026-05-13)

- `C:\Users\876409\organisatie-lakmoesproef\.git\config` bestaat, maar heeft **nog geen `origin`**.
- `C:\Users\876409\.git\config` bestaat ook (per ongeluk `git init` op gebruikersroot). Deze moet weg.
- `C:\Users\876409\moral aps\.git\config` is correct (`origin = rvodde-cyber/moral-maps`).

### Eerst doen (veilig)

1. Verwijder **alleen** `C:\Users\876409\.git` (niet je andere mappen/bestanden).
2. Zet in `C:\Users\876409\organisatie-lakmoesproef\SETUP_GIT.ps1` de echte `$RemoteUrl`.
3. Run het script in die map en laat `git push -u origin main` slagen.
4. Pas daarna `git rm -r apps/organisatie-lakmoesproef` in de monorepo.

---

## Al gedaan (in deze workspace: `moral aps`)

| Onderdeel | Actie |
|-----------|--------|
| Scheiding beleid | `docs/SCHEIDING_MAPS_EN_ORGANISATIE_LAKMOES.md` — Maps vs organisatie-lakmoesproef |
| Root `package.json` | Scripts `dev/build/lint:organisatie` verwijderd; `dev:maps2` / `build:maps2` / `lint:maps2` toegevoegd |
| Root `README.md` | Alleen Moral Maps-trilogie + persoonlijke integriteitsmeting; verwijzing naar scheidingsdoc |
| `LOGBOEK.md` | Regel 2026-05-12 over scheiding |
| App-map (zolang die nog hier staat) | `apps/organisatie-lakmoesproef/MIGRATIE_APARTE_REPOSITORY.md`, `README`-noot, **`SETUP_GIT.ps1`** (PowerShell, zonder `origin`-detectiebug) |

**Let op:** `apps/organisatie-lakmoesproef/` staat **nog** in deze monorepo tot jij de standalone-repo op GitHub hebt en hier `git rm -r apps/organisatie-lakmoesproef` doet.

---

## Wat alleen jij kunt (accounts / jouw PC)

1. **Per ongeluk `git init` in `C:\Users\876409`?**  
   Als `C:\Users\876409\.git` bestaat: **verwijder alleen die map** `.git` (niet je andere mappen). Git hoort alleen in projectmappen.

2. **Standalone map** `C:\Users\876409\organisatie-lakmoesproef`  
   - Open `SETUP_GIT.ps1` daar (of kopieer de versie uit `moral aps\apps\organisatie-lakmoesproef\SETUP_GIT.ps1`).  
   - Vul `$RemoteUrl` met je **echte** GitHub-HTTPS-URL.  
   - Voer uit:
     ```powershell
     cd C:\Users\876409\organisatie-lakmoesproef
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
     .\SETUP_GIT.ps1
     ```
   - Volg login/token voor `git push`.

3. **GitHub**  
   - Repo aanmaken (leeg) als die nog niet bestaat.  
   - Controleren dat `main` de code bevat.

4. **Vercel** (project `organisatie-morele-lakmoestest` of nieuw)  
   - **Root Directory:** `.` (als de app in de **root** van de nieuwe repo staat).  
   - Build: `npm run build`, output: `dist`.  
   - Zie ook `apps/organisatie-lakmoesproef/VERCEL_PROFESSIONALISERING.md` (kopieer mee naar standalone-repo als je die map als enige publiceert).

5. **Daarna: uit monorepo verwijderen** (als standalone goed draait + gepusht):
   ```bash
   cd "C:\Users\876409\moral aps"
   git rm -r apps/organisatie-lakmoesproef
   git commit -m "chore: organisatie lakmoesproef naar eigen repository"
   git push
   ```

6. **PR op moral-maps**  
   Branch met bovenstaande wijzigingen → PR naar `main` → merge.

---

## Hervatten in één zin

> *“Verder met scheiding: standalone organisatie-lakmoesproef pushen, Vercel-root op `.`, daarna `git rm` uit moral aps — zie `docs/HANDOFF_MORGEN.md`.”*

---

*Pauze: geen verdere stappen verwacht vanuit deze sessie tot jij de push hebt afgerond.*
