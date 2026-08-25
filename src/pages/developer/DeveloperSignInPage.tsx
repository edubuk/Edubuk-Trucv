import { useState } from "react";
import toast from "react-hot-toast";
import { developerService } from "@/api/developer.apis";

const DeveloperSignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await developerService.developerSignIn(email, password);
      if (res.success) {
        toast.success("Signed in successfully");
        window.location.href = "/developer/debug";
      } else {
        toast.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#03257e] text-center mb-1">Developer Portal</h2>
        <p className="text-sm text-slate-400 text-center mb-6">Internal debug/impersonation access</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email Address*</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#03257e]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password*</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#03257e]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded-lg font-semibold text-white shadow hover:shadow-md focus:outline-none"
            style={{ backgroundColor: loading ? "#8aa0d6" : "#03257e" }}
          >
            {loading ? "Signing you in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeveloperSignInPage;
