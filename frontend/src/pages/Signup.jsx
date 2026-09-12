import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const floatingMascots = [
  "/characters/piggy.png",
  "/characters/car.png",
  "/characters/cart.png",
  "/characters/burger.png",
  "/characters/popcorn.png",
];

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {floatingMascots.map((src, i) => (
        <motion.div
          key={i}
          className="absolute w-14 h-14 select-none pointer-events-none opacity-40 hover:opacity-80 transition"
          style={{
            left: `${10 + i * 18}%`,
            top: `${12 + (i % 3) * 26}%`,
          }}
          animate={{ y: [0, -16, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={src} alt="mascot" className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 drop-shadow-md">Create Account</h1>
          <p className="text-sky-200 text-sm font-medium">Start budgeting smarter with BudgetBrain AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-white/90 mb-1.5 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff] transition"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              placeholder="Your Name"
            />
          </div>

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
              minLength={8}
              className="w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff] transition"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              placeholder="At least 8 characters"
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
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center text-sky-100 text-sm font-medium mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-300 hover:text-white font-bold ml-1 transition">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
