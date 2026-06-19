export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6 p-1">
      <div className="h-8 w-48 rounded bg-slate-100" />
      <div className="h-4 w-96 max-w-full rounded bg-slate-100" />
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 h-10 w-full rounded bg-slate-100" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mb-3 h-12 w-full rounded bg-slate-50" />
        ))}
      </div>
    </div>
  );
}
