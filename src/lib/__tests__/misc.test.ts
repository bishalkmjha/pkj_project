import { describe, expect, it } from "vitest";
import { ARTICLES } from "../../i18n/articles";
import { en } from "../../i18n/en";
import { hi } from "../../i18n/hi";
import { translator } from "../../i18n";
import { checkPin, hashPin } from "../pin";
import { buildReport, reportAsText } from "../report";
import { parseBackup } from "../storage";
import { emptyData } from "../types";
import { startsFrom, withPeriods } from "./helpers";

describe("i18n", () => {
  it("has a Hindi string for every English key, with the same placeholders", () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(hi[key], key).toBeTruthy();
      const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
      expect(ph(hi[key]), key).toBe(ph(en[key]));
    }
  });
  it("has every article in both languages", () => {
    for (const a of ARTICLES) {
      expect(a.text.hi.body.length).toBe(a.text.en.body.length);
      expect(a.text.hi.title).toMatch(/[ऀ-ॿ]/);
    }
  });
  it("interpolates params", () => {
    expect(translator("hi")("todayNextIn", { n: 5 })).toBe("अगला पीरियड 5 दिन में");
  });
});

describe("backup parsing", () => {
  it("round-trips data and drops junk", () => {
    const data = withPeriods(["2026-01-01"]);
    data.settings.lang = "hi";
    const parsed = parseBackup(JSON.stringify(data))!;
    expect(parsed.settings.lang).toBe("hi");
    expect(Object.keys(parsed.days)).toHaveLength(5);

    const dirty = { ...emptyData(), days: { "2026-13-01": { flow: "heavy" }, "2026-01-01": { flow: "lava", symptoms: ["acne", "x"] } } };
    const cleaned = parseBackup(JSON.stringify(dirty))!;
    expect(cleaned.days).toEqual({ "2026-01-01": { symptoms: ["acne"] } });
  });
  it("rejects non-Sakhi files", () => {
    expect(parseBackup("not json")).toBeNull();
    expect(parseBackup(JSON.stringify({ hello: 1 }))).toBeNull();
  });
});

describe("pin", () => {
  it("hashes with salt and verifies", async () => {
    const h = await hashPin("1234");
    expect(h).not.toContain("1234");
    expect(await checkPin("1234", h)).toBe(true);
    expect(await checkPin("4321", h)).toBe(false);
    expect(await hashPin("1234")).not.toBe(h);
  });
});

describe("report", () => {
  it("summarises cycles, flags and symptoms", () => {
    const data = withPeriods(startsFrom("2026-01-01", [28, 28]), 5, "heavy", { symptoms: ["cramps"], pain: 2 });
    const r = buildReport(data, "2026-03-05");
    expect(r.rows[0]).toMatchObject({ start: "2026-02-26", cycle: null, heavy: 5 });
    expect(r.rows[2]).toMatchObject({ start: "2026-01-01", cycle: 28 });
    expect(r.symptoms[0]).toEqual(["cramps", 15]);
    const text = reportAsText(r, "en");
    expect(text).toContain("Heavy bleeding");
    expect(reportAsText(r, "hi")).toContain("ज़्यादा ब्लीडिंग");
  });
});
