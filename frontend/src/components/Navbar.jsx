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
    <nav className="relative z-50 px-6 py-4 flex items-center justify-between flex-wrap gap-3"
      style={{
        background: "linear-gradient(90deg, rgba(10,36,99,0.92) 0%, rgba(26,42,108,0.88) 50%, rgba(31,58,68,0.9) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(58,181,255,0.25)",
        boxShadow: "0 4px 32px rgba(30,111,255,0.15), 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Glow line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(58,181,255,0.6), rgba(176,105,143,0.6), transparent)" }}
      />

      {/* Logo */}
      <motion.h1
        whileHover={{ scale: 1.04 }}
        className="text-xl font-black flex items-center gap-2 select-none"
        style={{
          background: "linear-gradient(90deg, #3ab5ff, #6a8fff, #e3b8c9, #ffd23f)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 12px rgba(58,181,255,0.5))",
        }}
      >
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          🧠
        </motion.span>
        BudgetBrain AI
      </motion.h1>

      {/* Nav links */}
      <div className="flex items-center gap-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}>
              <motion.span
                whileHover={{ scale: 1.07, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-1.5 transition-all"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #1e6fff, #3ab5ff)",
                        color: "#fff",
                        boxShadow: "0 4px 20px rgba(30,111,255,0.45)",
                      }
                    : {
                        color: "rgba(227,184,201,0.9)",
                        background: "rgba(255,255,255,0.06)",
                      }
                }
              >
                <span>{link.emoji}</span> {link.label}
              </motion.span>
            </Link>
          );
        })}
      </div>

      {/* User & logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium" style={{ color: "rgba(58,181,255,0.85)" }}>
          {user?.email}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="px-4 py-2 rounded-2xl text-sm font-semibold transition-all"
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Logout
        </motion.button>
      </div>
    </nav>
  );
}
