import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { GuideSection } from "./GuideSection";
import { TRUCV_GUIDE_STEPS } from "./guideData";
import { DISPLAY_FONT, HEAD_FONT, INK, MARIGOLD_DEEP, NAVY, PAGE_BG } from "./theme";

// Ticket-stub card: dashed border + punched notches on both edges.
const TicketCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    <span
      className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
      style={{ backgroundColor: PAGE_BG }}
      aria-hidden="true"
    />
    <span
      className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
      style={{ backgroundColor: PAGE_BG }}
      aria-hidden="true"
    />
    <div
      className="h-full rounded-[20px] border-2 border-dashed bg-white p-6 shadow-[0_10px_30px_rgba(1,113,100,0.08)] sm:p-7"
      style={{ borderColor: "rgba(1,113,100,0.16)" }}
    >
      {children}
    </div>
  </div>
);

const SectionHeading = ({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  icon: any;
}) => (
  <div className="mb-5 flex items-center gap-3">
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: NAVY }}
    >
      <Icon size={18} color="#FFFFFF" strokeWidth={2.2} />
    </div>
    <div>
      <p
        className="text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{ color: MARIGOLD_DEEP, fontFamily: HEAD_FONT }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-[18px] font-bold leading-tight"
        style={{ color: INK, fontFamily: DISPLAY_FONT }}
      >
        {title}
      </h2>
    </div>
  </div>
);

// TruCV step-by-step guide: embeddable as a collapsible card (default) or
// rendered fully open on its own page via `defaultOpen`/`showToggle`.
export const TruCvGuideCard = ({
  defaultOpen = false,
  showToggle = true,
}: {
  defaultOpen?: boolean;
  showToggle?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = showToggle ? open : true;

  return (
    <TicketCard>
      <SectionHeading
        eyebrow="TruCV Guide"
        title="Step By Step Guide on how to create your TruCV"
        icon={FileText}
      />

      {showToggle && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left transition-colors hover:bg-[#FBF4E4]"
          style={{ backgroundColor: "#F5EEDD" }}
        >
          <span className="text-[14px] font-bold" style={{ color: INK }}>
            See the complete step-by-step guide
          </span>
          <ChevronDown
            size={18}
            style={{
              color: MARIGOLD_DEEP,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              flexShrink: 0,
            }}
          />
        </button>
      )}

      {isOpen && (
        <div className={showToggle ? "mt-6" : ""}>
          <GuideSection
            title="TruCV Guide"
            logo="/truCv.png"
            steps={TRUCV_GUIDE_STEPS}
          />
        </div>
      )}
    </TicketCard>
  );
};
