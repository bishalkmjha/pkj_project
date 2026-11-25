import { describe, expect, it } from "vitest";
import { computeStats, dayKind, findPeriods, predict, status } from "../cycle";
import { addDays, diffDays, monthGrid } from "../dates";
import { emptyData } from "../types";
import { startsFrom, withPeriods } from "./helpers";

describe("dates", () => {
  it("does day arithmetic across DST and month ends", () => {
    expect(addDays("2026-03-28", 3)).toBe("2026-03-31");
    expect(addDays("2026-02-27", 2)).toBe("2026-03-01");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(diffDays("2026-10-20", "2026-11-03")).toBe(14);
  });
  it("builds a Monday-first month grid", () => {
    const g = monthGrid(2026, 10); // November 2026 starts on a Sunday
    expect(g[0]).toBe("2026-10-26");
    expect(g.length % 7).toBe(0);
    expect(g).toContain("2026-11-30");
  });
});

describe("findPeriods", () => {
  it("groups bleeding days, merges short gaps, ignores lone spotting", () => {
    const data = emptyData();
    data.days["2026-01-01"] = { flow: "heavy", pain: 3 };
    data.days["2026-01-02"] = { flow: "medium" };
    data.days["2026-01-05"] = { flow: "light" }; // gap of 2 days -> same period
    data.days["2026-01-15"] = { flow: "spotting" };
    data.days["2026-01-29"] = { flow: "light" };
    const p = findPeriods(data.days);
    expect(p).toHaveLength(2);
    expect(p[0]).toMatchObject({ start: "2026-01-01", end: "2026-01-05", length: 5, heavyDays: 1, maxPain: 3 });
    expect(p[1].start).toBe("2026-01-29");
  });
});

describe("predict", () => {
  it("uses typical length until two cycles exist", () => {
    const data = withPeriods(["2026-01-01"]);
    data.settings.typicalCycleLength = 30;
    const [next] = predict(data);
    expect(next.start).toBe("2026-01-31");
    expect(diffDays(next.earliest, next.latest)).toBe(6); // +/- 3 days
  });

  it("uses a recency-weighted average of the user's cycles", () => {
    const data = withPeriods(startsFrom("2026-01-01", [26, 26, 32, 32]));
    const stats = computeStats(data);
    expect(stats.basedOnHistory).toBe(true);
    expect(stats.avgCycle).toBe(30); // (26*1+26*2+32*3+32*4)/10 = 30.2
    const [next] = predict(data, 1, stats);
    expect(diffDays(stats.periods.at(-1)!.start, next.start)).toBe(30);
  });

  it("places ovulation 14 days before the next period with a 7-day fertile window", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]));
    const [next] = predict(data);
    expect(diffDays(next.ovulation, next.start)).toBe(14);
    expect(diffDays(next.fertileStart, next.fertileEnd)).toBe(6);
  });

  it("widens the range for irregular cycles", () => {
    const regular = predict(withPeriods(startsFrom("2026-01-01", [28, 28, 28, 28])))[0];
    const irregular = predict(withPeriods(startsFrom("2026-01-01", [22, 34, 25, 36])))[0];
    expect(diffDays(regular.earliest, regular.latest)).toBeLessThan(diffDays(irregular.earliest, irregular.latest));
  });

  it("leaves outlier cycles out of the average", () => {
    const stats = computeStats(withPeriods(startsFrom("2026-01-01", [28, 28, 120, 28])));
    expect(stats.avgCycle).toBe(28);
    expect(stats.maxCycle).toBe(120);
  });

  it("returns nothing without data", () => {
    expect(predict(emptyData())).toEqual([]);
  });
});

describe("status", () => {
  const data = withPeriods(startsFrom("2026-01-01", [28, 28])); // last period 2026-02-26
  it("reports period days", () => {
    expect(status(data, "2026-02-27")).toMatchObject({ cycleDay: 2, phase: "period", inPeriod: true });
  });
  it("reports follicular, fertile and luteal phases", () => {
    expect(status(data, "2026-03-05").phase).toBe("follicular");
    expect(status(data, "2026-03-12").phase).toBe("fertile");
    expect(status(data, "2026-03-20").phase).toBe("luteal");
    expect(status(data, "2026-03-20").daysUntilNext).toBe(6);
  });
  it("reports lateness after the predicted range", () => {
    const s = status(data, "2026-04-01");
    expect(s.phase).toBe("late");
    expect(s.daysLate).toBe(6);
  });
  it("is unknown without periods", () => {
    expect(status(emptyData(), "2026-01-01").phase).toBe("unknown");
  });
});

describe("dayKind", () => {
  it("prefers logged data over predictions", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]));
    const stats = computeStats(data);
    const preds = predict(data, 3, stats);
    expect(dayKind(data, "2026-01-02", stats, preds)).toBe("period");
    expect(dayKind(data, preds[0].start, stats, preds)).toBe("predicted");
    expect(dayKind(data, preds[0].ovulation, stats, preds)).toBe("ovulation");
    expect(dayKind(data, addDays(preds[0].ovulation, -2), stats, preds)).toBe("fertile");
  });
});
