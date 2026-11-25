import { useState } from "react";
import { Page, Sheet } from "../components/ui";
import { formatDate } from "../i18n";
import { CHECKUPS, DANGER_SIGNS, ENDED_BIRTH, ENDED_LOSS, HEALTHY_HABITS, stageFor } from "../i18n/pregnancy";
import { addDays, isValidISO } from "../lib/dates";
import { pregnancyStatus } from "../lib/pregnancy";
import { useStore } from "../store";

export function PregnancyToday({ onEnd }: { onEnd: (kind: "birth" | "loss") => void }) {
  const { data, t, today } = useStore();
  const lang = data.settings.lang;
  const p = pregnancyStatus(data.settings.pregnancy!.lmp, today);
  const stage = stageFor(p.weeks);
  const C = 2 * Math.PI * 88;
  const progress = Math.min(1, (p.weeks * 7 + p.days) / 280);

  return (
    <main className="screen">
      <div className="screen-title">
        <h1>{t("pregTitle")}</h1>
        <span className="muted small">{formatDate(today, lang, { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      <section className="card hero">
        <div className="ring">
          <svg viewBox="0 0 200 200" aria-hidden>
            <circle cx="100" cy="100" r="88" fill="none" stroke="var(--surface-2)" strokeWidth="14" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="var(--fertile)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C * progress} ${C}`} />
          </svg>
          <div className="ring-label">
            <span className="muted small">{t("pregTrimester", { n: p.trimester })}</span>
            <span className="ring-big">{t("pregWeeks", { w: p.weeks, d: p.days })}</span>
          </div>
        </div>
        <p className="small"><strong>{t("pregDue", { date: formatDate(p.dueDate, lang, { day: "numeric", month: "long", year: "numeric" }) })}</strong></p>
        {p.daysToGo > 0 && <p className="muted small">{t("pregToGo", { n: p.daysToGo })}</p>}
        <p className="muted tiny">{t("pregDateNote")}</p>
      </section>

      {p.overdue && <div className="banner doctor"><p className="small">{t("pregOverdue")}</p></div>}

      <section className="card">
        <h3>{stage.title[lang]}</h3>
        <p className="small"><strong>{t("pregBody")}:</strong> {stage.body[lang]}</p>
        <p className="small"><strong>{t("pregBaby")}:</strong> {stage.baby[lang]}</p>
        <h3>{t("pregTodo")}</h3>
        <ul className="tips-list">{stage.todo.map((x, i) => <li key={i} className="small">{x[lang]}</li>)}</ul>
      </section>

      <div className="banner urgent">
        <h3>{DANGER_SIGNS.title[lang]}</h3>
        <ul className="tips-list">{DANGER_SIGNS.items.map((x, i) => <li key={i} className="small">{x[lang]}</li>)}</ul>
        <p className="small"><strong>{DANGER_SIGNS.call[lang]}</strong></p>
      </div>

      <section className="card">
        <h3>{t("pregCheckups")}</h3>
        <p className="small">{CHECKUPS[lang]}</p>
      </section>

      <section className="card">
        <h3>{t("pregHabits")}</h3>
        <ul className="tips-list">{HEALTHY_HABITS.map((x, i) => <li key={i} className="small">{x[lang]}</li>)}</ul>
      </section>

      <section className="card">
        <h3>{t("pregEnd")}</h3>
        <button className="btn ghost block" onClick={() => onEnd("birth")}>{t("pregEndBirth")}</button>
        <button className="btn ghost block" onClick={() => onEnd("loss")}>{t("pregEndLoss")}</button>
      </section>
    </main>
  );
}

/** Sheet to enter pregnancy mode: last period date, or a due date from the doctor. */
export function PregnancyStart({ onClose }: { onClose: () => void }) {
  const { data, t, today, stats, updateSettings } = useStore();
  const last = stats.periods[stats.periods.length - 1];
  const [lmp, setLmp] = useState(last?.start ?? "");
  const [due, setDue] = useState("");
  const chosenLmp = due && isValidISO(due) ? addDays(due, -280) : lmp;
  const valid = isValidISO(chosenLmp) && chosenLmp <= today && chosenLmp >= addDays(today, -300);

  const start = () => {
    updateSettings({ goal: "pregnant", pregnancy: { lmp: chosenLmp }, pregnancyEnded: null });
    onClose();
  };

  return (
    <Sheet title={t("pregStartTitle")} onClose={onClose}>
      <p className="muted small">{t("pregStartHint")}</p>
      <label className="field">
        <span>{t("pregLmpLabel")}</span>
        <input type="date" value={lmp} max={today} onChange={(e) => { setLmp(e.target.value); setDue(""); }} />
      </label>
      <label className="field">
        <span>{t("pregDueLabel")}</span>
        <input type="date" value={due} min={today} onChange={(e) => setDue(e.target.value)} />
      </label>
      <p className="muted tiny">{t("pregDateNote")}</p>
      <button className="btn block" disabled={!valid || data.settings.goal === "pregnant"} onClick={start}>{t("pregStartButton")}</button>
    </Sheet>
  );
}

export function PregnancyEnded({ kind, onBack }: { kind: "birth" | "loss"; onBack: () => void }) {
  const { data, t } = useStore();
  const lang = data.settings.lang;
  return (
    <Page title={kind === "birth" ? t("pregEndBirth") : t("pregEndLoss")} onBack={onBack}>
      <article className="card article">
        <div style={{ fontSize: 40 }} aria-hidden>{kind === "birth" ? "👶" : "🤍"}</div>
        <p>{(kind === "birth" ? ENDED_BIRTH : ENDED_LOSS)[lang]}</p>
      </article>
      <button className="btn block" onClick={onBack}>{t("done")}</button>
    </Page>
  );
}
