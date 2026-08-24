import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const floatingStickers = ["🪙", "✨", "🍔", "💫", "🍿", "🌟"];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating decorative Pixar stickers */}
      {floatingStickers.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl select-none pointer-events-none opacity-60"
          style={{
            left: `${10 + i * 15}%`,
            top: `${10 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🧠</div>
          <h1 className="text-3xl font-black text-white mb-2 drop-shadow-md">Welcome Back</h1>
          <p className="text-sky-200 text-sm font-medium">Log in to BudgetBrain AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-white/90 mb-1.5 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff] transition"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/90 mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff] transition"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              placeholder="••••••••"
            />
          </div>

          <div className="text-right -mt-2">
            <Link to="/forgot-password" className="text-sm font-semibold text-sky-300 hover:text-white transition">
              Forgot password?
            </Link>
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-white shadow-lg transition disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #1e6fff, #3ab5ff)",
              boxShadow: "0 4px 20px rgba(30,111,255,0.45)",
            }}
          >
            {loading ? "Logging in... ✨" : "Log In ✨"}
          </motion.button>
        </form>

        <p className="text-center text-sky-100 text-sm font-medium mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-sky-300 hover:text-white font-bold ml-1 transition">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
