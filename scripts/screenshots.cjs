// Captures app screenshots for the website (website/img/*.jpg) in English and Hindi.
// Usage: npm run build && npx vite preview --port 4173 &  then  node scripts/screenshots.cjs
// Needs Playwright (preinstalled in the dev container; otherwise `npm i -D playwright`).
const { chromium } = require("playwright");
const KEY = "CapacitorStorage.sakhi.data.v1";

function seed(lang) {
  const t = new Date();
  const iso = (n) => { const d = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const days = {};
  let start = -120;
  for (const len of [29, 27, 30, 28]) {
    for (let i = 0; i < 5; i++) days[iso(start + i)] = { flow: i === 0 ? "medium" : i < 3 ? "heavy" : "light", pain: i < 2 ? 2 : 1, symptoms: i < 2 ? ["cramps", "fatigue"] : [] };
    start += len;
  }
  for (let i = 0; i < 5; i++) days[iso(start + i)] = { flow: i < 2 ? "medium" : "light" };
  for (let i = 0; i <= -start; i++) { const d = iso(start + i); days[d] = { ...(days[d] || {}), temp: i < 14 ? 36.35 + (i % 3) * 0.05 : 36.8 + (i % 2) * 0.05 }; }
  days[iso(0)] = { ...days[iso(0)], symptoms: ["bloating", "headache"], moods: ["calm"] };
  return { version: 1, days, settings: { lang, onboarded: true, acceptedDisclaimer: true, typicalCycleLength: 28, typicalPeriodLength: 5,
    reminders: { periodSoon: true, periodLate: true, breastCheck: true, pill: { enabled: false, time: "21:00" } },
    goal: "track", pregnancy: null, pregnancyEnded: null, tempUnit: "C", showIntimacy: true, pinHash: null } };
}

(async () => {
  const b = await chromium.launch();
  for (const lang of ["en", "hi"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "light", locale: lang === "hi" ? "hi-IN" : "en-IN" });
    const p = await ctx.newPage();
    await p.goto("http://localhost:4173/");
    await p.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify(seed(lang))]);
    await p.reload();
    const nav = (i) => p.locator("nav button").nth(i).click();
    const shot = (name) => p.screenshot({ path: `website/img/${lang}-${name}.jpg`, type: "jpeg", quality: 82 });
    await p.waitForSelector(".ring");
    await shot("today");
    await nav(1); await shot("calendar");
    await nav(2); await p.locator(".tiles").waitFor(); await p.evaluate(() => document.querySelector("main").scrollTo(0, 0)); await shot("insights");
    await nav(3); await p.locator(".chips .chip").first().click(); await p.waitForSelector(".page"); await shot("remedy");
    await ctx.close();
  }
  await b.close();
  console.log("screenshots written to website/img/");
})();
