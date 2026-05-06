# Contributing

Deze repository hanteert een vaste technische standaard om apps consistent, onderhoudbaar en deployment-klaar te houden.

## Stack standaard

- Nieuwe apps/features: **Next.js (App Router) + TypeScript + Tailwind CSS**.
- UI-componenten bij voorkeur via shadcn/ui; iconen via Lucide.
- Subtiele micro-interacties met Framer Motion waar functioneel.

## Taalafspraak

- Webapps bestaan runtime altijd uit HTML/CSS/JavaScript.
- Ontwikkeling gebeurt TypeScript-first.
- Geen losse scriptoplossingen of afwijkende stacks voor nieuwe onderdelen.

## Migratie van legacy code

- Geen big-bang herschrijvingen van stabiele apps.
- Migreer stapsgewijs per module naar de standaardstack.
- Nieuwe functionaliteit altijd direct in de standaardstack bouwen.

## Quality gate (verplicht)

Voor elke change:

- `npm run lint`
- `npm run build`
- mobiele en desktopcheck
- toetsenbordnavigatie check
- alt-teksten en basis-toegankelijkheid check
