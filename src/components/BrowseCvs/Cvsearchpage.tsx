// CvSearchPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

import { useSearchProfiles } from "@/hooks/useSearchProfiles";
import { useCvData } from "@/hooks/useCvData";
import { CvSkeleton } from "../SkeletonLoader/CvSkeleton";
import { CvPanel } from "./CvPanel";
import { ProfileCard } from "./ProfileCard";
import { FilterBar, FilterState } from "./FilterBar";
import { EmptyCv, EmptyResults, ProfileSkeleton } from "./Utils";

//constant
const NAVY = "#03257e";
const TEAL = "#006666";
const PER_PAGE = 8;

const DEFAULT_FILTERS: FilterState = {
  name: "",
  location: "",
  skill: "",
  collegeName: "",
  companyName: "",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Pagination
// ─────────────────────────────────────────────────────────────────────────────

interface PaginationProps {
  current: number;
  total: number;
  onChange: (p: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  onChange,
}) => {
  console.log({ total });
  if (total <= 1) return null;

  const getPages = () => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, "...", total];
    if (current >= total - 2)
      return [1, "...", total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="flex items-center justify-center gap-1 py-3 px-2 border-t border-gray-100">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-30"
        style={{ color: NAVY }}
      >
        <ChevronLeft size={14} />
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`dot-${i}`}
            className="w-7 h-7 flex items-center justify-center text-xs text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page as number)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: current === page ? TEAL : "transparent",
              color: current === page ? "white" : NAVY,
            }}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-30"
        style={{ color: NAVY }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────────────────────────────────────

const CvSearchPage: React.FC = () => {
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const cvPanelRef = useRef<HTMLDivElement>(null);
  const { users, searchProfiles, isLoading, totalProfiles, setTotalProfiles } = useSearchProfiles();

  const { cvData, searchCvData, isCvLoading,reset } = useCvData();
  

  useEffect(() => {
    searchProfiles(searchQuery ? searchQuery : "default", page);
    setIsFilterApplied(false);
  }, [page, isFilterApplied === true]);

  const handleSearch = () => {
    setIsFilterApplied(true);
    setTotalProfiles(0);
    setPage(1);
    setSelectedId(null);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    //searchProfiles(filters, p);
  };

  const handleSelectProfile = (id: string) => {
    setSelectedId(id);
    searchCvData(id as string);
    // On mobile: scroll to CV panel
    setTimeout(
      () => cvPanelRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    //setProfiles([]);
    setTotal(0);
    //setTotalPages(0);
    setSelectedId(null);
    //setCvData(null);
    setHasSearched(false);
    searchProfiles("default");
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ── Filter Header ── */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={isLoading}
        setSearchQuery={setSearchQuery}
        setIsFilterApplied={setIsFilterApplied}
      />

      {/* ── Main content ── */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* ── Left: Profile List ── */}
        <div
          className="w-full md:w-[28%] lg:w-[24%] xl:w-[22%] flex flex-col border-r border-gray-100 bg-white h-[70vh]"
          style={{ minWidth: 240, maxWidth: 320 }}
        >
          {/* List header */}
          <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users size={13} style={{ color: TEAL }} />
              <span
                className="text-[11px] font-semibold tracking-wider uppercase"
                style={{ color: TEAL }}
              >
                Profiles
              </span>
            </div>
            {hasSearched && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${NAVY}12`, color: NAVY }}
              >
                {total} found
              </span>
            )}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 h-full">
            {isLoading ? (
              Array.from({ length: PER_PAGE }).map((_, i) => (
                <ProfileSkeleton key={i} />
              ))
            ) : users.length > 0 ? (
              users.map((profile, i) => (
                <ProfileCard
                  key={profile._id}
                  profile={profile}
                  selected={selectedId === profile._id}
                  onClick={() => handleSelectProfile(profile.userId)}
                  index={i}
                />
              ))
            ) : (
              <EmptyResults searched={hasSearched} />
            )}
          </div>

          {/* Pagination */}
          <Pagination
            current={page}
            total={totalProfiles ? Math.ceil(totalProfiles / 20) : 0}
            onChange={handlePageChange}
          />
        </div>

        {/* ── Right: CV Viewer ── */}
        <div
          ref={cvPanelRef}
          className="flex-1 bg-white overflow-hidden"
          style={{ minHeight: "400px" }}
        >
          {isCvLoading ? (
            <CvSkeleton />
          ) : cvData ? (
            <CvPanel cvData={cvData} userId={selectedId!} />
          ) : (
            <EmptyCv />
          )}
        </div>
      </div>
    </div>
  );
};

export default CvSearchPage;
