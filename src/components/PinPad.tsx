import { useEffect, useState, type ReactNode } from "react";

const LEN = 4;

/** Numeric PIN entry. Calls onComplete when 4 digits are entered; resets when `resetKey` changes. */
export function PinPad({ title, error, onComplete, resetKey, footer }: {
  title: string; error?: string; onComplete: (pin: string) => void; resetKey?: number; footer?: ReactNode;
}) {
  const [pin, setPin] = useState("");
  useEffect(() => setPin(""), [resetKey]);

  const press = (d: string) => {
    if (pin.length >= LEN) return;
    const next = pin + d;
    setPin(next);
    if (next.length === LEN) {
      setTimeout(() => {
        setPin("");
        onComplete(next);
      }, 150);
    }
  };

  return (
    <div className="center-screen" style={{ alignItems: "center", textAlign: "center" }}>
      <h1>{title}</h1>
      <div className="pin-dots" aria-label={`${pin.length}/${LEN}`}>
        {Array.from({ length: LEN }, (_, i) => <i key={i} className={i < pin.length ? "on" : ""} />)}
      </div>
      <p className="error" role="alert">{error}</p>
      <div className="pinpad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) =>
          k === "" ? <button key={i} className="blank" aria-hidden tabIndex={-1} /> : (
            <button key={i} aria-label={k === "⌫" ? "Delete" : k} onClick={() => (k === "⌫" ? setPin(pin.slice(0, -1)) : press(k))}>{k}</button>
          ),
        )}
      </div>
      {footer}
    </div>
  );
}
