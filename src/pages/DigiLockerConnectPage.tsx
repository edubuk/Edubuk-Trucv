import { useEffect, useState } from "react";

export default function DigiLockerSuccess() {
  const [countdown, setCountdown] = useState(5);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      handleClose();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleClose = () => {
    setClosed(true);
    window.opener?.postMessage({ type: "DIGILOCKER_SUCCESS" }, "*");
    window.close();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #03257e08 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, #00666608 0%, transparent 50%)`,
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #03257e, #006666)" }} />

          <div className="px-10 py-12 text-center">

            {/* Success icon */}
            <div className="relative mx-auto mb-8 w-20 h-20">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full opacity-10"
                style={{ background: "#006666" }}
              />
              {/* Inner circle */}
              <div
                className="absolute inset-2 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #03257e15, #00666625)" }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#006666"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Pulse ring */}
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: "#006666", animationDuration: "2s" }}
              />
            </div>

            {/* DigiLocker logo row */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "#03257e" }}
              >
                D
              </div>
              <span className="text-sm font-semibold tracking-wide" style={{ color: "#03257e" }}>
                DigiLocker
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mx-1">
                <path d="M9 12l2 2 4-4" stroke="#006666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="#006666" strokeWidth="1.5" />
              </svg>
              <span className="text-sm font-medium text-gray-400">Verified</span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold mb-3" style={{ color: "#03257e" }}>
              You're Connected!
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              Your DigiLocker account has been successfully linked.
            </p>
            <p className="text-gray-400 text-sm mb-10">
              You can now close this window and go back to use DigiLocker.
            </p>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="w-full py-3 px-6 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #03257e, #006666)" }}
            >
              Close Window
            </button>

            {/* Countdown */}
            {!closed && (
              <p className="mt-4 text-xs text-gray-400">
                Closing automatically in{" "}
                <span className="font-semibold" style={{ color: "#006666" }}>
                  {countdown}s
                </span>
              </p>
            )}

            {/* If window didn't close */}
            {closed && (
              <p className="mt-4 text-xs text-gray-400">
                You may close this tab manually.
              </p>
            )}
          </div>

          {/* Bottom strip */}
          <div className="px-10 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.8" />
              <path d="M8 11V7a4 4 0 018 0v4" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-gray-400">
              Secured by{" "}
              <span className="font-medium" style={{ color: "#03257e" }}>
                Ministry of Electronics & IT, India
              </span>
            </span>
          </div>
        </div>

        {/* Shadow decoration */}
        <div
          className="absolute -bottom-3 left-6 right-6 h-4 rounded-b-2xl -z-10 blur-sm opacity-20"
          style={{ background: "#03257e" }}
        />
      </div>
    </div>
  );
}