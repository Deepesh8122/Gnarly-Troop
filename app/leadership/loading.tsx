export default function LeadershipLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse bg-white">
      <div className="mx-auto max-w-[1170px] px-6 py-12">
        <div className="mb-8 h-12 w-64 rounded bg-neutral-100" />
        <div className="mb-4 h-10 w-full max-w-xl rounded bg-neutral-100" />
        <div className="mb-12 h-6 w-full max-w-2xl rounded bg-neutral-100" />
        <div className="flex gap-8 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[375px] shrink-0">
              <div className="mb-6 aspect-[5/4] rounded-lg bg-neutral-100" />
              <div className="mb-3 h-7 w-3/4 rounded bg-neutral-100" />
              <div className="h-5 w-1/2 rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
