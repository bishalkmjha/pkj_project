import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { translator, type T } from "./i18n";
import { MAX_GAP_IN_PERIOD, computeStats, predict, type CycleStats, type Prediction } from "./lib/cycle";
import { addDays, today, type ISODate } from "./lib/dates";
import { rescheduleReminders } from "./lib/notifications";
import { clearData, loadData, saveData } from "./lib/storage";
import { emptyData, isBleeding, isEmptyLog, type AppData, type DayLog, type Settings } from "./lib/types";

interface Store {
  data: AppData;
  t: T;
  today: ISODate;
  stats: CycleStats;
  predictions: Prediction[];
  setDay: (date: ISODate, log: DayLog) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  replaceData: (data: AppData) => void;
  resetAll: () => Promise<void>;
  startPeriod: (date: ISODate) => void;
  endPeriod: (date: ISODate) => void;
}

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

export function StoreProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [day, setDay] = useState(today());
  const first = useRef(true);

  useEffect(() => {
    loadData().then(setData);
    // Keep "today" correct if the app stays open past midnight.
    const id = setInterval(() => setDay(today()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!data) return;
    if (first.current) {
      first.current = false;
    } else {
      void saveData(data);
    }
    void rescheduleReminders(data).catch(() => undefined);
  }, [data]);

  const update = useCallback((fn: (d: AppData) => AppData) => setData((d) => (d ? fn(d) : d)), []);

  const store = useMemo<Store | null>(() => {
    if (!data) return null;
    const stats = computeStats(data);
    const setLog = (date: ISODate, log: DayLog) =>
      update((d) => {
        const days = { ...d.days };
        if (isEmptyLog(log)) delete days[date];
        else days[date] = log;
        return { ...d, days };
      });
    return {
      data,
      t: translator(data.settings.lang),
      today: day,
      stats,
      predictions: predict(data, 3, stats),
      setDay: setLog,
      updateSettings: (patch) => update((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
      replaceData: (next) => setData(next),
      resetAll: async () => {
        await clearData();
        first.current = true;
        setData(emptyData());
      },
      // "My period started": fill the typical period length with medium flow from that day so
      // the calendar and predictions update at once. "My period ended" or the day editor trims it.
      startPeriod: (date) =>
        update((d) => {
          const days = { ...d.days };
          for (let i = 0; i < d.settings.typicalPeriodLength; i++) {
            const k = addDays(date, i);
            if (!isBleeding(days[k])) days[k] = { ...days[k], flow: "medium" };
          }
          return { ...d, days };
        }),
      // "My period ended": the given day is the last bleeding day; clear bleeding after it in this period.
      endPeriod: (date) =>
        update((d) => {
          const days = { ...d.days };
          let gap = 0;
          for (let i = 1; i <= 14 && gap <= MAX_GAP_IN_PERIOD; i++) {
            const k = addDays(date, i);
            const log = days[k];
            if (!log?.flow) {
              gap++;
              continue;
            }
            gap = 0;
            const { flow: _flow, ...rest } = log;
            void _flow;
            if (isEmptyLog(rest)) delete days[k];
            else days[k] = rest;
          }
          return { ...d, days };
        }),
    };
  }, [data, day, update]);

  if (!store) return <>{fallback}</>;
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
