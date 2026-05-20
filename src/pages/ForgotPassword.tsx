import React, { useState, useEffect } from "react";
import { Mail, Key, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate} from "react-router-dom";
import { API_BASE_URL } from "@/main";
import toast from "react-hot-toast";

// PasswordResetUI.tsx
// Single-file React + TypeScript component for Forgot Password / Reset Password flows
// Colors (as requested):
//  - brand (deep blue)   : #03257e
//  - accent (teal)       : #006666
//  - danger / action     : #f14419

// Usage:
// Route 1: <Route path="/forgot-password" element={<PasswordResetUI />} />
// Route 2: <Route path="/reset-password/:token" element={<PasswordResetUI />} />

export default function PasswordResetUI() {
  // if token param is present, show Reset form. Otherwise show Forgot form.
  const location = useLocation();

  // Extract token from query string
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        // set CSS variables here so child elements can use them inline
        // Tailwind can't reference these variables without config changes, so we use inline styles when needed
      }}
    >
      <div className="w-full max-w-xl">
        {token ? <ResetForm token={token} /> : <ForgotForm />}
      </div>
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div
      className="rounded-2xl shadow-lg p-8 bg-white"
      style={{ boxShadow: "0 10px 30px rgba(3,37,126,0.08)" }}
    >
      <h2 className="text-2xl font-semibold mb-4" style={{ color: "#03257e" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/user/password-reset-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if(data.status==="Succeeded")
      {
        toast.success(data.message);
        setDone(true);
      }else{
        toast.error(data.message);
      }
    } catch (err:any) {
      toast.error(err.message || err || "somethinmg went wrong");
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Forgot your password?">
      <p className="text-sm text-gray-600 mb-6">Enter your email and we'll send a secure reset link. The link is single-use and expires soon.</p>

      {done ? (
        <div className="rounded-md p-4" style={{ background: "#f1f8f7" }}>
          <p className="text-sm text-gray-800">If an account exists for that email, you’ll receive a reset link shortly.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail size={16} color={"#006666"} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2"
                style={{
                  boxShadow: "inset 0 1px 2px rgba(16,24,40,0.03)",
                }}
                placeholder="you@example.com"
              />
            </div>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              onClick={submit}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
              style={{
                background: "#03257e",
                color: "white",
                minWidth: 140,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Send reset link"}
              <ArrowRight size={16} />
            </button>

            <a href="/login" className="text-sm underline" style={{ color: "#006666" }}>
              Back to login
            </a>
          </div>
        </form>
      )}
    </Card>
  );
}

function ResetForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  useEffect(() => {
    // Basic UX: if token is missing, redirect to forgot page
    if (!token) navigate("/forgot-password");
  }, [token, navigate]);

  const validate = () => {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== passwordConfirm) return "Passwords do not match.";
    // add more checks if you want (complexity, dictionary, etc.)
    return null;
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/user/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data  = await res.json();

      if (!data.success) {
        setError(data?.error || data?.message || "Token is invalid or expired.");
      } else {
        setOk(true);
        // slight delay so user can see success message, then redirect to login
        setTimeout(() => navigate("/login"), 1800);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Reset your password">
      <p className="text-sm text-gray-600 mb-6">Pick a strong password. Your existing sessions will be invalidated after a successful change.</p>

      {ok ? (
        <div className="rounded-md p-4" style={{ background: "#eef8ff" }}>
          <p className="text-sm" style={{ color: "#03257e" }}>Password updated! Redirecting to login…</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">New password</span>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Key size={16} color={"#03257e"} />
              </span>
              <input
                type={seePassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2"
                placeholder="At least 8 characters"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button type="button" onClick={() => setSeePassword(!seePassword)}>
                  {seePassword ? <Eye size={16} color={"#03257e"} /> : <EyeOff size={16} color={"#03257e"} />}
                </button>
              </div>
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Confirm password</span>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Key size={16} color={"#006666"} />
              </span>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2"
                placeholder="Repeat your password"
              />
            </div>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
              style={{
                background: "#006666",
                color: "white",
                minWidth: 140,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Updating..." : "Set new password"}
              <ArrowRight size={16} />
            </button>

            <a href="/" className="text-sm underline" style={{ color: "#03257e" }}>
              Cancel
            </a>
          </div>
        </form>
      )}
    </Card>
  );
}
