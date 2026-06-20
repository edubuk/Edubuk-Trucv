
import { Tag, Plus } from "lucide-react";

const COLOR_PRIMARY = "#03257e";
const COLOR_ACCENT = "#008888";

const SHIMMER_STYLE = `
@keyframes coupon-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.coupon-shimmer {
  background: linear-gradient(90deg, #eceef1 25%, #f5f6f8 37%, #eceef1 63%);
  background-size: 400% 100%;
  animation: coupon-shimmer 1.4s ease-in-out infinite;
}
`;

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="coupon-shimmer w-9 h-9 rounded-lg flex-shrink-0" />
        <div className="min-w-0 flex-1 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="coupon-shimmer h-4 w-24 rounded" />
            <div className="coupon-shimmer h-4 w-14 rounded-full" />
          </div>
          <div className="coupon-shimmer h-3 w-56 rounded" />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="coupon-shimmer h-8 w-16 rounded-lg" />
        <div className="coupon-shimmer h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export default function CouponManagerSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="min-h-screen w-full" style={{ background: "#f7f8fb" }}>
      <style>{SHIMMER_STYLE}</style>
      <main className="w-full sm:max-w-5xl sm:mx-auto sm:px-6 py-6 space-y-6">
        {/* Header — static, not skeletonized, since it never changes */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#e6f1fb" }}
            >
              <Tag className="h-5 w-5" style={{ color: COLOR_PRIMARY }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Coupon codes</h1>
              <p className="text-sm text-gray-500">
                Create and manage discount coupons for EBUK points plans
              </p>
            </div>
          </div>
          <button
            disabled
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg text-white opacity-60 cursor-not-allowed"
            style={{ backgroundColor: COLOR_ACCENT }}
          >
            <Plus className="h-4 w-4" /> New coupon
          </button>
        </div>

        {/* Skeleton rows mimicking the real list */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}