# Moral Maps — Trilogie

> Een interactieve morele reis in drie delen voor HBO-studenten en professionals.

---

## De Trilogie

| Deel | Titel | URL | Tech |
|------|-------|-----|------|
| 1 | **The Beginning** | moral-maps.vercel.app | React + Vite |
| 2 | **Crossroads** | moral-maps-2-crossroads.vercel.app | Next.js + Tailwind |
| 3 | **Final Destination** | moral-maps-3-final-destination.vercel.app | Next.js + Tailwind |

Alle drie de apps leven in deze repository, in aparte mappen. Vercel deployt elk project automatisch vanuit zijn eigen Root Directory.

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
│   ├── moral-maps-2-crossroads/      ← Deel 2 (Next.js)
│   └── moral-maps-3-final-destination/ ← Deel 3 (Next.js)
├── public/                           ← Gedeelde assets
└── LOGBOEK.md                        ← Sessielog met versiebeheer
```

---

## Opslag (100% lokaal)

Deel 1 gebruikt **geen backend of database**. Alle voortgang van de student
wordt lokaal op het toestel bewaard in `localStorage`, onder één sleutel:

```
moralmaps_journey
```

Dit object bevat de volledige reis (groepscode, leeftijdscategorie, gekozen
waarden, kernwaarden/GPS, dilemma-antwoorden, STARR, Rugzak, en welk deel/stap
actief is). Er worden geen omgevingsvariabelen gebruikt en er verlaat niets het
apparaat.

- **Hervatten:** bij het openen detecteert de app automatisch een bestaande
  reis en biedt "Welkom terug — doorgaan?" aan. Er is geen code meer nodig.
- **Wissen:** de knop "🗑 Wis mijn gegevens" verwijdert de sleutel volledig.
- **Let op:** de voortgang is toestel- en browsergebonden. Gebruik voor elk
  deel hetzelfde toestel en dezelfde browser, en werk niet in privénavigatie.

---

## Deployment

Vercel deployt automatisch bij elke push naar `main`.

| Project | Root Directory |
|---------|---------------|
| moral-maps | `/` (root) |
| moral-maps-2-crossroads | `apps/moral-maps-2-crossroads` |
| moral-maps-3-final-destination | `apps/moral-maps-3-final-destination` |

---

## Credits

Dit project maakt deel uit van de reeks **Moreel Vakmanschap** van het [Fontys Lectoraat Ethisch Werken](https://www.linkedin.com/company/lectoraat-ethisch-werken-bijdragen).

Fontys HRM en TP · Richard Voddé MCC

---

*Ontwikkeld met Claude (Anthropic)*
