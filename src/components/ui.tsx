import { useEffect, type ReactNode } from "react";
import type { StringKey } from "../i18n";
import type { HealthFlag } from "../lib/health";
import { useStore } from "../store";

export function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="chip" aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="setting">
      <span>{label}</span>
      <span className="switch">
        <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
        <span />
      </span>
    </label>
  );
}

export function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="stack">
      <span className="small">{label}</span>
      <div className="stepper">
        <button type="button" className="icon-btn" aria-label="−" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <output aria-live="polite">{value}</output>
        <button type="button" className="icon-btn" aria-label="+" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

/** Full-screen page with a back button (used for report, articles, privacy). */
export function Page({ title, onBack, children, actions }: { title: string; onBack: () => void; children: ReactNode; actions?: ReactNode }) {
  const { t } = useStore();
  useEffect(() => {
    document.querySelector(".page")?.scrollTo(0, 0);
  }, []);
  return (
    <div className="page" role="dialog" aria-label={title}>
      <div className="page-inner">
        <div className="screen-title no-print">
          <button className="icon-btn" onClick={onBack} aria-label={t("back")}>←</button>
          <h2 style={{ flex: 1 }}>{title}</h2>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const { t } = useStore();
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="screen-title">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={t("close")}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FlagBanner({ flag }: { flag: HealthFlag }) {
  const { t } = useStore();
  return (
    <div className={`banner ${flag.level}`}>
      <span className="level">{t(`level_${flag.level}` as StringKey)}</span>
      <h3>{t(`flag_${flag.id}_title` as StringKey, flag.params)}</h3>
      <p className="small">{t(`flag_${flag.id}_body` as StringKey, flag.params)}</p>
    </div>
  );
}

export function Logo({ size = 72 }: { size?: number }) {
  return <img src="./icon.svg" alt="" width={size} height={size} className="logo" />;
}

export const icons = {
  today: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  insights: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>,
  learn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5" /></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>,
};
