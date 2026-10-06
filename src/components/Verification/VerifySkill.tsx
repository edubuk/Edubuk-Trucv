import { API_BASE_URL } from "@/main";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

type Skill = {
  userId: string;
  skills: SkillItem[];
};

type SkillItem = {
  skillName: string;
  level: string;
};

const endorserProfiles = [
  "Team Lead",
  "CEO",
  "Manager",
  "CTO",
  "Tech Lead",
  "Other",
] as const;

const SkillVerification = () => {
  const [skill, setSkill] = useState<Skill>({ userId: "", skills: [] });
  const [endorserProfile, setEndorserProfile] = useState("");
  const [customEndorserProfile, setCustomEndorserProfile] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEndorsementSuccessful, setIsEndorsementSuccessful] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { token } = useParams();
  const resolvedEndorserProfile =
    endorserProfile === "Other"
      ? customEndorserProfile.trim()
      : endorserProfile;
  const canEndorse = Boolean(resolvedEndorserProfile);

  useEffect(() => {
    const getRequestedSkills = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const response = await fetch(
          `${API_BASE_URL}/api/v1/issuer/requested-skills/${token}`,
        );
        const result = await response.json();

        if (!result.success) {
          setLoadError(result.message || "Unable to load the requested skills.");
          toast.error(result.message);
          return;
        }

        setSkill(result.data);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setLoadError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void getRequestedSkills();
  }, [token]);

  useEffect(() => {
    if (!isEndorsementSuccessful) return;

    const closeTimer = window.setTimeout(() => {
      window.close();
    }, 2500);

    return () => window.clearTimeout(closeTimer);
  }, [isEndorsementSuccessful]);

  const handleApprove = async () => {
    if (!resolvedEndorserProfile) {
      toast.error("Please select your endorser profile");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/issuer/approve-skills/${token}?userId=${skill.userId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            data: {
              ...skill,
              endorserprofile: resolvedEndorserProfile,
            },
          }),
          headers: { "Content-Type": "application/json" },
        },
      );
      const result = await response.json();

      if (!result.success) {
        toast.error(result.message || "Unable to endorse these skills");
        return;
      }

      setIsEndorsementSuccessful(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-3 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#03257e]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 size-80 rounded-full bg-[#006666]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]" />

        <header className="border-b border-slate-100 bg-gradient-to-r from-[#03257e]/5 to-[#006666]/5 p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#03257e] text-white shadow-sm sm:size-12">
                <ShieldCheck className="size-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#006666]">
                  Secure endorsement
                </p>
                <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  Skill Verification
                </h1>
                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                  Review the candidate’s skills and confirm your professional
                  relationship before endorsing them.
                </p>
              </div>
            </div>
            {!isLoading && !loadError && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#006666]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#006666] shadow-sm">
                <Sparkles className="size-3.5" />
                {skill.skills.length} skill{skill.skills.length === 1 ? "" : "s"}
              </div>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-8">
          {isLoading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-[#03257e]/10 text-[#03257e]">
                <Loader2 className="size-6 animate-spin" />
              </span>
              <p className="mt-4 text-sm font-bold text-slate-900">
                Loading requested skills
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Please wait while we prepare the verification request.
              </p>
            </div>
          ) : loadError ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-[#f14419]/30 bg-[#f14419]/5 p-6 text-center">
              <p className="text-sm font-bold text-[#f14419]">
                Verification request unavailable
              </p>
              <p className="mt-1 max-w-md text-xs leading-5 text-slate-700">
                {loadError}
              </p>
            </div>
          ) : (
            <>
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Skills awaiting endorsement
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Confirm the skill names and proficiency levels below.
                    </p>
                  </div>
                  <BadgeCheck className="size-5 shrink-0 text-[#006666]" />
                </div>

                <div className="hidden grid-cols-[44px_minmax(0,1fr)_minmax(140px,0.45fr)] gap-3 border-b border-slate-200 px-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:grid">
                  <span />
                  <span>Skill name</span>
                  <span>Verified level</span>
                </div>

                <div className="mt-2 space-y-2.5">
                  {skill.skills.map((item, index) => (
                    <div
                      key={`${item.skillName}-${index}`}
                      className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 transition hover:border-[#006666]/30 hover:bg-[#006666]/5 sm:grid-cols-[44px_minmax(0,1fr)_minmax(140px,0.45fr)] sm:items-center sm:px-4"
                    >
                      <div className="hidden sm:flex sm:justify-center">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-[#006666]/10 text-[#006666]">
                          <CheckCircle2 className="size-4" />
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">
                          Skill
                        </span>
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {item.skillName}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">
                          Verified level
                        </span>
                        <span className="mt-1 inline-flex rounded-full bg-[#03257e]/10 px-2.5 py-1 text-xs font-semibold capitalize text-[#03257e] sm:mt-0">
                          {item.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-[#006666]/15 bg-[#006666]/5 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#006666] shadow-sm ring-1 ring-[#006666]/10">
                    <BriefcaseBusiness className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="endorser-profile"
                      className="text-sm font-bold text-slate-900"
                    >
                      Endorser Profile
                    </label>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600">
                      Select your role in relation to the candidate.
                    </p>

                    <div className="relative mt-3">
                      <select
                        id="endorser-profile"
                        value={endorserProfile}
                        onChange={(event) => {
                          setEndorserProfile(event.target.value);
                          if (event.target.value !== "Other") {
                            setCustomEndorserProfile("");
                          }
                        }}
                        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#006666] focus:ring-2 focus:ring-[#006666]/15"
                      >
                        <option value="">Select your profile</option>
                        {endorserProfiles.map((profile) => (
                          <option key={profile} value={profile}>
                            {profile}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    </div>

                    {endorserProfile === "Other" && (
                      <div className="mt-3">
                        <label
                          htmlFor="custom-endorser-profile"
                          className="text-xs font-semibold text-slate-700"
                        >
                          Specify your profile
                        </label>
                        <input
                          id="custom-endorser-profile"
                          type="text"
                          value={customEndorserProfile}
                          onChange={(event) =>
                            setCustomEndorserProfile(event.target.value)
                          }
                          placeholder="Enter your role or designation"
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#006666] focus:ring-2 focus:ring-[#006666]/15"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">
                  By endorsing, you confirm that these skills are accurate to
                  the best of your knowledge.
                </p>
                <button
                  type="button"
                  disabled={isSubmitting || !canEndorse}
                  onClick={handleApprove}
                  className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#006666] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#03257e] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Endorsing…
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="size-4" />
                      Endorse above skills
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <footer className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50 px-4 py-3 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> Secure skill verification link
          </span>
          <span>© {new Date().getFullYear()} Edubuk</span>
        </footer>
      </div>

      {isEndorsementSuccessful && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03257e]/35 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="endorsement-success-title"
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#006666]/20 bg-white text-center shadow-2xl"
          >
            <div className="h-1.5 bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]" />
            <div className="p-6 sm:p-8">
              <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#006666]/10 text-[#006666]">
                <CheckCircle2 className="size-8" />
              </span>
              <h2
                id="endorsement-success-title"
                className="mt-5 text-xl font-bold text-[#03257e]"
              >
                Successfully endorsed
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Thank you for verifying and endorsing the candidate’s skills.
              </p>
              <p className="mt-4 text-xs font-medium text-[#006666]">
                This window will close automatically.
              </p>
              <button
                type="button"
                onClick={() => window.close()}
                className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#006666] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#03257e]"
              >
                Close window
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SkillVerification;
