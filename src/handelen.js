export const HANDELEN_KOP = "Wat kun je vanuit jouw positie doen?";

export const HANDELEN_INLEIDING =
  "Dit is een uitnodiging, geen opdracht. Wie je bent is ook gevormd door wat je meemaakte en door de mensen die je tegenkwam. " +
  "Dat zegt deze tool niet. Het gaat om een eerste kleine stap vanuit waar je nu staat.";

export const MIN_AXES_FOR_HANDELEN_PROFIEL = 6;

const WHEEL_SCORE = { inside: 3, middle: 2, outside: 1 };

/**
 * @param {Record<string, string>} selected id -> "inside" | "middle" | "outside"
 * @param {{ id: string }[]} segments
 * @returns {'centrum' | 'gemengd' | 'periferie'}
 */
export function computeHandelenProfiel(selected, segments) {
  const scores = segments
    .map((seg) => {
      const side = selected[seg.id];
      return side ? WHEEL_SCORE[side] ?? null : null;
    })
    .filter((s) => s !== null);
  if (scores.length < MIN_AXES_FOR_HANDELEN_PROFIEL) return "gemengd";
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  if (avg > 2.33) return "centrum";
  if (avg < 1.67) return "periferie";
  return "gemengd";
}

export const HANDELEN_PROFIELEN = {
  centrum: {
    titel: "Je positie als hulpbron",
    inleiding: HANDELEN_INLEIDING,
    acties: [
      { tekst: "Let deze week op wie er aan tafel zit en wie niet.", fase: "Zien" },
      {
        tekst: "Noem in een overleg een idee van iemand anders met naam en toelichting.",
        fase: "Voelen",
      },
      {
        tekst: "Vraag iemand met een ander perspectief om mee te kijken en luister zonder meteen te verklaren.",
        fase: "Wegen",
      },
      {
        tekst: "Deel toegang: stel iemand voor aan je netwerk of nodig iemand uit voor een kans.",
        fase: "Handelen",
      },
    ],
    reflectievragen: [
      { tekst: "Welk voordeel ervaar je als vanzelfsprekend?", fase: "Zien" },
      { tekst: "Waar kun je ruimte maken zonder het over te nemen?", fase: "Volhouden" },
    ],
  },
  gemengd: {
    titel: "Verschillende posities tegelijk",
    inleiding: HANDELEN_INLEIDING,
    acties: [
      {
        tekst: "Herken in welke context je meer vanzelfsprekend gehoord wordt en waar niet.",
        fase: "Zien",
      },
      {
        tekst: "Gebruik de ervaring van de assen waar je aan de rand staat om anderen beter te begrijpen.",
        fase: "Voelen",
      },
      {
        tekst: "Zet waar je meer ruimte hebt die in voor iemand die minder ruimte heeft.",
        fase: "Wegen",
      },
      { tekst: "Bespreek je kaart met één vertrouwd persoon.", fase: "Handelen" },
    ],
    reflectievragen: [
      { tekst: "Waar schakel je vaak tussen werelden?", fase: "Zien" },
      { tekst: "Wat leer je daar dat anderen missen?", fase: "Volhouden" },
    ],
  },
  periferie: {
    titel: "Wat jij nodig hebt en kunt inbrengen",
    inleiding: HANDELEN_INLEIDING,
    acties: [
      {
        tekst: "Benoem één ding dat je helpt om je werk of studie vol te houden.",
        fase: "Zien",
      },
      {
        tekst: "Zoek een medestander of netwerk waar je positie vanzelfsprekend is.",
        fase: "Voelen",
      },
      {
        tekst: "Vraag expliciet om wat je mist; je mag duidelijk maken wat je nodig hebt.",
        fase: "Wegen",
      },
      {
        tekst:
          "Kies één moment deze maand waarop je jouw ervaring bewust inbrengt in een overleg of gesprek.",
        fase: "Handelen",
      },
    ],
    reflectievragen: [
      { tekst: "Wat kost jou het meeste extra energie?", fase: "Zien" },
      { tekst: "Wie of wat helpt je dat al?", fase: "Volhouden" },
    ],
  },
};
