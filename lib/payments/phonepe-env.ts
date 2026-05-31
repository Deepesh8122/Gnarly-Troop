/**
 * Global PhonePe mode — controlled by PHONEPE_ENV in .env.local / host env.
 *
 *   PHONEPE_ENV=sandbox     → UAT / test credentials, test checkout
 *   PHONEPE_ENV=production  → Live credentials, real payments
 *
 * Also accepts: prod, live (production) | uat, test (sandbox)
 */

export type PhonePePaymentEnvironment = "sandbox" | "production";

export function parsePhonePeEnvironment(
  raw: string | null | undefined,
): PhonePePaymentEnvironment {
  const env = String(raw ?? "sandbox").trim().toLowerCase();
  if (env === "production" || env === "prod" || env === "live") {
    return "production";
  }
  return "sandbox";
}

/** Active PhonePe mode for this server (from PHONEPE_ENV). */
export function getPhonePeEnvironment(): PhonePePaymentEnvironment {
  return parsePhonePeEnvironment(process.env.PHONEPE_ENV);
}

export function isPhonePeProductionMode(): boolean {
  return getPhonePeEnvironment() === "production";
}

export function isPhonePeSandboxMode(): boolean {
  return getPhonePeEnvironment() === "sandbox";
}

export function phonePeEnvironmentLabel(
  env: PhonePePaymentEnvironment | string | null | undefined,
): string {
  if (env === "production") return "Live";
  if (env === "sandbox") return "UAT / Test";
  return "Unknown";
}

export function phonePeEnvironmentDescription(env: PhonePePaymentEnvironment): string {
  if (env === "production") {
    return "Live payments — real money, shown in PhonePe production dashboard.";
  }
  return "Sandbox / UAT — test payments only, shown in PhonePe test dashboard.";
}
