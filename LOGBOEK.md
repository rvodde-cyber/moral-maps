# Logboek Moral APS

## 2026-04-20
- Nieuw project aangemaakt: `C:\Users\876409\moral aps` (kopie van `moral-maps`).
- Terminologie in de actieve flow geneutraliseerd naar `collega`, `medewerker` en `leidinggevende`.
- Stap 6 en 7 uit de appflow gehaald voor Deel 1:
  - `Socialisatieverslag` niet meer in de route.
  - eindverslagfase vervangen door een aparte afrondingspagina (`screen = done`).
- De route is nu gericht op Deel 1 (Vertrek), met een 5-stops communicatie op de landing.
- Afronding na STARR gaat nu direct via opslaan + done-scherm.
- Extra guard toegevoegd in dilemmaflow om door te gaan naar de volgende fase als de laatste vraag is bereikt.
- Build-check uitgevoerd: `npm run build` geslaagd.
- Projectnaam in `package.json` aangepast naar `moral-aps`.

## Trilogie-opzet
- Deel 1: Vertrek (huidige appflow).
- Deel 2: Onderweg (Crossroads) - later op basis van verwijderde onderdelen.
- Deel 3: Aankomst en terugblik (Final Destination) - later uit te werken.
