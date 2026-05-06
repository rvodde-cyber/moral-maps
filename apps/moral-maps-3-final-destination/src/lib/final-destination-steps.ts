export type StepId = "brug" | "terugblik" | "vooruitblik" | "reisverslag";

export const stepOrder: StepId[] = [
  "brug",
  "terugblik",
  "vooruitblik",
  "reisverslag",
];

export const stepMeta: Record<
  StepId,
  { title: string; subtitle: string; imageSrc: string; imageAlt: string }
> = {
  brug: {
    title: "De Brug in de Mist",
    subtitle: "Signature-opdracht",
    imageSrc: "/brug-in-de-mist.jpg",
    imageAlt: "Brug in mistige omgeving als metafoor voor overgang",
  },
  terugblik: {
    title: "Terugblik",
    subtitle: "Scharnierpunt, patroon en je ware koers",
    imageSrc: "/images/maps3-terugblik.jpg",
    imageAlt: "Reflectieve terugblik op je afgelegde route",
  },
  vooruitblik: {
    title: "Vooruitblik",
    subtitle: "Nalatenschap, richting en belofte",
    imageSrc: "/images/maps3-vooruitblik.jpg",
    imageAlt: "Horizon en richting voor je volgende etappe",
  },
  reisverslag: {
    title: "Reisverslag 3.0",
    subtitle: "Synthese van je inzichten en kompas",
    imageSrc: "/images/maps3-reisverslag.jpg",
    imageAlt: "Samenvattend reisverslag met persoonlijk kompas",
  },
};

