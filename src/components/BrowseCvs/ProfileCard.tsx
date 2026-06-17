import { type SearchProfile } from "@/api/search.apis";
import { ChevronRight } from "lucide-react";


interface ProfileCardProps {
  profile: SearchProfile;
  selected: boolean;
  onClick: () => void;
  index: number;
}

const NAVY   = "#03257e";
const TEAL   = "#006666";


const Avatar = ({ src, name, size = "md" }: { src?: string; name?: string; size?: "sm" | "md" | "lg" }) => {
  const dims = { sm: "w-9 h-9 text-base", md: "w-12 h-12 text-lg", lg: "w-20 h-20 text-3xl" };
  const initials = name?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || "?";
  if (src) return (
    <img src={src} alt={name} className={`${dims[size]} rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0`} />
  );
  return (
    <div
      className={`${dims[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${TEAL}, ${NAVY})` }}
    >
      {initials}
    </div>
  );
};


export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, selected, onClick, index }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-3 rounded-xl border transition-all duration-200 group relative"
    style={{
      borderColor: selected ? TEAL : "#e5e7eb",
      backgroundColor: selected ? `${TEAL}08` : "white",
      boxShadow: selected ? `0 0 0 1px ${TEAL}40, 0 2px 8px ${TEAL}12` : "none",
      animationDelay: `${index * 40}ms`,
    }}
  >
    {/* Selected accent bar */}
    <div
      className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full transition-all duration-200"
      style={{ backgroundColor: selected ? TEAL : "transparent" }}
    />

    <div className="flex items-start gap-2.5">
      <Avatar src={profile.userImage} name={profile.name} size="sm" />
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm leading-tight truncate"
          style={{ color: selected ? TEAL : NAVY }}
        >
          {profile.name}
        </p>
        {/* {profile. && (
          <p className="text-[11px] capitalize mt-0.5 flex items-center gap-1" style={{ color: `${TEAL}99` }}>
            {profile.profession === "student"
              ? <MdSchool size={11} />
              : <MdWork size={11} />
            }
            {profile.profession}
          </p>
        )} */}
        {/* {profile. && (
          <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
            <MapPin size={9} />
            {profile.city}
          </p>
        )} */}
        {profile.profileSummary && (
          <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
            {profile.profileSummary}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <ChevronRight
        size={14}
        className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: TEAL }}
      />
    </div>
  </button>
);