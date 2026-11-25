/**
 * Pregnancy dating from the first day of the last menstrual period (LMP), the standard clinical
 * method (Naegele's rule): due date = LMP + 280 days. An early ultrasound date from a doctor is
 * more accurate and should replace it when available.
 */
import { addDays, diffDays, type ISODate } from "./dates";

export interface PregnancyStatus {
  weeks: number;
  days: number;
  dueDate: ISODate;
  trimester: 1 | 2 | 3;
  daysToGo: number;
  /** past 42 weeks: the dates are probably wrong, or the user forgot to leave pregnancy mode */
  overdue: boolean;
}

export function pregnancyStatus(lmp: ISODate, on: ISODate): PregnancyStatus {
  const elapsed = Math.max(0, diffDays(lmp, on));
  const weeks = Math.floor(elapsed / 7);
  const dueDate = addDays(lmp, 280);
  return {
    weeks,
    days: elapsed % 7,
    dueDate,
    trimester: weeks < 14 ? 1 : weeks < 28 ? 2 : 3,
    daysToGo: diffDays(on, dueDate),
    overdue: weeks >= 42,
  };
}
