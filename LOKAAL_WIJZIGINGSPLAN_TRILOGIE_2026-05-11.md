# Lokaal wijzigingsplan trilogie (MAPS 1, 2, 3)

Datum: 2026-05-11  
Status: Werkplan voor lokale implementatie, gericht op kwaliteitsniveau van Deel 3 in alle delen.

## 0. Doel

Alle drie delen moeten dezelfde didactische kwaliteit hebben:
- heldere microcopy per opdracht;
- tussenbalansmomenten;
- mini-synthese per deel;
- consistente reflectie-opbouw van keuze -> afweging -> inzicht -> actie.

## 1. Scope

In scope:
- inhoudelijke en UX-tekstaanpassingen;
- beperkte UI-uitbreidingen voor tussenbalans/synthese;
- geen fundamentele architectuurmigratie.

Out of scope:
- volledige herbouw van MAPS 1 naar nieuwe stack;
- wijziging van datamodel buiten noodzakelijke velden voor synthese/tussenbalans.

## 2. Werkpakketten

### WP1 - Standaard microcopy-patroon (alle delen)

Doel:
- per opdracht dezelfde structuur in uitleg.

Patroon:
- korte contextzin;
- vraagdoelzin ("Deze opdracht helpt je om...");
- reflectie-opener.

Bestanden:
- MAPS 1: `src/MoralMaps.jsx`
- MAPS 2: `apps/moral-maps-2-crossroads/src/app/opdracht/[promptId]/page.tsx`
- MAPS 3: `apps/moral-maps-3-final-destination/src/app/opdracht/[step]/page.tsx`

Acceptatie:
- elke opdrachtpagina bevat minimaal 1 duidelijke uitlegzin boven input.

### WP2 - Deel 1 tussenbalans + gedragsintentie

Doel:
- overgang van verkennen naar kiezen versterken.

Aanpassingen:
- tussenbalans-card na kernwaarden:
  - wat valt op?
  - welke waarde stuurt nu?
- STARR-uitgang met 1 extra veld:
  - "Mijn concrete volgende stap in gedrag".

Bestand:
- `src/MoralMaps.jsx`

Acceptatie:
- deelnemer sluit Deel 1 af met expliciete intentie voor Deel 2.

### WP3 - Deel 2 mini-tussenstop + mini-synthese

Doel:
- losse opdrachten samenbrengen tot 1 routeverhaal.

Aanpassingen:
- halverwege tussenstop-blok:
  - grootste spanningspunt;
  - keuze die je nu anders zou wegen.
- eindblok mini-synthese:
  - grootste inzicht;
  - grootste spanning;
  - intentie voor Deel 3.

Bestanden:
- `apps/moral-maps-2-crossroads/src/lib/crossroads-storage.ts` (nieuwe velden)
- `apps/moral-maps-2-crossroads/src/app/opdracht/[promptId]/page.tsx`
- `apps/moral-maps-2-crossroads/src/app/page.tsx` (samenvatting/zichtbaarheid)

Acceptatie:
- Deel 2 eindigt met concrete brug naar Deel 3.

### WP4 - Doorstroomteksten harmoniseren (1 -> 2 -> 3)

Doel:
- consistente reisnarratief tussen apps.

Aanpassingen:
- eindcopy Deel 1 wijst expliciet op morele spanning in Deel 2.
- eindcopy Deel 2 wijst expliciet op integratie/actie in Deel 3.
- terminologie aligneren: kernwaarden, interne/morele GPS, routekeuze.

Bestanden:
- `src/MoralMaps.jsx`
- `apps/moral-maps-2-crossroads/src/app/page.tsx`
- `apps/moral-maps-3-final-destination/src/app/page.tsx`

Acceptatie:
- overgangsteksten voelen als 1 doorlopend leerpad.

### WP5 - Collega-review + afronding

Doel:
- inhoudelijke validatie met snelle vragenlijst.

Aanpak:
- gebruik sectie "Snelle 10-vragen review (collega's)" uit `LOGBOEK.md`;
- verzamel opmerkingen;
- voer 1 finale copy- en flow-ronde uit.

Acceptatie:
- scoredoel: minimaal 8/10 "Ja" per deel.

## 3. Volgorde van uitvoering

1. WP1 (microcopy patroon)  
2. WP2 (Deel 1 tussenbalans + intentie)  
3. WP3 (Deel 2 tussenstop + synthese)  
4. WP4 (doorstroomteksten)  
5. WP5 (review + afronding)

## 4. Testprotocol lokaal (kort)

Per deel:
1. landing openen;
2. 2 opdrachten invullen;
3. tussenbalans/synthese zichtbaar checken;
4. refresh en autosave checken;
5. doorstroom naar volgende deel checken.

## 5. Definitie van gereed

- alle werkpakketten uitgevoerd;
- copy consistent met Deel 3-kwaliteit;
- lokale lint/build groen op MAPS 2 en MAPS 3;
- logboek bijgewerkt met oplevernotitie en resterende actiepunten.
