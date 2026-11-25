import { useState } from "react";
import { Chip, Logo, Stepper } from "../components/ui";
import { addDays } from "../lib/dates";
import { ensurePermission } from "../lib/notifications";
import type { Lang } from "../lib/types";
import { useStore } from "../store";

export function Onboarding() {
  const { data, t, today, updateSettings, startPeriod } = useStore();
  const s = data.settings;
  const [step, setStep] = useState(0);
  const [last, setLast] = useState<string>("");
  const [unknown, setUnknown] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const finish = () => {
    updateSettings({ onboarded: true, acceptedDisclaimer: true });
    if (last && !unknown) startPeriod(last);
    void ensurePermission().catch(() => undefined);
  };

  const steps = [
    <>
      <Logo />
      <h1>{t("obWelcomeTitle")}</h1>
      <p className="muted">{t("obWelcomeBody")}</p>
      <div className="stack">
        <h3>{t("obChooseLanguage")}</h3>
        <div className="chips">
          {(["en", "hi"] as Lang[]).map((l) => (
            <Chip key={l} on={s.lang === l} onClick={() => updateSettings({ lang: l })}>{l === "en" ? "English" : "हिन्दी"}</Chip>
          ))}
        </div>
      </div>
      <button className="btn block" onClick={() => setStep(1)}>{t("next")}</button>
    </>,
    <>
      <h1>{t("obLastPeriodTitle")}</h1>
      <p className="muted">{t("obLastPeriodHint")}</p>
      <input type="date" value={last} max={today} min={addDays(today, -365)} disabled={unknown}
        onChange={(e) => setLast(e.target.value)} aria-label={t("obLastPeriodTitle")} />
      <div className="chips">
        <Chip on={unknown} onClick={() => setUnknown(!unknown)}>{t("obDontRemember")}</Chip>
      </div>
      <div className="row">
        <button className="btn ghost" onClick={() => setStep(0)}>{t("back")}</button>
        <button className="btn" style={{ flex: 1 }} disabled={!last && !unknown} onClick={() => setStep(2)}>{t("next")}</button>
      </div>
    </>,
    <>
      <h1>{t("obLengthsTitle")}</h1>
      <Stepper label={t("obCycleLength")} value={s.typicalCycleLength} min={15} max={60} onChange={(v) => updateSettings({ typicalCycleLength: v })} />
      <Stepper label={t("obPeriodLength")} value={s.typicalPeriodLength} min={1} max={14} onChange={(v) => updateSettings({ typicalPeriodLength: v })} />
      <p className="muted small">{t("obLengthsHint")}</p>
      <div className="row">
        <button className="btn ghost" onClick={() => setStep(1)}>{t("back")}</button>
        <button className="btn" style={{ flex: 1 }} onClick={() => setStep(3)}>{t("next")}</button>
      </div>
    </>,
    <>
      <h1>{t("obDisclaimerTitle")}</h1>
      <div className="banner doctor"><p>{t("obDisclaimerBody")}</p></div>
      <p className="muted small">{t("setPrivacyBody")}</p>
      <div className="chips">
        <Chip on={accepted} onClick={() => setAccepted(!accepted)}>✓ {t("obAccept")}</Chip>
      </div>
      <div className="row">
        <button className="btn ghost" onClick={() => setStep(2)}>{t("back")}</button>
        <button className="btn" style={{ flex: 1 }} disabled={!accepted} onClick={finish}>{t("obStart")}</button>
      </div>
    </>,
  ];

  return (
    <main className="center-screen">
      <div className="dots" aria-hidden>{steps.map((_, i) => <i key={i} className={i === step ? "on" : ""} />)}</div>
      {steps[step]}
    </main>
  );
}
