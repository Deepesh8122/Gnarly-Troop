export default function LeadershipProfileLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse bg-white">
      <div className="mx-auto max-w-[570px] px-6 py-12">
        <div className="mb-8 aspect-square w-full rounded-lg bg-neutral-100" />
        <div className="mb-3 flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-3 h-10 w-4/5 rounded bg-neutral-100" />
            <div className="h-6 w-1/2 rounded bg-neutral-100" />
          </div>
          <div className="h-16 w-20 rounded bg-neutral-100" />
        </div>
        <div className="mt-8 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-full rounded bg-neutral-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
