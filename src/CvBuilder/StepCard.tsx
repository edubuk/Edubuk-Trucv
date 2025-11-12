import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export function StepCard({
  index,
  title,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  index: number;
  title: string;
  icon: any;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#03257e] text-white flex items-center justify-center text-sm font-bold">
            {index}
          </div>
          <div className="flex items-center gap-2 text-[#03257e] font-semibold">
            <Icon size={18} />
            <span>{title}</span>
          </div>
        </div>
        {open ? <ChevronDown size={18} className="text-slate-500"/> : <ChevronRight size={18} className="text-slate-500"/>}
      </button>
      <div
        className={`transition-[grid-template-rows] duration-300 ease-in-out grid ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 border-t border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}