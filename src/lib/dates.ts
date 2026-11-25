/**
 * Calendar-date helpers. Dates are "YYYY-MM-DD" strings (ISO dates) in the user's local calendar.
 * Arithmetic goes through UTC so daylight-saving changes never shift a day.
 */
export type ISODate = string;

const DAY_MS = 86_400_000;

export function toISO(d: Date): ISODate {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function today(): ISODate {
  return toISO(new Date());
}

function toUTC(iso: ISODate): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(iso: ISODate, n: number): ISODate {
  return new Date(toUTC(iso) + n * DAY_MS).toISOString().slice(0, 10);
}

/** Whole days from a to b (b - a). */
export function diffDays(a: ISODate, b: ISODate): number {
  return Math.round((toUTC(b) - toUTC(a)) / DAY_MS);
}

/** Local Date at midnight, for display and Intl formatting. */
export function toLocalDate(iso: ISODate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isValidISO(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && addDays(s, 0) === s;
}

/** All dates of the month grid (Monday-first), padded with neighbouring days. */
export function monthGrid(year: number, month0: number): ISODate[] {
  const first = toISO(new Date(year, month0, 1));
  const weekday = (new Date(year, month0, 1).getDay() + 6) % 7; // 0 = Monday
  const start = addDays(first, -weekday);
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const cells = Math.ceil((weekday + daysInMonth) / 7) * 7;
  return Array.from({ length: cells }, (_, i) => addDays(start, i));
}
