import Link from "next/link";

export default function AdminDisabled() {
  return (
    <div className="admin-root flex min-h-screen items-center justify-center p-6">
      <div className="admin-card max-w-lg p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">Admin CMS is disabled</h1>
        <p className="mt-3 text-sm text-slate-600">
          This server was started without admin enabled. Add{" "}
          <code className="rounded bg-slate-100 px-1">ENABLE_ADMIN=true</code> to{" "}
          <code className="rounded bg-slate-100 px-1">.env.local</code>, then restart:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-left text-xs text-slate-100">
          {`ENABLE_ADMIN=true\nnpm run dev\n# or after changing env:\nrm -rf .next && npm run build && npm start`}
        </pre>
        <p className="mt-4 text-xs text-slate-500">
          Do not use <code className="rounded bg-slate-100 px-1">sudo npm run dev</code> — it can
          ignore your env file. Use <code className="rounded bg-slate-100 px-1">npm run dev</code>{" "}
          without sudo.
        </p>
        <Link href="/" className="admin-link mt-6 inline-block text-sm">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
