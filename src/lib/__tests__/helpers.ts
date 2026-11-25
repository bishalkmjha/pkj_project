import { addDays, type ISODate } from "../dates";
import { emptyData, type AppData, type DayLog, type Flow } from "../types";

/** Build data with periods starting at the given dates. */
export function withPeriods(starts: ISODate[], length = 5, flow: Flow = "medium", extra: Partial<DayLog> = {}): AppData {
  const data = emptyData();
  for (const s of starts) for (let i = 0; i < length; i++) data.days[addDays(s, i)] = { flow, ...extra };
  return data;
}

/** Period starts separated by the given cycle lengths. */
export function startsFrom(first: ISODate, lengths: number[]): ISODate[] {
  const out = [first];
  for (const l of lengths) out.push(addDays(out[out.length - 1], l));
  return out;
}
