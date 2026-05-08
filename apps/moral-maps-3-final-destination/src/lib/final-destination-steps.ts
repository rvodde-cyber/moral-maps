export type StepId =
  | "brug"
  | "terugblik"
  | "panorama"
  | "passie"
  | "mensen"
  | "nalatenschap"
  | "vooruitblik"
  | "reisverslag";

export const stepOrder: StepId[] = [
  "brug",
  "terugblik",
  "panorama",
  "passie",
  "mensen",
  "nalatenschap",
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
    imageSrc: "/images/brug-in-de-mist.jpg",
    imageAlt: "Brug in mistige omgeving als metafoor voor overgang",
  },
  terugblik: {
    title: "Terugblik",
    subtitle: "Scharnierpunt (blijvende verandering), patroon en je morele GPS",
    imageSrc: "/images/maps3-terugblik.jpg",
    imageAlt: "Reflectieve terugblik op je afgelegde route",
  },
  panorama: {
    title: "Het Panorama - Morele Eerlijkheid",
    subtitle: "Laag 2 - vierde thema",
    imageSrc: "/images/maps3-panorama-morele-eerlijkheid.jpg",
    imageAlt: "Panorama over de route met zicht op gemaakte keuzes",
  },
  passie: {
    title: "Passie",
    subtitle: "Waar vindt u energie in uw reis?",
    imageSrc: "/images/maps3-passie.jpg",
    imageAlt: "Persoon die met energie en focus werkt",
  },
  mensen: {
    title: "Mensen",
    subtitle: "Bij wie kunt u helemaal uzelf zijn?",
    imageSrc: "/images/maps3-mensen.jpg",
    imageAlt: "Vertrouwde mensen in een warme setting",
  },
  nalatenschap: {
    title: "Nalatenschap",
    subtitle: "Wat laat u achter voor anderen?",
    imageSrc: "/images/maps3-nalatenschap.jpg",
    imageAlt: "Verhaal over impact op anderen en de wereld",
  },
  vooruitblik: {
    title: "Vooruitblik",
    subtitle: "Nalatenschap, richting en belofte",
    imageSrc: "/images/maps3-vooruitblik.jpg",
    imageAlt: "Horizon en richting voor je volgende etappe",
  },
  reisverslag: {
    title: "Reisverslag 3.0",
    subtitle: "Synthese van je inzichten en morele GPS",
    imageSrc: "/images/maps3-reisverslag.jpg",
    imageAlt: "Samenvattend reisverslag met persoonlijke morele GPS",
  },
};

