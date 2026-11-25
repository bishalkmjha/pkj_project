import { App as CapApp } from "@capacitor/app";
import { useEffect, useRef, useState } from "react";
import { DayLogSheet } from "./components/DayLogSheet";
import { PinPad } from "./components/PinPad";
import { icons } from "./components/ui";
import type { StringKey } from "./i18n";
import type { Article } from "./i18n/articles";
import type { GuidePhase } from "./i18n/phases";
import type { RemedyId } from "./i18n/remedies";
import { status } from "./lib/cycle";
import { PhaseView, RemedyView } from "./screens/Guides";
import type { ISODate } from "./lib/dates";
import { checkPin, hashPin } from "./lib/pin";
import { Calendar } from "./screens/Calendar";
import { Insights } from "./screens/Insights";
import { ArticleView, Learn } from "./screens/Learn";
import { Onboarding } from "./screens/Onboarding";
import { Privacy } from "./screens/Privacy";
import { Report } from "./screens/Report";
import { Settings } from "./screens/Settings";
import { Today } from "./screens/Today";
import { useStore } from "./store";

type Tab = "today" | "calendar" | "insights" | "learn" | "settings";
type Overlay =
  | { kind: "log"; date: ISODate }
  | { kind: "report" }
  | { kind: "article"; article: Article }
  | { kind: "privacy" }
  | { kind: "phase"; phase: GuidePhase }
  | { kind: "remedy"; id: RemedyId }
  | { kind: "pinSetup" }
  | null;

const TABS: { id: Tab; label: StringKey }[] = [
  { id: "today", label: "tabToday" },
  { id: "calendar", label: "tabCalendar" },
  { id: "insights", label: "tabInsights" },
  { id: "learn", label: "tabLearn" },
  { id: "settings", label: "tabSettings" },
];

const RELOCK_AFTER_MS = 60_000;

export function App() {
  const store = useStore();
  const { data, t, today } = store;
  const [tab, setTab] = useState<Tab>("today");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [locked, setLocked] = useState(!!data.settings.pinHash);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const nav = useRef({ tab, overlay, locked });
  nav.current = { tab, overlay, locked };

  useEffect(() => {
    document.documentElement.lang = data.settings.lang;
    document.title = t("appName");
  }, [data.settings.lang, t]);

  // Android hardware back button: close overlay, then go to Today, then exit.
  useEffect(() => {
    let hiddenAt = 0;
    const subs = [
      CapApp.addListener("backButton", () => {
        const n = nav.current;
        if (n.locked) return void CapApp.exitApp();
        if (n.overlay) setOverlay(null);
        else if (n.tab !== "today") setTab("today");
        else void CapApp.exitApp();
      }),
      // Re-lock with the PIN after the app has been in the background for a while.
      CapApp.addListener("appStateChange", ({ isActive }) => {
        if (!isActive) hiddenAt = Date.now();
        else if (hiddenAt && Date.now() - hiddenAt > RELOCK_AFTER_MS) setLocked(true);
      }),
    ];
    return () => subs.forEach((p) => p.then((s) => s.remove()));
  }, []);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  if (locked && data.settings.pinHash) return <LockScreen onUnlock={() => setLocked(false)} />;
  if (!data.settings.onboarded) return <Onboarding />;

  const close = () => setOverlay(null);

  return (
    <div className="app">
      {tab === "today" && (
        <Today onLog={() => setOverlay({ kind: "log", date: today })} onInsights={() => setTab("insights")}
          onPhase={(phase) => setOverlay({ kind: "phase", phase })} onRemedy={(id) => setOverlay({ kind: "remedy", id })} />
      )}
      {tab === "calendar" && <Calendar onPick={(date) => setOverlay({ kind: "log", date })} />}
      {tab === "insights" && <Insights onReport={() => setOverlay({ kind: "report" })} />}
      {tab === "learn" && (
        <Learn onOpen={(article) => setOverlay({ kind: "article", article })}
          onPhase={(phase) => setOverlay({ kind: "phase", phase })} onRemedy={(id) => setOverlay({ kind: "remedy", id })} />
      )}
      {tab === "settings" && (
        <Settings onPin={() => setOverlay({ kind: "pinSetup" })} onPrivacy={() => setOverlay({ kind: "privacy" })} toast={toast} />
      )}

      <nav className="nav no-print" aria-label="Main">
        <div className="nav-inner">
          {TABS.map(({ id, label }) => (
            <button key={id} aria-current={tab === id ? "page" : undefined} onClick={() => { setTab(id); setOverlay(null); }}>
              {icons[id]}
              <span>{t(label)}</span>
            </button>
          ))}
        </div>
      </nav>

      {overlay?.kind === "log" && <DayLogSheet key={overlay.date} date={overlay.date} onClose={close} />}
      {overlay?.kind === "report" && <Report onBack={close} toast={toast} />}
      {overlay?.kind === "article" && <ArticleView article={overlay.article} onBack={close} />}
      {overlay?.kind === "privacy" && <Privacy onBack={close} />}
      {overlay?.kind === "phase" && (
        <PhaseView phase={overlay.phase} current={status(data, today, store.stats).phase === overlay.phase} onBack={close} />
      )}
      {overlay?.kind === "remedy" && <RemedyView key={overlay.id} id={overlay.id} onBack={close} />}
      {overlay?.kind === "pinSetup" && (
        <div className="page"><PinSetup onDone={(msg) => { close(); if (msg) toast(msg); }} /></div>
      )}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </div>
  );
}

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { data, t, resetAll } = useStore();
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [forgot, setForgot] = useState(false);

  const submit = async (pin: string) => {
    if (await checkPin(pin, data.settings.pinHash!)) onUnlock();
    else {
      setError(t("lockWrong"));
      setAttempt((a) => a + 1);
    }
  };

  return (
    <PinPad title={t("lockTitle")} error={error} resetKey={attempt} onComplete={submit}
      footer={forgot ? (
        <div className="card" style={{ maxWidth: 360 }}>
          <p className="small">{t("lockForgotBody")}</p>
          <button className="btn danger" onClick={() => { if (confirm(t("setDeleteConfirm"))) void resetAll(); }}>{t("setDeleteAll")}</button>
        </div>
      ) : <button className="link-btn" onClick={() => setForgot(true)}>{t("lockForgot")}</button>} />
  );
}

function PinSetup({ onDone }: { onDone: (msg?: string) => void }) {
  const { t, updateSettings } = useStore();
  const [first, setFirst] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [key, setKey] = useState(0);

  const complete = async (pin: string) => {
    if (first === null) {
      setFirst(pin);
      setError("");
      setKey((k) => k + 1);
    } else if (pin === first) {
      updateSettings({ pinHash: await hashPin(pin) });
      onDone();
    } else {
      setFirst(null);
      setError(t("lockMismatch"));
      setKey((k) => k + 1);
    }
  };

  return (
    <PinPad title={first === null ? t("lockNewTitle") : t("lockConfirmTitle")} error={error} resetKey={key} onComplete={complete}
      footer={<button className="link-btn" onClick={() => onDone()}>{t("cancel")}</button>} />
  );
}
