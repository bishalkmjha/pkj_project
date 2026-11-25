import { describe, expect, it } from "vitest";
import { computeStats, detectOvulation, predict, predictionsEnabled } from "../cycle";
import { addDays, diffDays } from "../dates";
import { healthFlags } from "../health";
import { pregnancyStatus } from "../pregnancy";
import { parseBackup } from "../storage";
import { formatTemp, parseTemp } from "../temp";
import type { AppData } from "../types";
import { startsFrom, withPeriods } from "./helpers";

/** Low temps (~36.4) until `shiftDay` (cycle day index), then high (~36.8). */
function withTemps(data: AppData, start: string, days: number, shiftDay: number) {
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    const base = i < shiftDay ? 36.4 + (i % 3) * 0.05 : 36.8 + (i % 2) * 0.05;
    data.days[d] = { ...data.days[d], temp: base };
  }
  return data;
}

const flagIds = (data: AppData, on: string) => {
  const stats = computeStats(data);
  return healthFlags(data, stats, predict(data, 1, stats)[0], on).map((f) => f.id);
};

describe("temperature ovulation detection", () => {
  it("finds a 3-over-6 shift and dates ovulation to the day before", () => {
    const data = withTemps(withPeriods(["2026-01-01"]), "2026-01-01", 22, 16);
    const shift = detectOvulation(data.days, "2026-01-01", "2026-02-01");
    expect(shift?.firstHigh).toBe("2026-01-17");
    expect(shift?.ovulation).toBe("2026-01-16");
    expect(shift?.coverline).toBeCloseTo(36.5);
  });
  it("needs a real rise, on consecutive days", () => {
    const flat = withTemps(withPeriods(["2026-01-01"]), "2026-01-01", 22, 99);
    expect(detectOvulation(flat.days, "2026-01-01", "2026-02-01")).toBeNull();
    const gappy = withTemps(withPeriods(["2026-01-01"]), "2026-01-01", 22, 16);
    delete gappy.days["2026-01-18"].temp;
    expect(detectOvulation(gappy.days, "2026-01-01", "2026-01-19")).toBeNull();
  });
  it("pins the next period to ovulation + 14 days with a tight range", () => {
    const data = withTemps(withPeriods(["2026-01-01"]), "2026-01-01", 22, 19); // late ovulation
    data.settings.typicalCycleLength = 28;
    const [next] = predict(data);
    expect(next.ovulation).toBe("2026-01-19");
    expect(next.start).toBe("2026-02-02");
    expect(diffDays(next.earliest, next.latest)).toBeLessThanOrEqual(4);
  });
});

describe("temperature input", () => {
  it("parses °C and °F into °C and rejects implausible values", () => {
    expect(parseTemp("36.55", "C")).toBe(36.55);
    expect(parseTemp("36,55", "C")).toBe(36.55);
    expect(parseTemp("97.7", "F")).toBeCloseTo(36.5, 1);
    expect(parseTemp("42", "C")).toBeNull();
    expect(parseTemp("abc", "C")).toBeNull();
    expect(formatTemp(36.5, "F")).toBe("97.70 °F");
  });
});

describe("intimacy and late periods", () => {
  it("suggests a pregnancy test as soon as a period is late after unprotected sex", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]));
    data.days["2026-03-08"] = { intimacy: "unprotected" };
    const ids = flagIds(data, "2026-03-29"); // 2 days past the predicted range
    expect(ids).toContain("lateUnprotected");
    expect(ids).not.toContain("late");
    data.days["2026-03-08"] = { intimacy: "protected" };
    expect(flagIds(data, "2026-03-29")).not.toContain("lateUnprotected");
  });
});

describe("pregnancy mode", () => {
  it("dates the pregnancy from the last period", () => {
    const p = pregnancyStatus("2026-01-01", "2026-03-19");
    expect(p).toMatchObject({ weeks: 11, days: 0, trimester: 1, dueDate: "2026-10-08" });
    expect(pregnancyStatus("2026-01-01", "2026-05-01").trimester).toBe(2);
    expect(pregnancyStatus("2026-01-01", "2026-08-01").trimester).toBe(3);
  });
  it("switches off predictions and cycle warnings while pregnant", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]));
    data.settings.goal = "pregnant";
    data.settings.pregnancy = { lmp: "2026-02-26" };
    expect(predictionsEnabled(data, computeStats(data))).toBe(false);
    expect(flagIds(data, "2026-06-01")).toEqual([]);
  });
  it("after pregnancy, waits for the first new period before predicting or flagging lateness", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28]));
    data.settings.pregnancyEnded = "2026-10-01";
    expect(predictionsEnabled(data, computeStats(data))).toBe(false);
    expect(flagIds(data, "2026-11-01")).not.toContain("noPeriod90");
    for (let i = 0; i < 4; i++) data.days[addDays("2026-11-20", i)] = { flow: "medium" };
    expect(predictionsEnabled(data, computeStats(data))).toBe(true);
  });
  it("survives a backup, and drops pregnancy mode without a date", () => {
    const data = withPeriods(["2026-01-01"]);
    data.settings.goal = "pregnant";
    data.settings.pregnancy = { lmp: "2026-01-01" };
    expect(parseBackup(JSON.stringify(data))!.settings.pregnancy).toEqual({ lmp: "2026-01-01" });
    data.settings.pregnancy = null;
    expect(parseBackup(JSON.stringify(data))!.settings.goal).toBe("track");
  });
});
