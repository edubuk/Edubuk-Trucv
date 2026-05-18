import { useState, useEffect, useRef } from "react";
import { useLocation, Link} from "react-router-dom";
import { API_BASE_URL } from "@/main";
import {
  CheckCircle,
  FileText,
  QrCode,
  Upload,
  Shield,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/AuthContext";
import { uploadFile } from "@/uploadFile";
import AddCertToLinkedIn from "../Dashboard/AddCertToLinkedIn";

const steps = [
  { id: 1, label: "Verification", icon: CheckCircle, endpoint: "/api/verify" },
  {
    id: 2,
    label: "Certificate Generation",
    icon: FileText,
    endpoint: "/api/generate-certificate",
  },
  {
    id: 3,
    label: "QR Code Attachment",
    icon: QrCode,
    endpoint: "/api/attach-qr",
  },
  {
    id: 4,
    label: "Certificate Upload",
    icon: Upload,
    endpoint: "/api/upload-certificate",
  },
  {
    id: 5,
    label: "Blockchain Registration",
    icon: Shield,
    endpoint: "/api/register-blockchain",
  },
];

export default function CertificateStepper() {
  const [currentStep, setCurrentStep] = useState(0); // index
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [failedStep, setFailedStep] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const id = useLocation().pathname.split("/").pop();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const {user} = useUserData();
  const storedData = JSON.parse(localStorage.getItem("uploadData") || "{}");
  //console.log("userFormData", userFormData);
  const [allStepData, setAllStepData] = useState<any>({
    name: user?.name,
    certificate_type: "",
    certId: "",
    fileHash: "",
    uri: "",
    issuerName: "AARVAK VSE&T",
    assessmentId: id,
  });

  // To avoid stale closures when updating allStepData inside async handlers
  // Guards & inflight map
  const hasStartedRef = useRef(false); // prevents auto-run from starting more than once
  const inFlightPromisesRef = useRef<Map<number, Promise<any>>>(new Map());
  const allStepDataRef = useRef(allStepData);
  useEffect(() => {
    allStepDataRef.current = allStepData;
  }, [allStepData]);

  function base64ToBlob(base64: string, contentType = "application/pdf") {
    const byteCharacters = atob(base64); // Decode base64
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  // Mock API call used for steps without concrete implementation
  const mockAPICall = (
    stepIndex: number
  ): Promise<{ success: boolean; error?: string; data?: any }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const shouldFail = Math.random() < 0.1; // small failure chance
        if (shouldFail) {
          resolve({
            success: false,
            error: `Failed to complete ${steps[stepIndex].label}. Please try again.`,
          });
        } else {
          resolve({ success: true, data: { info: "ok" } });
        }
      }, 1200 + Math.random() * 800);
    });
  };

  // Handler for step 0: Verification (example - using mock)
  const handleVerification = async () => {
    // Replace with real verification logic if you have it
    return await mockAPICall(0);
  };

  // Handler for Certificate Generation (step 1)
  const handleGenerationAndUpload = async () => {
    try {
      // 1) Generate certificate (external service)
      if(storedData && storedData.cert_id && storedData.fileHashWithTimeStampExt && storedData.url) {
        const uploadData = storedData;
        console.log("uploadData", uploadData);
        setAllStepData((prev: any) => {
        const next = {
          ...prev,
          certId: uploadData.cert_id,
          fileHash: uploadData?.fileHashWithTimeStampExt?.split("_")[0],
          uri: uploadData.url,
        };
        console.log("next", next);
        allStepDataRef.current = next;
        return next;
      });
      return {
        success: true,
        data: { certId: uploadData.cert_id, upload: uploadData },
      };
    }
      const res: any = await fetch("https://edubuktrucveduchain.org/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.name,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Generation failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      console.log("data", data);
      if (!data || !data.pdf_base64 || !data.cert_id) {
        throw new Error("Invalid generation response");
      }

      // convert base64 to file and upload to your BASE_URL upload endpoint
      const responseBlob = base64ToBlob(data.pdf_base64);
      const file = new File([responseBlob], "document.pdf", {
        type: "application/pdf",
      });
      const formData = new FormData();
      formData.append("file", file);

      const upload: any = await uploadFile(formData);

      if (!upload.data.success) {
        throw new Error(`Upload failed: ${upload.data.message}`);
      }
      const dataToSTore = {
        ...upload.data,
        cert_id: data.cert_id,
      }
      localStorage.setItem("uploadData", JSON.stringify(dataToSTore));
      const uploadData = dataToSTore;
      console.log("uploadData", uploadData);
      // Update step data
      setAllStepData((prev: any) => {
        const next = {
          ...prev,
          certId: data.cert_id,
          fileHash: uploadData.fileHashWithTimeStampExt.split("_")[0],
          uri: uploadData.fileHashWithTimeStampExt,
        };
        allStepDataRef.current = next;
        return next;
      });

      return {
        success: true,
        data: { certId: data.cert_id, upload: uploadData },
      };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  };

  // Handler for mapping QR (step 2)
  const handleAttachQr = async () => {
    try {
      const payload = {
        url: allStepDataRef.current.uri || storedData.url,
        id: allStepDataRef.current.certId || storedData.cert_id,
        hackathonName: "Code Royale: The Final Iteration Hackathon",
      };
      const mappingUrl: any = await fetch(
        `${API_BASE_URL}/api/v1/certification/dynamicQrUrlMap`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!mappingUrl.ok) {
        const txt = await mappingUrl.text().catch(() => "");
        throw new Error(`QR mapping failed: ${mappingUrl.status} ${txt}`);
      }

      const mappingUrlData = await mappingUrl.json();
      console.log("mappingUrlData", mappingUrlData);
      // if the API returns useful info, you can store it
      setAllStepData((prev: any) => {
        const next = { ...prev, qrMapping: mappingUrlData };
        allStepDataRef.current = next;
        return next;
      });

      return { success: true, data: mappingUrlData };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  };

  // Handler for certificate upload step (if you need any extra logic - here we mock)
  const handleCertificateUpload = async () => {
    // If everything was uploaded already in generation step, this can be a no-op or a verification call
    return await mockAPICall(3);
  };

  // Handler for blockchain registration (step 4)
  const handleRegisterOnChain = async () => {
    try {
      const payload = {
        name: user?.name || "",
        uri: allStepDataRef.current.uri || storedData.url,
        filehash: allStepDataRef.current.fileHash || storedData.fileHashWithTimeStampExt.split("_")[0],
        certificateType:"Participation",
        issuerName: "AARVAK VSE&T",
        hackathonName: "Code Royale: The Final Iteration Hackathon",
      };

      const txData = await fetch(`${API_BASE_URL}/api/v1/certification/register-on-chain`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!txData.ok) {
        const txt = await txData.text().catch(() => "");
        throw new Error(`Chain registration failed: ${txData.status} ${txt}`);
      }

      const tx = await txData.json();
       setTxHash(tx.txHash);
      setAllStepData((prev: any) => {
        const next = { ...prev, onChainTx: tx };
        allStepDataRef.current = next;
        return next;
      });
      return { success: true, data: tx };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  };

  // Map of handlers aligned with steps array (index-based)
  const stepHandlers: Array<
    () => Promise<{ success: boolean; error?: string; data?: any }>
  > = [
      handleVerification,
      handleGenerationAndUpload,
      handleAttachQr,
      handleCertificateUpload,
      handleRegisterOnChain,
    ];

  // simulate progress within a step (sets state.progress)
  const simulateProgressForStep = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / 30; // ~30 ticks
        return next >= 95 ? 95 : next;
      });
    }, 60);
    return () => clearInterval(interval);
  };

  // Process one step (used for both initial run and retry)
  const processSingleStep = async (index: number) => {
    // If already completed, skip
    if (completedSteps.includes(index)) {
      return { ok: true, data: null };
    }

    // If a call for this step is already in-flight, reuse it instead of starting a new call
    const existingPromise = inFlightPromisesRef.current.get(index);
    if (existingPromise) {
      // Wait for the existing run to finish and then return result shape consistent with function
      try {
        const existingResult = await existingPromise;
        return existingResult;
      } catch (err: any) {
        return { ok: false, error: err?.message || String(err) };
      }
    }

    // Create a wrapper promise so concurrent callers reuse it
    const stepPromise = (async () => {
      setIsProcessing(true);
      setErrorMessage("");
      setFailedStep(null);
      setCurrentStep(index);

      const stopSim = simulateProgressForStep();

      let handlerResult;
      try {
        const handler = stepHandlers[index];
        handlerResult = await handler();
      } catch (err: any) {
        handlerResult = { success: false, error: err?.message || String(err) };
      } finally {
        stopSim();
        setProgress(100);
      }

      if (handlerResult.success) {
        // mark step completed - functional update prevents races
        setCompletedSteps((prev) => {
          if (!prev.includes(index)) return [...prev, index];
          return prev;
        });
        setIsProcessing(false);
        setProgress(0);
        return { ok: true, data: handlerResult.data };
      } else {
        setFailedStep(index);
        setErrorMessage(handlerResult.error || "An error occurred");
        setIsProcessing(false);
        return { ok: false, error: handlerResult.error };
      }
    })();

    // register in-flight promise and ensure cleanup
    inFlightPromisesRef.current.set(index, stepPromise);
    try {
      const r = await stepPromise;
      return r;
    } finally {
      // always remove after resolution so future retries can run
      inFlightPromisesRef.current.delete(index);
    }
  };


  // Main sequential runner that runs all steps one after another unless a step fails
  const runAllStepsSequentially = async (startIndex = 0) => {
    // If some steps already completed (e.g., after retry), start after them
    for (let i = startIndex; i < steps.length; i++) {
      // skip already completed steps
      if (completedSteps.includes(i)) continue;

      const res = await processSingleStep(i);
      if (!res.ok) {
        // stop the sequence on failure - failedStep already set inside processSingleStep
        break;
      }
      // proceed to next step
    }
  };

  // Retry only the failed step (and resume subsequent steps if retry succeeds)
  const retryStep = async () => {
    if (failedStep === null) return;
    const idx = failedStep;

    // prevent accidental concurrent retry calls
    if (inFlightPromisesRef.current.has(idx)) return;

    setFailedStep(null);
    setErrorMessage("");
    const res = await processSingleStep(idx);

    // If you *do not* want automatic continuation to next steps, comment the next block out:
    if (res.ok) {
      // optionally resume: only use this if you want to continue after successful retry
      await runAllStepsSequentially(idx + 1);
    }
    setErrorCount((prev) => prev + 1);
    console.log("countError", errorCount);
    
  };


  // Start auto-run on mount (you can also trigger via a button if you want)
  useEffect(() => {
    if (hasStartedRef.current) return; // already started
    hasStartedRef.current = true;

    // compute the real first incomplete
    const firstIncomplete = steps.findIndex((_, i) => !completedSteps.includes(i));
    if (firstIncomplete === -1) return; // nothing to do

    runAllStepsSequentially(firstIncomplete).catch((err) =>
      console.error("Run error:", err)
    );

    // no extra deps -> mount-only. We used a ref to prevent duplicate starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // UI rendering
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Certificate Processing
          </h1>
          <p className="text-gray-600">
            Your exam certificate is being generated and secured
          </p>
          <p className="text-[#03257e]">
            <span className="font-bold text-red-500">Note:</span> Please do not refresh or close this page before completion of certificate generation
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          {!txHash ? <div className="space-y-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(index);
              const isActive =
                currentStep === index && !failedStep && isProcessing;
              const isFailed = failedStep === index;
              const isPending =
                !isCompleted && !isActive && !isFailed && index > currentStep;

              return (
                <div key={step.id} className="relative">
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 flex-shrink-0
                        ${isCompleted ? "bg-[#016765] scale-110" : ""}
                        ${isActive ? "bg-blue-500 animate-pulse" : ""}
                        ${isFailed ? "bg-red-500" : ""}
                        ${isPending ? "bg-gray-300" : ""}
                      `}
                    >
                      {isFailed ? (
                        <AlertCircle className="w-7 h-7 text-white" />
                      ) : (
                        <StepIcon
                          className={`
                            w-7 h-7 transition-all duration-300
                            ${isCompleted ? "text-white" : ""}
                            ${isActive ? "text-white" : ""}
                            ${isPending ? "text-gray-500" : ""}
                          `}
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`
                          text-lg font-semibold transition-colors duration-300
                          ${isCompleted ? "text-gray-900" : ""}
                          ${isActive ? "text-gray-900" : ""}
                          ${isFailed ? "text-red-600" : ""}
                          ${isPending ? "text-gray-400" : ""}
                        `}
                      >
                        {step.label}
                      </h3>

                      {isActive && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-100 ease-linear"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-sm text-blue-600 mt-1">
                            Processing...
                          </p>
                        </div>
                      )}

                      {isCompleted && (
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Completed
                        </p>
                      )}

                      {isFailed && (
                        <div className="flex flex-col gap-2">
                        <div className="mt-2">
                          <p className="text-sm text-red-600 mb-2">
                            {errorMessage}
                          </p>
                          <Button
                            onClick={retryStep}
                            disabled={isProcessing}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm h-8 px-4 cursor-pointer"
                          >
                            <RefreshCw
                              className={`w-4 h-4 mr-1 cursor-pointer ${isProcessing ? "animate-spin" : ""
                                }`}
                            />
                            Retry
                          </Button>
                        </div>
                        {errorCount > 5 && <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-500 mt-2">if you have already retried more than 3-4 times and still facing issue, please go back to dashboard. Your certificate are in queue and will available in dashboard after some time.</p>
                        <Link to="/user/dashboard" className="bg-[#016765] text-white text-center cursor-pointer hover:bg-[#016765]/80 py-2 px-2 rounded-xl w-40">Go to Dashboard</Link>
                        </div>}
                        </div>
                      )}
                    </div>
                  </div>
                   {index < steps.length - 1 && (
                    <div
                      className={`
                        absolute left-7 top-16 w-0.5 h-6 transition-colors duration-500
                        ${isCompleted ? "bg-green-500" : "bg-gray-300"}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div> : (
            <div className="mt-8 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#016765] rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                All Done!
              </h2>
              <p className="text-green-600 mb-4">
                Your certificate has been generated and registered on the
                blockchain
              </p>
              <div className="flex items-center justify-center gap-2">
                <a href={`https://trucvstorage.blob.core.windows.net/uploads/${allStepData?.uri}`} target="_blank" rel="noopener noreferrer" className="bg-[#016765] text-white cursor-pointer hover:bg-[#016765]/80 py-3 px-6 rounded-xl">
                  View Certificate
                </a>
                <AddCertToLinkedIn
                  certName="Certificate of Participation in Code Royale: The Final Iteration Hackathon"
                  organizationId={109555290}
                  issueYear={2026}
                  issueMonth={4}
                  certUrl={`https://trucvstorage.blob.core.windows.net/uploads/${allStepData?.uri}`}
                  certId={Number(user?.uuid)|| 109555290}
                />
                <Link to="/dashboard" className="bg-[#016765] text-white cursor-pointer hover:bg-[#016765]/80 py-3 px-6 rounded-xl">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}