import { useState } from "react";
import { formatDate, formatMonth, weekdayNames } from "../i18n";
import { dayKind } from "../lib/cycle";
import { monthGrid, toLocalDate, type ISODate } from "../lib/dates";
import { useStore } from "../store";

export function Calendar({ onPick }: { onPick: (d: ISODate) => void }) {
  const { data, t, today, stats, predictions } = useStore();
  const lang = data.settings.lang;
  const now = toLocalDate(today);
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const grid = monthGrid(ym.y, ym.m);
  const move = (delta: number) => {
    const d = new Date(ym.y, ym.m + delta, 1);
    setYm({ y: d.getFullYear(), m: d.getMonth() });
  };
  const monthPrefix = `${ym.y}-${String(ym.m + 1).padStart(2, "0")}`;

  return (
    <main className="screen">
      <div className="screen-title"><h1>{t("tabCalendar")}</h1>
        <button className="link-btn" onClick={() => setYm({ y: now.getFullYear(), m: now.getMonth() })}>{t("calToday")}</button>
      </div>
      <section className="card">
        <div className="cal-head">
          <button className="icon-btn" onClick={() => move(-1)} aria-label={t("calPrev")}>‹</button>
          <h2 aria-live="polite">{formatMonth(ym.y, ym.m, lang)}</h2>
          <button className="icon-btn" onClick={() => move(1)} aria-label={t("calNext")}>›</button>
        </div>
        <div className="cal-grid" role="grid">
          {weekdayNames(lang).map((w, i) => <div key={i} className="cal-wd">{w}</div>)}
          {grid.map((d) => {
            const kind = dayKind(data, d, stats, predictions);
            const log = data.days[d];
            const hasNotes = !!(log?.symptoms?.length || log?.moods?.length || log?.note || log?.pain);
            const future = d > today;
            const cls = ["cal-day", kind ?? "", d.startsWith(monthPrefix) ? "" : "out", d === today ? "today" : "", future ? "future" : ""].join(" ");
            return (
              <button key={d} className={cls} disabled={future} onClick={() => onPick(d)}
                aria-label={`${formatDate(d, lang, { day: "numeric", month: "long" })}${kind ? `, ${t(`calLegend${kind[0].toUpperCase()}${kind.slice(1)}` as never)}` : ""}`}>
                {Number(d.slice(8))}
                {hasNotes && <span className="dot" />}
              </button>
            );
          })}
        </div>
      </section>
      <div className="legend">
        <span><i className="sw period" />{t("calLegendPeriod")}</span>
        <span><i className="sw predicted" />{t("calLegendPredicted")}</span>
        <span><i className="sw fertile" />{t("calLegendFertile")}</span>
        <span><i className="sw ovulation" />{t("calLegendOvulation")}</span>
        <span><i className="sw spotting" />{t("calLegendSpotting")}</span>
      </div>
      <p className="muted small">{t("calTapHint")}</p>
      <p className="muted tiny">{t("todayEstimateNote")}</p>
    </main>
  );
}
