import { useGetLinkdeinProfile } from "@/api/scraper.api";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

import LinkedinProfileCvModal from "./LinkdeinProfileCv";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeaderButtonsProps {
  previewCV: boolean;
  setPreviewCV: (v: boolean) => void;
  cvData: any;
  showParsedModel: boolean;
  setShowParsedModel: (v: boolean) => void;
  cvFile: File | null;
  setCvFile: (f: File | null) => void;
  parseCV: () => void | Promise<void>;
  clearParsedCV: () => void;
  isParsing: boolean;
}

type ImportTab = "cv" | "linkedin";

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const CheckBadgeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LinkedInLogo = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const DropUpIcon = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const CheckCircleSmall = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#036665"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ─── Helper ───────────────────────────────────────────────────────────────────
const isValidLinkedIn = (url: string) =>
  /^https?:\/\/(www\.)?linkedin\.com\/[a-zA-Z0-9\-_%]+\/?/.test(url.trim());

// ─── Component ────────────────────────────────────────────────────────────────
const HeaderButtons = ({
  setPreviewCV,
  showParsedModel,
  setShowParsedModel,
  cvFile,
  setCvFile,
  parseCV,
  clearParsedCV,
  isParsing,
}: HeaderButtonsProps) => {
  const {
    getLinkdeinProfileData,
    cvData,
    isLoading: isLinkdeinImportLoading,
  } = useGetLinkdeinProfile();
  console.log("linkdein cvData is", cvData);
  const hasParsedCV = Boolean(
    typeof window !== "undefined" && localStorage.getItem("cvData"),
  );
  const [openLinkdeinProfileCV, setOpenLinkdeinProfileCV] =
    useState<boolean>(false);
  const [tab, setTab] = useState<ImportTab>("cv");
  const [isDragging, setIsDragging] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const linkedInValid = isValidLinkedIn(linkedInUrl);

  // Per-tab validation — CV tab needs a file, LinkedIn tab needs a valid URL
  const canSubmit =
    (tab === "cv" && !!cvFile) || (tab === "linkedin" && linkedInValid);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && /\.(pdf|doc|docx)$/i.test(file.name)) setCvFile(file);
  };

  const handleSubmit = async () => {
    if (tab === "linkedin") {
      if (!linkedInValid) {
        setUrlError("Please enter a valid LinkedIn profile URL.");
        return;
      }
      console.log("linkdein profile is", linkedInUrl);
      await getLinkdeinProfileData(linkedInUrl).then(() => {
        closeModal();
        setLinkedInUrl("");
        setOpenLinkdeinProfileCV(true);
      });
      setUrlError("");
      return toast.success("LinkedIn profile imported successfully.");
    }
    parseCV();
  };

  const closeModal = () => {
    setShowParsedModel(false);
    setCvFile(null);
    setLinkedInUrl("");
    setUrlError("");
    setTab("cv");
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes hb-slideup {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes hb-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes hb-spin {
          to { transform: rotate(360deg); }
        }
        .hb-animate-slideup { animation: hb-slideup 0.3s cubic-bezier(0.16,1,0.3,1); }
        .hb-animate-fadein  { animation: hb-fadein 0.2s ease; }
        .hb-spin { animation: hb-spin 0.7s linear infinite; display: inline-flex; }
      `}</style>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Preview button */}
        <button
          onClick={() => setPreviewCV(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 cursor-pointer transition-all duration-200 shadow-sm hover:border-[#036665] hover:text-[#036665] hover:-translate-y-px hover:shadow-md"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <EyeIcon />
          Preview CV
        </button>

        {/* Right side */}
        {hasParsedCV ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-[12px] font-medium text-green-700">
              <CheckBadgeIcon />
              CV Parsed
            </span>
            <button
              onClick={clearParsedCV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-[12px] font-medium text-rose-600 cursor-pointer transition-all duration-200 hover:bg-rose-100 hover:border-rose-300 hover:-translate-y-px"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <TrashIcon />
              Clear
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowParsedModel(true)}
            disabled={isParsing}
            className="inline-flex items-center gap-1.5 px-4 py-2 border-none rounded-lg text-[13px] font-medium text-white cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px hover:shadow-lg"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background:
                "linear-gradient(135deg, #024544 0%, #036665 55%, #048a89 100%)",
              boxShadow: "0 2px 10px rgba(3,102,101,0.35)",
            }}
          >
            <UploadCloudIcon />
            Import CV
          </button>
        )}
      </div>

      {/* ── Modal ── */}
      {showParsedModel && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center hb-animate-fadein"
          style={{
            background: "rgba(2,20,20,0.72)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="w-[92%] max-w-[460px] rounded-[18px] overflow-hidden hb-animate-slideup"
            style={{
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* ── Modal Header ── */}
            <div
              className="relative px-6 pt-[22px] pb-5"
              style={{
                background:
                  "linear-gradient(135deg, #011a1a 0%, #024544 45%, #036665 100%)",
              }}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-[22px] right-5 w-[30px] h-[30px] rounded-full flex items-center justify-center border-none cursor-pointer text-white transition-all duration-150"
                style={{ background: "rgba(255,255,255,0.12)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
              >
                <XIcon />
              </button>

              <p className="text-[10px] font-semibold tracking-widest uppercase text-teal-300 mb-1">
                Smart Autofill
              </p>
              <h2 className="text-[18px] font-bold text-white leading-snug mb-5">
                Import &amp; <span className="text-[#5dd4d3]">auto-fill</span>
                <br />
                your Trucv
              </h2>

              {/* Tabs */}
              <div
                className="flex gap-1 rounded-[10px] p-[3px]"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <button
                  onClick={() => setTab("cv")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 border-none cursor-pointer rounded-lg text-[12.5px] font-medium transition-all duration-200 ${
                    tab === "cv"
                      ? "bg-white text-[#036665] shadow-md"
                      : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  CV / Resume
                </button>
                <button
                  onClick={() => setTab("linkedin")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 border-none cursor-pointer rounded-lg text-[12.5px] font-medium transition-all duration-200 ${
                    tab === "linkedin"
                      ? "bg-white text-[#036665] shadow-md"
                      : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <LinkedInLogo size={13} />
                  LinkedIn Profile
                </button>
              </div>
            </div>

            {/* ── Modal Body ── */}
            {isLinkdeinImportLoading ? (
              <>
                <div className="px-[22px] pb-[22px] pt-4 bg-[#fafbff] flex flex-col items-center justify-center min-h-[220px]">
                  {/* Animated LinkedIn-branded orb */}
                  <div className="relative flex items-center justify-center mb-5">
                    {/* Outer pulse rings */}
                    <span
                      className="absolute w-16 h-16 rounded-full border border-[#036665] opacity-20"
                      style={{ animation: "hb-ring 2s ease-out infinite" }}
                    />
                    <span
                      className="absolute w-16 h-16 rounded-full border border-[#036665] opacity-10"
                      style={{ animation: "hb-ring 2s ease-out infinite 0.6s" }}
                    />
                    {/* Icon container */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg, #011a1a 0%, #036665 100%)",
                        animation: "hb-breathe 2.4s ease-in-out infinite",
                      }}
                    >
                      <LinkedInLogo size={22} color="#fff" />
                    </div>
                  </div>

                  {/* Text */}
                  <p
                    className="text-[13.5px] font-semibold text-slate-800 mb-1 text-center"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Importing your LinkedIn profile
                  </p>
                  <p
                    className="text-[12px] text-slate-400 text-center mb-4"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Extracting your details — just a moment…
                  </p>

                  {/* Animated progress dots / bar */}
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#036665]"
                        style={{
                          animation: "hb-bounce 1.2s ease-in-out infinite",
                          animationDelay: `${i * 0.15}s`,
                          opacity: 0.3,
                        }}
                      />
                    ))}
                  </div>

                  <style>{`
      @keyframes hb-ring {
        0%   { transform: scale(1);   opacity: 0.25; }
        100% { transform: scale(2.2); opacity: 0; }
      }
      @keyframes hb-breathe {
        0%, 100% { transform: scale(1);    box-shadow: 0 4px 18px rgba(3,102,101,0.35); }
        50%       { transform: scale(1.07); box-shadow: 0 6px 24px rgba(3,102,101,0.55); }
      }
      @keyframes hb-bounce {
        0%, 80%, 100% { transform: scaleY(1);   opacity: 0.3; }
        40%            { transform: scaleY(1.9); opacity: 1; }
      }
    `}</style>
                </div>
              </>
            ) : (
              <div className="px-[22px] pb-[22px] pt-4 bg-[#fafbff]">
                {/* ─ CV Tab ─ */}
                {tab === "cv" && (
                  <>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    />

                    {!cvFile ? (
                      <>
                        <div
                          onClick={() => fileRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          className={`mt-1 border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all duration-200 bg-white ${
                            isDragging
                              ? "border-[#036665] bg-[#f0fafa]"
                              : "border-slate-300 hover:border-[#036665] hover:bg-[#f0fafa]"
                          }`}
                        >
                          <div className="text-[#036665] opacity-65 mx-auto mb-2.5 flex justify-center">
                            <DropUpIcon />
                          </div>
                          <p className="text-[13.5px] font-semibold text-slate-800 mb-0.5">
                            Drop your CV here
                          </p>
                          <p className="text-[12px] text-slate-400">
                            or{" "}
                            <strong className="text-[#036665] font-semibold">
                              browse files
                            </strong>{" "}
                            from your device
                          </p>
                        </div>
                        <div className="flex gap-1.5 justify-center mt-3">
                          {["PDF", "DOC", "DOCX"].map((f) => (
                            <span
                              key={f}
                              className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-teal-50 text-[#036665]"
                              style={{ fontFamily: "'DM Mono', monospace" }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2.5 bg-[#f0fafa] border border-teal-200 rounded-xl px-3 py-2.5 mt-2.5">
                        <span className="text-[#036665] flex-shrink-0">
                          <FileIcon />
                        </span>
                        <span
                          className="flex-1 text-[12.5px] font-medium text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {cvFile.name}
                        </span>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">
                          {(cvFile.size / 1024).toFixed(0)} KB
                        </span>
                        <button
                          onClick={() => setCvFile(null)}
                          className="bg-transparent border-none cursor-pointer text-slate-400 flex p-0.5 transition-colors duration-150 hover:text-rose-500"
                        >
                          <XIcon />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* ─ LinkedIn Tab ─ */}
                {tab === "linkedin" && (
                  <>
                    <div className="bg-[#f0fafa] rounded-xl p-3 flex flex-col gap-2 mt-1">
                      {[
                        "Open your LinkedIn profile in a browser.",
                        "Copy the full URL from the address bar.",
                        "Paste it below — we'll extract your details instantly.",
                      ].map((text, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-[17px] h-[17px] rounded-full bg-[#036665] text-white text-[9.5px] font-bold flex items-center justify-center flex-shrink-0 mt-px">
                            {i + 1}
                          </span>
                          <span className="text-[12px] text-slate-600 leading-relaxed">
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="relative mt-3">
                      <input
                        type="url"
                        placeholder="https://www.linkedin.com/in/your-name"
                        value={linkedInUrl}
                        onChange={(e) => {
                          setLinkedInUrl(e.target.value);
                          if (urlError) setUrlError("");
                        }}
                        className={`w-full text-[12.5px] text-slate-800 bg-white rounded-xl py-[11px] px-2 outline-none transition-all duration-150 border ${
                          urlError
                            ? "border-rose-500 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)]"
                            : linkedInValid
                              ? "border-green-500 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)]"
                              : "border-slate-300 focus:border-[#036665] focus:shadow-[0_0_0_3px_rgba(3,102,101,0.1)]"
                        }`}
                        style={{
                          fontFamily: "'DM Mono', monospace",
                        }}
                      />
                      {linkedInValid && (
                        <span className="absolute right-[11px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center">
                          <CheckCircleSmall />
                        </span>
                      )}
                    </div>
                    {urlError && (
                      <p className="text-[11.5px] text-rose-600 mt-1.5">
                        {urlError}
                      </p>
                    )}
                  </>
                )}

                {/* Divider */}
                <div className="flex items-center gap-2 my-3.5 text-[11px] text-slate-300 font-medium">
                  <span className="flex-1 h-px bg-slate-200" />
                  auto-fill your sections
                  <span className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Submit button */}
                <button
                  disabled={!canSubmit || isParsing}
                  onClick={handleSubmit}
                  className="w-full py-3.5 border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 text-[13.5px] font-semibold text-white transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none hover:enabled:-translate-y-px"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background:
                      "linear-gradient(135deg, #011a1a 0%, #036665 100%)",
                    boxShadow:
                      !canSubmit || isParsing
                        ? "none"
                        : "0 3px 14px rgba(3,102,101,0.4)",
                  }}
                >
                  {isParsing ? (
                    <>
                      <span className="hb-spin">
                        <SpinnerIcon />
                      </span>
                      Processing…
                    </>
                  ) : tab === "cv" ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      </svg>
                      Parse &amp; Autofill CV
                    </>
                  ) : (
                    <>
                      <LinkedInLogo size={14} />
                      Import LinkedIn Profile
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!showParsedModel && openLinkdeinProfileCV && cvData && (
        <LinkedinProfileCvModal
          cvData={cvData}
          onClose={() => setOpenLinkdeinProfileCV(false)}
        />
      )}

      {/* {!showParsedModel && (
        <LinkedinProfileCvModal
          cvData={MOCK_CV_2}
          onClose={() => setOpenLinkdeinProfileCV(false)}
        />
      )} */}
    </div>
  );
};
// ─── MOCK DATA for preview ────────────────────────────────────────────────────
const MOCK_CV = {
  personal: {
    fullName: "Alexandra Chen",
    email: "alex.chen@email.com",
    phone: "+1 (555) 012-3456",
    city: "San Francisco, CA",
    profession: "employee",
    summary:
      "Full-stack engineer with 6+ years building scalable web products. Passionate about clean architecture and developer experience.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    imgUrl: "https://i.pravatar.cc/150?img=47",
  },
  educations: [
    {
      level: "B.Sc. Computer Science",
      institutionName: "UC Berkeley",
      boardNameOrDegree: "Bachelor of Science",
      gpa: "3.8",
      duration: { from: "2015-09-01", to: "2019-05-01" },
      status: "verified",
      isEmailSend: true,
      docUri: null,
    },
  ],
  skills: [
    { skillName: "React / Next.js", endoresBy: "0x1a2b3c4d5e6f" },
    { skillName: "Node.js", endoresBy: null },
    { skillName: "TypeScript", endoresBy: "0xdeadbeef1234" },
  ],
  experiences: [
    {
      jobRole: "Senior Frontend Engineer",
      companyName: "Stripe",
      description:
        "Led the redesign of the developer dashboard. Improved load time by 40%.",
      skills: "React, TypeScript, GraphQL",
      duration: { from: "2021-03-01", to: "2024-01-01" },
      status: "verified",
      isEmailSend: true,
      docUri: null,
      docHash: "",
    },
  ],
  awards: [
    {
      name: "Hackathon 1st Place",
      organisation: "TechCrunch Disrupt",
      description: "Built an AI-powered accessibility tool in 24 hrs.",
      duration: { from: "2022-10-01", to: null },
      status: "verified",
      isEmailSend: true,
      docUri: null,
    },
  ],
  projects: [
    {
      projectName: "OpenResume",
      projectUrl: "https://github.com",
      description:
        "Open-source resume builder with PDF export and ATS scoring.",
      skills: "React, Tailwind, PDF.js",
      duration: { from: "2023-01-01", to: "2023-06-01" },
    },
  ],
};
const MOCK_CV_2 = {
  personal: {
    fullName: "Vishakha Sadhwani",
    email: "connect.vishakha23@gmail.com",
    phone: "",
    city: "San Francisco",
    linkedin: "",
    github: "",
    imgUrl:
      "https://media.licdn.com/dms/image/v2/D4D03AQGmEBiv4UalJw/profile-displayphoto-crop_800_800/B4DZljOct2GkAI-/0/1758306356706?e=1775088000&v=beta&t=RgqorMCVxvbFek-wJg0vnNgFDPt3_U4UjbTEUTQiv3s",
    summary:
      "Results-oriented Cloud and AI Infrastructure Architect with a rich background in designing and implementing secure, scalable solutions across diverse cloud environments, including AWS, GCP, and Kubernetes. With experience at leading companies like NVIDIA and Google, I have successfully partnered with cross-functional teams to deliver AI/ML solutions. I am passionate about optimizing performance, ensuring cost efficiency, and providing insightful thought leadership in the tech community.",
  },

  educations: [
    {
      level: "Postgraduate",
      boardNameOrDegree: "Master's degree in Computer Engineering",
      institutionName: "University of Maryland",
      gpa: "",
      duration: { from: "2016-01-01", to: "2018-01-01" },
      selfAttested: false,
      docUri: "",
      issuerEmailId: "",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certification",
      boardNameOrDegree: "Graduate certificate in Software engineering",
      institutionName: "University of Maryland",
      gpa: "",
      duration: { from: "2016-01-01", to: "2017-01-01" },
      selfAttested: false,
      docUri: "",
      issuerEmailId: "",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Undergraduate",
      boardNameOrDegree:
        "Bachelor's degree in Electronics and Telecommunication engineering",
      institutionName: "Bhilai Institute of Technology (BIT), Durg",
      gpa: "",
      duration: { from: "2012-01-01", to: "2016-01-01" },
      selfAttested: false,
      docUri: "",
      issuerEmailId: "",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
  ],

  experiences: [
    {
      companyName: "NVIDIA",
      jobRole: "Sr. Solutions Architect (AI Inference)",
      duration: { from: "2025-10-01", to: "present" },
      skills:
        "AI inference, deep learning, performance optimization, resource efficiency",
      description:
        "Optimize inference workloads for performance and resource efficiency, Partner cross-functionally with engineering, product, data-science / ML teams and customers to define architecture, evaluate requirements, and deliver PoC or production-grade AI/ML solutions. Implement and manage infrastructure for AI inference including containerization/orchestration such as Kubernetes, GPU-orchestration, resource scheduling, monitoring/observability, CI/CD / MLOps. Participate in performance analysis, profiling and benchmarking of inference workloads.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Google",
      jobRole: "Sr. Cloud Architect, Strategic AI",
      duration: { from: "2024-10-01", to: "2025-10-01" },
      skills: "cloud architecture, AI workloads, GCP, customer collaboration",
      description:
        "Supporting strategic AI customers in designing and deploying scalable infrastructure for AI workloads on Google Cloud. Specializing in compute, storage, and network architecture to optimize performance and reliability for training and inference workloads. Delivering infrastructure solutions that align with customer goals from high-performance GPUs/TPUs to hybrid and multicloud setups.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Google",
      jobRole: "Cloud Architect",
      duration: { from: "2021-09-01", to: "2024-10-01" },
      skills:
        "cloud migration, integration strategies, architectural blueprints",
      description:
        "Identify and qualify business opportunities, identify key customer technical challenges and develop a strategy to resolve technical blockers. Recommend and document migration paths, integration strategies, and application architectures required to successfully implement complete solutions using best practices on Google Cloud. Assist infrastructure solutions management teams, contributing to solution and use case specific assets. Awarded the Google Cloud Club in 2024 for exceptional performance.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "O'Reilly",
      jobRole: "Author",
      duration: { from: "2024-05-01", to: "2025-03-01" },
      skills: "",
      description: "",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Amazon Web Services (AWS)",
      jobRole: "Cloud Engineer II | Deployment | CloudFormation SME",
      duration: { from: "2021-07-01", to: "2021-09-01" },
      skills: "CI/CD, AWS Code Pipeline, AWS CloudFormation, ECS, EKS",
      description:
        "Experience in infrastructure development and operations involving CI/CD services like AWS Code Pipeline, Code Build, Code Deploy, CloudFormation and containerized services like ECS and EKS. Advocated and strategized technical guidance to help plan and build solutions using best practices.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Amazon Web Services (AWS)",
      jobRole: "Cloud Engineer I - Deployment",
      duration: { from: "2020-04-01", to: "2021-06-01" },
      skills: "AWS deployment, AWS services",
      description: "",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Amazon Web Services (AWS)",
      jobRole: "Cloud Support Associate - Deployment",
      duration: { from: "2019-09-01", to: "2020-03-01" },
      skills: "AWS customer support, deployment",
      description: "",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Brightspot",
      jobRole: "DevOps Engineer",
      duration: { from: "2018-07-01", to: "2019-09-01" },
      skills: "AWS infrastructure, collaboration, backup mechanisms",
      description:
        "Managed and maintained 500+ Ubuntu Linux EC2 hosts across infrastructure supporting 50+ customer environments. Led migration from Chef-based infrastructure to containerized environments using Docker.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "University of Maryland College Park",
      jobRole: "Graduate Teaching Assistant",
      duration: { from: "2018-01-01", to: "2018-05-01" },
      skills: "",
      description: "",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "SwitchPitch",
      jobRole: "Software Developer Intern",
      duration: { from: "2017-10-01", to: "2017-12-01" },
      skills: "testing processes, regression testing",
      description:
        "Implemented testing processes in a startup ecosystem to discover design issues and development errors.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Financial Industry Regulatory Authority (FINRA)",
      jobRole: "Software Engineer Intern",
      duration: { from: "2017-05-01", to: "2017-08-01" },
      skills: "Baking and Bootstrap, AWS CLI, migration",
      description:
        "Created and tested Baking and Bootstrap scripts for customizing application server (EC2) using AWS CLI.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Stamp at University of Maryland, College Park",
      jobRole: "Office Assistant",
      duration: { from: "2016-08-01", to: "2017-05-01" },
      skills: "",
      description:
        "Assisted with administration of Pepsi Enhancement Funding and University Awards Program.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
    {
      companyName: "Bhilai Steel Plant",
      jobRole: "Industrial Engineering Intern",
      duration: { from: "2015-06-01", to: "2015-07-01" },
      skills: "",
      description:
        "Implementation of PID controller to control top-level pressure of Blast furnace.",
      selfAttested: false,
      isEmailSend: false,
      docUri: "",
      issuerEmailId: "",
      verified: false,
      status: "pending",
    },
  ],

  skills: [
    {
      skillName: "Google BigQuery",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Cloud deploy",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Cloud build",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Google Kubernetes Engine (GKE)",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Amazon EC2",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "AWS CodeBuild",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "AWS CodeDeploy",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "AWS CodePipeline",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Amazon ECS",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Amazon EKS",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "AWS Elastic Beanstalk",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "AWS CloudFormation",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Cloud Security",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Google Cloud Platform (GCP)",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Git",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Anthos",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Google Kubernetes Engine",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Java",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "AngularJS",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Amazon Web Services (AWS)",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Spring Framework",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Hibernate",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "SQL",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Material Design",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "HTML",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "JavaScript",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "C++",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
    {
      skillName: "Python",
      level: "intermediate",
      selfAttested: false,
      endoresBy: "",
      endoresThrough: "",
    },
  ],

  projects: [
    {
      projectName: "Predicting House Prices",
      projectUrl: "",
      duration: { from: "2016-11-01", to: "present" },
      skills: "",
      description:
        "Tuning the data by creating bins for categorical variables and applying PCA for numerical variables. Implementing Linear Regression, followed by Bagging Regression to improve efficiency.",
      selfAttested: false,
    },
    {
      projectName: "Smart – Door Lock Using Fingerprint Sensor and Adafruit IO",
      projectUrl: "",
      duration: { from: "2016-10-01", to: "present" },
      skills: "",
      description:
        "Developed a working prototype of a smart door lock that can be controlled with fingerprint of the user. Implemented and Programmed Arduino Uno board to detect and store fingerprint on cloud through Adafruit IO platform using ESP8266 Wifi module.",
      selfAttested: false,
    },
    {
      projectName: "AKO- Learning Management System",
      projectUrl: "https://github.com/nburuca/ako",
      duration: { from: "2017-09-01", to: "2017-12-01" },
      skills: "",
      description:
        "Implemented an Email Messaging System in Spring Boot which facilitated communication between students. Derived a communication layer in AngularJS to ensure seamless interaction with server. Designed UI screens using Angular Material to model components for learning management system.",
      selfAttested: false,
    },
    {
      projectName: "Design and Analysis of Cloud test environment using AWS",
      projectUrl: "",
      duration: { from: "2017-08-01", to: "2017-09-01" },
      skills: "",
      description:
        "Created a secure Virtual Private Cloud (VPC) with auto-scaling and load balancing. Provided controlled access to users in group using Identity and Access Management (IAM). Created an Elastic Cloud Compute (EC2) instance and monitored applications running in it using CloudWatch.",
      selfAttested: false,
    },
    {
      projectName:
        "Direct Term Deposit Enrollment in Online Banking Initiative",
      projectUrl: "",
      duration: { from: "2016-11-01", to: "2016-12-01" },
      skills: "",
      description:
        "Analyzed the Data of Portuguese National Bank using data mining concepts to determine the outcome of the campaign. Developed classification models using Python and drafted an analysis report for stakeholders of the bank that increased the number of term deposits.",
      selfAttested: false,
    },
    {
      projectName: "Polynomial Evaluation Actor using LWDF Model",
      projectUrl: "",
      duration: { from: "2016-10-01", to: "2016-12-01" },
      skills: "",
      description:
        "Designed and implemented a system for computing polynomials. Performed simulations for model development, unit testing, and functional validation of the system.",
      selfAttested: false,
    },
    {
      projectName: "LWDF for the CD to DAT Sample Rate Conversion application",
      projectUrl: "",
      duration: { from: "2016-09-01", to: "2016-10-01" },
      skills: "",
      description:
        "Developed and Implemented an application of CD to DAT sampling rate conversion using C. Built 3 unit test Suites in Dice with different Interpolation and Decimation rates.",
      selfAttested: false,
    },
    {
      projectName: "Wireless Mobile Detector Unit",
      projectUrl: "",
      duration: { from: "2016-01-01", to: "2016-04-01" },
      skills: "",
      description:
        "Designed and simulated a mobile detector module using Proteus software which tracks the RF signals generated by cell phones. Implemented it with RF433 transmitter-receiver pair to make it wireless.",
      selfAttested: false,
    },
    {
      projectName: "Precision Exam Center Sniffer",
      projectUrl: "",
      duration: { from: "2015-07-01", to: "2015-09-01" },
      skills: "",
      description:
        "Designed a prototype to control and monitor through remote locations by detecting the presence of mobile phones in restricted areas. The device operates in radio frequencies.",
      selfAttested: false,
    },
    {
      projectName: "Automatic switch controller using VHDL Programming",
      projectUrl: "",
      duration: { from: "2014-09-01", to: "2014-12-01" },
      skills: "",
      description:
        "Designed and Hardware implemented a switch using logic gates in Xilinx software.",
      selfAttested: false,
    },
  ],

  awards: [
    {
      level: "Certificate",
      name: "NVIDIA-Certified Professional: AI Operations",
      organisation: "NVIDIA",
      duration: { from: "2026-02-01", to: "2028-02-01" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri:
        "https://www.credly.com/badges/34654825-7b63-4c37-a35d-abca80ee9e83/public_url",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certificate",
      name: "NVIDIA-Certified Associate: AI Infrastructure and Operations",
      organisation: "NVIDIA",
      duration: { from: "2026-02-01", to: "2028-02-01" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri:
        "https://www.credly.com/badges/f8e5167d-1d56-4d75-81f6-c9a6cd52d83d",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certificate",
      name: "Professional Cloud Architect Certification",
      organisation: "Google",
      duration: { from: "2022-01-01", to: "2026-11-01" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri:
        "https://www.credly.com/badges/46eb7ac4-fbc5-45ee-9cfa-74ae5d3adeaf/linked_in_profile",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certificate",
      name: "Speaker",
      organisation: "WomenTech Network",
      duration: { from: "2024-04-01", to: "" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri:
        "https://www.womentech.net/certificate-speaker/Vishakha/Sadhwani?_sc=MjU5OTUyMCMxMzMyNzY%3D",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certificate",
      name: "CKS: Certified Kubernetes Security Specialist",
      organisation: "The Linux Foundation",
      duration: { from: "2022-12-01", to: "2024-12-01" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri:
        "https://www.credly.com/badges/b9289904-c910-47fc-815e-b261423a022f/linked_in_profile",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certificate",
      name: "CKA: Certified Kubernetes Administrator",
      organisation: "The Linux Foundation",
      duration: { from: "2022-11-01", to: "" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri:
        "https://www.credly.com/badges/19d6983e-0753-4464-9e64-793eaae138ff/linked_in",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certificate",
      name: "CKAD: Certified Kubernetes Application Developer",
      organisation: "The Linux Foundation",
      duration: { from: "2022-09-01", to: "2025-09-01" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri:
        "https://www.credly.com/badges/5d035e80-f16c-4039-9dfb-163c304e423f/linked_in_profile",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certificate",
      name: "AWS Certified Solutions Architect – Associate",
      organisation: "Amazon Web Services (AWS)",
      duration: { from: "2021-05-01", to: "2024-05-01" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri:
        "https://www.credly.com/badges/b5535326-c9f4-4907-ad26-978c220271dd",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
    {
      level: "Certificate",
      name: "Professional Cloud DevOps Engineer",
      organisation: "Google",
      duration: { from: "2022-02-01", to: "2026-02-01" },
      description: "",
      selfAttested: false,
      issuerEmailId: "",
      docUri: "https://www.credential.net/8bd804cc-3e91-421e-a9aa-21e2e07328a7",
      isEmailSend: false,
      verified: false,
      status: "pending",
    },
  ],
};

export default HeaderButtons;
