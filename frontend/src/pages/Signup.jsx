import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const floatingStickers = ["🌷", "✨", "🍰", "💫", "🎀"];

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, password, fullName);
      navigate("/dashboard");
    } catch (err) {
      setError("Could not create account. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-wine to-navy-deep flex items-center justify-center px-4 relative overflow-hidden">
      {floatingStickers.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl select-none pointer-events-none opacity-80"
          style={{
            left: `${12 + i * 18}%`,
            top: `${12 + (i % 3) * 25}%`,
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
          <div className="text-4xl mb-2">🎀</div>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-blush">Start budgeting smarter with BudgetBrain AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-blush mb-1 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep transition"
              placeholder="Your name"
            />
          </div>

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
              minLength={8}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep transition"
              placeholder="At least 8 characters"
            />
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
            {loading ? "Creating account... 🌸" : "Sign Up ✨"}
          </motion.button>
        </form>

        <p className="text-center text-blush/80 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-deep hover:text-mauve font-medium">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
