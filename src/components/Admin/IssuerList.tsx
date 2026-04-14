import { useContract } from "@/Blockchain/hooks/useMyContract";
import { RefreshCcw } from "lucide-react";
import { useState, useCallback } from "react";

interface IssuerInfo {
  wallet: string;
  name: string;
}


const useGetAllIssuers = (offset: number = 0, limit: number = 10) => {
  const { useGetAllIssuers } = useContract();
  const { data, isLoading, error, refetch } = useGetAllIssuers(offset, limit);

  const [issuers, total] = (data as [IssuerInfo[], bigint]) ?? [[], 0n];

  return {
    issuers: issuers ?? [],
    total: total ? Number(total) : 0,
    isLoading,
    error,
    refetch,
  };
};


const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}…${addr.slice(-4)}`;

const avatarGradient = (wallet: string) => {
  const n = parseInt(wallet.slice(2, 4), 16) % 2;
  return n === 0
    ? "linear-gradient(135deg, #006666, #03257e)"
    : "linear-gradient(135deg, #03257e, #006666)";
};

const PAGE_SIZE = 8;

function IssuerCard({ issuer, index }: { issuer: IssuerInfo; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(issuer.wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [issuer.wallet]);

  return (
    <div
      className="issuer-card group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
      style={{
        animationDelay: `${index * 55}ms`,
        background: "#03257e14",
        border: "1px solid #03257e55",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor = "#006666aa")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor = "#03257e55")
      }
    >
      {/* Left accent bar — orange */}
      <div
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl transition-all duration-300 group-hover:w-[4px]"
        style={{ background: "#f14419" }}
      />

      <div className="flex items-start justify-between gap-3 pl-2">
        {/* Avatar + name */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg"
            style={{ background: avatarGradient(issuer.wallet) }}
          >
            {issuer.name ? issuer.name[0].toUpperCase() : "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#03257e]">
              {issuer.name || "Unnamed Issuer"}
            </p>
            <p className="mt-0.5 font-mono text-xs" style={{ color: "#006666" }}>
              {truncateAddress(issuer.wallet)}
            </p>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          title="Copy address"
          className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs transition-all duration-200"
          style={{
            border: "1px solid #03257e99",
            background: "#03257e22",
            color: copied ? "#f14419" : "#7fa0d0",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = "#03257e55";
            btn.style.borderColor = "#006666";
            btn.style.color = "#e8eeff";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = "#03257e22";
            btn.style.borderColor = "#03257e99";
            btn.style.color = copied ? "#f14419" : "#7fa0d0";
          }}
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <rect x="7" y="7" width="10" height="12" rx="2" />
                <path d="M3 13V5a2 2 0 012-2h8" />
              </svg>
              Copy
            </span>
          )}
        </button>
      </div>

      {/* Full address row */}
      <p
        className="mt-3 truncate rounded-lg px-3 py-1.5 pl-5 font-mono text-[10px] tracking-tight"
        style={{ background: "#03257e30", color: "#4d7aaa" }}
      >
        {issuer.wallet}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl p-5"
      style={{ background: "#03257e10", border: "1px solid #03257e33" }}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl" style={{ background: "#03257e33" }} />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded" style={{ background: "#03257e33" }} />
          <div className="h-2.5 w-24 rounded" style={{ background: "#00666644" }} />
        </div>
        <div className="h-7 w-16 rounded-lg" style={{ background: "#03257e22" }} />
      </div>
      <div className="mt-3 h-6 rounded-lg" style={{ background: "#03257e1a" }} />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const applyHover = (el: HTMLButtonElement) => {
    el.style.background = "#03257e55";
    el.style.borderColor = "#006666";
    el.style.color = "#ffffff";
  };
  const removeHover = (el: HTMLButtonElement) => {
    el.style.background = "#03257e22";
    el.style.borderColor = "#03257e88";
    el.style.color = "#a8c4e8";
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
        style={{ border: "1px solid #03257e88", background: "#03257e22", color: "#a8c4e8" }}
        onMouseEnter={(e) => { if (!e.currentTarget.disabled) applyHover(e.currentTarget as HTMLButtonElement); }}
        onMouseLeave={(e) => removeHover(e.currentTarget as HTMLButtonElement)}
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
        Prev
      </button>

      <span
        className="rounded-xl px-4 py-2 text-sm font-medium"
        style={{ border: "1px solid #006666aa", background: "#00666622", color: "#7fc4c4" }}
      >
        <span style={{ color: "#e8f4ff" }}>{page + 1}</span>
        <span className="mx-1.5" style={{ color: "#03257e99" }}>/</span>
        {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
        style={{ border: "1px solid #03257e88", background: "#03257e22", color: "#a8c4e8" }}
        onMouseEnter={(e) => { if (!e.currentTarget.disabled) applyHover(e.currentTarget as HTMLButtonElement); }}
        onMouseLeave={(e) => removeHover(e.currentTarget as HTMLButtonElement)}
      >
        Next
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function IssuerList() {
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;

  const { issuers, total, isLoading, error, refetch } = useGetAllIssuers(
    offset,
    PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen px-4 py-10 font-sans">

      <div className="relative mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: "#006666", boxShadow: "0 0 8px #006666" }}
            />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#006666" }}>
              On-chain Registry
            </span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-[#03257e]">
              Issuers
            </h1>
            <div className="flex items-center gap-2">
              {!isLoading && total > 0 && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium text-white bg-[#03257e]"
                >
                  {total} total
                </span>
              )}
              <button
                onClick={() => refetch()}
                disabled={isLoading}
                title="Refresh"
                className="rounded-xl p-2 transition-all duration-200 disabled:cursor-wait disabled:opacity-50 bg-[#006666]"
              >
              <RefreshCcw className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          {/* Divider — orange → navy → transparent */}
          <div
            className="mt-4 h-px w-full"
            style={{ background: "linear-gradient(to right, #f14419, #03257e55, transparent)" }}
          />
        </div>

        {/* Error state */}
        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-2xl p-4 text-sm"
            style={{ border: "1px solid #f1441955", background: "#f1441912", color: "#ffb3a0" }}
          >
            <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#f14419" }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold" style={{ color: "#f14419" }}>Failed to load issuers</p>
              <p className="mt-0.5 opacity-80">{error.message}</p>
            </div>
          </div>
        )}

        {/* Card list */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
          ) : !error && issuers.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-2xl py-16 text-center"
              style={{ border: "1px solid #03257e55", background: "#03257e10" }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ background: "#03257e33" }}>
                🗂️
              </div>
              <p className="font-semibold" style={{ color: "#a8c4e8" }}>No issuers found</p>
              <p className="text-sm" style={{ color: "#4d7aaa" }}>No registered issuers on this contract yet.</p>
            </div>
          ) : (
            issuers.map((issuer, i) => (
              <IssuerCard key={issuer.wallet} issuer={issuer} index={i} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && total > PAGE_SIZE && (
          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(0, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            />
          </div>
        )}

        {/* Footer range */}
        {!isLoading && issuers.length > 0 && (
          <p className="mt-6 text-center text-xs" style={{ color: "#03257eaa" }}>
            Showing {offset + 1}–{Math.min(offset + issuers.length, total)} of {total} issuers
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .issuer-card { animation: fadeSlideIn 0.35s ease both; }
      `}</style>
    </div>
  );
}