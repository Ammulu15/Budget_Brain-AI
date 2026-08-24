import { motion } from "framer-motion";

export default function StatCard({ label, value, gradient, emoji, image, onClick, active, characterStyle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -10, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative rounded-3xl overflow-visible cursor-pointer group transition-all ${
        active ? "ring-4 ring-white/70 ring-offset-2 ring-offset-transparent" : ""
      }`}
      style={{ minHeight: "148px" }}
    >
      {/* Card glass body */}
      <div
        className={`glass-card rounded-3xl p-5 h-full bg-gradient-to-br ${gradient} relative overflow-hidden`}
      >
        {/* Shiny light sweep on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
          }}
        />

        {/* Sparkle dots */}
        <div className="absolute top-3 right-14 w-1.5 h-1.5 rounded-full bg-white opacity-60 group-hover:opacity-100 transition" />
        <div className="absolute top-6 right-10 w-1 h-1 rounded-full bg-white opacity-40" />

        {/* Label */}
        <p className="text-white/90 text-xs font-semibold uppercase tracking-widest mb-1 relative z-10">{label}</p>

        {/* Value */}
        <p className="text-white text-3xl font-black mt-1 relative z-10 drop-shadow-sm">
          ₹{typeof value === "number" ? value.toLocaleString() : value}
        </p>

        {/* Active filter pill */}
        {active && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-3 left-5 text-[9px] font-bold text-white/90 uppercase tracking-widest bg-white/25 px-2 py-0.5 rounded-full border border-white/30"
          >
            ● Active
          </motion.span>
        )}
      </div>

      {/* 3D Character — floats ABOVE the card, no box/frame */}
      {image && (
        <motion.div
          className="absolute -top-10 -right-3 z-30 pointer-events-none"
          animate={{ y: [0, -7, 0], rotate: [0, 2, -2, 0] }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.35))" }}
        >
          <img
            src={image}
            alt={label}
            className="w-24 h-24 object-contain"
            style={{ mixBlendMode: "normal" }}
          />
        </motion.div>
      )}

      {!image && emoji && (
        <motion.span
          className="absolute -top-6 -right-1 text-5xl z-30 pointer-events-none"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}
        >
          {emoji}
        </motion.span>
      )}
    </motion.div>
  );
}