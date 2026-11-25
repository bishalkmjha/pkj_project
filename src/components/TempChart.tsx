import { formatDate } from "../i18n";
import { currentCycleShift } from "../lib/cycle";
import { addDays, diffDays } from "../lib/dates";
import { cToUnit } from "../lib/temp";
import { useStore } from "../store";

/** Waking temperatures for the current cycle, with the cover line and confirmed ovulation. */
export function TempChart() {
  const { data, t, stats, today } = useStore();
  const lang = data.settings.lang;
  const unit = data.settings.tempUnit;
  const last = stats.periods[stats.periods.length - 1];
  if (!last) return null;
  const end = today < addDays(last.start, 45) ? today : addDays(last.start, 45);
  const points = Object.keys(data.days)
    .filter((d) => d >= last.start && d <= end && data.days[d].temp !== undefined)
    .sort()
    .map((d) => ({ d, x: diffDays(last.start, d), v: cToUnit(data.days[d].temp!, unit) }));

  return (
    <section className="card">
      <h3>{t("insTemp")}</h3>
      {points.length < 3 ? <p className="muted small">{t("insTempHint")}</p> : <Chart points={points} />}
      {points.length >= 3 && <ShiftNote />}
    </section>
  );

  function ShiftNote() {
    const shift = currentCycleShift(data, stats);
    return shift
      ? <p className="small">🌡️ {t("insTempOvulation", { date: formatDate(shift.ovulation, lang), line: `${cToUnit(shift.coverline, unit).toFixed(2)}°${unit}` })}</p>
      : <p className="muted small">{t("insTempNoShift")}</p>;
  }

  function Chart({ points }: { points: { d: string; x: number; v: number }[] }) {
    const shift = currentCycleShift(data, stats);
    const W = 320, H = 140, P = 28;
    const maxX = Math.max(28, ...points.map((p) => p.x));
    const vals = points.map((p) => p.v);
    const pad = unit === "C" ? 0.15 : 0.3;
    const lo = Math.min(...vals) - pad, hi = Math.max(...vals) + pad;
    const sx = (x: number) => P + (x / maxX) * (W - P - 8);
    const sy = (v: number) => H - 18 - ((v - lo) / (hi - lo)) * (H - 30);
    const line = points.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.v).toFixed(1)}`).join(" ");
    const cover = shift ? cToUnit(shift.coverline, unit) : null;
    const ovX = shift ? diffDays(last!.start, shift.ovulation) : null;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={t("insTemp")} style={{ overflow: "visible" }}>
        <text x="0" y={sy(hi - pad) + 4} fontSize="10" fill="var(--muted)">{(hi - pad).toFixed(1)}</text>
        <text x="0" y={sy(lo + pad) + 4} fontSize="10" fill="var(--muted)">{(lo + pad).toFixed(1)}</text>
        <line x1={P} x2={W - 8} y1={H - 18} y2={H - 18} stroke="var(--line)" />
        {[1, 7, 14, 21, 28].filter((d) => d <= maxX + 1).map((d) => (
          <text key={d} x={sx(d - 1)} y={H - 4} fontSize="10" fill="var(--muted)" textAnchor="middle">{d}</text>
        ))}
        {cover !== null && <line x1={P} x2={W - 8} y1={sy(cover)} y2={sy(cover)} stroke="var(--ovulation)" strokeDasharray="4 3" />}
        {ovX !== null && <line x1={sx(ovX)} x2={sx(ovX)} y1={8} y2={H - 18} stroke="var(--ovulation)" strokeWidth="2" opacity=".5" />}
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" />
        {points.map((p) => <circle key={p.d} cx={sx(p.x)} cy={sy(p.v)} r="3" fill="var(--accent)" />)}
      </svg>
    );
  }
}
