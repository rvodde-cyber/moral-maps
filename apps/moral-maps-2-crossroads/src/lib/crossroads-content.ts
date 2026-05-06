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
    summary: "Kiezen is ook verliezen. Onderzoek welke afslag je neemt en waarom.",
    prompts: [
      {
        id: "onbewandelde-weg",
        title: "De Onbewandelde Weg",
        question:
          "Reflecteer op een afslag die je niet hebt genomen. Wat liet je achter? Was het angst, veiligheid of een keuze vanuit je kernwaarden?",
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
    summary: "Zonder energie geen duurzame reis. Breng je actieradius eerlijk in beeld.",
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
          "Beschrijf een periode waarin je te lang doorging. Wat was de morele en relationele prijs van die uitputting?",
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
    summary: "De weg wordt versperd. Je moet kiezen uit vier routes met elk een andere morele lading.",
    prompts: [
      {
        id: "wegomleiding-keuze",
        title: "De omleiding bij schemer",
        question:
          "Je rijdt door een uitgestrekte, verdroogde vlakte en moet kiezen: avontuur in wilde bossen, omweg via je jeugdstad, hypermoderne stad vol prikkels, of de saaie maar snelle route. Welke kies je en waarom past dit bij jouw kernwaarden?",
        imageSrc: "/crossroads-wegomleiding.jpg",
        imageAlt: "Wegomleiding met meerdere routekeuzes",
      },
    ],
  },
  {
    id: "apk",
    label: "Morele APK",
    icon: "🧰",
    summary: "Onderhoud bepaalt betrouwbaarheid. Kijk naar slijtage en ballast.",
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
          "Welke oude koffers maken je reis zwaarder dan nodig? Wat kun je bewust achterlaten?",
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
    summary: "Stilstand hoort erbij. Kwetsbaarheid en wederkerigheid zijn onderdeel van leiderschap.",
    prompts: [
      {
        id: "vangrail",
        title: "Langs de Vangrail",
        question:
          "Denk aan een moment van pech of twijfel. Deelde je wat er werkelijk speelde, of hield je de motorkap dicht?",
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
    summary: "Wanneer zicht ontbreekt, bepaalt je interne kompas je koers.",
    prompts: [
      {
        id: "mist-rijden",
        title: "Rijden in de Mist",
        question:
          "Op welk intern kompas vertrouw je wanneer externe zekerheden wegvallen?",
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
    id: "socialisatie",
    label: "Socialisatieverslag",
    icon: "🧾",
    summary:
      "Wie ben je onderweg tegengekomen en hoe vormen die ontmoetingen je morele koers?",
    prompts: [
      {
        id: "ontmoetingen-route",
        title: "Wie kwam je onderweg tegen?",
        question:
          "Welke personen, groepen of systemen hebben jouw route wezenlijk beïnvloed? Beschrijf per ontmoeting de impact op je waarden en keuzes.",
        imageSrc:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Groep mensen in gesprek rond een tafel",
      },
      {
        id: "sociale-sporen",
        title: "Sporen op je stuur",
        question:
          "Welke overtuigingen heb je onderweg overgenomen, en welke heb je bewust losgelaten om koersvast te blijven?",
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
    summary:
      "De reisgenoot die anders is, houdt je een spiegel voor en verbreedt je blik.",
    prompts: [
      {
        id: "reisgenoot-spiegel",
        title: "De Reisgenoot als Spiegel",
        question:
          "Denk aan iemand die je als 'anders' ervaart. Wat laat deze persoon je zien over je eigen aannames, grenzen en waarden?",
        imageSrc:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
        imageAlt: "Twee mensen lopen naast elkaar in open ruimte",
      },
      {
        id: "insluiting-onderweg",
        title: "Insluiting onderweg",
        question:
          "Wat kun je concreet doen om deze reisgenoot beter te begrijpen en in te sluiten, zonder je eigen kompas te verliezen?",
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
