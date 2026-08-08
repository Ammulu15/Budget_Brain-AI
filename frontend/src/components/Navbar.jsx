import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
        BudgetBrain AI
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-slate-300 text-sm">{user?.email}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition"
        >
          Logout
        </motion.button>
      </div>
    </nav>
  );
}