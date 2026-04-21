import useHackathons from "@/hooks/useHackathons";
type HackathonStatus = "active" | "inactive" | "completed";

interface Hackathon {
  _id?: string;
  hackathonName: string;
  organization: string;
  emailId?: string;
  startDate?: string;
  endDate?: string;
  status?: HackathonStatus;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const SkeletonCard = () => {
  return (
    <div className="p-5 rounded-2xl shadow-md bg-white animate-pulse space-y-4 border border-gray-100">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status?: HackathonStatus }) => {
  const base = "px-3 py-1 text-xs font-medium rounded-full";

  const styles = {
    active: "bg-[#006666]/10 text-[#006666]",
    inactive: "bg-gray-100 text-gray-500",
    completed: "bg-[#03257e]/10 text-[#03257e]",
  };

  return (
    <span className={`${base} ${styles[status || "active"]}`}>
      {status || "active"}
    </span>
  );
};

const HackathonCard = ({hackathon }: { hackathon: Hackathon }) => {
  return (
    <div className="p-5 rounded-2xl shadow-md bg-white hover:shadow-lg transition duration-200 flex flex-col justify-between border border-gray-100">
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#03257e]">
            {hackathon.hackathonName}
          </h2>
          {/* <button className="text-white bg-[#f14419] px-3 py-1 rounded-full text-sm font-medium">View</button> */}
        </div>

        <p className="text-sm text-[#006666] font-medium">
          {hackathon.organization}
        </p>

        {hackathon.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {hackathon.description}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <StatusBadge status={hackathon.status} />

        <span className="text-xs text-gray-400">
          {hackathon.startDate
            ? `${new Date(hackathon.startDate).toLocaleDateString()} → ${hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : ""}`
            : "No dates"}
        </span>
      </div>
    </div>
  );
};

const HackathonList = () => {
    const { data, isLoading } = useHackathons();    

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#03257e] mb-6">
        Hackathons
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : data.map((hackathon, idx) => (
              <HackathonCard key={idx} hackathon={hackathon}/>
            ))}
      </div>

      {!isLoading && data.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No hackathons available.
        </p>
      )}
    </div>
  );
};

export default HackathonList;