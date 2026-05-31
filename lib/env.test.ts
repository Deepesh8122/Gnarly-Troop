import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/env";

describe("resolveSiteUrl", () => {
  it("always uses the live request host, even when env is localhost", () => {
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

  it("uses localhost when that is the active request host", () => {
    const request = new Request("http://localhost:3000/collaboration/donation/", {
      headers: { host: "localhost:3000" },
    });

    expect(resolveSiteUrl(request)).toBe("http://localhost:3000");
  });

  it("prefers request host over a different configured env domain", () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://old-domain.example";

    const request = new Request("https://www.gnarlytroop.org/collaboration/donation/", {
      headers: {
        host: "www.gnarlytroop.org",
        "x-forwarded-proto": "https",
      },
    });

    expect(resolveSiteUrl(request)).toBe("https://www.gnarlytroop.org");

    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });

  it("accepts matching client origin when host headers are missing", () => {
    const request = new Request("https://www.gnarlytroop.org/api/donations/phonepe/initiate/", {
      headers: { host: "www.gnarlytroop.org", "x-forwarded-proto": "https" },
    });

    expect(resolveSiteUrl(request, "https://www.gnarlytroop.org")).toBe(
      "https://www.gnarlytroop.org",
    );
  });

  it("uses configured env when no request is available", () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.gnarlytroop.org";

    expect(resolveSiteUrl()).toBe("https://www.gnarlytroop.org");

    process.env.NEXT_PUBLIC_SITE_URL = previous;
  });
});
