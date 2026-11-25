import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { useRef, useState } from "react";
import { Stepper, Switch } from "../components/ui";
import { ensurePermission, notificationsSupported } from "../lib/notifications";
import { parseBackup } from "../lib/storage";
import type { Lang, Reminders } from "../lib/types";
import { useStore } from "../store";

export const APP_VERSION = "0.1.0";

export function Settings({ onPin, onPrivacy, toast }: { onPin: () => void; onPrivacy: () => void; toast: (m: string) => void }) {
  const { data, t, today, updateSettings, replaceData, resetAll } = useStore();
  const s = data.settings;
  const fileRef = useRef<HTMLInputElement>(null);
  const [denied, setDenied] = useState(false);

  const setReminders = async (patch: Partial<Reminders>) => {
    const next = { ...s.reminders, ...patch };
    const turningOn = (patch.periodSoon || patch.periodLate || patch.breastCheck || patch.pill?.enabled) === true;
    if (turningOn && notificationsSupported()) {
      const ok = await ensurePermission();
      setDenied(!ok);
    }
    updateSettings({ reminders: next });
  };

  const exportData = async () => {
    const json = JSON.stringify(data, null, 2);
    const name = `sakhi-backup-${today}.json`;
    if (Capacitor.isNativePlatform()) {
      const file = await Filesystem.writeFile({ path: name, data: json, directory: Directory.Cache, encoding: Encoding.UTF8 });
      await Share.share({ title: name, files: [file.uri] }).catch(() => undefined);
    } else {
      const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: name });
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const importData = async (file: File | undefined) => {
    if (!file) return;
    const parsed = parseBackup(await file.text());
    if (fileRef.current) fileRef.current.value = "";
    if (!parsed) return toast(t("setImportBad"));
    if (!confirm(t("setImportConfirm"))) return;
    replaceData({ ...parsed, settings: { ...parsed.settings, onboarded: true, acceptedDisclaimer: true } });
    toast(t("setImportOk"));
  };

  const deleteAll = async () => {
    if (confirm(t("setDeleteConfirm"))) await resetAll();
  };

  return (
    <main className="screen">
      <div className="screen-title"><h1>{t("tabSettings")}</h1></div>

      <section className="card">
        <h3>{t("setLanguage")}</h3>
        <div className="seg">
          {(["en", "hi"] as Lang[]).map((l) => (
            <button key={l} aria-pressed={s.lang === l} onClick={() => updateSettings({ lang: l })}>{l === "en" ? "English" : "हिन्दी"}</button>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>{t("setCycle")}</h3>
        <Stepper label={t("obCycleLength")} value={s.typicalCycleLength} min={15} max={60} onChange={(v) => updateSettings({ typicalCycleLength: v })} />
        <Stepper label={t("obPeriodLength")} value={s.typicalPeriodLength} min={1} max={14} onChange={(v) => updateSettings({ typicalPeriodLength: v })} />
        <p className="muted small">{t("setCycleHint")}</p>
      </section>

      <section className="card">
        <h3>{t("setReminders")}</h3>
        {!notificationsSupported() && <p className="muted small">{t("setRemWebNote")}</p>}
        {denied && <p className="small" style={{ color: "var(--danger)" }}>{t("setRemDenied")}</p>}
        <Switch label={t("setRemPeriodSoon")} checked={s.reminders.periodSoon} onChange={(v) => setReminders({ periodSoon: v })} />
        <Switch label={t("setRemLate")} checked={s.reminders.periodLate} onChange={(v) => setReminders({ periodLate: v })} />
        <Switch label={t("setRemBreast")} checked={s.reminders.breastCheck} onChange={(v) => setReminders({ breastCheck: v })} />
        <Switch label={t("setRemPill")} checked={s.reminders.pill.enabled} onChange={(v) => setReminders({ pill: { ...s.reminders.pill, enabled: v } })} />
        {s.reminders.pill.enabled && (
          <label className="setting">
            <span>{t("setRemPillTime")}</span>
            <input type="time" style={{ width: 140 }} value={s.reminders.pill.time}
              onChange={(e) => e.target.value && setReminders({ pill: { enabled: true, time: e.target.value } })} />
          </label>
        )}
      </section>

      <section className="card">
        <h3>{t("setPrivacy")}</h3>
        <p className="small muted">{t("setPrivacyBody")}</p>
        <div className="setting">
          <span>{t("setPin")}: <strong>{s.pinHash ? t("setPinOn") : t("setPinOff")}</strong></span>
          {s.pinHash
            ? <button className="btn ghost" onClick={() => updateSettings({ pinHash: null })}>{t("setPinRemove")}</button>
            : <button className="btn secondary" onClick={onPin}>{t("setPinSet")}</button>}
        </div>
        <button className="link-btn" style={{ alignSelf: "flex-start" }} onClick={onPrivacy}>{t("setPrivacyPolicy")}</button>
      </section>

      <section className="card">
        <h3>{t("setBackup")}</h3>
        <button className="btn ghost block" onClick={exportData}>{t("setExport")}</button>
        <button className="btn ghost block" onClick={() => fileRef.current?.click()}>{t("setImport")}</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => importData(e.target.files?.[0])} />
        <button className="btn danger block" onClick={deleteAll}>{t("setDeleteAll")}</button>
      </section>

      <section className="card">
        <h3>{t("setAbout")}</h3>
        <p className="small">{t("setDisclaimer")}</p>
        <p className="muted tiny">{t("setVersion", { v: APP_VERSION })}</p>
      </section>
    </main>
  );
}
