import { TEMP_MAX_C, TEMP_MIN_C, type TempUnit } from "./types";

export const cToUnit = (c: number, unit: TempUnit) => (unit === "F" ? c * 9 / 5 + 32 : c);
export const unitToC = (v: number, unit: TempUnit) => (unit === "F" ? (v - 32) * 5 / 9 : v);

export function formatTemp(c: number, unit: TempUnit): string {
  return `${cToUnit(c, unit).toFixed(2)} °${unit}`;
}

/** Parse what the user typed into °C, or null if it isn't a plausible waking temperature. */
export function parseTemp(input: string, unit: TempUnit): number | null {
  const v = Number(input.replace(",", "."));
  if (!input.trim() || !Number.isFinite(v)) return null;
  const c = unitToC(v, unit);
  return c >= TEMP_MIN_C && c <= TEMP_MAX_C ? Math.round(c * 100) / 100 : null;
}
