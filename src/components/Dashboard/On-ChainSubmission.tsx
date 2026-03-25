// components/OnChainSubmission.tsx
import { useState } from "react";
import { FileText, Briefcase, Award, RefreshCw } from "lucide-react";
import { useContract } from "@/Blockchain/hooks/useMyContract";
import { useAccount } from "wagmi";

// ── Types ────────────────────────────────────────────────────────────────────

export type SubmissionStatus = 0 | 1 | 2; // 0=Pending 1=Approved 2=Rejected

export interface Submission {
  submitter   : `0x${string}`;
  name        : string;
  hash        : `0x${string}`;
  docType     : string;
  tokenUri    : string;
  status      : SubmissionStatus;
  submittedAt : bigint;
  rejectReason: string;
}

//Helpers

const STATUS_LABEL:Record<number, string> = { 0: "Pending", 1: "Approved", 2: "Rejected" } as const;

const STATUS_STYLES: Record<number, string> = {
  0: "bg-[#f14419]/10 text-[#f14419]",
  1: "bg-green-50 text-green-800",
  2: "bg-red-50   text-red-800",
};

const ICON_BG: Record<number, string> = {
  0: "bg-amber-50",
  1: "bg-green-50",
  2: "bg-red-50",
};

const DOC_ICON: Record<string, JSX.Element> = {
  education  : <FileText  size={16} />,
  experience : <Briefcase size={16} />,
  certificate: <Award     size={16} />,
};

const formatDate = (timestamp: bigint): string =>
  new Date(Number(timestamp) * 1000).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

const truncateHash = (hash: string) =>
  `${hash.slice(0, 10)}...${hash.slice(-6)}`;

export default function OnChainSubmission() {
  const [activeTab, setActiveTab] = useState<"all" | "approved">("all");
  const {useGetUserSubmissions} = useContract();
  const {address} = useAccount();
  const {submissions, isLoading, refetch} = useGetUserSubmissions(address as `0x${string}`);
  const approved    = submissions?.filter((s) => s.status === 1) || [];
  const displayed   = activeTab === "all" ? submissions || [] : approved;
  const stats = {
    total   : submissions?.length || 0,
    approved: approved.length,
    pending : (submissions?.length || 0) - approved.length,
  };


  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl animate-pulse">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Tabs + Refetch */}
      <div className="flex items-center justify-between border-b border-gray-200 mb-6">
        <div className="flex">
          {(["all", "approved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "all" ? "All submissions" : "Approved"}
              {tab === "approved" && (
                <span className="ml-2 text-xs bg-green-50 text-[#006666] px-2 py-0.5 rounded-full">
                  {stats.approved}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={()=>refetch()}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Stats — all tab only */}
      {activeTab === "all" && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total",    value: stats.total,    color: "text-[#03257e]"  },
            { label: "Approved", value: stats.approved, color: "text-[#006666]" },
            { label: "Pending",  value: stats.pending,  color: "text-[#f14419]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className={`text-2xl font-medium ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cards */}
      {displayed.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No submissions found.
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((sub) => (
            <div
              key={sub.hash}
              className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${ICON_BG[sub.status]}`}>
                {DOC_ICON[sub.docType.toLowerCase()] ?? <FileText size={16} />}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                <p className="text-xs text-gray-500 mb-2 capitalize">{sub.docType}</p>
                <p className="text-xs font-mono text-gray-400">{truncateHash(sub.hash)}</p>

                {/* Reject reason */}
                {sub.status === 2 && sub.rejectReason && (
                  <p className="text-xs text-red-500 mt-1">
                    Reason: {sub.rejectReason}
                  </p>
                )}
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${STATUS_STYLES[sub.status]}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {STATUS_LABEL[sub.status]}
                </span>
                <span className="text-xs text-gray-400">{formatDate(sub.submittedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}