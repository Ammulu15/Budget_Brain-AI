import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", emoji: "🏠" },
  { to: "/budgets", label: "Budgets", emoji: "🎯" },
  { to: "/goals", label: "Goals", emoji: "🌟" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-navy-deep/90 backdrop-blur-lg border-b border-mauve/20 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
      <h1 className="text-xl font-bold bg-gradient-to-r from-teal-deep via-mauve to-blush bg-clip-text text-transparent flex items-center gap-2">
        <span>🍡</span> BudgetBrain AI
      </h1>

      <div className="flex items-center gap-2">
        {links.map((link) => (
          <Link key={link.to} to={link.to}>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition ${
                location.pathname === link.to
                  ? "bg-gradient-to-r from-teal-deep to-mauve text-white"
                  : "text-blush hover:bg-white/10"
              }`}
            >
              <span>{link.emoji}</span> {link.label}
            </motion.span>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-blush text-sm">{user?.email}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="px-4 py-2 rounded-2xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition"
        >
          Logout
        </motion.button>
      </div>
    </nav>
  );
}
