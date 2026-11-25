/**
 * Cycle engine: turns day logs into periods, cycles, predictions and today's status.
 *
 * Method (calendar-based, as used by most trackers):
 * - A period is a run of bleeding days (light/medium/heavy). Gaps of up to 2 days are merged.
 *   Spotting on its own never starts a period.
 * - Cycle length = days between consecutive period starts.
 * - Prediction uses a recency-weighted average of the last 6 cycles (or the user's typical
 *   length until 2 cycles exist), shown as a range based on how much the cycles vary.
 * - Ovulation is estimated at 14 days before the next period (the luteal phase is the more
 *   stable half of the cycle); the fertile window is the 5 days before ovulation plus that day and the next.
 *
 * These are ESTIMATES. They must never be presented as contraception.
 */
import { addDays, diffDays, type ISODate } from "./dates";
import { isBleeding, type AppData, type DayLog, type Settings } from "./types";

export const MAX_GAP_IN_PERIOD = 2;
const HISTORY_FOR_PREDICTION = 6;
const LUTEAL_DAYS = 14;

export interface Period {
  start: ISODate;
  end: ISODate; // last bleeding day (inclusive)
  length: number;
  heavyDays: number;
  maxPain: number;
}

export interface Cycle {
  start: ISODate;
  length: number; // days until the next period start
  periodLength: number;
}

export interface Prediction {
  start: ISODate; // most likely start
  earliest: ISODate;
  latest: ISODate;
  ovulation: ISODate;
  fertileStart: ISODate;
  fertileEnd: ISODate;
}

export type Phase = "period" | "follicular" | "fertile" | "luteal" | "late" | "unknown";

export interface Status {
  cycleDay: number | null;
  phase: Phase;
  daysUntilNext: number | null;
  daysLate: number;
  inPeriod: boolean;
}

export interface CycleStats {
  periods: Period[];
  cycles: Cycle[]; // complete cycles, oldest first
  avgCycle: number;
  avgPeriod: number;
  minCycle: number | null;
  maxCycle: number | null;
  /** true when the averages come from the user's own logged cycles */
  basedOnHistory: boolean;
}

export function findPeriods(days: Record<ISODate, DayLog>): Period[] {
  const bleeding = Object.keys(days).filter((d) => isBleeding(days[d])).sort();
  const periods: Period[] = [];
  for (const d of bleeding) {
    const last = periods[periods.length - 1];
    if (last && diffDays(last.end, d) <= MAX_GAP_IN_PERIOD + 1) {
      last.end = d;
    } else {
      periods.push({ start: d, end: d, length: 0, heavyDays: 0, maxPain: 0 });
    }
  }
  for (const p of periods) {
    p.length = diffDays(p.start, p.end) + 1;
    for (let i = 0; i < p.length; i++) {
      const log = days[addDays(p.start, i)];
      if (log?.flow === "heavy") p.heavyDays++;
      p.maxPain = Math.max(p.maxPain, log?.pain ?? 0);
    }
  }
  return periods;
}

function weightedMean(values: number[]): number {
  // Most recent value weighs the most: weights 1..n.
  let sum = 0;
  let wsum = 0;
  values.forEach((v, i) => {
    sum += v * (i + 1);
    wsum += i + 1;
  });
  return sum / wsum;
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / (values.length - 1));
}

export function computeStats(data: AppData): CycleStats {
  const periods = findPeriods(data.days);
  const cycles: Cycle[] = [];
  for (let i = 0; i + 1 < periods.length; i++) {
    cycles.push({
      start: periods[i].start,
      length: diffDays(periods[i].start, periods[i + 1].start),
      periodLength: periods[i].length,
    });
  }
  const s: Settings = data.settings;
  // Cycles over 60 days are usually a missed log or a skipped period; they are still shown
  // and flagged, but would wreck the prediction, so they are left out of the average.
  const usable = usableLengths(cycles);
  const basedOnHistory = usable.length >= 2;
  const recentPeriods = periods.slice(-HISTORY_FOR_PREDICTION).map((p) => p.length);
  return {
    periods,
    cycles,
    avgCycle: basedOnHistory ? Math.round(weightedMean(usable)) : s.typicalCycleLength,
    avgPeriod: recentPeriods.length ? Math.round(weightedMean(recentPeriods)) : s.typicalPeriodLength,
    minCycle: cycles.length ? Math.min(...cycles.map((c) => c.length)) : null,
    maxCycle: cycles.length ? Math.max(...cycles.map((c) => c.length)) : null,
    basedOnHistory,
  };
}

function usableLengths(cycles: Cycle[]): number[] {
  return cycles.map((c) => c.length).filter((l) => l >= 15 && l <= 60).slice(-HISTORY_FOR_PREDICTION);
}

/** Half-width of the prediction range, in days. */
function uncertainty(stats: CycleStats): number {
  if (!stats.basedOnHistory) return 3;
  const usable = usableLengths(stats.cycles);
  return Math.min(7, Math.max(1, Math.round(stdDev(usable))));
}

/**
 * Ovulation confirmed by basal body temperature, using the common "3 over 6" rule: three
 * consecutive readings above the highest of the previous six (the cover line), with the third at
 * least 0.2 °C above it. Ovulation is taken as the day before the first high reading.
 * Only days between `from` and `to` (inclusive) are considered. Needs at least 9 readings.
 */
export interface TempShift { ovulation: ISODate; coverline: number; firstHigh: ISODate }

export function detectOvulation(days: Record<ISODate, DayLog>, from: ISODate, to: ISODate): TempShift | null {
  const readings = Object.keys(days)
    .filter((d) => d >= from && d <= to && typeof days[d].temp === "number")
    .sort()
    .map((d) => ({ d, t: days[d].temp! }));
  for (let i = 6; i + 2 < readings.length; i++) {
    const coverline = Math.max(...readings.slice(i - 6, i).map((r) => r.t));
    const [a, b, c] = readings.slice(i, i + 3);
    // readings must be on consecutive days for the rule to apply
    if (diffDays(a.d, c.d) !== 2) continue;
    if (a.t > coverline && b.t > coverline && c.t >= coverline + 0.2) {
      return { ovulation: addDays(a.d, -1), coverline, firstHigh: a.d };
    }
  }
  return null;
}

/** Temperature-confirmed ovulation in the current (latest) cycle, if any. */
export function currentCycleShift(data: AppData, stats: CycleStats): TempShift | null {
  const last = stats.periods[stats.periods.length - 1];
  if (!last) return null;
  return detectOvulation(data.days, last.start, addDays(last.start, 60));
}

/** Predict the next `count` periods after the last logged period start. */
export function predict(data: AppData, count = 3, stats = computeStats(data)): Prediction[] {
  const last = stats.periods[stats.periods.length - 1];
  if (!last) return [];
  let spread = uncertainty(stats);
  // A confirmed temperature shift pins the next period to about 14 days after ovulation.
  const shift = currentCycleShift(data, stats);
  let first = addDays(last.start, stats.avgCycle);
  if (shift) {
    first = addDays(shift.ovulation, LUTEAL_DAYS);
    spread = Math.min(spread, 2);
  }
  const out: Prediction[] = [];
  for (let i = 1; i <= count; i++) {
    const start = addDays(first, stats.avgCycle * (i - 1));
    const ovulation = i === 1 && shift ? shift.ovulation : addDays(start, -LUTEAL_DAYS);
    const s = spread * Math.min(i, 2);
    out.push({
      start,
      earliest: addDays(start, -s),
      latest: addDays(start, s),
      ovulation,
      fertileStart: addDays(ovulation, -5),
      fertileEnd: addDays(ovulation, 1),
    });
  }
  return out;
}

export function status(data: AppData, on: ISODate, stats = computeStats(data)): Status {
  const past = stats.periods.filter((p) => p.start <= on);
  const last = past[past.length - 1];
  if (!last) return { cycleDay: null, phase: "unknown", daysUntilNext: null, daysLate: 0, inPeriod: false };

  const cycleDay = diffDays(last.start, on) + 1;
  const inPeriod = on <= last.end || (on === addDays(last.end, 1) && isBleeding(data.days[on]));
  const next = predict(data, 1, { ...stats, periods: past })[0];
  const daysUntilNext = diffDays(on, next.start);
  const daysLate = on > next.latest ? diffDays(next.start, on) : 0;

  let phase: Phase;
  if (inPeriod) phase = "period";
  else if (daysLate > 0) phase = "late";
  else if (on >= next.fertileStart && on <= next.fertileEnd) phase = "fertile";
  else if (on < next.fertileStart) phase = "follicular";
  else phase = "luteal";

  return { cycleDay, phase, daysUntilNext, daysLate, inPeriod };
}

export type DayKind = "period" | "predicted" | "fertile" | "ovulation" | "spotting" | null;

/** What to paint on a calendar cell. Logged data always wins over predictions. */
export function dayKind(data: AppData, d: ISODate, stats: CycleStats, predictions: Prediction[]): DayKind {
  const log = data.days[d];
  if (stats.periods.some((p) => d >= p.start && d <= p.end)) return "period";
  if (log?.flow === "spotting") return "spotting";
  for (const p of predictions) {
    if (d >= p.start && d < addDays(p.start, stats.avgPeriod)) return "predicted";
    if (d === p.ovulation) return "ovulation";
    if (d >= p.fertileStart && d <= p.fertileEnd) return "fertile";
  }
  return null;
}

/**
 * Period predictions are switched off during pregnancy, and after pregnancy mode ends until the
 * first new period is logged (the old pre-pregnancy period would make everything look "late").
 */
export function predictionsEnabled(data: AppData, stats: CycleStats): boolean {
  const s = data.settings;
  if (s.goal === "pregnant") return false;
  const last = stats.periods[stats.periods.length - 1];
  if (s.pregnancyEnded && (!last || last.start < s.pregnancyEnded)) return false;
  return true;
}
