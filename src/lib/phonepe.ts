import crypto from "crypto";
import { getSiteUrl } from "@/lib/env";
import {
  getPhonePeEnvironment,
  isPhonePeProductionMode,
  type PhonePePaymentEnvironment,
} from "@/lib/payments/phonepe-env";

export { getPhonePeEnvironment, type PhonePePaymentEnvironment };

export type PhonePePayRequest = {
  merchantTransactionId: string;
  amountPaise: number;
  userId: string;
  mobileNumber?: string;
};

export type PhonePeConfig = {
  clientId: string;
  clientSecret: string;
  clientVersion: string;
};

type TokenCache = {
  token: string;
  expiresAt: number;
};

const PHONEPE_V1_PRODUCTION_BASE = "https://api.phonepe.com/apis/hermes";

let tokenCache: TokenCache | null = null;

/** Production uses V1 (Merchant ID + API Key). Sandbox uses V2 OAuth (Client ID + Secret). */
export function usesPhonePeV1Flow(): boolean {
  return isPhonePeProductionMode();
}

function getPhonePeApiBase(): string {
  return isPhonePeProductionMode()
    ? "https://api.phonepe.com/apis/pg"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";
}

function getPhonePeAuthUrl(): string {
  return isPhonePeProductionMode()
    ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
}

/** Supports V2 names (CLIENT_*) and legacy V1 names (MERCHANT_ID / SALT_*) still present in env files. */
export function getPhonePeConfig(): PhonePeConfig | null {
  const clientId = process.env.PHONEPE_CLIENT_ID ?? process.env.PHONEPE_MERCHANT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET ?? process.env.PHONEPE_SALT_KEY;
  const clientVersion =
    process.env.PHONEPE_CLIENT_VERSION ?? process.env.PHONEPE_SALT_INDEX ?? "1";

  if (!clientId || !clientSecret) {
    return null;
  }
  return { clientId, clientSecret, clientVersion };
}

function sha256Hex(payload: string): string {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function buildV1Checksum(
  payload: string,
  endpoint: string,
  saltKey: string,
  saltIndex: string,
): string {
  return sha256Hex(payload + endpoint + saltKey) + "###" + saltIndex;
}

export function verifyPhonePeCallback(base64Response: string, receivedChecksum: string): boolean {
  const cfg = getPhonePeConfig();
  if (!cfg) return false;
  const expected = sha256Hex(base64Response + cfg.clientSecret) + "###" + cfg.clientVersion;
  return expected === receivedChecksum;
}

async function getAccessToken(): Promise<string> {
  const cfg = getPhonePeConfig();
  if (!cfg) {
    throw new Error(
      "PhonePe is not configured (PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET, or legacy PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY)",
    );
  }

  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.expiresAt > now + 60) {
    return tokenCache.token;
  }

  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_version: cfg.clientVersion,
    client_secret: cfg.clientSecret,
    grant_type: "client_credentials",
  });

  const res = await fetch(getPhonePeAuthUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = await res.json();
  if (!res.ok || !json?.access_token) {
    throw new Error(json?.message ?? json?.code ?? "PhonePe authorization failed");
  }

  tokenCache = {
    token: json.access_token,
    expiresAt: json.expires_at ?? now + 3600,
  };
  return json.access_token;
}

export function verifyPhonePeWebhook(authHeader: string | null): boolean {
  const username = process.env.PHONEPE_WEBHOOK_USERNAME;
  const password = process.env.PHONEPE_WEBHOOK_PASSWORD;
  if (!username || !password) return true;
  if (!authHeader) return false;

  const expected = sha256Hex(`${username}:${password}`);
  const normalized = authHeader.replace(/^SHA256\s+/i, "").trim();
  return normalized === expected;
}

async function createPhonePePaymentV1(
  req: PhonePePayRequest,
  siteUrl: string,
): Promise<{ redirectUrl: string; merchantTransactionId: string; returnUrl: string }> {
  const cfg = getPhonePeConfig();
  if (!cfg) {
    throw new Error("PhonePe is not configured");
  }

  const returnUrl = `${siteUrl}/collaboration/donation/status/?id=${req.merchantTransactionId}`;
  const payload = {
    merchantId: cfg.clientId,
    merchantTransactionId: req.merchantTransactionId,
    merchantUserId: req.userId.slice(0, 36),
    amount: req.amountPaise,
    redirectUrl: returnUrl,
    redirectMode: "REDIRECT",
    callbackUrl: `${siteUrl}/api/donations/phonepe/callback/`,
    mobileNumber: (req.mobileNumber ?? "9999999999").replace(/\D/g, "").slice(-10),
    paymentInstrument: { type: "PAY_PAGE" },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const endpoint = "/pg/v1/pay";
  const checksum = buildV1Checksum(base64Payload, endpoint, cfg.clientSecret, cfg.clientVersion);

  const res = await fetch(`${PHONEPE_V1_PRODUCTION_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    body: JSON.stringify({ request: base64Payload }),
  });

  const json = await res.json();
  const redirectUrl = json?.data?.instrumentResponse?.redirectInfo?.url;
  if (!res.ok || !redirectUrl) {
    throw new Error(json?.message ?? json?.code ?? "PhonePe payment initiation failed");
  }

  return {
    redirectUrl,
    merchantTransactionId: req.merchantTransactionId,
    returnUrl,
  };
}

async function createPhonePePaymentV2(
  req: PhonePePayRequest,
  siteUrl: string,
): Promise<{ redirectUrl: string; merchantTransactionId: string; returnUrl: string }> {
  const token = await getAccessToken();
  const returnUrl = `${siteUrl}/collaboration/donation/status/?id=${req.merchantTransactionId}`;

  const payload = {
    merchantOrderId: req.merchantTransactionId,
    amount: req.amountPaise,
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "Donation to Gnarly Troop",
      merchantUrls: {
        redirectUrl: returnUrl,
      },
    },
    metaInfo: {
      udf1: req.userId.slice(0, 256),
      udf2: (req.mobileNumber ?? "").replace(/\D/g, "").slice(-10),
    },
  };

  const res = await fetch(`${getPhonePeApiBase()}/checkout/v2/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json?.redirectUrl) {
    throw new Error(json?.message ?? json?.code ?? "PhonePe payment initiation failed");
  }

  return {
    redirectUrl: json.redirectUrl,
    merchantTransactionId: req.merchantTransactionId,
    returnUrl,
  };
}

export async function createPhonePePayment(
  req: PhonePePayRequest,
  options?: { siteUrl?: string },
): Promise<{
  redirectUrl: string;
  merchantTransactionId: string;
  returnUrl: string;
}> {
  const siteUrl = options?.siteUrl ?? getSiteUrl();
  if (usesPhonePeV1Flow()) {
    return createPhonePePaymentV1(req, siteUrl);
  }
  return createPhonePePaymentV2(req, siteUrl);
}

async function checkPhonePeStatusV1(merchantTransactionId: string) {
  const cfg = getPhonePeConfig();
  if (!cfg) throw new Error("PhonePe not configured");

  const path = `/pg/v1/status/${cfg.clientId}/${merchantTransactionId}`;
  const checksum = sha256Hex(path + cfg.clientSecret) + "###" + cfg.clientVersion;

  const res = await fetch(`${PHONEPE_V1_PRODUCTION_BASE}${path}`, {
    headers: {
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": cfg.clientId,
    },
  });
  return res.json();
}

async function checkPhonePeStatusV2(merchantTransactionId: string) {
  const token = await getAccessToken();
  const url = `${getPhonePeApiBase()}/checkout/v2/order/${encodeURIComponent(merchantTransactionId)}/status?details=true`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message ?? json?.code ?? `PhonePe status check failed (${res.status})`);
  }
  return json;
}

export async function checkPhonePeStatus(merchantTransactionId: string) {
  if (usesPhonePeV1Flow()) {
    return checkPhonePeStatusV1(merchantTransactionId);
  }
  return checkPhonePeStatusV2(merchantTransactionId);
}

export function isPhonePePaymentSuccessful(statusRes: {
  code?: string;
  state?: string;
  data?: { state?: string; transactionId?: string };
  paymentDetails?: Array<{ state?: string; transactionId?: string }>;
}): boolean {
  if (statusRes?.code === "ORDER_NOT_FOUND" || statusRes?.state === "FAILED") {
    return false;
  }

  if (statusRes?.code === "PAYMENT_SUCCESS" || statusRes?.data?.state === "COMPLETED") {
    return true;
  }

  return (
    statusRes?.state === "COMPLETED" ||
    statusRes?.paymentDetails?.some(
      (detail) => detail.state === "COMPLETED" && Boolean(detail.transactionId),
    ) === true
  );
}

export function getPhonePeTransactionId(statusRes: {
  data?: { transactionId?: string };
  paymentDetails?: Array<{ transactionId?: string }>;
}): string | null {
  return statusRes?.data?.transactionId ?? statusRes?.paymentDetails?.[0]?.transactionId ?? null;
}
