import { X } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type EdubukRegistrationProps = {
  /** Put the supplied edubuk-logo.png file in your app's public directory. */
  logoSrc?: string;
  className?: string;
  /** Pass this together with onClose to control the popup from a parent. */
  isOpen?: boolean;
  /** Controls initial visibility when isOpen is not supplied. */
  defaultOpen?: boolean;
  onClose?: () => void;
};

type DetailProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
};

const iconClassName =
  "h-[13px] w-[13px] shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.3]";

function Detail({
  icon,
  label,
  children,
  className = "",
}: DetailProps) {
  return (
    <div
      className={`flex items-center gap-2 text-[11.5px] font-medium font-bold text-[#4a5578] ${className}`}
    >
      <span className="flex h-5 w-5 items-center justify-center text-[#f14419]">
        {icon}
      </span>

      <span className="font-bold">
        <b className="text-[#03257E]">{label}:</b>&nbsp;{children}
      </span>
    </div>
  );
}

function Barcode({ bars }: { bars: number[] }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-[18px] items-end gap-0.5"
    >
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-0.5 bg-[#03257E] opacity-50"
          style={{ height }}
        />
      ))}
    </div>
  );
}

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const PersonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const LayersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <path d="M12 2 3 7l9 5 9-5-9-5Z" />
    <path d="M3 12l9 5 9-5" />
  </svg>
);

const MoneyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M15 9.5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
  </svg>
);

const SeatsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

const ChartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <path d="M3 3v18h18M8 17V9m4 8V5m4 12v-5" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className={iconClassName}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

/* 
 * IMPORTANT:
 * Both cards use flex-col.
 * mt-auto on the button wrapper pushes both buttons
 * to the same bottom position.
 */
const sharedCardClasses =
  "group relative flex min-w-0 flex-1 flex-col gap-2.5 px-[24px] pb-[26px] pt-[26px] sm:px-[34px] sm:pb-[26px] sm:pt-[34px] no-underline transition-colors focus-visible:z-10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#03257E]";

const badgeClasses =
  "inline-flex self-start rounded-full px-[13px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.6px]";

const titleClasses =
  "mt-0.5 min-h-[52px] text-xl font-extrabold leading-[1.28] text-[#03257E]";

const descriptionClasses =
  "text-[12.5px] leading-[1.6] text-[#6b7690]";

const detailsClasses =
  "mt-1.5 flex flex-col gap-[7px] border-t border-dashed border-[#E4E8F4] pt-3";

const buttonClasses =
  "inline-flex self-start rounded-[10px] bg-[#FE9A02] px-5 py-[11px] text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(254,154,2,0.28)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-[#F57C00] group-hover:shadow-[0_12px_24px_rgba(254,154,2,0.35)]";

export default function EdubukRegistration({
  logoSrc = "/edubuklogo1.svg",
  className = "",
  isOpen,
  defaultOpen = true,
  onClose,
}: EdubukRegistrationProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const controlled = typeof isOpen === "boolean";
  const open = controlled ? isOpen : internalOpen;
  const popupDismissed = localStorage.getItem("edubukPopupClosed") === "true";
  const isVisible = open && !popupDismissed;

  const closePopup = useCallback(() => {
    if (!controlled) {
      setInternalOpen(false);
    }

    onClose?.();
  }, [controlled, onClose]);

  useEffect(() => {
    if (!isVisible) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, closePopup]);

  return (
    <>
      {isVisible && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#02143f]/65 p-2 backdrop-blur-[3px] font-['Poppins',sans-serif] ${className}`}
          role="presentation"
          onMouseDown={closePopup}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edubuk-registration-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-[1060px] overflow-y-auto rounded-[28px] bg-white px-4 py-8 shadow-[0_30px_90px_rgba(2,20,63,0.34)] sm:px-8 sm:py-9"
          >
            {/* Close Button */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <button
              className="flex items-center gap-2 rounded-full bg-[#F4F6FC] px-4 py-2 text-sm text-[#f14419] underline-offset-2 hover:underline focus-visible:underline"
              type="button"
              onClick={() => {
                localStorage.setItem("edubukPopupClosed", "true");
                closePopup();
              }}
            >
              <X className="h-4 w-4" /> Do not show again
            </button>
            </div>
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              autoFocus
              onClick={closePopup}
              aria-label="Close Edubuk registration popup"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E8F4] bg-white text-2xl leading-none text-[#03257E] shadow-sm transition hover:bg-[#F4F6FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#03257E]"
            >
              <span aria-hidden="true">×</span>
            </button>
            </div>

            {/* Logo */}
            <div className="mb-3 flex w-full items-center justify-center">
              <img
                src={logoSrc}
                alt="Edubuk"
                className="h-[94px] w-[94px] object-contain sm:h-[110px] sm:w-[110px]"
              />
            </div>

            {/* Heading */}
            <h2
              id="edubuk-registration-title"
              className="mx-auto mb-2 max-w-[640px] text-center text-[clamp(17px,2.4vw,22px)] font-extrabold leading-[1.4] text-[#03257E]"
            >
              Two Tracks to get a Job, One Next step.
            </h2>

            <p className="mb-6 text-center text-[13px] text-[#8790aa] sm:mb-8">
              Pick the journey that matches where you are today
            </p>

            {/* Main Cards */}
            <section
              aria-label="Choose an Edubuk job track"
              className="relative mx-auto flex w-full max-w-[980px] flex-col overflow-visible rounded-[22px] border-[1.5px] border-[#E4E8F4] bg-white shadow-[0_18px_44px_rgba(3,37,126,0.09)] md:flex-row md:items-stretch"
            >
              {/* ================= CARD 1 ================= */}
              <a
                href="https://edubuktrujobs.com/register/super100batch-with-apoorva/no-ref"
                target="_blank"
                rel="noopener noreferrer"
                className={`${sharedCardClasses} rounded-t-[22px] text-[#F14419] hover:bg-[#fff8f5] md:rounded-l-[22px] md:rounded-tr-none`}
              >
                <span
                  className={`${badgeClasses} bg-[#fff0eb] text-[#F14419]`}
                >
                  Top 100 Jobs at Edubuk Group across India, UAE, and Singapore.
                </span>

                <h2 className={titleClasses}>
                  Edubuk is Hiring via its Super 100 talent Program
                </h2>

                <p className={descriptionClasses}>
                  Access top jobs at Edubuk Group across India, UAE, and
                  Singapore. Mentored by CFA charter holders and former Goldman
                  Sachs, D.E. Shaw and J.P. Morgan professionals.
                </p>

                <div className={detailsClasses}>
                  <Detail icon={<CalendarIcon />} label="Format">
                    Live, cohort-based sessions
                  </Detail>

                  <Detail icon={<PersonIcon />} label="Mentor">
                    Apoorva Bajaj, Co-Founder &amp; CEO
                  </Detail>

                  <Detail icon={<LayersIcon />} label="Focus">
                    AI, Blockchain, Cybersecurity, Data Analytics
                  </Detail>

                  <Detail icon={<MoneyIcon />} label="Price">
                    Free Until Placed with Nominal Exam fees
                  </Detail>

                  <Detail icon={<SeatsIcon />} label="Seats">
                    Strictly Limited to 100 Talented Learners
                  </Detail>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <Barcode bars={[14, 18, 10, 16, 8, 18, 12]} />

                  <span className="font-['Roboto_Mono',monospace] text-[10.5px] font-bold tracking-[0.4px] text-[#F14419]">
                    SEAT 001–100
                  </span>
                </div>

                {/* Button pushed to bottom */}
                <div className="mt-auto flex pt-6">
                  <span className={buttonClasses}>
                    Register Now in Super 100 at Edubuk
                  </span>
                </div>
              </a>

              {/* ================= DIVIDER ================= */}
              <div
                aria-hidden="true"
                className="relative h-0 shrink-0 border-t-2 border-dashed border-[#D8DEEE] md:h-auto md:w-0 md:border-l-2 md:border-t-0"
              >
                <span className="absolute left-1/2 top-[-11px] h-[22px] w-[22px] -translate-x-1/2 rounded-full border-[1.5px] border-[#E4E8F4] bg-white md:left-[-11px] md:top-[-11px] md:translate-x-0" />

                <span className="absolute bottom-[-11px] left-1/2 h-[22px] w-[22px] -translate-x-1/2 rounded-full border-[1.5px] border-[#E4E8F4] bg-white md:bottom-[-11px] md:left-[-11px] md:translate-x-0" />
              </div>

              {/* ================= CARD 2 ================= */}
              <a
                href="https://edubuktrujobs.com/jobs-mela"
                target="_blank"
                rel="noopener noreferrer"
                className={`${sharedCardClasses} rounded-b-[22px] text-[#006666] hover:bg-[#f5fbfb] md:rounded-bl-none md:rounded-r-[22px] md:pl-[52px]`}
              >
                <span
                  className={`${badgeClasses} bg-[#eaf5f5] text-[#006666]`}
                >
                  Pan India Placement Drive across Tech and Non-Tech Jobs
                </span>

                <h2 className={titleClasses}>
                  Edubuk&apos;s Jobs Mela
                </h2>

                <p className={descriptionClasses}>
                  A dedicated hiring drive connecting you with verified
                  employers actively recruiting across roles and experience
                  levels — from campus hires to working professionals.
                </p>

                <div className="mt-5 flex flex-col gap-[7px] border-t border-dashed border-[#E4E8F4] pt-3">
                  <Detail icon={<ChartIcon />} label="Scale">
                    25,000+ jobs with 5,000+ recruiters
                  </Detail>

                  <Detail icon={<BriefcaseIcon />} label="Format">
                    Completely virtual
                  </Detail>

                  <Detail
                    icon={<CheckIcon />}
                    label="Employers"
                    className="md:whitespace-nowrap"
                  >
                    Verified Companies, Live Openings, Inc Work from Home
                  </Detail>

                  <Detail icon={<LayersIcon />} label="Roles">
                    Tech and Non-Tech Across Sectors
                  </Detail>

                  <Detail icon={<ClockIcon />} label="Result">
                    Premium 1 week, Free 8 weeks
                  </Detail>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <Barcode bars={[10, 18, 20, 14, 20, 8, 16]} />

                  <span className="font-['Roboto_Mono',monospace] text-[10.5px] font-bold tracking-[0.4px] text-[#006666]">
                    ENTRY OPEN
                  </span>
                </div>

                {/* Button pushed to exactly the same bottom position */}
                <div className="mt-auto flex justify-between pt-6">
                  <span className={buttonClasses}>
                    Explore Job Openings
                  </span>
                </div>
              </a>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
