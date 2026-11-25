import type { ISODate } from "./dates";

export type Flow = "spotting" | "light" | "medium" | "heavy";
export type Lang = "en" | "hi";

export const SYMPTOMS = [
  "cramps", "headache", "backache", "bloating", "breastTenderness", "acne", "fatigue",
  "nausea", "dizziness", "cravings", "insomnia", "excessHair", "discharge", "hotFlashes",
] as const;
export type Symptom = (typeof SYMPTOMS)[number];

export const MOODS = ["happy", "calm", "sad", "anxious", "irritable", "moodSwings", "low"] as const;
export type Mood = (typeof MOODS)[number];

/** Cervical mucus / discharge, as people commonly describe it. "unusual" = colour, smell or itching. */
export const DISCHARGES = ["dry", "sticky", "creamy", "watery", "eggWhite", "unusual"] as const;
export type Discharge = (typeof DISCHARGES)[number];

/** 0 none, 1 mild, 2 moderate, 3 severe */
export type Pain = 0 | 1 | 2 | 3;

export interface DayLog {
  flow?: Flow;
  pain?: Pain;
  discharge?: Discharge;
  symptoms?: Symptom[];
  moods?: Mood[];
  pillTaken?: boolean;
  note?: string;
}

export interface Reminders {
  periodSoon: boolean;
  periodLate: boolean;
  pill: { enabled: boolean; time: string }; // "HH:MM"
  breastCheck: boolean;
}

export interface Settings {
  lang: Lang;
  onboarded: boolean;
  acceptedDisclaimer: boolean;
  /** Used for predictions until enough cycles have been logged. */
  typicalCycleLength: number;
  typicalPeriodLength: number;
  reminders: Reminders;
  /** salt:sha256 hex of the app-lock PIN, or null when no lock is set. */
  pinHash: string | null;
}

export interface AppData {
  version: 1;
  settings: Settings;
  days: Record<ISODate, DayLog>;
}

export const DEFAULT_SETTINGS: Settings = {
  lang: "en",
  onboarded: false,
  acceptedDisclaimer: false,
  typicalCycleLength: 28,
  typicalPeriodLength: 5,
  reminders: { periodSoon: true, periodLate: true, pill: { enabled: false, time: "21:00" }, breastCheck: true },
  pinHash: null,
};

export function emptyData(): AppData {
  return { version: 1, settings: structuredClone(DEFAULT_SETTINGS), days: {} };
}

export function isBleeding(log: DayLog | undefined): boolean {
  return !!log?.flow && log.flow !== "spotting";
}

export function isEmptyLog(log: DayLog): boolean {
  return !log.flow && !log.pain && !log.discharge && !log.symptoms?.length && !log.moods?.length && !log.pillTaken && !log.note?.trim();
}
