import { toLocalDate, type ISODate } from "../lib/dates";
import type { Lang } from "../lib/types";
import { en, type StringKey } from "./en";
import { hi } from "./hi";

export type { StringKey };
export const STRINGS: Record<Lang, Record<StringKey, string>> = { en, hi };

export type T = (key: StringKey, params?: Record<string, string | number>) => string;

export function translator(lang: Lang): T {
  const dict = STRINGS[lang];
  return (key, params) => {
    let s = dict[key] ?? en[key] ?? key;
    if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

const LOCALE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN" };

export function formatDate(iso: ISODate, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }): string {
  // Hindi short month names ("दिस॰") read awkwardly, so Hindi always uses the full name.
  const o = lang === "hi" && opts.month === "short" ? { ...opts, month: "long" as const } : opts;
  return new Intl.DateTimeFormat(LOCALE[lang], o).format(toLocalDate(iso));
}

export function formatMonth(year: number, month0: number, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { month: "long", year: "numeric" }).format(new Date(year, month0, 1));
}

/** Monday-first short weekday names. */
export function weekdayNames(lang: Lang): string[] {
  const f = new Intl.DateTimeFormat(LOCALE[lang], { weekday: "narrow" });
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(2024, 0, 1 + i))); // 2024-01-01 is a Monday
}
