/** Builds the doctor report (as structured data and as plain text for sharing). */
import { formatDate, translator, type StringKey } from "../i18n";
import { computeStats, predict } from "./cycle";
import { addDays, type ISODate } from "./dates";
import { healthFlags, type HealthFlag } from "./health";
import type { AppData, Lang, Symptom } from "./types";

export interface ReportRow { start: ISODate; cycle: number | null; period: number; heavy: number; pain: number }

export interface Report {
  generated: ISODate;
  avgCycle: number;
  avgPeriod: number;
  minCycle: number | null;
  maxCycle: number | null;
  cyclesLogged: number;
  basedOnHistory: boolean;
  rows: ReportRow[]; // newest first, up to 12
  flags: HealthFlag[];
  symptoms: [Symptom, number][];
}

export function symptomCounts(data: AppData, on: ISODate, sinceDays = 180): [Symptom, number][] {
  const from = addDays(on, -sinceDays);
  const counts = new Map<Symptom, number>();
  for (const [d, log] of Object.entries(data.days)) {
    if (d < from || d > on) continue;
    for (const s of log.symptoms ?? []) counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export function buildReport(data: AppData, on: ISODate): Report {
  const stats = computeStats(data);
  const next = predict(data, 1, stats)[0];
  const rows: ReportRow[] = stats.periods.map((p, i) => {
    const nextP = stats.periods[i + 1];
    return {
      start: p.start,
      cycle: nextP ? stats.cycles[i].length : null,
      period: p.length,
      heavy: p.heavyDays,
      pain: p.maxPain,
    };
  });
  return {
    generated: on,
    avgCycle: stats.avgCycle,
    avgPeriod: stats.avgPeriod,
    minCycle: stats.minCycle,
    maxCycle: stats.maxCycle,
    cyclesLogged: stats.cycles.length,
    basedOnHistory: stats.basedOnHistory,
    rows: rows.reverse().slice(0, 12),
    flags: healthFlags(data, stats, next, on),
    symptoms: symptomCounts(data, on),
  };
}

export function reportAsText(r: Report, lang: Lang): string {
  const t = translator(lang);
  const date = (d: ISODate) => formatDate(d, lang, { day: "numeric", month: "short", year: "numeric" });
  const lines: string[] = [
    t("reportTitle"),
    t("reportGenerated", { date: date(r.generated) }),
    "",
    `${t("reportOverview")}:`,
    `- ${t("insAvgCycle")}: ${t("days", { n: r.avgCycle })}`,
    `- ${t("insAvgPeriod")}: ${t("days", { n: r.avgPeriod })}`,
  ];
  if (r.minCycle !== null) lines.push(`- ${t("insRange")}: ${r.minCycle}–${r.maxCycle}`);
  lines.push(`- ${t("insCycles")}: ${r.cyclesLogged}`, "", `${t("reportCycles")}:`);
  for (const row of r.rows) {
    lines.push(`- ${date(row.start)}: ${t("reportColCycle")} ${row.cycle ?? "–"}, ${t("reportColPeriod")} ${row.period}, ` +
      `${t("reportColHeavy")} ${row.heavy}, ${t("reportColPain")} ${t(`pain_${row.pain}` as StringKey)}`);
  }
  lines.push("", `${t("reportFlags")}:`);
  if (!r.flags.length) lines.push(`- ${t("reportNone")}`);
  for (const f of r.flags) lines.push(`- ${t(`flag_${f.id}_title` as StringKey, f.params)}`);
  lines.push("", `${t("reportSymptoms")}:`);
  if (!r.symptoms.length) lines.push(`- ${t("reportNone")}`);
  for (const [s, n] of r.symptoms) lines.push(`- ${t(`sym_${s}` as StringKey)}: ${n}`);
  return lines.join("\n");
}
