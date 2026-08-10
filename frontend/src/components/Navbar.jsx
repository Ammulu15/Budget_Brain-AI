import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/60 backdrop-blur-lg border-b border-pink-100 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
        <span>🍡</span> BudgetBrain AI
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-slate-500 text-sm">{user?.email}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="px-4 py-2 rounded-2xl bg-pink-100 text-pink-500 text-sm font-medium hover:bg-pink-200 transition"
        >
          Logout
        </motion.button>
      </div>
    </nav>
  );
}