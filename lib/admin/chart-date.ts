/** Dashboard charts bucket activity by IST calendar day (site locale). */
export const CHART_TIMEZONE = "Asia/Kolkata";

export function dateKeyInTimezone(value: Date | string, timeZone = CHART_TIMEZONE): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

export function lastNDateKeys(n: number, timeZone = CHART_TIMEZONE): string[] {
  const today = dateKeyInTimezone(new Date(), timeZone);
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    keys.push(shiftDateKey(today, -i));
  }
  return keys;
}

export function formatChartDayLabel(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
