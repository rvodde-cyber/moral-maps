export type AnswerMap = Record<string, string>;
export type ScoreMap = Record<string, number>;

export const STORAGE_KEY = "maps2-crossroads-v2";

export type CrossroadsDraft = {
  travelerName?: string;
  coreValues?: string;
  destination?: string;
  answers?: AnswerMap;
  scores?: ScoreMap;
  detourChoice?: string;
};

export function getStoredDraft(): CrossroadsDraft {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as CrossroadsDraft;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}
