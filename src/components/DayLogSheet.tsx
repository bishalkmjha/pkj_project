import { useState } from "react";
import { formatDate, type StringKey } from "../i18n";
import type { ISODate } from "../lib/dates";
import { DISCHARGES, MOODS, SYMPTOMS, type DayLog, type Flow, type Mood, type Pain, type Symptom } from "../lib/types";
import { useStore } from "../store";
import { Chip, Sheet } from "./ui";

const FLOWS: (Flow | undefined)[] = [undefined, "spotting", "light", "medium", "heavy"];

function toggle<T>(list: T[] | undefined, item: T): T[] {
  const l = list ?? [];
  return l.includes(item) ? l.filter((x) => x !== item) : [...l, item];
}

export function DayLogSheet({ date, onClose }: { date: ISODate; onClose: () => void }) {
  const { data, t, setDay } = useStore();
  const [log, setLog] = useState<DayLog>(data.days[date] ?? {});
  const lang = data.settings.lang;

  const save = () => {
    setDay(date, { ...log, note: log.note?.trim() || undefined });
    onClose();
  };

  return (
    <Sheet title={formatDate(date, lang, { weekday: "long", day: "numeric", month: "long" })} onClose={onClose}>
      <section className="stack">
        <h3>{t("logFlow")}</h3>
        <div className="chips">
          {FLOWS.map((f) => (
            <Chip key={f ?? "none"} on={log.flow === f} onClick={() => setLog({ ...log, flow: f })}>
              {t(`flow_${f ?? "none"}` as StringKey)}
            </Chip>
          ))}
        </div>
      </section>

      <section className="stack">
        <h3>{t("logPain")}</h3>
        <div className="chips">
          {([0, 1, 2, 3] as Pain[]).map((p) => (
            <Chip key={p} on={(log.pain ?? 0) === p} onClick={() => setLog({ ...log, pain: p || undefined })}>
              {t(`pain_${p}` as StringKey)}
            </Chip>
          ))}
        </div>
      </section>

      <section className="stack">
        <h3>{t("logDischarge")}</h3>
        <p className="muted tiny">{t("logDischargeHint")}</p>
        <div className="chips">
          {DISCHARGES.map((d) => (
            <Chip key={d} on={log.discharge === d} onClick={() => setLog({ ...log, discharge: log.discharge === d ? undefined : d })}>
              {t(`dis_${d}` as StringKey)}
            </Chip>
          ))}
        </div>
      </section>

      <section className="stack">
        <h3>{t("logSymptoms")}</h3>
        <div className="chips">
          {SYMPTOMS.map((s: Symptom) => (
            <Chip key={s} on={!!log.symptoms?.includes(s)} onClick={() => setLog({ ...log, symptoms: toggle(log.symptoms, s) })}>
              {t(`sym_${s}` as StringKey)}
            </Chip>
          ))}
        </div>
      </section>

      <section className="stack">
        <h3>{t("logMood")}</h3>
        <div className="chips">
          {MOODS.map((m: Mood) => (
            <Chip key={m} on={!!log.moods?.includes(m)} onClick={() => setLog({ ...log, moods: toggle(log.moods, m) })}>
              {t(`mood_${m}` as StringKey)}
            </Chip>
          ))}
        </div>
      </section>

      {data.settings.reminders.pill.enabled && (
        <div className="chips">
          <Chip on={!!log.pillTaken} onClick={() => setLog({ ...log, pillTaken: !log.pillTaken || undefined })}>
            💊 {t("logPill")}
          </Chip>
        </div>
      )}

      <label className="field">
        <span>{t("logNote")}</span>
        <textarea value={log.note ?? ""} maxLength={2000} placeholder={t("logNotePlaceholder")} onChange={(e) => setLog({ ...log, note: e.target.value })} />
      </label>

      <div className="sticky-actions">
        <button className="btn ghost" onClick={() => setLog({})}>{t("logClear")}</button>
        <button className="btn" style={{ flex: 1 }} onClick={save}>{t("save")}</button>
      </div>
    </Sheet>
  );
}
