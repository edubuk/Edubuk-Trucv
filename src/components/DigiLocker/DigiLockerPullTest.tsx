// DigiLockerTest.tsx (styled)
import api from "@/lib/api";
import { API_BASE_URL } from "@/main";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import ThreeDotLoader from "../Loader/ThreeDotLoader";
import LoadingButton from "../LoadingButton";


type Profile = {
  digilockerid?: string;
  name?: string;
  dob?: string;
  gender?: string;
  eaadhaar?: "Y" | "N";
};


function DigiLockerPullCard({
  onConnect,
  field,
  openDigiLocker,
  setOpenDigiLocker,
}: {
  onConnect: () => void;
  field: string;
  openDigiLocker: boolean;
  setOpenDigiLocker: (open: boolean) => void;
}) {
  const [consent, setConsent] = useState(false);
  let issuerName = "";
  let description = "";
  const backdropRef = useRef(null);

  // close on ESC
  useEffect(() => {
    if (!openDigiLocker) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDigiLocker(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openDigiLocker, setOpenDigiLocker]);

  // prevent body scroll when open
  useEffect(() => {
    if (openDigiLocker) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [openDigiLocker]);

  if (!openDigiLocker) return null;

  switch (field) {
    case "class10":
      issuerName = "class10Board";
      description = "Class X Marksheet";
      break;
    case "class12":
      issuerName = "class12Board";
      description = "Class XII Marksheet";
      break;
    case "undergraduation":
      issuerName = "underGraduateCollegeName";
      description = "Degree Certificate";
      break;
    case "postgraduation":
      issuerName = "postGraduateCollegeName";
      description = "Degree Certificate";
      break;
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 sm:py-12"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        // click outside to close: only if clicked directly on backdrop (not children)
        if (e.target === backdropRef.current) setOpenDigiLocker(false);
      }}
    >
      {/* blurred dim background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      {/* centered popup content container */}
      <div className="relative z-30 w-full max-w-3xl">
        <div className="flex w-full">
          <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="flex-none w-12 h-12 rounded-lg bg-indigo-50 grid place-items-center">
                {/* cloud-download icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-indigo-600">
                  <path d="M12 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 16.5A3.5 3.5 0 0115.5 20H8.5A3.5 3.5 0 015 16.5 3.5 3.5 0 018.5 13H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="min-w-0">
                <h2 id="digilocker-heading" className="text-slate-900 text-lg font-semibold truncate">Pull certificates from DigiLocker</h2>
                <p className="mt-1 text-sm text-slate-500">If your certificates are stored on DigiLocker, connect to import verified documents instantly — no manual upload required.</p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className={`flex-none mt-1 w-7 h-7 rounded-full grid place-items-center bg-slate-100 text-slate-700`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="block">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <span className="font-medium text-slate-800">Auto-verified:</span>{" "}
                  <span className="text-slate-600">Certificates pulled from DigiLocker are verified by the source.</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex-none mt-1 w-7 h-7 rounded-full bg-sky-50 grid place-items-center text-[#03257e]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="block">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <span className="font-medium text-slate-800">Instant retrieval:</span>{" "}
                  <span className="text-slate-600">Fetch documents in seconds to speed up verification workflows.</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex-none mt-1 w-7 h-7 rounded-full bg-emerald-50 grid place-items-center text-emerald-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="block">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM9.5 13.5L7 11l1-1 1.5 1.5L16 6l1 1-7.5 6.5z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <span className="font-medium text-slate-800">Trusted source:</span>{" "}
                  <span className="text-slate-600">DigiLocker is an official government-backed repository that ensures document authenticity.</span>
                </div>
              </li>
            </ul>

            <div className="mt-6">
              <label htmlFor="digilocker-checkbox" className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  id="digilocker-checkbox"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#006666]"
                />
                <span className="text-slate-600">
                  I provide my consent to share my basic information and educational documents with the Edubuk <span className="font-semibold text-slate-800">{issuerName}</span> for the purpose of Educational Documents Verification <span className="font-semibold text-slate-800">{description}</span> through DigiLocker to create a verified CV.
                </span>
              </label>

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  disabled={!consent}
                  onClick={onConnect}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md shadow-sm text-white font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#006666] bg-[#006666] hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Connect to Digilocker"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Connect DigiLocker
                </button>

                <button
                  type="button"
                  onClick={() => setOpenDigiLocker(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 text-sm bg-white shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* optional: small close button in top-right of the popup */}
        <button type="button" onClick={() => setOpenDigiLocker(false)} aria-label="Close popup" className="absolute -top-2 -right-2 bg-white rounded-full p-1 z-30 shadow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function DigiLockerTest({
  field,
  setOpenDigiLocker,
  openDigiLocker,
  index,
}: {
  field: string;
  setOpenDigiLocker: (open: boolean) => void;
  openDigiLocker: boolean;
  index: number;
}) {

  const DIGILOCKER_CLIENT_ID = "YZDD56F8C8"; // sandbox client id
  const DIGILOCKER_REDIRECT_URI = `${API_BASE_URL}/api/dl/callback`;
  const DIGILOCKER_AUTH_URL ="https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize";
  const [profile, setProfile] = useState<Profile | null>(null);
  const form = useFormContext();
  const { getValues, setValue } = form;
  //const [status, setStatus] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading,setLoading] = useState<boolean>(false);
  const [uri, setUri] = useState<string>();
  const [consent, setConsent] = useState(false);
  const [year, setYear] = useState<string>();
  const [rollno,setRollno] = useState<string>();
  const [regno,setRegno] = useState<string>();
  let issuerName =null;
  let description =null;
  let orgId =null;
  let doctype = null;
  switch (field) {
    case "Secondary School":
      issuerName = getValues(`educations.${index}.boardNameOrDegree`);
      description = "Class X Marksheet";
      doctype = "SSCER";
      orgId = getValues(`educations.${index}.orgId`);
      break;
    case "Higher Secondary School":
      issuerName = getValues(`educations.${index}.boardNameOrDegree`);
      description = "Class XII Marksheet";
      doctype = "HSCER";
      orgId = getValues(`educations.${index}.orgId`);
      break;
    case "Graduation":
      issuerName = getValues(`educations.${index}.institutionName`);
      description = "Degree Certificate";
      doctype = "DGCER"
      orgId = getValues(`educations.${index}.orgId`);
      break;
    case "PostGraduation":
      issuerName = getValues(`educations.${index}.institutionName`);
      description = "PostGraduation Certificate";
      doctype = "DGCER"
      orgId = getValues(`educations.${index}.orgId`);
      break;
  }

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const r:any = await api.get("/api/dl/me")
      if (r.status===200) {
        console.log("Profile:", r.data);
        setProfile(r.data);
        setOpenDigiLocker(true);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }finally{setLoading(false)}
  };

  const fetchIssued = async () => {
    //setStatus("Loading issued documents…");
    if(!rollno || !year){
      return toast.error("year and rollno required");
    }
    if(doctype === "DGCER" && !regno){
      return toast.error("regno required");
    }
    try {
      setLoading(true);
      const r: any = await api.post(`/api/dl/fetchDocUri?orgid=${orgId}&doctype=${doctype}&regno=${regno}`,
      {rollno, year}
      )
      if (r.ok) {
        setUri(r.data.uri);
        setValue(`educations.${index}.docUri`, r.data.uri, {
          shouldValidate: true,
          shouldDirty: true,
        });
        //setting value for the verification validations
        setValue(`educations.${index}.status`, "verified");
        setValue(`educations.${index}.verifiedThrough`, "DigiLocker");
        setValue(`educations.${index}.verified`, true);
      } else {
        setErrorMsg("No document found");
      }
      if (!r.response.data.ok) {
        setErrorMsg(r?.response?.data?.error?.error_description);
      }
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error?.error_description);
    }finally{setLoading(false)}
  };

  // Helpers for PKCE
  function base64URLEncode(str: ArrayBuffer | Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(str)]))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest("SHA-256", data);
  }

  async function startLogin() {
    // 1. Generate random verifier
    const verifier = base64URLEncode(
      crypto.getRandomValues(new Uint8Array(32))
    );

    // 2. Save verifier to backend session
    await fetch(`${API_BASE_URL}/api/dl/save-verifier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verifier }),
      credentials: "include",
    });

    // 3. Hash → Challenge
    const hashed = await sha256(verifier);
    const challenge = base64URLEncode(hashed);

    // 4. Add CSRF-safe state
    const state = crypto.randomUUID();

    // 5. Build DigiLocker authorization URL
    const authUrl = `${DIGILOCKER_AUTH_URL}?client_id=${encodeURIComponent(
      DIGILOCKER_CLIENT_ID
    )}&response_type=code&redirect_uri=${encodeURIComponent(
      DIGILOCKER_REDIRECT_URI
    )}&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(
      challenge
    )}&code_challenge_method=S256`;

    // 6. Redirect user
    window.location.href = authUrl;
  }

  useEffect(() => {
      fetchProfile();
  },[]);

  // If there's no connected profile, show the Digilocker pull card (static JSX)
  if (!profile?.digilockerid) {
    return (
      loading?
      <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white p-6 rounded-2xl shadow-2xl max-w-3xl w-full">
          <ThreeDotLoader w={18} h={18} yPos="center"/>
        </div>
      </div>
      </>
      :<DigiLockerPullCard
        onConnect={startLogin}
        field={field}
        setOpenDigiLocker={setOpenDigiLocker}
        openDigiLocker={openDigiLocker}
      />
    );
  }

  // Otherwise show connected UI + fetch/docs area
  return (
    <>
    {(profile && openDigiLocker)&&<div>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white p-6 rounded-2xl shadow-2xl max-w-3xl w-full">
          <div className="flex flex-col items-start justify-between gap-4">
        <div className="flex items-start justify-between gap-4 w-full">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">DigiLocker</h1>
            <p className="text-sm text-slate-500 mt-1">Connected</p>
          </div>
          <div className="text-right text-sm">
            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium">Connected</span>
          </div>
          <button
            type="button"
            onClick={() => setOpenDigiLocker(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 text-sm bg-white shadow-sm"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 bg-slate-50 border border-slate-100 rounded-lg p-4 grid gap-2">
          <div className="flex justify-between text-sm text-slate-600">
            <div>Name:</div>
            <div className="font-medium text-slate-800">{profile.name}</div>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <div>DigiLocker ID:</div>
            <div className="font-medium text-slate-800">{profile.digilockerid}</div>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <div>DOB:</div>
            <div className="font-medium text-slate-800">{profile.dob}</div>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <div>Gender:</div>
            <div className="font-medium text-slate-800">{profile.gender}</div>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <div>eAadhaar available:</div>
            <div className="font-medium text-slate-800">{profile.eaadhaar === "Y" ? "Yes" : "No"}</div>
          </div>
        </div>
        <label>Enter below your {description} related required data</label>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Enter Roll Number*"
            value={rollno}
            onChange={(e) => setRollno(e.target.value)}
            className="rounded-lg w-full px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#03257e]"
          />

          {doctype === "DGCER" && <input
            type="text"
            placeholder="Enter Registration Number*"
            value={regno}
            onChange={(e) => setRegno(e.target.value)}
            className="rounded-lg w-full px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#03257e]"
          />}
          <input
            type="text"
            placeholder="Enter Passing Year*"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-lg w-full px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#03257e]"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="digilocker-checkbox" className="flex items-start gap-3 text-sm text-slate-600">
            <input
              id="digilocker-checkbox"
              type="checkbox"
              onChange={() => setConsent(!consent)}
              checked={consent}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#006666]"
            />
            <span className="text-slate-600">I provide my consent to share my educational documents with the <span className="font-semibold text-slate-800">{issuerName}</span> for the purpose of fetching <span className="font-semibold text-slate-800">{description}</span> into DigiLocker.</span>
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {loading?<LoadingButton 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-[#03257e] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-105 transition"
          />:<button
            type="button"
            onClick={fetchIssued}
            disabled={!consent}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-[#03257e] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-105 transition"
          >
            Fetch {description}
          </button>}

          {uri && (
            <button type="button" className="ml-2 bg-green-500 text-white rounded-lg py-2 px-4" onClick={()=>setOpenDigiLocker(false)}>Save Document</button>
          )}
        </div>

        {errorMsg && (
          <div className="text-red-500 mt-3 text-sm">{errorMsg}</div>
        )}
      </div>
      </div>
      </div>
      </div>}
    </>
  );
}
