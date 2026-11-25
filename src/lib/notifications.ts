/**
 * Local reminders (Android only). Scheduled on the device; no push server involved.
 * Every time the data changes we cancel and reschedule, so predictions stay current.
 */
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { translator } from "../i18n";
import { computeStats, predict, predictionsEnabled } from "./cycle";
import { addDays, toLocalDate } from "./dates";
import type { AppData } from "./types";

const ID_SOON = 1;
const ID_LATE = 2;
const ID_PILL = 3;
const ID_BREAST = 4;

export const notificationsSupported = () => Capacitor.isNativePlatform();

export async function ensurePermission(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  const current = await LocalNotifications.checkPermissions();
  if (current.display === "granted") return true;
  const asked = await LocalNotifications.requestPermissions();
  return asked.display === "granted";
}

function at(iso: string, hour: number, minute = 0): Date {
  const d = toLocalDate(iso);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export async function rescheduleReminders(data: AppData): Promise<void> {
  if (!notificationsSupported()) return;
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length) {
    await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
  }
  const { reminders, lang } = data.settings;
  if (!reminders.periodSoon && !reminders.periodLate && !reminders.pill.enabled && !reminders.breastCheck) return;
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== "granted") return;

  const t = translator(lang);
  const now = new Date();
  const stats = computeStats(data);
  const next = predictionsEnabled(data, stats) ? predict(data, 1, stats)[0] : undefined;
  const list = [];

  if (next && reminders.periodSoon) {
    const when = at(addDays(next.start, -2), 9);
    if (when > now) list.push({ id: ID_SOON, title: t("notifSoonTitle"), body: t("notifSoonBody"), schedule: { at: when, allowWhileIdle: true } });
  }
  if (next && reminders.periodLate) {
    const when = at(addDays(next.latest, 1), 10);
    if (when > now) list.push({ id: ID_LATE, title: t("notifLateTitle"), body: t("notifLateBody"), schedule: { at: when, allowWhileIdle: true } });
  }
  if (reminders.breastCheck) {
    // A few days after the period ends: 7 days after the last start, or after the next predicted start.
    const last = stats.periods[stats.periods.length - 1];
    const candidates = [last && addDays(last.start, 7), next && addDays(next.start, 7)].filter(Boolean) as string[];
    const when = candidates.map((d) => at(d, 11)).find((d) => d > now);
    if (when) list.push({ id: ID_BREAST, title: t("notifBreastTitle"), body: t("notifBreastBody"), schedule: { at: when, allowWhileIdle: true } });
  }
  if (reminders.pill.enabled) {
    const [hour, minute] = reminders.pill.time.split(":").map(Number);
    list.push({ id: ID_PILL, title: t("notifPillTitle"), body: t("notifPillBody"), schedule: { on: { hour, minute }, allowWhileIdle: true } });
  }
  if (list.length) await LocalNotifications.schedule({ notifications: list });
}
