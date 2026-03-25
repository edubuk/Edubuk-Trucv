import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useContract } from "@/Blockchain/hooks/useMyContract";
import { parseContractError } from "@/Blockchain/utils/error";
interface IDoc {
  emailId: string;
  level?: string;
  boardNameOrDegree?: string;
  institutionName?: string;
  docUri?: string;
  skills?: string | undefined;
  organisation?: string;
  companyName?: string;
  duration?: { from?: string; to?: string };
  position?: string;
  docType: string;
  docHash?: string;
  userEmail?: string;
  token?: string;
  jobRole?: string;
  name?: string;
}

const DocumentVerificationPage: React.FC = () => {
  const { token } = useParams();
  const [metadata, setMetaData] = useState<IDoc>();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("processing...");
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState("Initializing verification…");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isConnected } = useAccount();
  const [tab, setTab] = useState<"approve" | "reject">("approve");
  const { approveDocument, rejectDocument } = useContract();
  const { address } = useAccount();
  const fetchMetaData = async () => {
    try {
      const res = await api.get(`/issuer/fetch-requested-doc/${token}`);
      if (res.data.success) {
        setMetaData(res.data.doc);
      }
      console.log("", res.data);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setError(
        (error as any)?.response?.data?.message ||
          "Failed to fetch document metadata",
      );
    }
  };

  useEffect(() => {
    fetchMetaData();
  }, []);

  const onApprove = async () => {
    try {
      setShowPopup(true);
      setTab("approve");
      setIsProcessing(true);
      setPopupStatus("Starting document approval…");
      setError(null);
      setStatus("processing...");
      if (metadata?.docHash) {
        const id = toast.loading("Submitting on chain...");
        try {
          await approveDocument(
            `0x${metadata.docHash}`,
            address as `0x${string}`,
          );
          toast.dismiss(id);
        } catch (txError) {
          const errMsg = parseContractError(txError);

          if (errMsg === "This document is no longer pending.") {
            // Already on chain — skip and proceed to DB save
            toast.dismiss(id);
            toast.custom(() => (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                <p>Document is no longer pending on chain. Retrying database save...</p>
              </div>
            ));
          } else {
            // Any other chain error — stop everything
            toast.dismiss(id);
            throw txError;
          }
        }
      }

      // Start approval process
      const { data } = await api.patch(`/issuer/approve/${token}`);
      console.log("data", data);
      if (!data.success) {
        setPopupStatus("");
        setError(data.message || "Failed to approve document");
        setIsProcessing(false);
      }
      setPopupStatus("Document approved successfully!");
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error approving document:", error.data?.message);
      setPopupStatus("");
      setError(error.data?.message || "Something went wrong during approval.");
      setIsProcessing(false);
    } finally {
      //setIsProcessing(false);
    }
  };

  const onReject = async () => {
    try {
      setTab("reject");
      setLoading(true);
      setShowPopup(true);
      setPopupStatus("Document rejection in progress...");
      if (metadata?.docHash) {
        const id = toast.loading("Submitting on chain...");
        try {
          await rejectDocument(
            `0x${metadata.docHash}`,
            address as `0x${string}`,
            "False Document",
          );
          toast.dismiss(id);
        } catch (txError) {
          const errMsg = parseContractError(txError);

          if (errMsg === "This document is no longer pending.") {
            // Already on chain — skip and proceed to DB save
            toast.dismiss(id);
            toast.custom(() => (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                <p>Document is no longer pending on chain. Retrying database save...</p>
              </div>
            ));
          } else {
            // Any other chain error — stop everything
            toast.dismiss(id);
            throw txError;
          }
        }
      }
      const { data } = await api.patch(`/issuer/reject/${token}`);
      if (!data.success) {
        setError(data.message || "Document rejection failed");
        setPopupStatus("");
      }
      setPopupStatus("Document rejected successfully!");
      setIsProcessing(false);
    } catch (error) {
      console.error("Error rejecting document:", error);
      setPopupStatus("");
      setError("Document rejection failed");
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (!error) {
      window.close();
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="absolute top-4 right-4">
          <ConnectButton />
          {!isConnected && (
            <span className="inline-flex items-center rounded-full bg-[#f14419]/10 px-2 py-0.5 text-xs font-semibold text-[#f14419]">
              Please connect your wallet to approve/reject
            </span>
          )}
        </div>
        {metadata ? (
          <div className="w-full max-w-2xl space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Document Verification
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Please review the document details carefully before taking
                action.
              </p>
            </div>

            {/* Metadata Card */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Document Metadata
              </h2>
              <pre className="whitespace-pre-wrap break-words">
                {(metadata?.boardNameOrDegree || metadata.institutionName) ? (
                  <>
                    <strong>Level:</strong> {metadata?.level}
                    <br />
                    <strong>Board/Degree:</strong> {metadata?.boardNameOrDegree}
                    <br />
                    <strong>Institution:</strong> {metadata?.institutionName}
                    <br />
                    <strong>Duration:</strong> {metadata?.duration?.from} -{" "}
                    {metadata?.duration?.to}
                  </>
                ) : metadata?.jobRole ? (
                  <>
                    <strong>Organisation:</strong> {metadata?.companyName}
                    <br />
                    <strong>Job Role:</strong> {metadata?.jobRole}
                    <br />
                    <strong>Skills:</strong> {metadata?.skills}
                    <br />
                    <strong>Duration:</strong> {metadata?.duration?.from} -{" "}
                    {metadata?.duration?.to}
                  </>
                ) : (
                  <>
                    <strong>Document Type:</strong> {metadata?.level}
                    <br />
                    <strong>Document Name:</strong> {metadata?.name}
                    <br />
                    <strong>Organisation:</strong> {metadata?.organisation}
                    <br />
                    <strong>Duration:</strong> {metadata?.duration?.from} -{" "}
                    {metadata?.duration?.to}
                  </>
                )}
              </pre>

              {/* View Document */}
              <a
                href={metadata?.docUri}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
              >
                <FileText className="h-4 w-4" />
                View Document
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Action Buttons */}
            {popupStatus === "Document approved successfully!" ? (
              <>
                <h1 className=" text-center text-[#03257e] text-2xl font-bold">
                  Document approved. Thank you for verifying!
                </h1>
                <p className="text-center text-gray-600">
                  You may now safely close this tab.
                </p>
              </>
            ) : popupStatus === "Document rejected successfully!" ? (
              <>
                <h1 className=" text-center text-[#03257e] text-2xl font-bold">
                  Document rejected. Thank you for verifying!
                </h1>
                <p className="text-center text-gray-600">
                  You may now safely close this tab.
                </p>
              </>
            ) : (
              <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Verification Action
                </h2>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Approve */}
                  <button
                    onClick={onApprove}
                    disabled={isProcessing || !isConnected}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition
                ${isProcessing || !isConnected ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                  >
                    <CheckCircle className="h-5 w-5" />
                    Approve Document
                  </button>

                  {/* Reject */}
                  <button
                    onClick={onReject}
                    disabled={loading || !isConnected}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition
              ${loading || !isConnected ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    <XCircle className="h-5 w-5" />
                    Reject Document
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  This action is final and will be securely recorded.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-center text-[#f14419] text-md">{error}</p>
          </div>
        )}
      </div>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-center">
            {/* Loader */}
            {(isProcessing || loading) && (
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900">
              {isProcessing || loading
                ? loading
                  ? "Rejection in Progress"
                  : "Approval in Progress"
                : "Execution Status"}
            </h3>

            {/* Status text */}
            <p
              className={`mt-2 text-md font-bold ${status === "failed" ? "text-red-500" : "text-[#03257e]"}`}
            >
              {popupStatus === "approved"
                ? "Creating the asset..."
                : popupStatus === "optin"
                  ? "Opting in to the asset..."
                  : popupStatus === "transfer"
                    ? "Finalizing the transaction..."
                    : popupStatus}
            </p>

            {error && (
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={tab === "approve" ? onApprove : onReject}
                  disabled={isProcessing || loading}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition
                ${isProcessing || loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  <CheckCircle className="h-5 w-5" />
                  {tab === "approve" ? "Retry Approval" : "Retry Rejection"}
                </button>
              </div>
            )}

            {/* Close button */}
            {!isProcessing && (
              <button
                onClick={closePopup}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentVerificationPage;
