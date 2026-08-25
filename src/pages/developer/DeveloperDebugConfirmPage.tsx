import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { developerService } from "@/api/developer.apis";

type ConfirmState = "confirming" | "success" | "error";

const DeveloperDebugConfirmPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<ConfirmState>("confirming");
  const [message, setMessage] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    if (!token) {
      setState("error");
      setMessage("Missing confirmation link");
      return;
    }

    developerService.confirmDebugSession(token).then((res) => {
      if (res.success) {
        setCandidateEmail(res.candidate.email);
        setState("success");
        // full reload so the app's auth context picks up the freshly-set
        // candidate accessToken/refreshToken cookies (it only fetches once on mount)
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setState("error");
        setMessage(res.message);
      }
    });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 text-center">
      {state === "confirming" && (
        <p className="text-[#03257e] text-lg">Confirming debug session...</p>
      )}
      {state === "success" && (
        <div>
          <p className="text-green-600 text-lg font-semibold">
            Debug session started as {candidateEmail}
          </p>
          <p className="text-sm text-slate-400 mt-2">Redirecting...</p>
        </div>
      )}
      {state === "error" && (
        <div>
          <p className="text-red-600 text-lg font-semibold">{message}</p>
          <Link to="/developer/debug" className="text-[#03257e] underline mt-4 inline-block">
            Back to debug request
          </Link>
        </div>
      )}
    </div>
  );
};

export default DeveloperDebugConfirmPage;
