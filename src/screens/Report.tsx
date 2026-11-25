import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { useState } from "react";
import { Page } from "../components/ui";
import { formatDate, translator, type StringKey } from "../i18n";
import { buildReport, reportAsText } from "../lib/report";
import type { Lang } from "../lib/types";
import { useStore } from "../store";

export function Report({ onBack, toast }: { onBack: () => void; toast: (msg: string) => void }) {
  const { data, today, t: appT } = useStore();
  const [lang, setLang] = useState<Lang>(data.settings.lang);
  const t = translator(lang);
  const r = buildReport(data, today);
  const fmt = (d: string) => formatDate(d, lang, { day: "numeric", month: "short", year: "numeric" });

  const share = async () => {
    const text = reportAsText(r, lang);
    try {
      if (Capacitor.isNativePlatform() || typeof navigator.share === "function") {
        await Share.share({ title: t("reportTitle"), text, dialogTitle: t("reportShare") });
      } else {
        await navigator.clipboard.writeText(text);
        toast(t("reportCopied"));
      }
    } catch {
      /* user closed the share sheet */
    }
  };

  return (
    <Page title={appT("insDoctorReport")} onBack={onBack}>
      <div className="row between no-print">
        <span className="small muted">{appT("reportLanguage")}</span>
        <div className="seg">
          {(["en", "hi"] as Lang[]).map((l) => (
            <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>{l === "en" ? "English" : "हिन्दी"}</button>
          ))}
        </div>
      </div>

      <article className="card report" lang={lang}>
        <h2>{t("reportTitle")}</h2>
        <p className="muted tiny">{t("reportGenerated", { date: fmt(r.generated) })}</p>

        <h3>{t("reportOverview")}</h3>
        <table><tbody>
          <tr><th>{t("insAvgCycle")}</th><td>{t("days", { n: r.avgCycle })}</td></tr>
          <tr><th>{t("insAvgPeriod")}</th><td>{t("days", { n: r.avgPeriod })}</td></tr>
          <tr><th>{t("insRange")}</th><td>{r.minCycle !== null ? `${r.minCycle}–${r.maxCycle}` : "–"}</td></tr>
          <tr><th>{t("insCycles")}</th><td>{r.cyclesLogged}</td></tr>
        </tbody></table>

        <h3>{t("reportCycles")}</h3>
        {r.rows.length === 0 ? <p className="small muted">{t("reportNone")}</p> : (
          <table>
            <thead><tr><th>{t("reportColStart")}</th><th>{t("reportColCycle")}</th><th>{t("reportColPeriod")}</th><th>{t("reportColHeavy")}</th><th>{t("reportColPain")}</th></tr></thead>
            <tbody>{r.rows.map((row) => (
              <tr key={row.start}><td>{fmt(row.start)}</td><td>{row.cycle ?? "–"}</td><td>{row.period}</td><td>{row.heavy}</td><td>{t(`pain_${row.pain}` as StringKey)}</td></tr>
            ))}</tbody>
          </table>
        )}

        <h3>{t("reportFlags")}</h3>
        {r.flags.length === 0 ? <p className="small">{t("reportNone")}</p> : (
          <ul className="small">{r.flags.map((f) => <li key={f.id}>{t(`flag_${f.id}_title` as StringKey, f.params)}</li>)}</ul>
        )}

        <h3>{t("reportSymptoms")}</h3>
        {r.symptoms.length === 0 ? <p className="small">{t("reportNone")}</p> : (
          <ul className="small">{r.symptoms.map(([s, n]) => <li key={s}>{t(`sym_${s}` as StringKey)}: {n}</li>)}</ul>
        )}
      </article>

      <div className="row no-print">
        <button className="btn" style={{ flex: 1 }} onClick={share}>{appT("reportShare")}</button>
        {!Capacitor.isNativePlatform() && <button className="btn secondary" onClick={() => window.print()}>{appT("reportPrint")}</button>}
      </div>
    </Page>
  );
}
