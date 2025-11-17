// DigiLockerTest.tsx
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

type IssuedItem = {
  name: string;
  type: string;
  mime: string | string[];
  uri: string;
  description?: string;
  issuer?: string;
  issuerid?: string;
  doctype?: string;
  date?: string;
};

type Profile = {
  digilockerid?: string;
  name?: string;
  dob?: string;
  gender?: string;
  eaadhaar?: "Y" | "N";
};

const BACKEND = "http://localhost:8000";
const DIGILOCKER_CLIENT_ID = "WI7E8AA6B6"; // sandbox client id
const DIGILOCKER_REDIRECT_URI = "http://localhost:8000/api/dl/callback";
const DIGILOCKER_AUTH_URL =
  "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize";

// const checkClasses = "bg-emerald-50 text-emerald-600"

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
  console.log("issuerName", issuerName);
  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        // click outside to close: only if clicked directly on backdrop (not children)
        if (e.target === backdropRef.current) setOpenDigiLocker(false);
      }}
    >
      {/* blurred dim background */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* centered popup content container */}
      <div className="relative z-30 w-full max-w-3xl">
        {/* keep your inner markup here — adjusted styles (removed fixed/top/left classes) */}
        <div className="flex w-full">
          <div className="flex flex-col md:flex-row gap-6 z-30 w-full p-2">
            {/* Info column */}
            <div className="flex-1 flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="flex-none w-12 h-12 rounded-lg bg-indigo-50 grid place-items-center">
                  {/* cloud-download icon */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="text-indigo-600"
                  >
                    <path
                      d="M12 3v10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 9l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 16.5A3.5 3.5 0 0115.5 20H8.5A3.5 3.5 0 015 16.5 3.5 3.5 0 018.5 13H9"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h2
                    id="digilocker-heading"
                    className="text-slate-900 text-lg font-semibold truncate"
                  >
                    Pull certificates from DigiLocker
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    If your certificates are stored on DigiLocker, connect to
                    import verified documents instantly — no manual upload
                    required.
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span
                    className={`flex-none mt-1 w-6 h-6 rounded-full grid place-items-center`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="block"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="leading-tight">
                    <span className="font-medium text-slate-800">
                      Auto-verified:
                    </span>{" "}
                    <span className="text-slate-600">
                      Certificates pulled from DigiLocker are verified by the
                      source.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-none mt-1 w-6 h-6 rounded-full bg-sky-50 grid place-items-center text-[#03257e]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="block"
                    >
                      <path
                        d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="leading-tight">
                    <span className="font-medium text-slate-800">
                      Instant retrieval:
                    </span>{" "}
                    <span className="text-slate-600">
                      Fetch documents in seconds to speed up verification
                      workflows.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-none mt-1 w-6 h-6 rounded-full bg-emerald-50 grid place-items-center text-emerald-600">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="block"
                    >
                      <path
                        d="M12 2a10 10 0 100 20 10 10 0 000-20zM9.5 13.5L7 11l1-1 1.5 1.5L16 6l1 1-7.5 6.5z"
                        stroke="currentColor"
                        strokeWidth="0.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="leading-tight">
                    <span className="font-medium text-slate-800">
                      Trusted source:
                    </span>{" "}
                    <span className="text-slate-600">
                      DigiLocker is an official government-backed repository
                      that ensures document authenticity.
                    </span>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <label
                  htmlFor="digilocker-checkbox"
                  className="flex items-start gap-3 text-sm text-slate-600"
                >
                  <input
                    id="digilocker-checkbox"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    // onChange and checked should be controlled from parent via props or context
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#006666]"
                  />
                  <span className="text-slate-600">
                    I provide my consent to share my basic information and
                    educational documents with the{" "}
                    <span className="font-semibold text-slate-800">
                      {issuerName}
                    </span>{" "}
                    for the purpose of fetching{" "}
                    <span className="font-semibold text-slate-800">
                      {description}
                    </span>{" "}
                    into DigiLocker.
                  </span>
                </label>

                <button
                  type="button"
                  disabled={!consent}
                  onClick={onConnect}
                  className="inline-flex items-center mt-3 gap-2 px-4 py-2 rounded-md shadow-sm text-white font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#006666] bg-[#006666] hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Connect to Digilocker"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Connect DigiLocker
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* optional: small close button in top-right of the popup */}
        <button
          type="button"
          onClick={() => setOpenDigiLocker(false)}
          aria-label="Close popup"
          className="absolute -top-1 -right-1 bg-white rounded-full p-1 z-30"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [docs, setDocs] = useState<IssuedItem[]>([]);
  const form = useFormContext();
  const { getValues, setValue } = form;
  //const [status, setStatus] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [uri, setUri] = useState<string>();

  const [consent, setConsent] = useState(false);
  let issuerName = "";
  let description = "";
  let orgId = "";
  switch (field) {
    case "Secondary School":
      issuerName = getValues(`educations.${index}.boardNameOrDegree`);
      description = "Class X Marksheet";
      orgId = getValues(`educations.${index}.orgId`);
      break;
    case "Higher Secondary School":
      issuerName = getValues(`educations.${index}.boardNameOrDegree`);
      description = "Class XII Marksheet";
      orgId = getValues(`educations.${index}.orgId`);
      break;
    case "Graduation":
      issuerName = getValues(`educations.${index}.institutionName`);
      description = "Degree/Provisional Certificate";
      orgId = getValues(`educations.${index}.orgId`);
      break;
    case "PostGraduation":
      issuerName = getValues(`educations.${index}.institutionName`);
      description = "Degree/Provisional Certificate";
      orgId = getValues(`educations.${index}.orgId`);
      break;
  }

  const fetchProfile = async () => {
    try {
      const r = await fetch(`${BACKEND}/api/dl/me`, {
        credentials: "include",
      });
      if (r.ok) {
        const data = await r.json();
        console.log("Profile:", data);
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetchIssued = async () => {
    //setStatus("Loading issued documents…");
    try {
      const r: any = await fetch(
        `${BACKEND}/api/dl/XCert?typeClass=${field}?orgId=${orgId}`,
        {
          credentials: "include",
        }
      );
      const data = await r.json();
      console.log("Issued docs:", data);
      if (data.uri) {
        setUri(data.uri);
        setValue(`educations.${index}.proof`, data.uri, {
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
      if (!r.ok) {
        setErrorMsg(data?.error?.error_description);
      }

      const items: IssuedItem[] = Array.isArray(data?.items) ? data.items : [];

      // filter for Class X / XII mark sheets
      const filtered = items.filter((it) => {
        const text = `${it.name} ${it.description || ""}`.toLowerCase();
        return (
          text.includes("class x") ||
          text.includes("class xii") ||
          it.doctype === "HSCER"
        );
      });

      setDocs(filtered);
      // setStatus(
      //   filtered.length ? "" : "No Class X/XII marksheets found in issued documents."
      // );
    } catch (e: any) {
      console.error(e);
      //setStatus(e?.message || "Failed to load");
    }
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
    await fetch(`${BACKEND}/api/dl/save-verifier`, {
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
  }, []);

  const downloadPdf = (uri: string) => {
    window.open(
      `${BACKEND}/api/dl/file?uri=${encodeURIComponent(uri)}`,
      "_blank"
    );
  };

  const viewXml = (uri: string) => {
    window.open(
      `${BACKEND}/api/dl/xml?uri=${encodeURIComponent(uri)}`,
      "_blank"
    );
  };

  // If there's no connected profile, show the Digilocker pull card (static JSX)
  if (!profile?.digilockerid) {
    return (
      <DigiLockerPullCard
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
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      <div
        className="z-20 absolute top-0 left-0 right-0 m-auto bg-white p-6 rounded"
        style={{
          maxWidth: 860,
          margin: "40px auto",
          fontFamily: "Inter, system-ui, Arial",
        }}
      >
        <h1 style={{ marginBottom: 12 }}>DigiLocker Demo</h1>
        <p style={{ opacity: 0.8, marginBottom: 24 }}>
          <span className="rounded-full bg-green-500 text-white px-2 py-1">
            Connected
          </span>
        </p>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 10,
            marginBottom: 4,
            background: "#fafafa",
          }}
        >
          <div>
            Name: <span className="font-semibold">{profile.name}</span>
          </div>
          <div>
            DigiLocker ID:{" "}
            <span className="font-semibold">{profile.digilockerid}</span>
          </div>
          <div>
            DOB: <span className="font-semibold">{profile.dob}</span>
          </div>
          <div>
            Gender: <span className="font-semibold">{profile.gender}</span>
          </div>
          <div>
            eAadhaar available:{" "}
            <span className="font-semibold">
              {profile.eaadhaar === "Y" ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="digilocker-checkbox"
            className="flex items-start gap-3 text-sm text-slate-600"
          >
            <input
              id="digilocker-checkbox"
              type="checkbox"
              onChange={() => setConsent(!consent)}
              checked={consent}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#006666]"
            />
            <span className="text-slate-600">
              I provide my consent to share my educational documents with the{" "}
              <span className="font-semibold text-slate-800">{issuerName}</span>{" "}
              for the purpose of fetching{" "}
              <span className="font-semibold text-slate-800">
                {description}
              </span>{" "}
              into DigiLocker.
            </span>
          </label>
        </div>
        {uri && (
          <p className="m-4 font-semibold">
            Document found:{" "}
            <a
              href={`http://localhost:8000/api/dl/view-doc?uri=${uri}`}
              target="_blank"
              className="mt-2 underline text-[#006666]"
            >
              View Document
            </a>
          </p>
        )}

        <button
          type="button"
          className="hover:bg-[#021e50] disabled:bg-[#021e50] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={fetchIssued}
          disabled={!consent}
          style={{
            backgroundColor: "#03257e",
            color: "white",
            padding: "10px 16px",
            borderRadius: 10,
            cursor: "pointer",
            margin: 2,
            transition: "background-color 0.2s ease-in-out",
          }}
        >
          Fetch {description}
        </button>
        {uri && (
          <button
            type="button"
            className="ml-2 bg-green-500 text-white rounded-lg py-[10px] px-[16px]"
          >
            Save Document
          </button>
        )}
        {errorMsg && (
          <div
            className="text-red-500"
            style={{ marginBottom: 4, opacity: 0.8 }}
          >
            {errorMsg}
          </div>
        )}
        {docs.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#f5f7ff" }}>
              <tr>
                <th style={{ textAlign: "left", padding: 12 }}>Name</th>
                <th style={{ textAlign: "left", padding: 12 }}>Issuer</th>
                <th style={{ textAlign: "left", padding: 12 }}>Doctype</th>
                <th style={{ textAlign: "left", padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.uri}>
                  <td style={{ padding: 12, borderTop: "1px solid #eee" }}>
                    {d.name || d.description}
                  </td>
                  <td style={{ padding: 12, borderTop: "1px solid #eee" }}>
                    {d.issuer || d.issuerid}
                  </td>
                  <td style={{ padding: 12, borderTop: "1px solid #eee" }}>
                    {d.doctype || "-"}
                  </td>
                  <td style={{ padding: 12, borderTop: "1px solid #eee" }}>
                    <button
                      type="button"
                      onClick={() => downloadPdf(d.uri)}
                      style={{
                        marginRight: 8,
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => viewXml(d.uri)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      View XML
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
