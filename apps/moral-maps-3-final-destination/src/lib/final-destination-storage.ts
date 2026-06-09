export const STORAGE_KEY = "maps3-final-destination-v1";

export type FinalDestinationDraft = {
  travelerName?: string;
  destination?: string;
  bridge?: {
    ballast: string;
    meenemen: string;
    vinden: string;
    gps: string;
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

type LegacyBridge = {
  ballast?: string;
  meenemen?: string;
  vinden?: string;
  gps?: string;
  kompas?: string;
};

function normalizeBridge(raw?: LegacyBridge) {
  return {
    ballast: raw?.ballast ?? "",
    meenemen: raw?.meenemen ?? "",
    vinden: raw?.vinden ?? "",
    gps: raw?.gps ?? raw?.kompas ?? "",
  };
}

export function getStoredDraft(): FinalDestinationDraft {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as FinalDestinationDraft & { bridge?: LegacyBridge };
    return {
      ...parsed,
      bridge: parsed.bridge ? normalizeBridge(parsed.bridge) : undefined,
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}
