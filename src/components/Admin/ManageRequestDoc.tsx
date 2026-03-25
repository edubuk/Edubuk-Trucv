import { FileCheck, User, Shield, ExternalLink } from "lucide-react";

interface DocumentRequestProps {
  requestedDoc: any[];
  isFetching: boolean;
}

const DocumentCard = ({requestedDoc, isFetching}: DocumentRequestProps) => {
  // skeleton loader
    if (isFetching) {
      return (<div className="flex justify-center items-center gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-5 w-44 rounded-lg bg-gray-100 animate-pulse" />
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
                    <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                  </div>
                  <div className="h-3 w-28 rounded bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Button */}
            <div className="mt-5 h-9 w-full rounded-xl bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>);
  }
  return (
    <div className="flex gap-5 justify-start items-center flex-wrap">
   {requestedDoc?.length === 0 && (
    <div className="w-full flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10">
      <p className="text-[#f14419] text-base">
        No documents requested yet.
      </p>
    </div>
  )}
    {requestedDoc?.map((doc:any) => (
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#03257e]/10">
          <FileCheck className="h-5 w-5 text-[#03257e]" />
        </div>
        <h3 className="text-lg font-semibold text-[#03257e]">
          Document Verification
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-3 text-sm">

        {/* Document Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <FileCheck className="h-4 w-4 text-[#006666]" />
            <span>Document Type</span>
          </div>
          <span className="font-medium text-gray-900">
            {doc.documentType}
          </span>
        </div>

        {/* User ID */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4 text-[#006666]" />
            <span>User ID</span>
          </div>
          <span className="font-medium text-gray-900 truncate max-w-[180px]">
            {doc.userId}
          </span>
        </div>

        {/* Verification Method */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="h-4 w-4 text-[#006666]" />
            <span>Verification Method</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#006666]/10 px-2 py-0.5 text-xs font-semibold text-[#006666]">
            {doc.verifiedThrough}
          </span>
        </div>
      </div>

      {/* Action Link */}
      <a
        href={`/verify-document/${doc.token}`}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#f14419] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
      >
        Approve On-Chain
        <ExternalLink className="h-4 w-4" />
      </a>
      </div>
    ))}
    </div>
  );
};

export default DocumentCard;
