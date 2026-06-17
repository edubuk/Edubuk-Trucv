import { CircleUser, Search } from "lucide-react";

const NAVY   = "#03257e";
const TEAL   = "#006666";
const ORANGE = "yellow";

export const EmptyCv = () => (
  <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center select-none">
    <div
      className="w-20 h-20 rounded-2xl flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${TEAL}15, ${NAVY}10)` }}
    >
      <CircleUser size={36} style={{ color: `${TEAL}60` }} />
    </div>
    <div>
      <p className="text-base font-semibold" style={{ color: NAVY }}>No profile selected</p>
      <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-[200px]">
        Search and click a profile from the left to view their blockchain-verified CV
      </p>
    </div>
    <div className="flex gap-1.5 mt-2">
      {[NAVY, TEAL, ORANGE].map(c => (
        <div key={c} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${c}50` }} />
      ))}
    </div>
  </div>
);

export const EmptyResults = ({ searched }: { searched: boolean }) => (
  <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 text-center">
    <Search size={28} style={{ color: `${TEAL}50` }} className="mb-3" />
    <p className="text-sm font-medium" style={{ color: NAVY }}>
      {searched ? "No profiles found" : "Search to find profiles"}
    </p>
    <p className="text-[11px] text-gray-400 mt-1">
      {searched
        ? "Try adjusting your filters"
        : "Use the filters above to find blockchain-verified CVs"}
    </p>
  </div>
);


export const ProfileSkeleton = () => (
  <div className="p-3 rounded-xl border border-gray-100 animate-pulse">
    <div className="flex items-start gap-2.5">
      <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-2 bg-gray-100 rounded w-1/2 mb-1.5" />
        <div className="h-2 bg-gray-100 rounded w-full" />
        <div className="h-2 bg-gray-100 rounded w-2/3 mt-1" />
      </div>
    </div>
  </div>
);