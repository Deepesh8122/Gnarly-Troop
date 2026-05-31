import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/env";

describe("resolveSiteUrl", () => {
  it("prefers the live request host over localhost env", () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

    const request = new Request("https://www.gnarlytroop.org/collaboration/donation/", {
      headers: {
        host: "www.gnarlytroop.org",
        "x-forwarded-proto": "https",
      },
    });

    expect(resolveSiteUrl(request)).toBe("https://www.gnarlytroop.org");

    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });

  it("uses configured env when it is a public domain", () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.gnarlytroop.org";

    expect(resolveSiteUrl()).toBe("https://www.gnarlytroop.org");

    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });
});
