import { describe, expect, it } from "vitest";
import {
  CHART_TIMEZONE,
  dateKeyInTimezone,
  lastNDateKeys,
  shiftDateKey,
} from "@/lib/admin/chart-date";

describe("chart-date", () => {
  it("buckets timestamps by IST calendar day", () => {
    // 2026-05-31 20:00 UTC = 2026-06-01 01:30 IST
    expect(dateKeyInTimezone("2026-05-31T20:00:00.000Z", CHART_TIMEZONE)).toBe("2026-06-01");
  });

  it("builds consecutive day keys ending today in IST", () => {
    const keys = lastNDateKeys(3, CHART_TIMEZONE);
    expect(keys).toHaveLength(3);
    expect(shiftDateKey(keys[2], -1)).toBe(keys[1]);
    expect(shiftDateKey(keys[1], -1)).toBe(keys[0]);
  });
});
