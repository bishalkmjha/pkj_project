import { FlagBanner } from "../components/ui";
import { formatDate, type StringKey } from "../i18n";
import { healthFlags } from "../lib/health";
import { symptomCounts } from "../lib/report";
import { useStore } from "../store";

export function Insights({ onReport }: { onReport: () => void }) {
  const { data, t, today, stats, predictions } = useStore();
  const lang = data.settings.lang;
  const flags = healthFlags(data, stats, predictions[0], today);
  const symptoms = symptomCounts(data, today).slice(0, 6);
  const maxCount = symptoms[0]?.[1] ?? 1;
  const fmt = (d: string) => formatDate(d, lang, { day: "numeric", month: "short", year: "numeric" });
  const last = stats.periods[stats.periods.length - 1];

  return (
    <main className="screen">
      <div className="screen-title"><h1>{t("tabInsights")}</h1></div>

      <section className="tiles">
        <div className="tile"><div className="muted small">{t("insAvgCycle")}</div><div className="v">{t("days", { n: stats.avgCycle })}</div></div>
        <div className="tile"><div className="muted small">{t("insAvgPeriod")}</div><div className="v">{t("days", { n: stats.avgPeriod })}</div></div>
        <div className="tile"><div className="muted small">{t("insRange")}</div><div className="v">{stats.minCycle !== null ? `${stats.minCycle}–${stats.maxCycle}` : "–"}</div></div>
        <div className="tile"><div className="muted small">{t("insCycles")}</div><div className="v">{stats.cycles.length}</div></div>
      </section>
      {!stats.basedOnHistory && <p className="muted small">{t("insFromSettings")}</p>}

      <section className="stack">
        <h2>{t("insHealth")}</h2>
        {flags.length ? flags.map((f) => <FlagBanner key={f.id} flag={f} />) : <div className="banner info"><p className="small">{t("insAllGood")}</p></div>}
      </section>

      <button className="list-item" onClick={onReport}>
        <span className="emoji">📋</span>
        <span className="stack" style={{ gap: 2 }}>
          <strong>{t("insDoctorReport")}</strong>
          <span className="muted small">{t("insDoctorReportHint")}</span>
        </span>
      </button>

      <section className="card">
        <h3>{t("insTopSymptoms")}</h3>
        {symptoms.length === 0 && <p className="muted small">{t("insNoSymptoms")}</p>}
        {symptoms.map(([s, n]) => (
          <div key={s} className="stack" style={{ gap: 4 }}>
            <div className="row between small"><span>{t(`sym_${s}` as StringKey)}</span><span className="muted">{n}</span></div>
            <div className="bar"><div style={{ width: `${(100 * n) / maxCount}%` }} /></div>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>{t("insHistory")}</h3>
        {!last && <p className="muted small">{t("notEnoughData")}</p>}
        {last && <p className="small">{t("insCurrentCycle", { start: fmt(last.start) })}</p>}
        {[...stats.cycles].reverse().slice(0, 12).map((c) => (
          <p key={c.start} className="small">{t("insCycleRow", { start: fmt(c.start), len: c.length, plen: c.periodLength })}</p>
        ))}
      </section>
    </main>
  );
}
