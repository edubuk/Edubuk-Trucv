import * as React from "react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { API_BASE_URL } from "@/main";
// import { useFormContext } from "react-hook-form";

type Option = { orgId: string; name: string };

export type DropDownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder?: string;
  options?: Option[]; // initial options
  searchable?: boolean;
  classOrgId?:string;
  index:number;
  onSearch?: (q: string) => void | Promise<void>;
  fetcher?: (q: string) => Promise<Option[]>;
};

const defaultFetcher = async (q: string): Promise<Option[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dl/getIssuer?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    console.log("data", data);
    return data.items ?? [];
  } catch (err) {
    console.error("fetcher error", err);
    return [];
  }
};

const DropDown = React.forwardRef<HTMLSelectElement, DropDownProps>(
  (
    {
      className,
      placeholder = "Search with full board or college name",
      searchable = true,
      onSearch,
      fetcher = defaultFetcher,
      options: initialOptions = [],
      value: propValue,
      defaultValue,
      classOrgId,
      index,
      onChange,
      ...props
    },
    ref
  ) => {
    const isControlled = propValue !== undefined;

    // Now selectedValue stores the **label** (name) — that's what will be sent to the form
    const [selectedValue, setSelectedValue] = React.useState<string>(() =>
      isControlled ? String(propValue) : defaultValue ? String(defaultValue) : ""
    );
    const {setValue} = useFormContext();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [options, setOptions] = React.useState<Option[]>(initialOptions);
    const [highlighted, setHighlighted] = React.useState<number>(0);

    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const debounceRef = React.useRef<number | null>(null);

    // keep internal state in sync with controlled prop (propValue now expected to be label)
    React.useEffect(() => {
      if (isControlled) 
        {setSelectedValue(String(propValue))
        };
    }, [propValue, isControlled]);

    // Filtered list used for dropdown display
    const filtered = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return options;
      return options.filter(
        (o) => o.name.toLowerCase().includes(q)
      );
    }, [options, query]);

    // selectedLabel is the same as selectedValue here (keeps naming clear)
    const selectedLabel = selectedValue;

    // maintain highlighted index when selection/filter changes
    React.useEffect(() => {
      const idx = filtered.findIndex((o) => o.name === selectedValue);
      if (idx >= 0) setHighlighted(idx);
      else setHighlighted(0);
    }, [selectedValue, filtered]);

    // click outside to close
    React.useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (!wrapperRef.current) return;
        if (!wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
          setQuery("");
        }
      }
      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }, []);

    // Debounced server fetch when query changes
    React.useEffect(() => {
      if (!searchable) return;

      if (onSearch) onSearch(query);

      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(async () => {
        if (!query) {
          setOptions(initialOptions);
          return;
        }
        const resOptions = await fetcher(query);
        setOptions(resOptions);
        setHighlighted(0);
      }, 300);

      return () => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, fetcher, onSearch, searchable]);

    // When a user selects an option from list — set label as selectedValue
    function handleSelectOption(opt: Option) {
      console.log("option",opt)
      if (!isControlled) 
        {
          setSelectedValue(opt.name);
        }

      // ensure options include the selected item (so label lookup works later)
      setOptions((prev) => {
        if (prev.find((p) => p.orgId === opt.orgId && p.name === opt.name)) return prev;
        return [opt, ...prev];
      });

      setOpen(false);
      setQuery("");

      // Emit label (name) to the parent/form
      const syntheticEvent = {
        target: { value: opt.name, name: (props as any).name },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange?.(syntheticEvent);

      inputRef.current?.focus();

      setValue(`educations.${index}.orgId`, opt.orgId, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    }

    function onKeyDown(e: React.KeyboardEvent) {
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        setOpen(true);
        e.preventDefault();
        return;
      }

      if (open) {
        if (e.key === "ArrowDown") {
          setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
          e.preventDefault();
        } else if (e.key === "ArrowUp") {
          setHighlighted((h) => Math.max(h - 1, 0));
          e.preventDefault();
        } else if (e.key === "Enter") {
          const opt = filtered[highlighted];
          if (opt) handleSelectOption(opt);
          e.preventDefault();
        } else if (e.key === "Escape") {
          setOpen(false);
          setQuery("");
          e.preventDefault();
        }
      }
    }

    return (
      <div className="relative" ref={wrapperRef}>
        {/* Hidden native select — value is now the label (name) so form will receive the name */}
        <select
          aria-hidden
          tabIndex={-1}
          ref={ref}
          value={selectedValue}
          onChange={onChange}
          className="hidden"
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            // NOTE: value is label so the form gets the name
            <option key={opt.orgId} value={opt.name}>
              {opt.name}
            </option>
          ))}
        </select>

        {/* Visible custom control */}
        <div
          className={cn(
            "flex h-9 w-full items-center rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:focus-within:ring-zinc-300",
            className
          )}
          onKeyDown={onKeyDown}
        >
          {searchable ? (
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder={placeholder}
              value={open ? query : selectedLabel}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              aria-expanded={open}
              aria-haspopup="listbox"
            />
          ) : (
            <button
              type="button"
              className="flex-1 text-left truncate"
              onClick={() => setOpen((s) => !s)}
            >
              {selectedLabel || placeholder}
            </button>
          )}

          {/* caret */}
          <button
            type="button"
            onClick={() => {
              setOpen((s) => !s);
              inputRef.current?.focus();
            }}
            aria-label="Toggle dropdown"
            className="ml-2 shrink-0 rounded p-1 hover:bg-zinc-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
        </div>

        {/* Dropdown list */}
        {open && (
          <ul
            role="listbox"
            aria-activedescendant={filtered[highlighted] ? `option-${filtered[highlighted].orgId}` : undefined}
            tabIndex={-1}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg dark:bg-zinc-900 dark:border-zinc-800"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-zinc-500">No results</li>
            ) : (
              filtered.map((opt, idx) => {
                const isHighlighted = idx === highlighted;
                const isSelected = opt.name === selectedValue;
                return (
                  <li
                    key={opt.orgId}
                    id={`option-${opt.orgId}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectOption(opt)}
                    onMouseEnter={() => setHighlighted(idx)}
                    className={cn(
                      "flex cursor-pointer items-center px-3 py-2 text-sm",
                      isHighlighted ? "bg-zinc-100 dark:bg-zinc-800" : "",
                      isSelected ? "font-semibold" : "font-normal"
                    )}
                  >
                    <div className="truncate">{opt.name}</div>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    );
  }
);

DropDown.displayName = "DropDown";
export { DropDown };
