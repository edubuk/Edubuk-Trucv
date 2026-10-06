import { useState } from "react";
import { Bug } from "lucide-react";
import { developerService } from "@/api/developer.apis";

const isDebugSessionActive = () =>
  document.cookie.split("; ").some((c) => c.startsWith("debugSession="));

const DebugSessionBanner = () => {
  const [switching, setSwitching] = useState(false);

  if (!isDebugSessionActive()) return null;

  const handleSwitch = async () => {
    setSwitching(true);
    try {
      await developerService.switchDebugSession();
    } finally {
      // full reload so the app's auth context re-fetches with the developer's
      // own (candidate-less) session, matching how logout/login already work here
      window.location.href = "/developer/debug";
    }
  };

  return (
    <div className="w-full bg-amber-500 text-white px-4 py-2 flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
      <div className="flex items-center gap-2">
        <Bug className="w-4 h-4 shrink-0" />
        <span>Developer debug session active — you're viewing this candidate account for debugging.</span>
      </div>
      <button
        disabled={switching}
        onClick={handleSwitch}
        className="px-3 py-1 rounded bg-white text-amber-600 font-semibold disabled:opacity-60"
      >
        {switching ? "Switching..." : "Switch session"}
      </button>
    </div>
  );
};

export default DebugSessionBanner;
