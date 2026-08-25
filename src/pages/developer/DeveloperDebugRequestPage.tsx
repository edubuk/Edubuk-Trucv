import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { developerService } from "@/api/developer.apis";

const DeveloperDebugRequestPage = () => {
  const [developerEmail, setDeveloperEmail] = useState<string | null>(null);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    developerService.getCurrentDeveloper().then((res) => {
      if (res.success) setDeveloperEmail(res.developer.email);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!developerEmail) return;
    setLoading(true);
    setSent(false);
    try {
      const res = await developerService.requestDebugSession(candidateEmail, developerEmail);
      if (res.success) {
        toast.success(res.message);
        setSent(true);
      } else {
        toast.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await developerService.developerLogout();
    window.location.href = "/developer/sign-in";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#03257e] text-center mb-1">Start a Debug Session</h2>
        {developerEmail && (
          <p className="text-sm text-slate-400 text-center mb-6">Signed in as {developerEmail}</p>
        )}

        {sent ? (
          <div className="text-center text-sm text-slate-600 border border-slate-200 rounded-lg p-4">
            Check your inbox ({developerEmail}) for a confirmation link. It expires in 15 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Your email*</span>
              <input
                type="email"
                required
                value={developerEmail ?? ""}
                onChange={(e) => setDeveloperEmail(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#03257e]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Candidate email to debug as*</span>
              <input
                type="email"
                required
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#03257e]"
              />
            </label>

            <button
              type="submit"
              disabled={loading || !developerEmail}
              className="mt-2 w-full py-3 rounded-lg font-semibold text-white shadow hover:shadow-md focus:outline-none"
              style={{ backgroundColor: loading ? "#8aa0d6" : "#03257e" }}
            >
              {loading ? "Sending..." : "Send confirmation email"}
            </button>
          </form>
        )}

        <button
          onClick={handleSignOut}
          className="mt-6 w-full text-center text-sm text-slate-400 hover:text-slate-600 underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default DeveloperDebugRequestPage;
