
const TEAL = "#006666"
export const CvSkeleton = () => (
  <div className="h-full flex animate-pulse">
    <div className="w-[190px] flex-shrink-0 p-5" style={{ backgroundColor: `${TEAL}30` }}>
      <div className="w-16 h-16 rounded-full bg-white/30 mx-auto mb-4" />
      <div className="h-2 bg-white/30 rounded w-full mb-2" />
      <div className="h-2 bg-white/30 rounded w-3/4 mb-2" />
      <div className="h-2 bg-white/30 rounded w-1/2" />
    </div>
    <div className="flex-1 p-5">
      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
      <div className="h-20 bg-gray-100 rounded-xl mb-4" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="flex flex-wrap gap-2 mb-4">
        {[1,2,3,4,5].map(i => <div key={i} className="h-6 w-16 bg-gray-100 rounded-full" />)}
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
      {[1,2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg mb-2" />)}
    </div>
  </div>
);