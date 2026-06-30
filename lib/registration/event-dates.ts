export function formatEventDates(starts: string | null, ends: string | null): string {
  if (!starts) return "Dates to be announced";
  const start = new Date(starts);
  const end = ends ? new Date(ends) : null;
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  if (end && end.getTime() !== start.getTime()) {
    return `${fmt(start)} – ${fmt(end)}`;
  }
  return fmt(start);
}
