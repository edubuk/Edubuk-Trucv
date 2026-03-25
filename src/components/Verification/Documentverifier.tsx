import { useState, useRef, useCallback } from "react";
import {
  ShieldCheck,
  ShieldX,
  Upload,
  FileText,
  Hash,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Clock,
  User,
  Tag,
  Building2,
} from "lucide-react";
import { useContract } from "@/Blockchain/hooks/useMyContract";
import toast from "react-hot-toast";



// ─── Helpers ──────────────────────────────────────────────────────────────────

async function sha256File(file: File): Promise<`0x${string}`> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const docHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${docHash}` as `0x${string}`; // typed as bytes32-compatible hex
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatTs(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="mt-0.5 flex-shrink-0" style={{ color: "#006666" }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm text-slate-800 break-all ${
            mono ? "font-mono text-xs" : "font-medium"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DocumentVerifier() {
  const [file, setFile]         = useState<File | null>(null);
  const [hash, setHash] = useState<string | null>();
  const [hashing, setHashing]   = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {useVerifyDocument} = useContract();
  // ── Real contract hook ─────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    error,
  } = useVerifyDocument(triggered ? hash as `0x${string}` : "");
  const [isValid,doc] = data || [false, {}];
  // ── Derived state ──────────────────────────────────────────────────────────

  const hasResult  = triggered && !isLoading && !error;
  const isVerified = hasResult && !!doc;

  // ── File handling ──────────────────────────────────────────────────────────

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setTriggered(false);
    setHash("0x");
    setHashing(true);
    try {
      const h = await sha256File(f);
      setHash(h);
    } finally {
      setHashing(false);
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const reset = () => {
    setFile(null);
    setHash(null);
    setTriggered(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Verify ─────────────────────────────────────────────────────────────────

  const handleVerify = () => {
    try {
    if (!hash || hashing) return;
    if(/^0x[0-9a-fA-F]{64}$/.test(hash)) {
      setTriggered(true);
    }else{
      toast.error("Invalid hash");
    }
    } catch (error) {
      console.error(error);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-4 py-12"
      style={{ background: "#f7f9fc" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="text-center mb-10 max-w-xl w-full">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 border"
          style={{
            background: "rgba(3,37,126,0.06)",
            borderColor: "rgba(3,37,126,0.15)",
          }}
        >
          <ShieldCheck className="h-4 w-4" style={{ color: "#03257e" }} />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#03257e" }}
          >
            Blockchain-Powered
          </span>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-extrabold leading-tight"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            letterSpacing: "-0.5px",
            color: "#03257e",
          }}
        >
          Document Authenticity{" "}
          <span style={{ color: "#006666" }}>Verification</span>
        </h1>

        <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Upload any issued document. We compute its cryptographic fingerprint
          and cross-check it against the immutable on-chain registry — in
          seconds.
        </p>
      </div>

      {/* ── Card ────────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">

        {/* Gradient accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(to right, #03257e, #006666, #f14419)",
          }}
        />

        <div className="p-6 space-y-5">

          {/* ── Drop zone ─────────────────────────────────────────────────── */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="relative cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 flex flex-col items-center gap-3 transition-all duration-200"
            style={{
              borderColor: dragOver
                ? "#006666"
                : file
                ? "rgba(3,37,126,0.30)"
                : "#e2e8f0",
              background: dragOver
                ? "rgba(0,102,102,0.04)"
                : file
                ? "rgba(3,37,126,0.02)"
                : "transparent",
            }}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={onInputChange}
            />

            {file ? (
              <>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "rgba(3,37,126,0.08)" }}
                >
                  <FileText className="h-6 w-6" style={{ color: "#03257e" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatBytes(file.size)}&nbsp;·&nbsp;
                    {file.type || "unknown type"}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="text-xs font-medium hover:underline"
                  style={{ color: "#f14419" }}
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Upload className="h-6 w-6 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Drop your document here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    or{" "}
                    <span className="font-semibold" style={{ color: "#006666" }}>
                      click to browse
                    </span>{" "}
                    — PDF, PNG, JPG, DOCX…
                  </p>
                </div>
              </>
            )}
          </div>

          {/* ── Hash display ──────────────────────────────────────────────── */}
          {(hashing || hash) && (
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Hash className="h-3.5 w-3.5" style={{ color: "#006666" }} />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  SHA-256 Hash
                </span>
              </div>
              {hashing ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Computing hash…</span>
                </div>
              ) : (
                <p
                  className="font-mono text-xs break-all leading-relaxed"
                  style={{ color: "#03257e" }}
                >
                  {hash}
                </p>
              )}
            </div>
          )}

          {/* ── Verify button ─────────────────────────────────────────────── */}
          <button
            onClick={handleVerify}
            disabled={!hash || hashing || isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#006666" }}
            onMouseEnter={(e) => {
              if (!(e.currentTarget as HTMLButtonElement).disabled)
                (e.currentTarget as HTMLButtonElement).style.background = "#03257e";
            }}
            onMouseLeave={(e) => {
              if (!(e.currentTarget as HTMLButtonElement).disabled)
                (e.currentTarget as HTMLButtonElement).style.background = "#006666";
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying on Blockchain…
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Verify Document
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* ── Error state ─────────────────────────────────────────────────── */}
        {triggered && !isLoading && error && (
          <div className="border-t border-red-100 bg-red-50 px-6 py-4">
            <p className="text-sm font-medium text-red-600">
              Verification failed: {error.message ?? "Unknown error"}
            </p>
          </div>
        )}

        {/* ── Result panel ────────────────────────────────────────────────── */}
        {hasResult && (
          <div
            className="border-t px-6 py-6"
            style={{
              borderColor: isVerified ? "#d1fae5" : "#fee2e2",
              background: isVerified
                ? "rgba(236,253,245,0.7)"
                : "rgba(254,242,242,0.6)",
            }}
          >
            {/* Status header */}
            <div className="flex items-center gap-3 mb-5">
              {isVerified ? (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-emerald-700">
                      Verified &amp; Authentic
                    </p>
                    <p className="text-xs text-emerald-600 opacity-80">
                      This document exists on-chain and is valid
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
                    <ShieldX className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-red-600">
                      Not Found on Blockchain
                    </p>
                    <p className="text-xs text-red-500 opacity-80">
                      No matching record found in the registry
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* On-chain document details — only shown when document is returned */}
            {isVerified && document && (
              <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden">

                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{ background: "#03257e" }}
                >
                  <ShieldCheck className="h-4 w-4 text-white opacity-80" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white opacity-90">
                    On-Chain Record
                  </span>
                </div>

               { doc && <div className="px-4">
                  <InfoRow
                    icon={<FileText className="h-4 w-4" />}
                    label="Document Name"
                    value={doc?.name || ""}
                  />
                  <InfoRow
                    icon={<Tag className="h-4 w-4" />}
                    label="Document Type"
                    value={doc?.docType || ""}
                  />
                  <InfoRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="Issuer Address"
                    value={shortAddr(doc?.issuer || "")}
                    mono
                  />        
                  <InfoRow
                    icon={<User className="h-4 w-4" />}
                    label="Recipient Address"
                    value={shortAddr(doc?.recipient || "")}
                    mono
                  />
                  <InfoRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Issued At"
                    value={formatTs(BigInt(doc?.issuedAt as number || 0))}
                  />
                  <InfoRow
                    icon={<Hash className="h-4 w-4" />}
                    label="On-Chain Hash"
                    value={doc?.hash || ""}
                    mono
                  />

                  {/* Validity pill */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                      Validity Status
                    </span>
                    {isValid ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Revoked
                      </span>
                    )}
                  </div>
                </div>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Privacy note ────────────────────────────────────────────────────── */}
      <p className="mt-6 text-center text-xs text-slate-400 max-w-sm leading-relaxed">
        Your file never leaves your device. Only the cryptographic hash is
        submitted for verification.
      </p>
    </div>
  );
}