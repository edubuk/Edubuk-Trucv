// DigiLockerTest.tsx
import { useEffect, useState } from "react";
import { CloudDownload, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

// const data ={
//   orgid:"00027",
//   docType:"HSCER",
//   consent:"Y"
// }

// type IssuedItem = {
//   name: string;
//   type: string;
//   mime: string | string[];
//   uri: string;
//   description?: string;
//   issuer?: string;
//   issuerid?: string;
//   doctype?: string;
//   date?: string;
// };

type Profile = {
  digilockerid?: string;
  name?: string;
  dob?: string;
  gender?: string;
  eaadhaar?: "Y" | "N";
};

const BACKEND = import.meta.env.VITE_API_BASE || "https://trucv.org";
const DIGILOCKER_CLIENT_ID = "YZDD56F8C8"; // sandbox client id
const DIGILOCKER_REDIRECT_URI = "https://www.trucv.org/api/dl/callback";
const DIGILOCKER_AUTH_URL =
  "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize";

// --- Small Digilocker-pull UI (used when profile is not connected) ---
const COLOR_PRIMARY = "#03257e";
const COLOR_TEAL = "#006666";

function DigiLockerPullCard({ onConnect }: { onConnect: () => void }) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: "#fff",
        padding: 20,
        boxShadow: "0 6px 18px rgba(12, 15, 20, 0.04)",
        border: "1px solid #eee",
        maxWidth: 860,
        margin: "40px auto",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <CloudDownload style={{ color: COLOR_PRIMARY }} />
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            Pull Certificates from DigiLocker
          </h2>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>
            If your certificates are available on DigiLocker, please pull them
            directly from there.
          </p>
        </div>
      </div>

      <ul style={{ marginTop: 16, paddingLeft: 18, color: "#374151" }}>
        <li style={{ marginBottom: 10, display: "flex", gap: 8 }}>
          <CheckCircle style={{ color: COLOR_TEAL, marginTop: 3 }} />
          <div>
            <strong>Auto-verified:</strong> Certificates pulled from DigiLocker
            are automatically verified — no dependency on the original issuer.
          </div>
        </li>
        <li style={{ marginBottom: 10, display: "flex", gap: 8 }}>
          <Zap style={{ color: COLOR_PRIMARY, marginTop: 3 }} />
          <div>
            <strong>Instant verification:</strong> Documents are trusted
            immediately, speeding up background checks and workflows.
          </div>
        </li>
        <li style={{ display: "flex", gap: 8 }}>
          <CheckCircle style={{ color: COLOR_TEAL, marginTop: 3 }} />
          <div>
            <strong>Trusted source:</strong> Digilocker is a secure,
            government-backed repository that ensures authenticity.
          </div>
        </li>
      </ul>

      <div style={{ marginTop: 18 }}>
        <button
          onClick={onConnect}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: COLOR_PRIMARY,
            color: "white",
            fontWeight: 600,
          }}
        >
          Connect DigiLocker (sandbox)
        </button>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function DigiLockerTest() {
  const [profile, setProfile] = useState<Profile | null>(null);
  //const [docs, setDocs] = useState<IssuedItem[]>([]);
  const [status, setStatus] = useState<string>("");

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

  // const fetchIssued = async () => {
  //   setStatus("Loading issued documents…");
  //   try {
  //     const r = await fetch(`${BACKEND}/api/dl/issued`, {
  //       credentials: "include",
  //     });
  //     if (!r.ok) throw new Error("Failed to load issued docs");
  //     const data = await r.json();
  //     console.log("Issued docs:", data);

  //     const items: IssuedItem[] = Array.isArray(data?.items) ? data.items : [];

  //     // filter for Class X / XII mark sheets
  //     const filtered = items.filter((it) => {
  //       const text = `${it.name} ${it.description || ""}`.toLowerCase();
  //       return (
  //         text.includes("class x") ||
  //         text.includes("class xii") ||
  //         it.doctype === "HSCER"
  //       );
  //     });

  //     setDocs(filtered);
  //     setStatus(
  //       filtered.length ? "" : "No Class X/XII marksheets found in issued documents."
  //     );
  //   } catch (e: any) {
  //     console.error(e);
  //     setStatus(e?.message || "Failed to load documents.");
  //   }
  // };

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

  async function fetchDoc()
  {
   try {
    const r = await fetch(`${BACKEND}/digilocker/XCert`, {
      credentials: "include",
    });
    if (!r.ok) throw new Error("Failed to load issued docs");
    const data = await r.json();
    console.log("Issued docs:", data);
   } catch (error:any) {
    console.error(error);
    setStatus(error?.message || "Failed to load documents.");
   }
  }

  async function startLogin() {
    // 1. Generate random verifier
    const verifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(32)));

    // 2. Save verifier to backend session
    await fetch("https://trucv.org/api/dl/save-verifier", {
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
    )}&state=${encodeURIComponent(
      state
    )}&code_challenge=${encodeURIComponent(
      challenge
    )}&code_challenge_method=S256&amr=aadhaar&scope=files.issueddocs+files.uploadeddocs`;

    // 6. Redirect user
    window.location.href = authUrl;
  }

  // async function fetchIssuers() {
  //   try {
  //     const r = await fetch('http://localhost:4000/digilocker/issuers', {
  //       credentials: "include",
  //     });
  //     if (!r.ok) throw new Error("Failed to load issuers");
  //     const data = await r.json();
  //     console.log("Issuers:", data);
  //   } catch (e: any) {
  //     console.error(e);
  //     setStatus(e?.message || "Failed to load issuers.");
  //   }
  // }

  useEffect(() => {
    fetchProfile();
  }, []);

  // const downloadPdf = (uri: string) => {
  //   window.open(`${BACKEND}/api/dl/file?uri=${encodeURIComponent(uri)}`, "_blank");
  // };

  // const viewXml = (uri: string) => {
  //   window.open(`${BACKEND}/api/dl/xml?uri=${encodeURIComponent(uri)}`, "_blank");
  // };

  // If there's no connected profile, show the Digilocker pull card (static JSX)
  if (!profile?.digilockerid) {
    return <DigiLockerPullCard onConnect={startLogin} />;
  }

  // Otherwise show connected UI + fetch/docs area
  return (
    <div
      style={{
        maxWidth: 860,
        margin: "40px auto",
        fontFamily: "Inter, system-ui, Arial",
      }}
    >
      <h1 style={{ marginBottom: 12 }}>DigiLocker Sandbox Demo</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Connected to DigiLocker
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
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Connected</div>
        <div>Name: {profile.name}</div>
        <div>DigiLocker ID: {profile.digilockerid}</div>
        <div>DOB: {profile.dob}</div>
        <div>Gender: {profile.gender}</div>
        <div>eAadhaar available: {profile.eaadhaar === "Y" ? "Yes" : "No"}</div>
        <div className="w-full mt-6">
      <Link to="/create-cv" className="text-blue-500 w-full text-center border px-4 py-2  rounded-full">Save it</Link>
      </div>
      </div>

      <button
        onClick={fetchDoc}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid #ccc",
          cursor: "pointer",
          marginBottom: 2,
        }}
      >
        Fetch Class X/XII Marksheets
      </button>
      {status && <div style={{ marginBottom: 4, opacity: 0.8 }}>{status}</div>}

      {/* {docs.length > 0 && (
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
      )} */}
    </div>
  );
}
