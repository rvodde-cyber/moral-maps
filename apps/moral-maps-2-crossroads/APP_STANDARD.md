# Standaard App Structuur v1

Deze standaard app structuur gebruiken we als vaste blueprint voor nieuwe apps en voor verbouwingen van bestaande apps.

## 1) Technische basis

- Framework: Next.js (App Router) met TypeScript.
- Styling: Tailwind CSS.
- UI: Shadcn/UI componenten waar zinvol, Lucide icons.
- Animatie: Framer Motion (subtiel, functioneel).
- Data:
  - Kleine/solo apps: localStorage + export.
  - Meerdere gebruikers of rapportage: Supabase of Prisma + Postgres.
- Image rendering: `next/image` + geconfigureerde `remotePatterns`.

## 2) Projectstructuur

Gebruik standaard deze opbouw:

```txt
src/
  app/
    page.tsx
    layout.tsx
    globals.css
    opdracht/
      [promptId]/
        page.tsx
        loading.tsx
  lib/
    content.ts
    storage.ts
    types.ts
  components/
    ui/
    shared/
```

Naamgeving:
- Data/content: `src/lib/*content*.ts`
- State/storage helpers: `src/lib/*storage*.ts`
- Herbruikbare UI: `src/components/shared/*`

## 3) UX-opbouw (educatieve flow)

Elke app bevat minimaal:

1. Intro + context
2. Overzicht van modules/opdrachten
3. 1 opdracht per pagina
4. Vorige/volgende navigatie
5. Voortgangsindicator
6. Autosave feedback
7. Afronding/export

Extra richtlijnen:
- Mobiel eerst ontwerpen.
- Schrijfvelden ruim en rustgevend.
- Geen overmatige animatie; micro-interacties alleen ter ondersteuning.

## 4) Visuele stijl (Apple-like)

- Veel witruimte, rustige hiërarchie.
- Typografie:
  - Duidelijke kopniveaus (`text-3xl`, `text-xl`, `text-sm`).
  - Compacte bodytekst met hoge leesbaarheid.
- Kleurgebruik:
  - Neutrale basis (slate).
  - 1 primaire accentkleur (bijv. teal) voor acties/status.
- Componentstijl:
  - Afgeronde cards (`rounded-2xl`), subtiele borders.
  - Zachte schaduwen, nooit zwaar.
  - Buttons als duidelijke primary/secondary.

## 5) Data- en contentmodel

Minimum `Prompt` model:

```ts
type Prompt = {
  id: string;
  title: string;
  question: string;
  imageSrc: string;
  imageAlt: string;
};
```

Regels:
- Elke opdracht heeft exact 1 afbeelding.
- `id` is stabiel en URL-veilig.
- Tekst is concreet, reflectief, actiegericht.

## 6) Kwaliteit en toegankelijkheid

Altijd checken:
- TypeScript compileert zonder errors.
- Lint zonder errors (warnings actief beoordelen).
- Toetsenbordnavigatie werkt.
- Voldoende kleurcontrast.
- Afbeeldingen hebben `alt`.
- Loading/empty/error states aanwezig.

## 7) Performance standaard

- Gebruik `next/image` waar mogelijk.
- Beperk client state tot wat nodig is.
- Splits grote pagina's in kleinere componenten.
- Lazy load waar logisch.

## 8) Release checklist (kort)

Voor release:
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Responsive check (mobile/tablet/desktop)
- [ ] Empty state + error state getest
- [ ] Local save + restore getest
- [ ] Export getest (indien aanwezig)

## 9) Werkwijze voor verbouwingen

Bij migratie van bestaande app naar deze standaard:

1. Inventarisatie huidige routes/components/state
2. Content uit pagina halen naar `lib/content`
3. Opslag abstraheren naar `lib/storage`
4. Omzetten naar 1-opdracht-per-pagina
5. UI harmoniseren volgens stijlregels
6. Lint/build/accessibility check

## 10) Definition of Done

Een app voldoet aan deze standaard als:
- Structuur conform sectie 2 is ingericht.
- UX-flow conform sectie 3 aanwezig is.
- Visuele stijl consistent is.
- Kwaliteitschecks uit sectie 6 en 8 groen zijn.
