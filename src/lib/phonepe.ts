import crypto from "crypto";
import { getSiteUrl } from "@/lib/env";

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

let tokenCache: TokenCache | null = null;

function getPhonePeEnv(): "production" | "sandbox" {
  const env = String(process.env.PHONEPE_ENV ?? "sandbox").trim().toLowerCase();
  if (env === "production" || env === "prod" || env === "live") {
    return "production";
  }
  return "sandbox";
}

function getPhonePeApiBase(): string {
  return getPhonePeEnv() === "production"
    ? "https://api.phonepe.com/apis/pg"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";
}

function getPhonePeAuthUrl(): string {
  return getPhonePeEnv() === "production"
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

  const expected = crypto.createHash("sha256").update(`${username}:${password}`).digest("hex");
  const normalized = authHeader.replace(/^SHA256\s+/i, "").trim();
  return normalized === expected;
}

export async function createPhonePePayment(req: PhonePePayRequest): Promise<{
  redirectUrl: string;
  merchantTransactionId: string;
}> {
  const token = await getAccessToken();
  const siteUrl = getSiteUrl();

  const payload = {
    merchantOrderId: req.merchantTransactionId,
    amount: req.amountPaise,
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "Donation to Gnarly Troop",
      merchantUrls: {
        redirectUrl: `${siteUrl}/collaboration/donation/status/?id=${req.merchantTransactionId}`,
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
  };
}

export async function checkPhonePeStatus(merchantTransactionId: string) {
  const token = await getAccessToken();
  const url = `${getPhonePeApiBase()}/checkout/v2/order/${encodeURIComponent(merchantTransactionId)}/status?details=false`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
  });
  return res.json();
}

export function isPhonePePaymentSuccessful(statusRes: {
  state?: string;
  paymentDetails?: Array<{ state?: string; transactionId?: string }>;
}): boolean {
  return (
    statusRes?.state === "COMPLETED" ||
    statusRes?.paymentDetails?.some((detail) => detail.state === "COMPLETED") === true
  );
}

export function getPhonePeTransactionId(statusRes: {
  paymentDetails?: Array<{ transactionId?: string }>;
}): string | null {
  return statusRes?.paymentDetails?.[0]?.transactionId ?? null;
}
