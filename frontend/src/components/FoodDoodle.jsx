import { motion } from "framer-motion";

// Cute kawaii-style icons with eyes, matched to the jewel-tone palette.
// Usage: <FoodDoodle type="pizza" /> or "burger", "coffee", "shopping", "savings"

const doodles = {
  pizza: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 8 L56 52 L8 52 Z" fill="#e8c4cb" stroke="#7a1f4d" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="26" cy="34" r="3" fill="#b0698f" />
      <circle cx="38" cy="30" r="3" fill="#b0698f" />
      <circle cx="32" cy="44" r="3" fill="#b0698f" />
      {/* eyes */}
      <circle cx="26" cy="20" r="2.5" fill="#1f3a44" />
      <circle cx="38" cy="20" r="2.5" fill="#1f3a44" />
      <path d="M28 26 Q32 29 36 26" stroke="#1f3a44" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  burger: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M10 26 Q10 14 32 14 Q54 14 54 26 Z" fill="#e3b8c9" stroke="#7a1f4d" strokeWidth="2" />
      <rect x="10" y="27" width="44" height="6" rx="2" fill="#4f8a86" stroke="#1f3a44" strokeWidth="1.5" />
      <rect x="10" y="35" width="44" height="7" rx="2" fill="#b0698f" stroke="#7a1f4d" strokeWidth="1.5" />
      <path d="M10 44 Q10 52 32 52 Q54 52 54 44 Z" fill="#e8c4cb" stroke="#7a1f4d" strokeWidth="2" />
      {/* eyes on the top bun */}
      <circle cx="25" cy="19" r="2.2" fill="#1f3a44" />
      <circle cx="39" cy="19" r="2.2" fill="#1f3a44" />
      <path d="M27 23 Q32 25 37 23" stroke="#1f3a44" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  coffee: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M14 24 H44 V42 Q44 52 29 52 Q14 52 14 42 Z" fill="#4f8a86" stroke="#1f3a44" strokeWidth="2" />
      <path d="M44 28 Q54 28 54 36 Q54 44 44 42" stroke="#1f3a44" strokeWidth="2" fill="none" />
      <circle cx="24" cy="34" r="2.2" fill="#e3b8c9" />
      <circle cx="34" cy="34" r="2.2" fill="#e3b8c9" />
      <path d="M25 39 Q29 41 33 39" stroke="#e3b8c9" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  shopping: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M16 22 H48 L45 52 H19 Z" fill="#b0698f" stroke="#7a1f4d" strokeWidth="2" />
      <path d="M24 22 V16 Q24 8 32 8 Q40 8 40 16 V22" stroke="#7a1f4d" strokeWidth="2" fill="none" />
      <circle cx="27" cy="34" r="2.2" fill="#e8c4cb" />
      <circle cx="37" cy="34" r="2.2" fill="#e8c4cb" />
      <path d="M28 39 Q32 41 36 39" stroke="#e8c4cb" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  savings: (
    <svg viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="36" rx="22" ry="16" fill="#e3b8c9" stroke="#7a1f4d" strokeWidth="2" />
      <path d="M50 30 Q58 28 58 34 Q58 38 50 38" fill="#e3b8c9" stroke="#7a1f4d" strokeWidth="2" />
      <circle cx="46" cy="20" r="6" fill="#e3b8c9" stroke="#7a1f4d" strokeWidth="2" />
      <circle cx="26" cy="34" r="2.2" fill="#7a1f4d" />
      <circle cx="36" cy="34" r="2.2" fill="#7a1f4d" />
      <path d="M27 40 Q31 42 35 40" stroke="#7a1f4d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="20" y="46" width="4" height="6" rx="1" fill="#7a1f4d" />
      <rect x="40" y="46" width="4" height="6" rx="1" fill="#7a1f4d" />
    </svg>
  ),
};

export default function FoodDoodle({ type = "shopping", size = 40 }) {
  return (
    <motion.div
      whileHover={{ scale: 1.15, rotate: [0, -6, 6, 0] }}
      transition={{ duration: 0.4 }}
      style={{ width: size, height: size }}
      className="inline-block cursor-pointer"
    >
      {doodles[type] || doodles.shopping}
    </motion.div>
  );
}
