import { describe, expect, it } from "vitest";
import { ARTICLES } from "../../i18n/articles";
import { PHASE_GUIDES } from "../../i18n/phases";
import { MOOD_REMEDY, REMEDIES, SYMPTOM_REMEDY } from "../../i18n/remedies";
import { parseBackup } from "../storage";
import { MOODS, SYMPTOMS, emptyData } from "../types";

const devanagari = /[ऀ-ॿ]/;

describe("remedies", () => {
  it("are complete in both languages with an evidence label and a see-a-doctor note", () => {
    for (const r of REMEDIES) {
      for (const field of [r.title, r.intro, r.doctor, ...(r.caution ? [r.caution] : [])]) {
        expect(field.en.length, r.id).toBeGreaterThan(0);
        expect(field.hi, r.id).toMatch(devanagari);
      }
      expect(r.tips.length, r.id).toBeGreaterThanOrEqual(3);
      for (const tip of r.tips) {
        expect(["good", "some", "traditional"]).toContain(tip.evidence);
        expect(tip.text.hi, r.id).toMatch(devanagari);
      }
    }
  });
  it("every mapped symptom or mood points to an existing remedy", () => {
    const ids = new Set(REMEDIES.map((r) => r.id));
    for (const s of SYMPTOMS) expect(SYMPTOM_REMEDY[s] === null || ids.has(SYMPTOM_REMEDY[s]!), s).toBe(true);
    for (const m of MOODS) expect(MOOD_REMEDY[m] === null || ids.has(MOOD_REMEDY[m]!), m).toBe(true);
  });
  it("never gives supplement doses", () => {
    const all = JSON.stringify(REMEDIES);
    expect(all).not.toMatch(/\d+\s?(mg|mcg|IU)\b/i);
  });
});

describe("phase guides and articles", () => {
  it("cover all four phases in both languages", () => {
    expect(PHASE_GUIDES.map((g) => g.id)).toEqual(["period", "follicular", "fertile", "luteal"]);
    for (const g of PHASE_GUIDES) {
      for (const item of [g.days, g.hormones, g.body, ...g.food, ...g.move, ...g.care]) expect(item.hi).toMatch(devanagari);
    }
  });
  it("have unique ids, a category, and matching paragraph counts", () => {
    const ids = ARTICLES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ARTICLES.length).toBe(16);
    for (const a of ARTICLES) {
      expect(a.category, a.id).toBeTruthy();
      expect(a.text.hi.body.length, a.id).toBe(a.text.en.body.length);
    }
  });
});

describe("new log fields", () => {
  it("keeps valid discharge values and the breast-check setting through a backup", () => {
    const data = emptyData();
    data.days["2026-01-10"] = { discharge: "eggWhite" };
    data.days["2026-01-11"] = { discharge: "glitter" as never };
    data.settings.reminders.breastCheck = false;
    const parsed = parseBackup(JSON.stringify(data))!;
    expect(parsed.days["2026-01-10"]).toEqual({ discharge: "eggWhite" });
    expect(parsed.days["2026-01-11"]).toBeUndefined();
    expect(parsed.settings.reminders.breastCheck).toBe(false);
  });
});
