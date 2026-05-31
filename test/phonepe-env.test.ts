import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getPhonePeEnvironment,
  parsePhonePeEnvironment,
  phonePeEnvironmentLabel,
} from "../lib/payments/phonepe-env";

describe("PhonePe environment config", () => {
  const original = process.env.PHONEPE_ENV;

  afterEach(() => {
    if (original === undefined) delete process.env.PHONEPE_ENV;
    else process.env.PHONEPE_ENV = original;
  });

  it("defaults to sandbox", () => {
    delete process.env.PHONEPE_ENV;
    expect(getPhonePeEnvironment()).toBe("sandbox");
  });

  it("parses production aliases", () => {
    for (const value of ["production", "prod", "live"]) {
      expect(parsePhonePeEnvironment(value)).toBe("production");
    }
  });

  it("parses sandbox aliases", () => {
    for (const value of ["sandbox", "uat", "test", ""]) {
      expect(parsePhonePeEnvironment(value)).toBe("sandbox");
    }
  });

  it("labels environments for admin UI", () => {
    expect(phonePeEnvironmentLabel("production")).toBe("Live");
    expect(phonePeEnvironmentLabel("sandbox")).toBe("UAT / Test");
  });
});
