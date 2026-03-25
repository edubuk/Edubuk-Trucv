function CvCardSkeleton() {
  return (
    <div className="group relative flex flex-col h-full border border-slate-200 bg-white/90 shadow-sm">
      {/* Accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] rounded" />

      {/* Card content */}
      <div className="flex-1 flex flex-col gap-3 px-4 pt-5 pb-4">
        {/* Badge + trash icon row */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-6 w-28 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-5 w-5 rounded bg-slate-200 animate-pulse" />
        </div>

        {/* Name */}
        <div className="space-y-1">
          <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
        </div>

        {/* Meta chips */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <div className="h-6 w-32 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-6 w-36 rounded-full bg-slate-100 animate-pulse" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-100">
        <div className="h-9 w-full rounded-xl bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

export default function CvCardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CvCardSkeleton key={i} />
      ))}
    </div>
  );
}