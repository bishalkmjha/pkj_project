import { describe, expect, it } from "vitest";
import { computeStats, predict } from "../cycle";
import { addDays } from "../dates";
import { healthFlags, urgentNow } from "../health";
import type { AppData } from "../types";
import { startsFrom, withPeriods } from "./helpers";

function flagIds(data: AppData, on: string) {
  const stats = computeStats(data);
  return healthFlags(data, stats, predict(data, 1, stats)[0], on).map((f) => f.id);
}

describe("healthFlags", () => {
  it("flags nothing for regular cycles", () => {
    const starts = startsFrom("2026-01-01", [28, 29, 27, 28]);
    expect(flagIds(withPeriods(starts), addDays(starts.at(-1)!, 10))).toEqual([]);
  });

  it("flags short, long and irregular cycles", () => {
    const short = startsFrom("2026-01-01", [19, 18, 20]);
    expect(flagIds(withPeriods(short, 4), addDays(short.at(-1)!, 5))).toContain("shortCycles");
    const long = startsFrom("2026-01-01", [40, 45, 38]);
    const ids = flagIds(withPeriods(long), addDays(long.at(-1)!, 5));
    expect(ids).toContain("longCycles");
    const irregular = startsFrom("2026-01-01", [24, 36, 26]);
    expect(flagIds(withPeriods(irregular), addDays(irregular.at(-1)!, 5))).toContain("irregular");
  });

  it("flags long and heavy periods", () => {
    const starts = startsFrom("2026-01-01", [28, 28]);
    expect(flagIds(withPeriods(starts, 9), "2026-03-05")).toContain("longPeriod");
    expect(flagIds(withPeriods(starts, 5, "heavy"), "2026-03-05")).toContain("heavyFlow");
  });

  it("flags severe pain in 2+ periods", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]), 5, "medium", { pain: 3 });
    expect(flagIds(data, "2026-03-05")).toContain("severePain");
  });

  it("flags 90+ days without a period, and lateness of a week", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]));
    expect(flagIds(data, "2026-06-01")).toContain("noPeriod90");
    expect(flagIds(data, "2026-04-05")).toContain("late");
    expect(flagIds(data, "2026-03-27")).not.toContain("late");
  });

  it("flags bleeding between periods", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]));
    data.days["2026-01-15"] = { flow: "spotting" };
    data.days["2026-02-12"] = { flow: "spotting" };
    expect(flagIds(data, "2026-03-05")).toContain("betweenPeriods");
  });

  it("suggests PCOS only alongside a cycle problem plus symptoms", () => {
    const long = startsFrom("2026-01-01", [42, 45, 40]);
    const data = withPeriods(long);
    const on = addDays(long.at(-1)!, 5);
    expect(flagIds(data, on)).not.toContain("pcosSigns");
    data.days[on] = { symptoms: ["excessHair"] };
    expect(flagIds(data, on)).toContain("pcosSigns");
  });

  it("suggests anaemia with heavy periods plus tiredness", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]), 5, "heavy", { symptoms: ["fatigue"] });
    expect(flagIds(data, "2026-03-05")).toContain("anemiaSigns");
  });
});

describe("urgentNow", () => {
  it("needs 3 heavy days in a row with dizziness", () => {
    const data = withPeriods(["2026-01-01"], 3, "heavy");
    expect(urgentNow(data, "2026-01-03")).toBe(false);
    data.days["2026-01-03"] = { flow: "heavy", symptoms: ["dizziness"] };
    expect(urgentNow(data, "2026-01-03")).toBe(true);
  });
});
