# Moral Maps — Trilogie

> Een interactieve morele reis in drie delen voor HBO-studenten en professionals.

---

## De Trilogie

| Deel | Titel | URL | Tech |
|------|-------|-----|------|
| 1–3 | **Moral Maps Trilogie** | moral-maps.vercel.app | React + Vite |
| 2 (oud) | Crossroads | moral-maps-2-crossroads.vercel.app | redirect naar de hoofdapp |
| 3 (oud) | Final Destination | moral-maps-3-final-destination.vercel.app | redirect naar de hoofdapp |

De trilogie leeft in één app (`src/MoralMaps.jsx`). De oude Vercel-projecten voor Deel 2 en 3 blijven bestaan zodat bestaande URL’s blijven werken; ze sturen door naar `moral-maps.vercel.app`.

---

## Wat doet de app?

Studenten en professionals doorlopen een morele reis:

1. **De Kaart** — 10 waarden kiezen uit 35
2. **De GPS** — 3 kernwaarden aanwijzen
3. **De Route** — reageren op morele dilemma's (2 van 6, willekeurig)
4. **STARR Reflectie** — eigen ervaring beschrijven
5. **Reisverslag** — exporteerbaar als PDF

In deel 2 navigeer je kruispunten. In deel 3 bepaal je je eindbestemming.

---

## Repository structuur

```
moral-maps/
├── src/                              ← Deel 1 (React + Vite)
│   ├── MoralMaps.jsx                 ← Hoofdcomponent
│   ├── HalteCrossroads.jsx           ← Tussenpagina deel 1 → 2
│   ├── HalteFinalDestination.jsx     ← Tussenpagina deel 2 → 3
│   └── MapsLanding.jsx               ← Reserve landingspagina
├── apps/
│   ├── moral-maps-2-crossroads/      ← Redirect-stub (oud Vercel-project)
│   └── moral-maps-3-final-destination/ ← Redirect-stub (oud Vercel-project)
├── public/                           ← Gedeelde assets
└── LOGBOEK.md                        ← Sessielog met versiebeheer
```

---

## Supabase

Tabel: `moralmaps_results`

| Kolom | Type | Inhoud |
|-------|------|--------|
| group_code | TEXT | Groepscode |
| age | TEXT | Leeftijdscategorie |
| core_values | JSONB | Kernwaarden [{id, name, color}] |
| dilemma_responses | JSONB | Keuzes [{text, color}] |
| starr | JSONB | {situatie, taak, actie, resultaat, reflectie} |
| dominant_color | TEXT | Dominante veranderkleur |
| vreemde_ander | JSONB | Reflectie de vreemde ander |
| socialisatie | JSONB | Socialisatieverslag |

---

## Deployment

Vercel deployt automatisch bij elke push naar `main`.

| Project | Root Directory | Opmerking |
|---------|---------------|-----------|
| moral-maps | `/` (root) | de echte app |
| moral-maps-2-crossroads | `apps/moral-maps-2-crossroads` | redirect-stub |
| moral-maps-3-final-destination | `apps/moral-maps-3-final-destination` | redirect-stub |

---

## Credits

Dit project maakt deel uit van de reeks **Moreel Vakmanschap** van het [Fontys Lectoraat Ethisch Werken](https://www.linkedin.com/company/lectoraat-ethisch-werken-bijdragen).

Fontys HRM en TP · Richard Voddé MCC

---

*Ontwikkeld met Claude (Anthropic)*
