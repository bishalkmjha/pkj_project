/**
 * Health pattern checks. Thresholds follow the FIGO (International Federation of Gynecology and
 * Obstetrics) and ACOG definitions of normal menstruation for adults:
 *   - cycle length 24–38 days (FIGO); ACOG commonly quotes 21–35. We flag outside 21–35 repeatedly.
 *   - variation between shortest and longest cycle up to 7–9 days; we flag above 9.
 *   - bleeding up to 8 days (FIGO); ACOG flags more than 7. We flag more than 7.
 *   - no period for 90+ days (outside pregnancy) needs evaluation.
 *
 * Every flag is phrased as "worth discussing with a doctor", never as a diagnosis.
 * The thresholds should be reviewed by a gynaecologist before release.
 */
import { addDays, diffDays, type ISODate } from "./dates";
import { predictionsEnabled, type CycleStats, type Prediction } from "./cycle";
import { isBleeding, type AppData } from "./types";

export type FlagId =
  | "shortCycles" | "longCycles" | "irregular" | "longPeriod" | "heavyFlow"
  | "noPeriod90" | "late" | "lateUnprotected" | "betweenPeriods" | "severePain" | "pcosSigns" | "anemiaSigns";

export type FlagLevel = "info" | "doctor" | "urgent";

export interface HealthFlag {
  id: FlagId;
  level: FlagLevel;
  /** numbers substituted into the translated text, e.g. {days} */
  params: Record<string, number>;
}

const RECENT_CYCLES = 6;

export function healthFlags(data: AppData, stats: CycleStats, next: Prediction | undefined, on: ISODate): HealthFlag[] {
  const flags: HealthFlag[] = [];
  // Cycle-based checks don't apply during pregnancy.
  if (data.settings.goal === "pregnant") return flags;
  const cycles = stats.cycles.slice(-RECENT_CYCLES);
  const periods = stats.periods.slice(-RECENT_CYCLES);
  const lastPeriod = stats.periods[stats.periods.length - 1];
  const lengths = cycles.map((c) => c.length);

  const short = lengths.filter((l) => l < 21).length;
  if (short >= 2) flags.push({ id: "shortCycles", level: "doctor", params: { count: short } });

  const long = lengths.filter((l) => l > 35).length;
  if (long >= 2) flags.push({ id: "longCycles", level: "doctor", params: { count: long } });

  if (lengths.length >= 3) {
    const spread = Math.max(...lengths) - Math.min(...lengths);
    if (spread > 9) flags.push({ id: "irregular", level: "doctor", params: { days: spread } });
  }

  const longPeriods = periods.filter((p) => p.length > 7);
  if (longPeriods.length >= 1) {
    flags.push({ id: "longPeriod", level: "doctor", params: { days: Math.max(...longPeriods.map((p) => p.length)) } });
  }

  const heavy = periods.filter((p) => p.heavyDays >= 3).length;
  if (heavy >= 2) flags.push({ id: "heavyFlow", level: "doctor", params: { count: heavy } });

  const painful = periods.filter((p) => p.maxPain >= 3).length;
  if (painful >= 2) flags.push({ id: "severePain", level: "doctor", params: { count: painful } });

  if (lastPeriod && predictionsEnabled(data, stats)) {
    const since = diffDays(lastPeriod.start, on);
    if (since >= 90) {
      flags.push({ id: "noPeriod90", level: "doctor", params: { days: since } });
    } else if (next && on > next.latest) {
      const late = diffDays(next.start, on);
      // Unprotected sex logged since the last period start makes a test the first thing to do.
      const unprotected = Object.keys(data.days).some((d) => d >= lastPeriod.start && d <= on && data.days[d].intimacy === "unprotected");
      if (unprotected && late >= 1) flags.push({ id: "lateUnprotected", level: "doctor", params: { days: late } });
      else if (late >= 7) flags.push({ id: "late", level: "info", params: { days: late } });
    }
  }

  // Spotting or bleeding logged outside a period, more than 2 days away from any period, in the last 90 days.
  const from = addDays(on, -90);
  const betweenDays = Object.keys(data.days).filter((d) => {
    if (d < from || d > on) return false;
    const log = data.days[d];
    if (!log.flow) return false;
    return !stats.periods.some((p) => d >= addDays(p.start, -2) && d <= addDays(p.end, 2));
  });
  if (betweenDays.length >= 2) flags.push({ id: "betweenPeriods", level: "doctor", params: { count: betweenDays.length } });

  // Symptom combinations, looked at over the last 6 months.
  const sixMonths = addDays(on, -180);
  const recentLogs = Object.entries(data.days).filter(([d]) => d >= sixMonths && d <= on).map(([, l]) => l);
  const symptomDays = (s: string) => recentLogs.filter((l) => l.symptoms?.includes(s as never)).length;

  const cycleProblem = flags.some((f) => f.id === "longCycles" || f.id === "irregular" || f.id === "noPeriod90");
  if (cycleProblem && (symptomDays("acne") >= 3 || symptomDays("excessHair") >= 1)) {
    flags.push({ id: "pcosSigns", level: "doctor", params: {} });
  }

  const heavyRecent = flags.some((f) => f.id === "heavyFlow" || f.id === "longPeriod");
  const tiredDizzy = recentLogs.filter((l) => l.symptoms?.includes("fatigue") || l.symptoms?.includes("dizziness")).length;
  if (heavyRecent && tiredDizzy >= 3) flags.push({ id: "anemiaSigns", level: "doctor", params: {} });

  return flags;
}

/** Heavy bleeding on several consecutive logged days with dizziness: tell the user to get help now. */
export function urgentNow(data: AppData, on: ISODate): boolean {
  const recent = [0, 1, 2].map((i) => data.days[addDays(on, -i)]);
  const heavyRun = recent.every((l) => l?.flow === "heavy");
  const dizzy = recent.some((l) => l?.symptoms?.includes("dizziness"));
  return heavyRun && dizzy && isBleeding(data.days[on]);
}
