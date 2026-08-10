import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const floatingStickers = ["🍰", "✨", "🎀", "💫", "🧁", "🌸"];

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
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-wine to-navy-deep flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating decorative stickers */}
      {floatingStickers.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl select-none pointer-events-none opacity-80"
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
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-mauve/30 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌷</div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-blush">Log in to BudgetBrain AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-blush mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-blush mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep transition"
              placeholder="••••••••"
            />
          </div>
          <div className="text-right -mt-2">
  <Link to="/forgot-password" className="text-sm text-teal-deep hover:text-mauve">
    Forgot password?
  </Link>
</div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-300 text-sm"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-deep to-mauve text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in... 🌸" : "Log In ✨"}
          </motion.button>
        </form>

        <p className="text-center text-blush/80 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-deep hover:text-mauve font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
