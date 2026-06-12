import { Building2, CircleUser, GraduationCap, MapPin, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { SiHyperskill } from "react-icons/si";
import trucvLogo from "@/assets/truCV2.png"

const NAVY   = "#03257e";
const TEAL   = "#006666";

export interface FilterState {
  name: string;
  location: string;
  skill: string;
  collegeName: string;
  companyName: string;
}


interface FilterBarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
  setSearchQuery: (query: string) => void;
  setIsFilterApplied: (isFilterApplied: boolean) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, onSearch, onClear, loading,setSearchQuery }) => {

  const set = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement>) => {
  const updatedFilters = { ...filters, [key]: e.target.value };
  onChange(updatedFilters);

  const query = Object.values(updatedFilters)
    .filter((value) => value.trim() !== "")  // ← removed fields drop out here
    .map((value) => encodeURIComponent(value.trim()))
    .join("+");

  setSearchQuery(query);  // empty string "" if all fields cleared
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  const hasFilters = Object.values(filters).some(v => v.trim());

  const fields: { key: keyof FilterState; label: string; placeholder: string; icon: React.ReactNode }[] = [
    { key: "name",        label: "Name",         placeholder: "Search by name…",     icon: <CircleUser size={14} /> },
    { key: "location",    label: "Location",     placeholder: "City or state…",      icon: <MapPin size={14} /> },
    { key: "skill",       label: "Skill",        placeholder: "e.g. React, Solidity…", icon: <SiHyperskill size={14} /> },
    { key: "collegeName", label: "College",      placeholder: "Institution name…",   icon: <GraduationCap size={14} /> },
    { key: "companyName", label: "Company",      placeholder: "Company name…",       icon: <Building2 size={14} /> },
  ];

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm h-min-[30vh]">
      {/* Brand bar */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 100%)` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-20 h-18 rounded-lg bg-white flex items-center justify-center">
            {/* <Users size={16} className="text-white" /> */}
            <img src={trucvLogo} alt="TruCV" className="w-fit h-18" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-wide leading-none">
              TruCV <span className="font-light opacity-80">Search</span>
            </h1>
            <p className="text-white/60 text-[10px] tracking-widest uppercase mt-0.5">
              Blockchain-Verified Profiles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 border border-[#ffffff] rounded-full bg-[#03257e]" />
          <div className="w-2 h-2 border border-[#ffffff] rounded-full bg-[#008888]" />
          <div className="w-2 h-2 border border-[#ffffff] rounded-full bg-[#f14419]" />
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={13} style={{ color: TEAL }} />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: TEAL }}>
            Filters
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {fields.map(({ key, label, placeholder, icon }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: NAVY }}>
                {label}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" style={{ color: NAVY }}>
                  {icon}
                </span>
                <input
                  type="text"
                  value={filters[key]}
                  onChange={set(key)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border transition-all outline-none"
                  style={{
                    borderColor: filters[key] ? TEAL : "#e5e7eb",
                    boxShadow: filters[key] ? `0 0 0 2px ${TEAL}22` : "none",
                    color: NAVY,
                  }}
                  onFocus={e => (e.target.style.borderColor = TEAL, e.target.style.boxShadow = `0 0 0 2px ${TEAL}22`)}
                  onBlur={e => {
                    if (!filters[key]) {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between mt-3">
            <div className="flex gap-4 justify-center items-center ">
          {hasFilters ? (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs text-[#03257e] hover:text-gray-600 transition-colors"
            >
              <X size={13} />
              Clear all 
            </button>
          ) : <div />}
            <button 
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs text-[#03257e] hover:text-gray-600 transition-colors">
            <RefreshCw size={13} className="cursor-pointer"/> Refresh 
            </button>
          </div>
           
          <button
            onClick={onSearch}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, #f14419, #c43714)` }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={14} />
            )}
            Search Profiles
          </button>
        </div>
      </div>
    </div>
  );
};