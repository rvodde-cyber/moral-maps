export type Prompt = {
  id: string;
  title: string;
  question: string;
  imageSrc: string;
  imageAlt: string;
};

export type Stage = {
  id: string;
  label: string;
  icon: string;
  summary: string;
  prompts: Prompt[];
};

export const stages: Stage[] = [
  {
    id: "crossroads",
    label: "De Kruising",
    icon: "🛣️",
    summary: "Kiezen is ook iets laten liggen. Welke afslag nam je wél — en welke niet?",
    prompts: [
      {
        id: "onbewandelde-weg",
        title: "De Onbewandelde Weg",
        question:
          "Een afslag die je níet nam: wat liet je daardoor achter? Angst, veiligheid zoeken, of juist je kernwaarden?",
        imageSrc:
          "https://images.unsplash.com/photo-1501534664411-27bfbf5c3d88?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Kruispunt met twee wegen in zacht licht",
      },
    ],
  },
  {
    id: "energie",
    label: "Brandstof",
    icon: "⛽",
    summary: "Waar tank je bij en waar lekt de energie weg?",
    prompts: [
      {
        id: "tankstation-ziel",
        title: "Het Tankstation van de Ziel",
        question:
          "Welke activiteiten geven je hoogwaardige brandstof? Welke gewoonten vervuilen je motor?",
        imageSrc:
          "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Landschap met weg en rustpunt",
      },
      {
        id: "reserve-lampje",
        title: "Rijden op de Reserve",
        question:
          "Een periode waarin je te lang doorging: wat kostte je dat (in werk, relaties, humeur)?",
        imageSrc:
          "https://images.unsplash.com/photo-1493236296276-d17357e288a7?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Dashboard met brandstofwaarschuwing in donkere sfeer",
      },
    ],
  },
  {
    id: "wegomleiding",
    label: "Wegomleiding",
    icon: "🚧",
    summary: "Omleiding: vier routes, één keuze.",
    prompts: [
      {
        id: "wegomleiding-keuze",
        title: "De omleiding bij schemer",
        question:
          "Je rijdt door een uitgestrekte, verdroogde vlakte en moet kiezen: avontuur in wilde bossen, omweg via je jeugdstad, hypermoderne stad vol prikkels, of de saaie maar snelle route. Welke kies je en waarom past dit bij jouw kernwaarden?",
        imageSrc: "/images/crossroads-wegomleiding.jpg",
        imageAlt: "Wegomleiding met meerdere routekeuzes",
      },
    ],
  },
  {
    id: "apk",
    label: "Morele APK",
    icon: "🧰",
    summary: "Slijtage en ballast: wat heeft nu onderhoud nodig?",
    prompts: [
      {
        id: "slijtage",
        title: "Slijtagecheck",
        question:
          "Welke karakteronderdelen vragen nu onderhoud (bijv. geduld, empathie, integriteit, moed)?",
        imageSrc:
          "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Werkbank met gereedschap in nette compositie",
      },
      {
        id: "ballast",
        title: "Bagagedrager",
        question:
          "Welke oude koffers maken je reis zwaarder dan nodig? Wat kun je achterlaten?",
        imageSrc:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Koffers naast een lege weg",
      },
    ],
  },
  {
    id: "panne",
    label: "Pech & Hulp",
    icon: "🛟",
    summary: "Stilstand hoort erbij: pech, hulp vragen en hulp bieden.",
    prompts: [
      {
        id: "vangrail",
        title: "Langs de Vangrail",
        question:
          "Pech of twijfel: deelde je wat er speelde, of hield je de motorkap dicht?",
        imageSrc:
          "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Auto langs de vangrail op een stille weg",
      },
      {
        id: "wegenwacht",
        title: "De Wegenwacht",
        question:
          "Wie stopt er voor jou wanneer je vastloopt? En stop jij zelf voor anderen als het schuurt met je planning?",
        imageSrc:
          "https://images.unsplash.com/photo-1465043153532-5c2f5f6d7f9e?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Hand die hulp aanbiedt op de weg",
      },
    ],
  },
  {
    id: "mist",
    label: "Mist & Zicht",
    icon: "🌫️",
    summary: "Weinig zicht: waar vertrouw je op als de route onduidelijk is?",
    prompts: [
      {
        id: "mist-rijden",
        title: "Rijden in de Mist",
        question:
          "Op welke interne GPS-instellingen vertrouw je wanneer externe zekerheden wegvallen?",
        imageSrc:
          "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Weg in dichte mist met zacht licht",
      },
      {
        id: "dode-hoek",
        title: "De Dode Hoek",
        question:
          "Welke blinde vlek zie je vaak te laat? Wie fungeert voor jou als extra spiegel?",
        imageSrc:
          "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Autospiegel met onscherpe achtergrond",
      },
    ],
  },
  {
    id: "wegkeuze",
    label: "De Wegkeuze",
    icon: "🧭",
    summary: "Je weet wat klopt — en toch sla je soms een andere afslag in.",
    prompts: [
      {
        id: "wegkeuze-goede-niet-gedaan",
        title: "Het goede weten, toch afslaan",
        question:
          "Je wist wat het goede was — maar deed het niet. Wat hield je tegen?",
        imageSrc: "/images/maps2-wegkeuze-goede-niet-gedaan.jpg",
        imageAlt: "Wegkeuze: het goede weten en toch afslaan",
      },
      {
        id: "wegkeuze-zwijgen",
        title: "De stilte op het kruispunt",
        question:
          "Wanneer zweeg je terwijl spreken beter was geweest - voor jezelf of voor een ander?",
        imageSrc: "/images/maps2-wegkeuze-zwijgen.jpg",
        imageAlt: "Wegkeuze: de stilte op het kruispunt",
      },
      {
        id: "wegkeuze-moeilijk-of-fout",
        title: "Moeilijk of fout",
        question:
          "Wat is het verschil tussen een moeilijke keuze en een foute keuze, voor jou persoonlijk?",
        imageSrc: "/images/maps2-wegkeuze-moeilijk-of-fout.jpg",
        imageAlt: "Wegkeuze: moeilijke keuze versus foute keuze",
      },
    ],
  },
  {
    id: "socialisatie",
    label: "Socialisatieverslag",
    icon: "🧾",
    summary: "Wie of wat heeft je route echt beïnvloed?",
    prompts: [
      {
        id: "ontmoetingen-route",
        title: "Wie kwam je onderweg tegen?",
        question:
          "Welke personen, groepen of systemen hebben je route echt beïnvloed? Noem er een paar en wat ze bij je deden.",
        imageSrc:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Groep mensen in gesprek rond een tafel",
      },
      {
        id: "sociale-sporen",
        title: "Sporen op je stuur",
        question:
          "Welke overtuigingen nam je onderweg mee en welke liet je los?",
        imageSrc:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Hand op stuur met focus op richting",
      },
    ],
  },
  {
    id: "vreemde-ander",
    label: "De Vreemde Ander",
    icon: "🧍",
    summary: "Iemand die anders is dan jij: wat leer je daarvan over jezelf?",
    prompts: [
      {
        id: "reisgenoot-spiegel",
        title: "De Reisgenoot als Spiegel",
        question:
          "Iemand die je als ‘anders’ ervaart: welke aannames of grenzen merk je bij jezelf?",
        imageSrc:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Twee mensen lopen naast elkaar in open ruimte",
      },
      {
        id: "insluiting-onderweg",
        title: "Insluiting onderweg",
        question:
          "Wat kun je concreet doen om deze reisgenoot beter te begrijpen en in te sluiten, zonder je interne GPS te verliezen?",
        imageSrc:
          "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Mensen die samen een brug oversteken",
      },
    ],
  },
];

export const allPrompts = stages.flatMap((stage) =>
  stage.prompts.map((prompt) => ({
    ...prompt,
    stageId: stage.id,
    stageLabel: stage.label,
    stageIcon: stage.icon,
  })),
);
