import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setResetToken(res.data.reset_token || null);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-wine to-navy-deep flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-mauve/30"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="text-2xl font-bold text-white mb-2">Forgot your password?</h1>
          <p className="text-blush text-sm">Enter your email and we'll help you reset it</p>
        </div>

        {!resetToken ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep"
              placeholder="you@example.com"
            />
            {error && <p className="text-rose-300 text-sm">{error}</p>}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-deep to-mauve text-white font-semibold shadow-md disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-blush text-sm">
              In a live app, this link would be emailed to you. For this demo, here it is directly:
            </p>
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="block px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-teal-deep text-sm break-all hover:bg-white/20 transition"
            >
              Click here to reset your password
            </Link>
          </div>
        )}

        <p className="text-center text-blush/80 text-sm mt-6">
          <Link to="/login" className="text-teal-deep hover:text-mauve font-medium">
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}