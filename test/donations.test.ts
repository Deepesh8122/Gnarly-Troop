import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/env", () => ({
  getSiteUrl: () => "http://localhost:3000",
}));

describe("PhonePe donation gateway (V2 OAuth)", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.PHONEPE_ENV = "sandbox";
    process.env.PHONEPE_CLIENT_ID = "TEST_CLIENT";
    process.env.PHONEPE_CLIENT_SECRET = "test_client_secret";
    process.env.PHONEPE_CLIENT_VERSION = "1";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.PHONEPE_ENV;
    delete process.env.PHONEPE_CLIENT_ID;
    delete process.env.PHONEPE_CLIENT_SECRET;
    delete process.env.PHONEPE_CLIENT_VERSION;
  });

  it("creates a PhonePe payment request and returns the redirect URL", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/v1/oauth/token")) {
        return {
          ok: true,
          json: async () => ({
            access_token: "test-token",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          redirectUrl: "https://phonepe.example.com/checkout",
          state: "PENDING",
        }),
      };
    });

    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    const { createPhonePePayment } = await import("../src/lib/phonepe");
    const result = await createPhonePePayment({
      merchantTransactionId: "GT1234567890",
      amountPaise: 15000,
      userId: "donor@example.com",
      mobileNumber: "+91-9876543210",
    });

    expect(result).toEqual({
      redirectUrl: "https://phonepe.example.com/checkout",
      merchantTransactionId: "GT1234567890",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [authUrl, authOptions] = fetchMock.mock.calls[0];
    expect(authUrl).toContain("/v1/oauth/token");
    expect(authOptions.method).toBe("POST");

    const [payUrl, payOptions] = fetchMock.mock.calls[1];
    expect(payUrl).toContain("/checkout/v2/pay");
    expect(payOptions.method).toBe("POST");
    expect(payOptions.headers.Authorization).toBe("O-Bearer test-token");
    expect(JSON.parse(payOptions.body).merchantOrderId).toBe("GT1234567890");
  });
});
