import { useGetLinkdeinProfile } from "@/api/scraper.api";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

import LinkedinProfileCvModal from "./LinkdeinProfileCv";
import { StepCard } from "@/CvBuilder/StepCard";
import { autoSave, autoSaveParsedData } from "@/api/autoSave.apis";
import {
  AlertTriangle,
  Check,
  Eye,
  FileText,
  Files,
  Link2,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

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

// ─── Helper ───────────────────────────────────────────────────────────────────
const isValidLinkedIn = (url: string) =>
  /^https?:\/\/(www\.)?linkedin\.com\/[a-zA-Z0-9\-_%]+\/?/.test(url.trim());

const AvailableDataPanel = ({
  title,
  description,
  isSaving,
  onSave,
  onClear,
  onPreview,
}: {
  title: string;
  description: string;
  isSaving: boolean;
  onSave: () => void;
  onClear: () => void;
  onPreview?: () => void;
}) => (
  <div className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-center sm:p-5">
    <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200">
      <Check className="size-6" />
    </span>
    <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
    <p className="mt-1 max-w-lg text-xs leading-5 text-slate-600">{description}</p>
    <div className="mt-5 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
      {onPreview && (
        <button type="button" onClick={onPreview} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold leading-5 text-slate-700 transition hover:border-[#006666] hover:text-[#006666] sm:w-auto sm:text-sm">
          <Eye className="size-4 shrink-0" /> <span>Preview data</span>
        </button>
      )}
      <button type="button" disabled={isSaving} onClick={onSave} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#03257e] px-4 py-2 text-xs font-semibold leading-5 text-white transition hover:bg-[#006666] disabled:opacity-50 sm:w-auto sm:text-sm">
        <Save className="size-4 shrink-0" /> <span>{isSaving ? "Saving…" : "Save to CV"}</span>
      </button>
      <button type="button" onClick={onClear} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold leading-5 text-red-600 transition hover:bg-red-50 sm:w-auto sm:text-sm">
        <Trash2 className="size-4 shrink-0" /> <span>Clear data</span>
      </button>
    </div>
    <div className="mt-5 flex w-full max-w-xl items-start gap-3 rounded-xl border border-amber-300 bg-amber-100 px-3 py-3 text-left shadow-sm sm:px-4">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
        <AlertTriangle className="size-4" />
      </span>
      <p className="text-xs font-medium leading-5 text-amber-950">
        <strong className="block font-bold">Important note</strong>
        Imported data may be incomplete. Review every field after saving.
      </p>
    </div>
  </div>
);

const ImportConflictPanel = ({
  message,
  clearLabel,
  onClear,
}: {
  message: string;
  clearLabel: string;
  onClear: () => void;
}) => (
  <div className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-center sm:p-5">
    <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm ring-1 ring-amber-200">
      <AlertTriangle className="size-5" />
    </span>
    <h3 className="mt-4 text-base font-bold text-slate-900">Existing import found</h3>
    <p className="mt-1 max-w-lg text-xs leading-5 text-slate-600">{message}</p>
    <button type="button" onClick={onClear} className="mt-5 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold leading-5 text-red-600 transition hover:bg-red-50 sm:w-auto sm:text-sm">
      <Trash2 className="size-4 shrink-0" /> <span>{clearLabel}</span>
    </button>
  </div>
);

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
  const hasParsedCV = Boolean(
    typeof window !== "undefined" && localStorage.getItem("cvData"),
  );
  const hasLinkedInData = Boolean(
    typeof window !== "undefined" && localStorage.getItem("linkedInCvData"),
  );

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
      icon={Sparkles}
      open={step === 1}
      onToggle={() => setStep(step === 1 ? 0 : 1)}
    >
      {!showParsedModel && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-[#f5f9ff] to-[#f2fbf9] p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#03257e]">
                  <Sparkles className="size-5" />
                  <h2 className="text-base font-bold leading-6 sm:text-xl">Import your existing profile</h2>
                </div>
                <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-600">
                  Upload a resume or use LinkedIn to fill your CV details automatically.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm lg:w-[360px]">
                <button
                  type="button"
                  onClick={() => setTab("cv")}
                  className={`flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold leading-4 transition sm:gap-2 sm:px-3 sm:text-sm ${tab === "cv" ? "bg-[#03257e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <FileText className="size-4 shrink-0" />
                  <span className="min-w-0">CV / Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("linkedin")}
                  className={`flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold leading-4 transition sm:gap-2 sm:px-3 sm:text-sm ${tab === "linkedin" ? "bg-[#006666] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <LinkedInLogo size={15} color={tab === "linkedin" ? "white" : "#64748b"} />
                  <span className="min-w-0">LinkedIn</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {isLinkdeinImportLoading || isParsing ? (
              <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#006666]/15 bg-gradient-to-br from-[#f5f9ff] via-white to-[#f2fbf9] px-4 text-center sm:min-h-[300px] sm:px-6">
                <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#03257e]/5 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 size-52 rounded-full bg-[#006666]/10 blur-3xl" />

                <div className="relative flex items-center justify-center">
                  <div className="flex size-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-[#03257e] to-[#006666] text-white shadow-xl shadow-[#03257e]/20">
                    {isParsing ? <Files className="size-6" /> : <LinkedInLogo size={23} />}
                  </div>
                </div>

                <p className="mt-5 text-base font-bold text-slate-900">
                  {isParsing ? "Parsing your CV" : "Importing your LinkedIn profile"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {isParsing
                    ? "Reading your document and organizing each CV section."
                    : "Fetching your profile and organizing your professional details."}
                </p>

                <div className="mt-5 flex items-center gap-2" aria-label="Import in progress">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="size-2 animate-bounce rounded-full bg-[#006666]"
                      style={{ animationDelay: `${dot * 160}ms` }}
                    />
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[#03257e] shadow-sm ring-1 ring-slate-200">Reading</span>
                  <span>•</span>
                  <span>Extracting</span>
                  <span>•</span>
                  <span>Organizing</span>
                </div>
              </div>
            ) : tab === "cv" ? (
              hasParsedCV ? (
                <AvailableDataPanel
                  title="Your CV data is ready"
                  description="Save the imported information, then review each field for accuracy."
                  isSaving={isDataSaving}
                  onSave={saveParsedData}
                  onClear={() => {
                    localStorage.removeItem("cvData");
                    window.location.reload();
                  }}
                />
              ) : hasLinkedInData ? (
                <ImportConflictPanel
                  message="LinkedIn data is already available. Clear it before importing a resume."
                  clearLabel="Clear LinkedIn data"
                  onClear={() => {
                    localStorage.removeItem("linkedInCvData");
                    window.location.reload();
                  }}
                />
              ) : (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
                  />
                  {!cvFile ? (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`group flex min-h-[230px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition sm:min-h-[250px] sm:px-6 ${isDragging ? "border-[#006666] bg-[#f2fbf9]" : "border-slate-300 bg-slate-50 hover:border-[#006666] hover:bg-[#f2fbf9]"}`}
                    >
                      <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-[#03257e] shadow-sm ring-1 ring-slate-200 transition group-hover:-translate-y-0.5 group-hover:text-[#006666]">
                        <UploadCloud className="size-7" />
                      </span>
                      <span className="mt-4 text-sm font-bold text-slate-900 sm:text-base">Drop your CV here</span>
                      <span className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">or click to browse from your device</span>
                      <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#03257e] px-4 py-2 text-xs font-semibold text-white group-hover:bg-[#006666]">
                        Choose a file
                      </span>
                      <span className="mt-3 text-xs text-slate-400">PDF, DOC, or DOCX</span>
                    </button>
                  ) : (
                    <div className="flex min-h-[150px] flex-col justify-center rounded-2xl border border-[#006666]/25 bg-[#f2fbf9] p-4 sm:p-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#006666] shadow-sm ring-1 ring-[#006666]/10">
                          <FileText className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="max-w-full truncate text-xs font-bold text-slate-900 sm:text-sm">{cvFile.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{(cvFile.size / 1024).toFixed(0)} KB · Ready to import</p>
                        </div>
                        <button type="button" onClick={() => setCvFile(null)} aria-label="Remove selected file" className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-red-600">
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )
            ) : hasLinkedInData ? (
              <AvailableDataPanel
                title="Your LinkedIn data is ready"
                description="Preview the imported profile or save it to your CV."
                isSaving={isDataSaving}
                onSave={saveLinkedInData}
                onPreview={() => setOpenLinkdeinProfileCV(true)}
                onClear={() => {
                  localStorage.removeItem("linkedInCvData");
                  window.location.reload();
                }}
              />
            ) : hasParsedCV ? (
              <ImportConflictPanel
                message="Parsed CV data is already available. Clear it before importing from LinkedIn."
                clearLabel="Clear parsed CV data"
                onClear={() => {
                  localStorage.removeItem("cvData");
                  window.location.reload();
                }}
              />
            ) : (
              <div className="mx-auto max-w-2xl py-2">
                <div className="rounded-2xl border border-[#0a66c2]/15 bg-[#0a66c2]/[0.04] p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0a66c2] text-white shadow-sm">
                      <LinkedInLogo size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Import from your public profile</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">Copy the full URL from your LinkedIn profile and paste it below.</p>
                    </div>
                  </div>
                </div>
                <label htmlFor="linkedin-profile-url" className="mt-5 block text-xs font-semibold text-slate-700">LinkedIn profile URL</label>
                <div className="relative mt-2">
                  <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="linkedin-profile-url"
                    type="url"
                    placeholder="https://www.linkedin.com/in/your-name"
                    value={linkedInUrl}
                    onChange={(event) => {
                      setLinkedInUrl(event.target.value);
                      if (urlError) setUrlError("");
                    }}
                    className={`h-12 w-full rounded-xl border bg-slate-50 pl-10 pr-11 text-sm text-slate-800 outline-none transition ${urlError ? "border-red-400 ring-1 ring-red-200" : linkedInValid ? "border-[#006666] ring-1 ring-[#006666]/20" : "border-slate-200 focus:border-[#006666] focus:ring-1 focus:ring-[#006666]/20"}`}
                  />
                  {linkedInValid && (
                    <span className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#006666] text-white">
                      <Check className="size-3.5" />
                    </span>
                  )}
                </div>
                {urlError && <p className="mt-2 text-xs font-medium text-red-600">{urlError}</p>}
              </div>
            )}
          </div>

          {!hasParsedCV && !hasLinkedInData && !isLinkdeinImportLoading && !isParsing && (
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs leading-5 text-slate-500">Imported information can be reviewed and edited before you save your CV.</p>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#03257e] px-4 py-2.5 text-xs font-semibold leading-5 text-white shadow-sm transition hover:bg-[#006666] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto sm:min-w-[210px] sm:px-5 sm:text-sm"
              >
                {tab === "cv" ? (
                  <><Sparkles className="size-4" /> Parse &amp; autofill CV</>
                ) : (
                  <><LinkedInLogo size={14} /> Import LinkedIn profile</>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {!showParsedModel && openLinkdeinProfileCV && cvData && (
        <LinkedinProfileCvModal cvData={cvData} onClose={() => setOpenLinkdeinProfileCV(false)} />
      )}
    </StepCard>
  );
};

export default HeaderButtons;
