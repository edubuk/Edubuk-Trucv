
import { useState, type ReactNode } from "react";
import { BadgeCheck, Columns2, FileText } from "lucide-react";
import CvOutputPage from "@/pages/CvOutputPage";
import CvTemplates, { type CleanTemplate } from "./CvTemplates";
import { useUserData } from "@/context/AuthContext";

type CvTemplate = "verified" | CleanTemplate;

const CvById = () => {
  const [template, setTemplate] = useState<CvTemplate>("verified");
  const { user } = useUserData();

  return (
    <section className="mx-auto w-full max-w-[1400px] pb-10">
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#006666]">CV templates</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Choose how your CV looks</h1>
          <p className="mt-1 text-sm text-slate-500">Your verified profile stays unchanged. The clean templates are optimized for printing and saving as PDF.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3" role="tablist" aria-label="CV template selection">
          <TemplateButton
            active={template === "verified"}
            icon={<BadgeCheck size={19} />}
            title="Verified TruCV"
            description="Full credential and blockchain view"
            onClick={() => setTemplate("verified")}
          />
          <TemplateButton
            active={template === "classic"}
            icon={<FileText size={19} />}
            title="Clean Classic"
            description="Simple, ATS-friendly single column"
            onClick={() => setTemplate("classic")}
          />
          <TemplateButton
            active={template === "modern"}
            icon={<Columns2 size={19} />}
            title="Modern Professional"
            description="Polished layout with a compact sidebar"
            onClick={() => setTemplate("modern")}
          />
        </div>
      </div>

      {template === "verified" ? <CvOutputPage userId={user?._id || ""} /> : <CvTemplates template={template} />}
    </section>
  );
};

const TemplateButton = ({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={`flex min-h-[84px] items-start gap-3 rounded-xl border p-3 text-left transition sm:p-4 ${
      active
        ? "border-[#006666] bg-[#006666]/[.06] shadow-[0_8px_24px_rgba(0,102,102,.09)]"
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
    }`}
  >
    <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${active ? "bg-[#006666] text-white" : "bg-slate-100 text-slate-600"}`}>{icon}</span>
    <span>
      <strong className="block text-sm text-slate-900">{title}</strong>
      <small className="mt-1 block text-xs leading-5 text-slate-500">{description}</small>
    </span>
  </button>
);

export default CvById;
