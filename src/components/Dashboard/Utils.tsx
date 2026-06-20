import { Link } from "react-router-dom";
import { Infinity as InfinityIcon, ShieldCheckIcon, TrendingUp } from "lucide-react";
import EBUKLogo from "@/assets/ebukLogo.webp";

const COLOR_PRIMARY = "#03257e";
const COLOR_ACCENT = "#008888";
const COLOR_WARNING = "#f14419";


export function EbukPointsBar({ balance }: { balance: number }) {
  return (
<div className="relative mx-6 mt-4">
  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] opacity-90" />
  <div className="relative bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
            <img src={EBUKLogo} alt="EBUK Logo" className="h-10 w-10 rounded-full" />
        </div>
        <div>
          <p className="text-sm text-[#03257e]">EBUK points balance</p>
          <p className="text-xl font-bold text-[#006666]">{balance} pts</p>
        </div>
      </div>
      <Link
        to="/pricing"
        className="text-sm font-medium px-4 py-2.5 rounded-lg text-white"
        style={{ backgroundColor: COLOR_ACCENT }}
      >
        Buy points
      </Link>
      </div>
    </div>
  );
}

export function VerificationBenefits() {
  const benefits = [
    {
      icon: <InfinityIcon className="h-5 w-5" style={{ color: COLOR_PRIMARY }} />,
      title: "Verify once, stay verified",
      desc: "Lifetime verification — no repeat checks needed.",
    },
    {
      icon: <ShieldCheckIcon className="h-5 w-5" style={{ color: "#0F6E56" }} />,
      title: "Skip post-hire checks",
      desc: "No background verification worries after you're hired.",
    },
    {
      icon: <TrendingUp className="h-5 w-5" style={{ color: COLOR_WARNING }} />,
      title: "Rank higher in shortlists",
      desc: "Verified profiles surface first to recruiters.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {benefits.map((b, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
          {b.icon}
          <p className="text-sm font-semibold text-gray-900 mt-2">{b.title}</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}