import React from "react";
import { SearchProfile } from "@/api/search.apis";

interface SearchResultsPopupProps {
  users: SearchProfile[];
  loading?: boolean;
  onSelect: (user: SearchProfile) => void;
}

const truncateText = (text: string = "", maxWords: number = 12) => {
  const words = text.split(" ");

  if (words.length <= maxWords) return text;

  return words.slice(0, maxWords).join(" ") + "...";
};

const SearchResultsPopup: React.FC<SearchResultsPopupProps> = ({
  users,
  loading,
  onSelect,
}) => {
  console.log("USERS", users);
  return (
    <div
      className="
        absolute
        top-full
        mt-2
        left-0
        w-full
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-2xl
        overflow-hidden
        z-50
      "
    >
      {loading && (
        <div className="p-6 text-center text-[#03257e]">Searching...</div>
      )}

      {!loading && users?.length === 0 && (
        <div className="p-6 text-center text-slate-500">No profiles found</div>
      )}

      {users?.length > 0 && (
        <div
          className="max-h-[420px] overflow-y-auto [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:none]
    [scrollbar-width:none]
"
        >
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => onSelect(user)}
              className="
                w-full
                text-left
                p-2
                flex
                gap-2
                items-start
                transition-all
                duration-200
                hover:bg-[#03257e]/5
                border-b
                border-slate-100
                last:border-b-0

              "
            >
              <img
                src={
                  user?.userImage || "https://ui-avatars.com/api/?name=User"
                }
                alt={user.name}
                className="
                  w-10
                  h-10
                  rounded-full
                  object-cover
                  border-2
                  border-[#006666]/20
                  flex-shrink-0
                "
              />

              <div className="flex-1 min-w-0">
                <h3
                  className="
                  text-sm
                    sm:text-md
                    font-semibold
                    text-[#03257e]
                    text-base
                    truncate
                  "
                >
                  {user.name}
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-600
                    leading-relaxed
                  "
                >
                  {truncateText(user.profileSummary || "", 15)}
                </p>

                <span
                  className="
                    inline-flex
                    mt-2
                    text-xs
                    font-medium
                    text-[#f14419]
                  "
                >
                  View CV →
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPopup;
