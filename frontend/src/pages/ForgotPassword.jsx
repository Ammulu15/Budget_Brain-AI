import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSent(true);
      if (res.data?.reset_link) {
        setResetLink(res.data.reset_link);
      }
    } catch (err) {
      const detail = err.response?.data?.detail || "Could not process request. Make sure backend server is running.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-3xl shadow-2xl p-8 border border-sky-400/30 relative z-10"
        style={{ background: "rgba(10, 25, 60, 0.9)" }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="text-2xl font-black text-white mb-2">Forgot Your Password?</h1>
          <p className="text-sky-200 text-sm font-medium">Enter your registered email to receive a password reset link</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-sky-200 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl font-bold text-white bg-slate-900/90 border border-sky-400/40 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="you@example.com"
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-300 text-sm font-semibold bg-rose-500/20 p-3 rounded-xl border border-rose-400/30"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold text-white shadow-lg disabled:opacity-50 transition"
              style={{ background: "linear-gradient(135deg, #1e6fff, #3ab5ff)" }}
            >
              {loading ? "Sending... ✨" : "Send Reset Link ✨"}
            </motion.button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-emerald-300 font-bold text-sm bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30">
              📬 If that email is registered, a reset link has been created!
            </p>
            {resetLink && (
              <div className="p-3 bg-sky-950/80 rounded-xl border border-sky-400/40 text-left">
                <p className="text-xs font-bold text-sky-200 mb-1">Direct Reset Link:</p>
                <a
                  href={resetLink}
                  className="text-xs font-bold text-sky-300 hover:text-white underline break-all"
                >
                  {resetLink}
                </a>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-sky-100 text-sm font-medium mt-6">
          <Link to="/login" className="text-sky-300 hover:text-white font-bold transition">
            ← Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}