import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { FileScan, AlertTriangle, Award, DownloadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddCertToLinkedIn from "./AddCertToLinkedIn";
import toast from "react-hot-toast";
import ThreeDotLoader from "../Loader/ThreeDotLoader";
import { useUserData } from "@/context/AuthContext";

interface CertificateProps {
  cvData: any[];
}

const Certificate: React.FC<CertificateProps> = ({ cvData }) => {
  const [certificationData, setCertificationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {user} = useUserData();

  const fetchCertificationData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hackathon/certification-data");
      setCertificationData(res.data);
      console.log("certification data", res.data);
    } catch (error) {
      console.log("Failed to fetch certification data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificationData();
  }, []);

  const handleDownload = async (url: string) => {
    // Fetch file as blob
    const response = await fetch(url);
    const blob = await response.blob();

    // Create object URL
    const blobUrl = window.URL.createObjectURL(blob);

    // Force download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "mypdf.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Cleanup
    window.URL.revokeObjectURL(blobUrl);
  };

  const generateCertificate = () => {
    if (!cvData || cvData.length === 0) {
      toast.error("No CV found. Please create a CV first.");
      return;
    } else {
      navigate("/certificate-timer");
    }
    console.log("Generating certificate...");
  };

  if (loading) {
    return <ThreeDotLoader w={4} h={4} yPos={"center"} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
          🧩
          </span>
        ))}
      </div>

      {/* Header text */}
      <h1 className="relative z-10 text-3xl font-bold text-gray-900 text-center frost-text font-['Inter'] text-3xl font-extrabold">
        INSIDE THE MIND OF HACKER HACKATHON
      </h1>
      <h1 className="relative z-10 text-2xl font-bold text-[#03257e] text-center font-['Inter'] text-2xl font-extrabold">
        Series - 1 Certification
      </h1>
      <Alert
        variant="destructive"
        className="rounded-2xl border-l-4 border-red-600 shadow-md max-w-xl mx-auto my-5 "
      >
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <div>
          <AlertTitle className="font-semibold text-red-700">
            Important Notice
          </AlertTitle>
          <AlertDescription className="text-gray-700">
            You can only generate a certificate after the creating the CV.
          </AlertDescription>
        </div>
      </Alert>
      <div className="max-w-xl mx-auto mt-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg">
        {!certificationData?.certification?.certUrl ? (
          <div className="max-w-xl mx-auto mt-8 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-7 shadow-xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <svg
                  className="h-7 w-7 text-[#03257e]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#03257e]">
                Certificate Generation
              </h2>
              <p className="text-sm text-gray-600 max-w-md">
                You can generate and download your official hackathon
                certificate from here.
              </p>

              <button
                onClick={generateCertificate}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#006666] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#008888] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#006666]"
              >
                Generate Certificate
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Left */}
              <div>
                <span className="block text-base font-semibold capitalize text-gray-900">
                  INSIDE THE MIND OF HACKER
                </span>
                <p className="mt-1 text-sm text-gray-500">
                  Taken on 17 Jan 2026
                </p>
              </div>

              {/* Right actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className=" relative group flex items-center gap-2 rounded-full bg-[#e8f4f8] px-3 py-2 text-sm font-medium text-[#03257e]"
                  onClick={() =>
                    handleDownload(
                      `https://trucvstorage.blob.core.windows.net/uploads/${certificationData?.certification?.certUrl}`,
                    )
                  }
                >
                  <DownloadIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Download</span>
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    Download your certificate
                  </span>
                </button>

                <a
                  href="https://www.edubukeseal.xyz/verifier"
                  target="_blank"
                  rel="noreferrer"
                  className="relative flex items-center justify-center group"
                >
                  <FileScan className="h-6 w-6 text-[#03257e]" />

                  {/* Tooltip */}
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    Verify your certificate
                  </span>
                </a>

                <Award className="h-6 w-6 text-[#006666]" />
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 space-y-4">
              <div className="flex w-full flex-col items-center gap-3">
                <AddCertToLinkedIn
                  certName="SNOW FROST HACKATHON Participation Certificate"
                  organizationId={110972920}
                  issueYear={2026}
                  issueMonth={1}
                  certUrl={`https://trucvstorage.blob.core.windows.net/uploads/${certificationData?.certification?.certUrl}`}
                  certId={Number(user?.uuid) || 110972920}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificate;
