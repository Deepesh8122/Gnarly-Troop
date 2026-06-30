"use client";

import { useEffect, useState } from "react";

type ConfigStatus = {
  email: {
    configured: boolean;
    transport: string;
    host: string | null;
    fromEmail: string | null;
    hints: string[];
  };
  whatsapp: { configured: boolean; hints: string[] };
};

export default function AdminRegistrationNotifyTest() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/registrations/test-notify/")
      .then((r) => r.json())
      .then((json) => setConfig(json.config ?? null))
      .catch(() => setConfig(null));
  }, []);

  async function runTest(
    test: "config" | "smtp-verify" | "email" | "pdf-generate" | "pdf" | "whatsapp" | "all",
  ) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/registrations/test-notify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email || undefined, phone: phone || undefined, test }),
      });
      const json = await res.json();
      if (json.config) setConfig(json.config);
      setResult(JSON.stringify(json, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Test failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-card space-y-3 p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
        Test MailerSend / PDF / WhatsApp
      </h3>

      {config && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <p>
            <strong>Email ({config.email.transport}):</strong>{" "}
            {config.email.configured ? (
              <span className="text-teal-700">
                ready — {config.email.host ?? "api"} / from {config.email.fromEmail ?? "—"}
              </span>
            ) : (
              <span className="text-red-700">not ready</span>
            )}
          </p>
          {config.email.hints.length > 0 && (
            <ul className="mt-1 list-disc pl-4">
              {config.email.hints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <p className="mt-2">
            <strong>WhatsApp:</strong>{" "}
            {config.whatsapp.configured ? (
              <span className="text-teal-700">configured</span>
            ) : (
              <span className="text-red-700">not configured</span>
            )}
          </p>
          {!config.whatsapp.configured && config.whatsapp.hints.length > 0 && (
            <ul className="mt-1 list-disc pl-4">
              {config.whatsapp.hints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Test email</span>
          <input
            className="admin-input w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Test phone (WhatsApp)</span>
          <input
            className="admin-input w-full"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91..."
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="admin-btn-primary text-sm"
          disabled={loading}
          onClick={() => runTest("smtp-verify")}
        >
          Test connection
        </button>
        <button
          type="button"
          className="admin-btn-primary text-sm"
          disabled={loading}
          onClick={() => runTest("pdf-generate")}
        >
          Test PDF only
        </button>
        <button
          type="button"
          className="admin-btn-primary text-sm"
          disabled={loading || !email}
          onClick={() => runTest("email")}
        >
          Test email
        </button>
        <button
          type="button"
          className="admin-btn-primary text-sm"
          disabled={loading || !email}
          onClick={() => runTest("pdf")}
        >
          Test PDF email
        </button>
        <button
          type="button"
          className="admin-btn-primary text-sm"
          disabled={loading || !phone}
          onClick={() => runTest("whatsapp")}
        >
          Test WhatsApp
        </button>
      </div>
      {result && (
        <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
          {result}
        </pre>
      )}
    </section>
  );
}
