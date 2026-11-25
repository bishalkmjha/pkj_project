import { FlagBanner } from "../components/ui";
import type { GuidePhase } from "../i18n/phases";
import { MOOD_REMEDY, SYMPTOM_REMEDY, remedyById, type RemedyId } from "../i18n/remedies";
import { EvidenceTag } from "./Guides";
import { formatDate, type StringKey } from "../i18n";
import { status } from "../lib/cycle";
import { addDays } from "../lib/dates";
import { healthFlags, urgentNow } from "../lib/health";
import { useStore } from "../store";

export function Today({ onLog, onInsights, onPhase, onRemedy }: {
  onLog: () => void; onInsights: () => void; onPhase: (p: GuidePhase) => void; onRemedy: (r: RemedyId) => void;
}) {
  const { data, t, today, stats, predictions, startPeriod, endPeriod, setDay } = useStore();
  const lang = data.settings.lang;
  const st = status(data, today, stats);
  const next = predictions.find((p) => p.latest >= today) ?? predictions[0];
  const flags = healthFlags(data, stats, predictions[0], today);
  const fmt = (d: string) => formatDate(d, lang);
  const todayLog = data.days[today] ?? {};
  // Remedies for what was logged today; during a period with nothing logged, cramps tips by default.
  const reliefIds = [...new Set([
    ...(todayLog.symptoms ?? []).map((s) => SYMPTOM_REMEDY[s]),
    ...(todayLog.moods ?? []).map((m) => MOOD_REMEDY[m]),
  ].filter((x): x is RemedyId => !!x))];
  if (!reliefIds.length && st.inPeriod) reliefIds.push("cramps");
  const guidePhase: GuidePhase | null = ["period", "follicular", "fertile", "luteal"].includes(st.phase) ? (st.phase as GuidePhase) : null;

  let headline: string;
  if (st.phase === "unknown") headline = t("todayNoData");
  else if (st.inPeriod) headline = t("todayInPeriod", { n: st.cycleDay! });
  else if (st.daysLate > 0) headline = t("todayLate", { n: st.daysLate });
  else if (st.daysUntilNext === 0) headline = t("todayNextToday");
  else if (st.daysUntilNext === 1) headline = t("todayNextTomorrow");
  else headline = t("todayNextIn", { n: st.daysUntilNext! });

  // Ring progress: share of the average cycle elapsed.
  const progress = st.cycleDay ? Math.min(1, st.cycleDay / stats.avgCycle) : 0;
  const C = 2 * Math.PI * 88;

  return (
    <main className="screen">
      <div className="screen-title">
        <h1>{t("appName")}</h1>
        <span className="muted small">{formatDate(today, lang, { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      {urgentNow(data, today) && (
        <div className="banner urgent" role="alert">
          <span className="level">{t("level_urgent")}</span>
          <h3>{t("todayUrgentTitle")}</h3>
          <p className="small">{t("todayUrgentBody")}</p>
        </div>
      )}

      <section className="card hero">
        <div className="ring">
          <svg viewBox="0 0 200 200" aria-hidden>
            <circle cx="100" cy="100" r="88" fill="none" stroke="var(--surface-2)" strokeWidth="14" />
            <circle cx="100" cy="100" r="88" fill="none" stroke={st.phase === "fertile" ? "var(--fertile)" : "var(--accent)"}
              strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C * progress} ${C}`} />
          </svg>
          <div className="ring-label">
            {st.cycleDay && <span className="muted small">{t("todayCycleDay", { n: st.cycleDay })}</span>}
            <span className="ring-big">{headline}</span>
          </div>
        </div>
        <span className={`phase-pill ${st.phase === "fertile" ? "fertile" : ""}`}>{t(`phase_${st.phase}` as StringKey)}</span>
        {next && !st.inPeriod && (
          <p className="muted small">{t("todayExpectedRange", { from: fmt(next.earliest), to: fmt(next.latest) })}</p>
        )}
        {st.phase === "unknown" && <p className="muted small">{t("todayNoDataHint")}</p>}

        <div className="stack" style={{ width: "100%" }}>
          {st.inPeriod ? (
            <button className="btn block" onClick={() => endPeriod(today)}>{t("todayPeriodEnded")}</button>
          ) : (
            <button className="btn block" onClick={() => startPeriod(today)}>{t("todayPeriodStarted")}</button>
          )}
          <button className="btn secondary block" onClick={onLog}>{t("todayLogDay")}</button>
          {data.settings.reminders.pill.enabled && (
            <label className="setting" style={{ justifyContent: "center" }}>
              <input type="checkbox" checked={!!todayLog.pillTaken}
                onChange={(e) => setDay(today, { ...todayLog, pillTaken: e.target.checked || undefined })} />
              <span>💊 {t("todayPillTaken")}</span>
            </label>
          )}
        </div>
      </section>

      <section className="card">
        <h3>{t(`phase_${st.phase}` as StringKey)}</h3>
        <p className="small">{t(`phaseInfo_${st.phase}` as StringKey)}</p>
        {guidePhase && (
          <button className="link-btn" style={{ alignSelf: "flex-start" }} onClick={() => onPhase(guidePhase)}>{t("todayPhaseTips")} →</button>
        )}
      </section>

      {todayLog.discharge === "unusual" && <div className="banner doctor"><p className="small">{t("todayUnusualDischarge")}</p></div>}

      {reliefIds.length > 0 && (
        <section className="stack">
          <h2>{t("todayRelief")}</h2>
          <p className="muted small">{t("todayReliefHint")}</p>
          {reliefIds.slice(0, 3).map((id) => {
            const r = remedyById(id);
            return (
              <div key={id} className="card">
                <h3><span aria-hidden>{r.icon}</span> {r.title[lang]}</h3>
                {r.tips.slice(0, 2).map((tip, i) => (
                  <div key={i} className="stack" style={{ gap: 4 }}>
                    <EvidenceTag evidence={tip.evidence} />
                    <p className="small">{tip.text[lang]}</p>
                  </div>
                ))}
                <button className="link-btn" style={{ alignSelf: "flex-start" }} onClick={() => onRemedy(id)}>{t("seeAllTips")} →</button>
              </div>
            );
          })}
        </section>
      )}

      {flags.length > 0 && (
        <section className="stack">
          <div className="row between">
            <h2>{t("todayHealthNotes")}</h2>
            {flags.length > 2 && <button className="link-btn" onClick={onInsights}>{t("todaySeeAll")}</button>}
          </div>
          {flags.slice(0, 2).map((f) => <FlagBanner key={f.id} flag={f} />)}
        </section>
      )}

      {next && (
        <section className="card">
          <div className="row between small">
            <span>{t("calLegendFertile")}</span>
            <strong>{fmt(next.fertileStart)} – {fmt(next.fertileEnd)}</strong>
          </div>
          <div className="row between small">
            <span>{t("calLegendOvulation")}</span>
            <strong>{fmt(next.ovulation)}</strong>
          </div>
          <div className="row between small">
            <span>{t("calLegendPredicted")}</span>
            <strong>{fmt(next.start)} – {fmt(addDays(next.start, stats.avgPeriod - 1))}</strong>
          </div>
        </section>
      )}

      <p className="muted tiny" style={{ textAlign: "center" }}>{t("todayEstimateNote")}</p>
    </main>
  );
}
