import { motion, AnimatePresence } from "framer-motion";

// A little character whose face reacts to your financial health.
// mood is derived from savings vs income ratio - happy when saving well,
// sad when expenses are eating into or exceeding income.

function getMood(income, expenses) {
  if (income === 0 && expenses === 0) return "neutral";
  const savingsRatio = income > 0 ? (income - expenses) / income : -1;
  if (savingsRatio >= 0.3) return "excited";
  if (savingsRatio >= 0) return "happy";
  if (savingsRatio >= -0.2) return "worried";
  return "sad";
}

const faces = {
  excited: {
    eyes: <><path d="M20 26 Q24 20 28 26" stroke="#1f3a44" strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M36 26 Q40 20 44 26" stroke="#1f3a44" strokeWidth="2.5" fill="none" strokeLinecap="round" /></>,
    mouth: <path d="M22 36 Q32 48 42 36" stroke="#1f3a44" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    blush: true,
    sparkle: true,
    message: "Amazing savings! Keep it up! ✨",
  },
  happy: {
    eyes: <><circle cx="24" cy="26" r="2.5" fill="#1f3a44" /><circle cx="40" cy="26" r="2.5" fill="#1f3a44" /></>,
    mouth: <path d="M24 35 Q32 42 40 35" stroke="#1f3a44" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    blush: true,
    sparkle: false,
    message: "You're doing great!",
  },
  neutral: {
    eyes: <><circle cx="24" cy="26" r="2.5" fill="#1f3a44" /><circle cx="40" cy="26" r="2.5" fill="#1f3a44" /></>,
    mouth: <line x1="26" y1="37" x2="38" y2="37" stroke="#1f3a44" strokeWidth="2.5" strokeLinecap="round" />,
    blush: false,
    sparkle: false,
    message: "Add some transactions to get started!",
  },
  worried: {
    eyes: <><path d="M21 24 Q24 27 27 24" stroke="#1f3a44" strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M37 24 Q40 27 43 24" stroke="#1f3a44" strokeWidth="2.5" fill="none" strokeLinecap="round" /></>,
    mouth: <path d="M25 39 Q32 34 39 39" stroke="#1f3a44" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    blush: false,
    sparkle: false,
    message: "Careful, expenses are creeping up",
  },
  sad: {
    eyes: <><circle cx="24" cy="27" r="2.2" fill="#1f3a44" /><circle cx="40" cy="27" r="2.2" fill="#1f3a44" /><path d="M22 32 L26 30" stroke="#7a1f4d" strokeWidth="1.5" strokeLinecap="round" /><path d="M42 32 L38 30" stroke="#7a1f4d" strokeWidth="1.5" strokeLinecap="round" /></>,
    mouth: <path d="M25 41 Q32 35 39 41" stroke="#1f3a44" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    blush: false,
    sparkle: false,
    message: "Expenses have overtaken income!",
  },
};

export default function MoodBuddy({ income, expenses }) {
  const mood = getMood(income, expenses);
  const face = faces[mood];

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: mood === "excited" ? [0, -6, 0] : 0 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.4, y: { repeat: mood === "excited" ? Infinity : 0, duration: 1.2 } }}
        >
          <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="26" fill="#e3b8c9" stroke="#7a1f4d" strokeWidth="2" />
            {face.blush && (
              <>
                <circle cx="16" cy="32" r="4" fill="#b0698f" opacity="0.6" />
                <circle cx="48" cy="32" r="4" fill="#b0698f" opacity="0.6" />
              </>
            )}
            {face.eyes}
            {face.mouth}
            {face.sparkle && (
              <>
                <path d="M10 12 L11.5 15.5 L15 17 L11.5 18.5 L10 22 L8.5 18.5 L5 17 L8.5 15.5 Z" fill="#4f8a86" />
                <path d="M54 10 L55 12.5 L57.5 13.5 L55 14.5 L54 17 L53 14.5 L50.5 13.5 L53 12.5 Z" fill="#4f8a86" />
              </>
            )}
          </svg>
        </motion.div>
      </AnimatePresence>
      <p className="text-slate-600 text-xs mt-2 text-center max-w-[140px]">{face.message}</p>
    </div>
  );
}
