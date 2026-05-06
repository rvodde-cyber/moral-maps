export const STORAGE_KEY = "maps3-final-destination-v1";

export type FinalDestinationDraft = {
  travelerName?: string;
  destination?: string;
  bridge?: {
    ballast: string;
    meenemen: string;
    vinden: string;
    kompas: string;
  };
  terugblik?: {
    scharnierpunt: string;
    patroon: string;
    noorden: string;
  };
  vooruitblik?: {
    nalatenschap: string;
    richting: string;
    belofte: string;
  };
  synthese?: string;
};

export function getStoredDraft(): FinalDestinationDraft {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as FinalDestinationDraft;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}
