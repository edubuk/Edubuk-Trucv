import { useGetLinkdeinProfile } from "@/api/scraper.api";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

import LinkedinProfileCvModal from "./LinkdeinProfileCv";
import { StepCard } from "@/CvBuilder/StepCard";
import { autoSave, autoSaveParsedData } from "@/api/autoSave.apis";
import { Files, Trash2 } from "lucide-react";

//import AllImportedLinkdeinProfilesModel from "./AllImportedLinkdeinProfilesModels";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeaderButtonsProps {
  step: number;
  setStep: (step: number) => void;
  previewCV: boolean;
  setPreviewCV: (v: boolean) => void;
  cvData: any;
  showParsedModel: boolean;
  setShowParsedModel: (v: boolean) => void;
  cvFile: File | null;
  setCvFile: (f: File | null) => void;
  parseCV: () => boolean | Promise<boolean>;
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
  step,
  setStep,
  showParsedModel,
  setShowParsedModel,
  cvFile,
  setCvFile,
  parseCV,
  isParsing,
}: HeaderButtonsProps) => {
  const {
    getLinkdeinProfileData,
    cvData,
    isLoading: isLinkdeinImportLoading,
  } = useGetLinkdeinProfile();
  // const { profiles, isLoading: isAllImportedProfilesLoading } =
  //   useGetALLImportedProfiles();
  console.log("linkdein cvData is", cvData);
  // const hasParsedCV = Boolean(
  //   typeof window !== "undefined" && localStorage.getItem("cvData"),
  // );
  const [openLinkdeinProfileCV, setOpenLinkdeinProfileCV] =
    useState<boolean>(false);
  const [tab, setTab] = useState<ImportTab>("cv");
  const [isDragging, setIsDragging] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDataSaving, setIsDataSaving] = useState(false);
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
    const success = parseCV();
    if (!success) {
      toast.error("Failed to parse CV");
    }
  };

  const closeModal = () => {
    setShowParsedModel(false);
    setCvFile(null);
    setLinkedInUrl("");
    setUrlError("");
    setTab("cv");
  };

  const saveLinkedInData = async () => {
    try {
      setIsDataSaving(true);
      const data = localStorage.getItem("linkedInCvData");
      const cvData = JSON.parse(data || "{}");
      const savedData = await autoSave(cvData);
      if (savedData?.success) {
        toast.success("Data saved successfully");
        localStorage.removeItem("linkedInCvData");
        window.location.reload();
      } else {
        toast.error("Something went wrong...");
      }
    } catch (error) {
      toast.error("Something went wrong...");
    } finally {
      setIsDataSaving(false);
    }
  };
  const saveParsedData = async () => {
    try {
      setIsDataSaving(true);
      const data = localStorage.getItem("cvData");
      const cvData = JSON.parse(data || "{}");
      const savedData = await autoSaveParsedData(cvData);
      if (savedData?.success) {
        toast.success("Data saved successfully");
        localStorage.removeItem("cvData");
        window.location.reload();
      } else {
        toast.error("Something went wrong...");
      }
    } catch (error) {
      toast.error("Something went wrong...");
    } finally {
      setIsDataSaving(false);
    }
  };

  return (
    <StepCard
      index={1}
      title="Smart Autofill"
      icon={FileIcon}
      open={step === 1}
      onToggle={() => setStep(step === 1 ? 0 : 1)}
    >
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

        {/* ── Modal ── */}
        {!showParsedModel && (
          <div
            className="w-full flex items-center justify-center hb-animate-fadein bg-white"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="w-full overflow-hidden hb-animate-slideup">
              {/* ── Modal Header ── */}
              <div className="flex flex-col w-full px-6 pt-[22px] pb-5 bg-[#03257e]/5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[#03257e] mb-1">
                  Smart Autofill
                </p>

                <h2 className="text-[18px] font-bold text-[#006666] leading-snug mb-5">
                  Import &amp; <span className="text-[#03257e]">auto-fill</span>
                  <br />
                  your Trucv
                </h2>

                {/* Tabs */}
                <div className="flex gap-1 rounded-[10px] p-[3px] bg-[#03257e]/10">
                  <button
                    onClick={() => setTab("cv")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 ${
                      tab === "cv"
                        ? "bg-white text-[#006666] shadow"
                        : "text-[#03257e] hover:bg-white/40"
                    }`}
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
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 ${
                      tab === "linkedin"
                        ? "bg-white text-[#006666] shadow"
                        : "text-[#03257e] hover:bg-white/40"
                    }`}
                  >
                    <LinkedInLogo
                      size={13}
                      color={tab === "linkedin" ? "#006666" : "#03257e"}
                    />
                    LinkedIn Profile
                  </button>
                </div>
              </div>

              {/* ── Modal Body ── */}
              {isLinkdeinImportLoading ? (
                <div className="px-[22px] pb-[22px] pt-4 bg-[#03257e]/5 flex flex-col items-center justify-center min-h-[220px]">
                  <div className="relative flex items-center justify-center mb-5">
                    <span
                      className="absolute w-16 h-16 rounded-full border border-[#006666] opacity-20"
                      style={{ animation: "hb-ring 2s ease-out infinite" }}
                    />

                    <span
                      className="absolute w-16 h-16 rounded-full border border-[#006666] opacity-10"
                      style={{ animation: "hb-ring 2s ease-out infinite 0.6s" }}
                    />

                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg,#03257e 0%,#006666 100%)",
                        animation: "hb-breathe 2.4s ease-in-out infinite",
                      }}
                    >
                      <LinkedInLogo size={22} color="#fff" />
                    </div>
                  </div>

                  <p className="text-[13.5px] font-semibold text-[#03257e] mb-1 text-center">
                    Importing your LinkedIn profile
                  </p>

                  <p className="text-[12px] text-gray-500 text-center mb-4">
                    Extracting your details — just a moment…
                  </p>

                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#006666]"
                        style={{
                          animation: "hb-bounce 1.2s ease-in-out infinite",
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-[22px] pb-[22px] pt-4 bg-[#03257e]/5">
                  {/* ─ CV Tab ─ */}
                  {tab === "cv" &&
                    (localStorage.getItem("cvData") ? (
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          disabled={isDataSaving}
                          onClick={saveParsedData}
                          className="px-3 py-2 rounded-lg flex items-center gap-2 text-white transition disabled:opacity-40"
                          style={{
                            background:
                              "linear-gradient(135deg,#03257e 0%,#006666 100%)",
                          }}
                        >
                          {isDataSaving ? "Saving..." : "Save Data for CV"}
                        </button>

                        <button
                          className="flex items-center justify-center gap-1 text-[#f14419] border border-[#f14419] rounded-lg px-3 py-2"
                          onClick={() => {
                            localStorage.removeItem("cvData");
                            window.location.reload();
                          }}
                        >
                          <Trash2 size={16} />
                          Clear CV Data
                        </button>
                      </div>
                    ) : (
                      localStorage.getItem("linkedInCvData") ? 
                      (
                        <div className="flex flex-col justify-center items-center gap-2">
                          <span className="text-[#03257e] font-bold text-center">LinkedIn CV Data Available. If You want to import cv please clear linkedin existing data.</span>
                          <button
                            className="flex items-center justify-center gap-1 text-[#f14419] border border-[#f14419] rounded-lg px-3 py-2"
                            onClick={() => {
                              localStorage.removeItem("linkedInCvData");
                              window.location.reload();
                            }}
                          >
                            <Trash2 size={16} />
                            Clear LinkedIn CV Data
                          </button>
                        </div>
                      ):
                      <>
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) =>
                            setCvFile(e.target.files?.[0] ?? null)
                          }
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
                              className={`mt-1 border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition bg-white ${
                                isDragging
                                  ? "border-[#006666] bg-[#006666]/5"
                                  : "border-gray-300 hover:border-[#006666] hover:bg-[#006666]/5"
                              }`}
                            >
                              <div className="text-[#006666] opacity-70 mx-auto mb-2 flex justify-center">
                                <DropUpIcon />
                              </div>

                              <p className="text-[13.5px] font-semibold text-[#03257e]">
                                Drop your CV here
                              </p>

                              <p className="text-[12px] text-gray-500">
                                or{" "}
                                <strong className="text-[#006666]">
                                  browse files
                                </strong>
                              </p>
                            </div>

                            <div className="flex gap-1.5 justify-center mt-3">
                              {["PDF", "DOC", "DOCX"].map((f) => (
                                <span
                                  key={f}
                                  className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-[#006666]/10 text-[#006666]"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 bg-[#006666]/5 border border-[#006666]/30 rounded-xl px-3 py-2.5 mt-2">
                            <span className="text-[#006666]">
                              <FileIcon />
                            </span>

                            <span className="flex-1 text-[12.5px] font-medium text-[#03257e]">
                              {cvFile.name}
                            </span>

                            <span className="text-[11px] text-gray-500">
                              {(cvFile.size / 1024).toFixed(0)} KB
                            </span>

                            <button
                              onClick={() => setCvFile(null)}
                              className="text-gray-400 hover:text-[#f14419]"
                            >
                              <XIcon />
                            </button>
                          </div>
                        )}
                      </>
                    ))}

                  {/* ─ LinkedIn Tab ─ */}
                  {tab === "linkedin" &&
                    (localStorage.getItem("linkedInCvData") ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          className="bg-[#006666] text-white px-4 py-2 rounded-lg flex items-center gap-1"
                          onClick={() => setOpenLinkdeinProfileCV(true)}
                        >
                          <EyeIcon />
                          Preview LinkedIn Data
                        </button>

                        <button
                          disabled={isDataSaving}
                          onClick={saveLinkedInData}
                          className="px-3 py-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold text-white transition disabled:opacity-45"
                          style={{
                            background:
                              "linear-gradient(135deg,#03257e 0%,#006666 100%)",
                          }}
                        >
                          {isDataSaving ? "Saving..." : "Save Data for CV"}
                        </button>

                        <button
                          className="flex items-center justify-center gap-1 text-[#f14419] border border-[#f14419] rounded-lg px-3 py-2"
                          onClick={() => {
                            localStorage.removeItem("linkedInCvData");
                            window.location.reload();
                          }}
                        >
                          <Trash2 size={16} />
                          Clear CV Data
                        </button>
                      </div>
                      <p className="text-[#03257e] text-center"><span className="font-bold text-[#f14419]">Note:</span> All fetched data may not be accurate and complete, so please verify and update each saved field after saving it.</p>
                      </div>
                    ) : (
                      localStorage.getItem("cvData") ? 
                      (
                        <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex flex-col justify-center items-center gap-2">
                          <span className="text-[#03257e] font-bold text-center">Parsed CV Data Available. If You want to import CV data from LinkedIn please clear existing parsed CV data.</span>
                          <button
                            className="flex items-center justify-center gap-1 text-[#f14419] border border-[#f14419] rounded-lg px-3 py-2"
                            onClick={() => {
                              localStorage.removeItem("cvData");
                              window.location.reload();
                            }}
                          >
                            <Trash2 size={16} />
                            Clear Parsed CV Data
                          </button>
                        </div>
                        <p className="text-[#03257e] text-center"><span className="font-bold text-[#f14419]">Note:</span> All fetched data may not be accurate and complete, so please verify and update each saved field after saving it.</p>
                        </div>

                      ):
                      <>
                        <div className="bg-[#006666]/5 border border-[#006666]/20 rounded-xl p-3 flex flex-col gap-2 mt-1">
                          {[
                            "Open your LinkedIn profile in a browser.",
                            "Copy the full URL from the address bar.",
                            "Paste it below — we'll extract your details instantly.",
                          ].map((text, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="w-[17px] h-[17px] rounded-full bg-[#006666] text-white text-[9.5px] font-bold flex items-center justify-center mt-px">
                                {i + 1}
                              </span>
                              <span className="text-[12px] text-gray-600 leading-relaxed">
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
                            className={`w-full text-[12.5px] text-[#03257e] bg-white rounded-xl py-[11px] px-3 outline-none transition border ${
                              urlError
                                ? "border-[#f14419]"
                                : linkedInValid
                                  ? "border-[#006666]"
                                  : "border-gray-300 focus:border-[#006666]"
                            }`}
                          />

                          {linkedInValid && (
                            <span className="absolute right-[11px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#006666] text-white flex items-center justify-center">
                              <CheckCircleSmall />
                            </span>
                          )}
                        </div>

                        {urlError && (
                          <p className="text-[11.5px] text-[#f14419] mt-1.5">
                            {urlError}
                          </p>
                        )}
                      </>
                    ))}

                  {/* Divider */}
                  <div className="flex items-center gap-2 my-4 text-[11px] text-gray-400">
                    <span className="flex-1 h-px bg-gray-200" />
                    auto-fill your sections
                    <span className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Submit */}
                  {isParsing &&
                  <div className="px-[22px] pb-[22px] pt-4 bg-[#03257e]/5 flex flex-col items-center justify-center min-h-[220px]">
                  <div className="relative flex items-center justify-center mb-5">
                    <span
                      className="absolute w-16 h-16 rounded-full border border-[#006666] opacity-20"
                      style={{ animation: "hb-ring 2s ease-out infinite" }}
                    />

                    <span
                      className="absolute w-16 h-16 rounded-full border border-[#006666] opacity-10"
                      style={{ animation: "hb-ring 2s ease-out infinite 0.6s" }}
                    />

                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg,#03257e 0%,#006666 100%)",
                        animation: "hb-breathe 2.4s ease-in-out infinite",
                      }}
                    >
                      <Files size={22} color="#fff" />
                    </div>
                  </div>

                  <p className="text-[13.5px] font-semibold text-[#03257e] mb-1 text-center">
                    Parsing your uploaded CV
                  </p>

                  <p className="text-[12px] text-gray-500 text-center mb-4">
                    Extracting your details — just a moment…
                  </p>

                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#006666]"
                        style={{
                          animation: "hb-bounce 1.2s ease-in-out infinite",
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                  }
                  {!localStorage.getItem("cvData") &&
                    !localStorage.getItem("linkedInCvData") && (
                      <button
                        disabled={!canSubmit || isParsing}
                        onClick={handleSubmit}
                        className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-[13.5px] font-semibold text-white transition disabled:opacity-40"
                        style={{
                          background:
                            "linear-gradient(135deg,#03257e 0%,#006666 100%)",
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
                          <>Parse &amp; Autofill CV</>
                        ) : (
                          <>
                            <LinkedInLogo size={14} />
                            Import LinkedIn Profile
                          </>
                        )}
                      </button>
                    )}
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
      </div>
    </StepCard>
  );
};

export default HeaderButtons;
