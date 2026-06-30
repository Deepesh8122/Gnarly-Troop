import { describe, it, expect } from "vitest";
import { registrationPassDownloadUrl } from "@/lib/registration/deliver-registration-pass";

describe("registrationPassDownloadUrl", () => {
  it("builds public download URL with registration and delegate ids", () => {
    const url = registrationPassDownloadUrl(
      "00000000-0000-0000-0000-000000000001",
      "GT-DELEGATE-ABC123",
    );
    expect(url).toContain("/api/registrations/pass/download/");
    expect(url).toContain("registrationId=");
    expect(url).toContain("delegateId=GT-DELEGATE-ABC123");
  });
});
