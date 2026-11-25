/**
 * On-device persistence. Uses Capacitor Preferences (Android SharedPreferences in the app,
 * localStorage on the web). Nothing ever leaves the device.
 */
import { Preferences } from "@capacitor/preferences";
import { isValidISO } from "./dates";
import { DEFAULT_SETTINGS, DISCHARGES, TEMP_MAX_C, TEMP_MIN_C, MOODS, SYMPTOMS, emptyData, isEmptyLog, type AppData, type DayLog } from "./types";

const KEY = "sakhi.data.v1";

export async function loadData(): Promise<AppData> {
  try {
    const { value } = await Preferences.get({ key: KEY });
    if (!value) return emptyData();
    return parseBackup(value) ?? emptyData();
  } catch {
    return emptyData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  await Preferences.set({ key: KEY, value: JSON.stringify(data) });
}

export async function clearData(): Promise<void> {
  await Preferences.remove({ key: KEY });
}

const FLOWS = ["spotting", "light", "medium", "heavy"];

function cleanLog(raw: unknown): DayLog | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const log: DayLog = {};
  if (typeof r.flow === "string" && FLOWS.includes(r.flow)) log.flow = r.flow as DayLog["flow"];
  if (typeof r.pain === "number" && [0, 1, 2, 3].includes(r.pain)) log.pain = r.pain as DayLog["pain"];
  if (typeof r.discharge === "string" && (DISCHARGES as readonly string[]).includes(r.discharge)) log.discharge = r.discharge as DayLog["discharge"];
  if (typeof r.temp === "number" && r.temp >= TEMP_MIN_C && r.temp <= TEMP_MAX_C) log.temp = Math.round(r.temp * 100) / 100;
  if (r.intimacy === "protected" || r.intimacy === "unprotected") log.intimacy = r.intimacy;
  if (Array.isArray(r.symptoms)) log.symptoms = r.symptoms.filter((s) => (SYMPTOMS as readonly unknown[]).includes(s));
  if (Array.isArray(r.moods)) log.moods = r.moods.filter((s) => (MOODS as readonly unknown[]).includes(s));
  if (r.pillTaken === true) log.pillTaken = true;
  if (typeof r.note === "string") log.note = r.note.slice(0, 2000);
  return log;
}

/** Parse and validate stored data or an imported backup. Returns null if it isn't Sakhi data. */
export function parseBackup(json: string): AppData | null {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.version !== 1 || typeof r.days !== "object" || r.days === null) return null;

  const days: AppData["days"] = {};
  for (const [date, log] of Object.entries(r.days as Record<string, unknown>)) {
    const clean = isValidISO(date) ? cleanLog(log) : null;
    if (clean && !isEmptyLog(clean)) days[date] = clean;
  }
  const s = (r.settings ?? {}) as Partial<AppData["settings"]>;
  const clamp = (v: unknown, lo: number, hi: number, d: number) =>
    typeof v === "number" && v >= lo && v <= hi ? Math.round(v) : d;
  const rem = s.reminders ?? DEFAULT_SETTINGS.reminders;
  const result: AppData = {
    version: 1,
    days,
    settings: {
      lang: s.lang === "hi" ? "hi" : "en",
      onboarded: s.onboarded === true,
      acceptedDisclaimer: s.acceptedDisclaimer === true,
      typicalCycleLength: clamp(s.typicalCycleLength, 15, 60, DEFAULT_SETTINGS.typicalCycleLength),
      typicalPeriodLength: clamp(s.typicalPeriodLength, 1, 14, DEFAULT_SETTINGS.typicalPeriodLength),
      reminders: {
        periodSoon: rem.periodSoon !== false,
        periodLate: rem.periodLate !== false,
        breastCheck: rem.breastCheck !== false,
        pill: {
          enabled: rem.pill?.enabled === true,
          time: /^\d{2}:\d{2}$/.test(rem.pill?.time ?? "") ? rem.pill.time : "21:00",
        },
      },
      goal: s.goal === "conceive" || s.goal === "pregnant" ? s.goal : "track",
      pregnancy: s.goal === "pregnant" && s.pregnancy && isValidISO(String(s.pregnancy.lmp)) ? { lmp: s.pregnancy.lmp } : null,
      pregnancyEnded: typeof s.pregnancyEnded === "string" && isValidISO(s.pregnancyEnded) ? s.pregnancyEnded : null,
      tempUnit: s.tempUnit === "F" ? "F" : "C",
      showIntimacy: s.showIntimacy !== false,
      pinHash: typeof s.pinHash === "string" ? s.pinHash : null,
    },
  };
  if (result.settings.goal === "pregnant" && !result.settings.pregnancy) result.settings.goal = "track";
  return result;
}
