import { useEffect, useState } from "react";

const placeholders = [
  "name",
  "city",
  "college",
  "company",
  "skill",
];

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const AnimatedSearchInput = ({
  value,
  onChange,
}: SearchInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prev) => (prev + 1) % placeholders.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          h-8
          sm:h-10
          pl-6
          pr-4
          rounded-2xl
          border
          border-slate-200
          bg-white
          text-slate-800
          outline-none
          focus:border-[#03257e]
          focus:ring-4
          focus:ring-[#03257e]/10
        "
      />

      {!value && (
        <div
          className="
            absolute
            left-6
            top-1/2
            -translate-y-1/2
            flex
            items-center
            pointer-events-none
            text-slate-400
            text-xs
            sm:text-sm
          "
        >
          <span>Search CV by&nbsp;</span>

          <span
            key={placeholderIndex}
            className="animate-placeholder font-medium text-[#03257e]"
          >
            {placeholders[placeholderIndex]}
          </span>
        </div>
      )}
    </div>
  );
};

export default AnimatedSearchInput;