import crypto from "crypto";
import { getSiteUrl } from "@/lib/env";

const PHONEPE_BASE =
  process.env.PHONEPE_ENV === "production"
    ? "https://api.phonepe.com/apis/hermes"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";

export type PhonePePayRequest = {
  merchantTransactionId: string;
  amountPaise: number;
  userId: string;
  mobileNumber?: string;
};

export function getPhonePeConfig() {
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX ?? "1";

  if (!merchantId || !saltKey) {
    return null;
  }
  return { merchantId, saltKey, saltIndex };
}

function sha256Hex(payload: string): string {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function buildPhonePeChecksum(base64Payload: string, endpoint: string, saltKey: string, saltIndex: string) {
  const raw = base64Payload + endpoint + saltKey;
  return sha256Hex(raw) + "###" + saltIndex;
}

export function verifyPhonePeCallback(base64Response: string, receivedChecksum: string): boolean {
  const cfg = getPhonePeConfig();
  if (!cfg) return false;
  const expected = sha256Hex(base64Response + cfg.saltKey) + "###" + cfg.saltIndex;
  return expected === receivedChecksum;
}

export async function createPhonePePayment(req: PhonePePayRequest): Promise<{
  redirectUrl: string;
  merchantTransactionId: string;
}> {
  const cfg = getPhonePeConfig();
  if (!cfg) {
    throw new Error("PhonePe is not configured (PHONEPE_MERCHANT_ID, PHONEPE_SALT_KEY)");
  }

  const siteUrl = getSiteUrl();
  const payload = {
    merchantId: cfg.merchantId,
    merchantTransactionId: req.merchantTransactionId,
    merchantUserId: req.userId.slice(0, 36),
    amount: req.amountPaise,
    redirectUrl: `${siteUrl}/collaboration/donation/status/?id=${req.merchantTransactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${siteUrl}/api/donations/phonepe/callback/`,
    mobileNumber: (req.mobileNumber ?? "9999999999").replace(/\D/g, "").slice(-10),
    paymentInstrument: { type: "PAY_PAGE" },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const endpoint = "/pg/v1/pay";
  const checksum = buildPhonePeChecksum(base64Payload, endpoint, cfg.saltKey, cfg.saltIndex);

  const res = await fetch(`${PHONEPE_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    body: JSON.stringify({ request: base64Payload }),
  });

  const json = await res.json();
  if (!res.ok || !json?.data?.instrumentResponse?.redirectInfo?.url) {
    throw new Error(json?.message ?? json?.code ?? "PhonePe payment initiation failed");
  }

  return {
    redirectUrl: json.data.instrumentResponse.redirectInfo.url,
    merchantTransactionId: req.merchantTransactionId,
  };
}

export async function checkPhonePeStatus(merchantTransactionId: string) {
  const cfg = getPhonePeConfig();
  if (!cfg) throw new Error("PhonePe not configured");

  const path = `/pg/v1/status/${cfg.merchantId}/${merchantTransactionId}`;
  const checksum = sha256Hex(path + cfg.saltKey) + "###" + cfg.saltIndex;

  const res = await fetch(`${PHONEPE_BASE}${path}`, {
    headers: { "X-VERIFY": checksum, "X-MERCHANT-ID": cfg.merchantId },
  });
  return res.json();
}
