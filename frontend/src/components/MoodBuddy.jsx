import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getMood(income, expenses) {
  if (income === 0 && expenses === 0) {
    return {
      mood: "neutral",
      text: "Add some transactions to get started!",
      emoji: "🌱",
      mouthType: "neutral",
      blushOpacity: 0.4,
      earAngle: 0,
      sparkle: false,
    };
  }
  const savingsRatio = income > 0 ? (income - expenses) / income : -1;
  if (savingsRatio >= 0.3) {
    return {
      mood: "excited",
      text: "Amazing savings! You're crushing your goals! ✨",
      emoji: "🌟",
      mouthType: "excited",
      blushOpacity: 0.85,
      earAngle: -6,
      sparkle: true,
    };
  }
  if (savingsRatio >= 0) {
    return {
      mood: "happy",
      text: "Looking good! Keep growing your savings!",
      emoji: "💖",
      mouthType: "happy",
      blushOpacity: 0.7,
      earAngle: 0,
      sparkle: false,
    };
  }
  if (savingsRatio >= -0.2) {
    return {
      mood: "worried",
      text: "Careful, expenses are catching up to income",
      emoji: "⚠️",
      mouthType: "worried",
      blushOpacity: 0.3,
      earAngle: 8,
      sparkle: false,
    };
  }
  return {
    mood: "sad",
    text: "Expenses have overtaken income this month!",
    emoji: "🚨",
    mouthType: "sad",
    blushOpacity: 0.1,
    earAngle: 14,
    sparkle: false,
  };
}

export default function MoodBuddy({ income, expenses }) {
  const currentMood = getMood(income, expenses);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Optional mouse tracking to make the creature feel alive and curious
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth - 0.5) * 6;
      const normalizedY = (e.clientY / innerHeight - 0.5) * 4;
      setMouseOffset({ x: normalizedX, y: normalizedY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative flex flex-col items-center">
        {/* Soft magical background aura */}
        <div className="absolute inset-0 bg-gradient-to-t from-mauve/20 to-transparent blur-xl rounded-full scale-125 pointer-events-none" />

        {/* The Animated Fluffy Creature */}
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-md"
          >
            <defs>
              {/* Fluffy Body Gradient */}
              <radialGradient id="bodyGrad" cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#f8dbe5" />
                <stop offset="65%" stopColor="#e8b8cb" />
                <stop offset="100%" stopColor="#cf8fab" />
              </radialGradient>

              {/* Head / Fur Gradient */}
              <radialGradient id="headGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#fae2ec" />
                <stop offset="80%" stopColor="#e3b2c5" />
                <stop offset="100%" stopColor="#c57f9d" />
              </radialGradient>

              {/* Shiny Gold Coin Gradient */}
              <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe680" />
                <stop offset="50%" stopColor="#f5b300" />
                <stop offset="100%" stopColor="#cf8600" />
              </linearGradient>

              {/* Eye Specular Gradient */}
              <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1c29" />
                <stop offset="100%" stopColor="#2c3047" />
              </linearGradient>
            </defs>

            {/* STATIC / STABLE BODY (stays mostly still, facing forward) */}
            <g id="body-layer">
              {/* Soft Body Shadow */}
              <ellipse cx="60" cy="112" rx="28" ry="6" fill="#7a1f4d" opacity="0.18" />

              {/* Fluffy Round Body */}
              <ellipse cx="60" cy="84" rx="34" ry="26" fill="url(#bodyGrad)" stroke="#b0698f" strokeWidth="1.2" />

              {/* Tiny Cute Feet */}
              <ellipse cx="44" cy="106" rx="10" ry="5.5" fill="#d992ad" stroke="#9e4e75" strokeWidth="1" />
              <ellipse cx="76" cy="106" rx="10" ry="5.5" fill="#d992ad" stroke="#9e4e75" strokeWidth="1" />

              {/* Belly Soft Highlight */}
              <ellipse cx="60" cy="86" rx="20" ry="15" fill="#ffffff" opacity="0.45" />

              {/* Tiny Hands holding a cute gold savings coin */}
              <g id="hands-and-coin">
                {/* Shiny Gold Coin */}
                <circle cx="60" cy="85" r="10" fill="url(#coinGrad)" stroke="#a16400" strokeWidth="1" />
                <circle cx="60" cy="85" r="7.5" fill="none" stroke="#ffeaa7" strokeWidth="0.8" />
                <text x="60" y="89" fontSize="9" fontWeight="bold" fill="#704400" textAnchor="middle">₹</text>

                {/* Tiny Left & Right Paws */}
                <ellipse cx="49" cy="85" rx="5.5" ry="4.5" fill="#fae2ec" stroke="#b0698f" strokeWidth="1" />
                <ellipse cx="71" cy="85" rx="5.5" ry="4.5" fill="#fae2ec" stroke="#b0698f" strokeWidth="1" />
              </g>
            </g>

            {/* DYNAMIC HEAD (Turns slowly and smoothly from left to right at a steady natural pace) */}
            <motion.g
              id="head-and-face"
              animate={{
                x: [-7, 0, 7, 0, -7],
                rotate: [-4.5, 0, 4.5, 0, -4.5],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transformOrigin: "60px 58px",
              }}
            >
              {/* Ears with subtle twitch & mood adaptation */}
              <motion.g
                animate={{
                  rotate: currentMood.earAngle,
                }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                {/* Left Ear */}
                <path
                  d="M32 36 C24 16, 40 10, 44 26 Z"
                  fill="url(#headGrad)"
                  stroke="#b0698f"
                  strokeWidth="1.2"
                />
                <path d="M34 32 C28 20, 38 16, 41 26 Z" fill="#b0698f" opacity="0.6" />

                {/* Right Ear */}
                <path
                  d="M88 36 C96 16, 80 10, 76 26 Z"
                  fill="url(#headGrad)"
                  stroke="#b0698f"
                  strokeWidth="1.2"
                />
                <path d="M86 32 C92 20, 82 16, 79 26 Z" fill="#b0698f" opacity="0.6" />
              </motion.g>

              {/* Fluffy Head Base */}
              <circle cx="60" cy="50" r="30" fill="url(#headGrad)" stroke="#b0698f" strokeWidth="1.2" />

              {/* Cute Cheek Blushes */}
              <ellipse cx="40" cy="56" rx="6" ry="4" fill="#b0698f" opacity={currentMood.blushOpacity} />
              <ellipse cx="80" cy="56" rx="6" ry="4" fill="#b0698f" opacity={currentMood.blushOpacity} />

              {/* Tiny Cute Snout / Nose */}
              <ellipse cx="60" cy="49" rx="3.5" ry="2.5" fill="#7a1f4d" opacity="0.85" />

              {/* EYES LAYER: Moves smoothly with head + follows gaze */}
              <motion.g
                animate={{
                  x: [-3, 0, 3, 0, -3],
                }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Left Big Glossy Eye */}
                <ellipse cx="48" cy="44" rx="7" ry="8.5" fill="url(#eyeGrad)" />
                {/* Right Big Glossy Eye */}
                <ellipse cx="72" cy="44" rx="7" ry="8.5" fill="url(#eyeGrad)" />

                {/* Sparkling Highlights (Primary Specular) */}
                <ellipse cx="46" cy="41" rx="3" ry="3.8" fill="#ffffff" />
                <ellipse cx="70" cy="41" rx="3" ry="3.8" fill="#ffffff" />

                {/* Secondary Cute Sparkle Dot */}
                <circle cx="51" cy="48" r="1.4" fill="#ffffff" opacity="0.9" />
                <circle cx="75" cy="48" r="1.4" fill="#ffffff" opacity="0.9" />

                {/* Soft Eyelashes/Brows */}
                <path d="M43 35 Q48 33 53 35" stroke="#7a1f4d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M67 35 Q72 33 77 35" stroke="#7a1f4d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </motion.g>

              {/* MOUTH & VISIBLE FRONT TEETH (Reacts to income & expenses) */}
              <g id="mouth-layer">
                {currentMood.mouthType === "excited" && (
                  <>
                    {/* Big Joyful Open Mouth */}
                    <path
                      d="M51 55 Q60 67 69 55 Z"
                      fill="#7a1f4d"
                      stroke="#7a1f4d"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    {/* Cute Front Teeth (2 visible white teeth) */}
                    <rect x="56.5" y="55" width="3.2" height="3.5" rx="1" fill="#ffffff" stroke="#e8c4cb" strokeWidth="0.5" />
                    <rect x="60.3" y="55" width="3.2" height="3.5" rx="1" fill="#ffffff" stroke="#e8c4cb" strokeWidth="0.5" />
                    {/* Pink Tongue */}
                    <path d="M55 62 Q60 65 65 62" stroke="#e89bb8" strokeWidth="3" strokeLinecap="round" />
                  </>
                )}

                {currentMood.mouthType === "happy" && (
                  <>
                    {/* Slightly Open Happy Mouth */}
                    <path
                      d="M53 55 Q60 63 67 55 Z"
                      fill="#7a1f4d"
                      stroke="#7a1f4d"
                      strokeWidth="1"
                    />
                    {/* Visible Front Teeth */}
                    <rect x="57" y="55" width="2.8" height="2.8" rx="0.8" fill="#ffffff" stroke="#e8c4cb" strokeWidth="0.4" />
                    <rect x="60.2" y="55" width="2.8" height="2.8" rx="0.8" fill="#ffffff" stroke="#e8c4cb" strokeWidth="0.4" />
                    {/* Tongue */}
                    <ellipse cx="60" cy="59.5" rx="3.5" ry="1.5" fill="#e89bb8" />
                  </>
                )}

                {currentMood.mouthType === "neutral" && (
                  <>
                    {/* Calm slightly open smile with front teeth */}
                    <path
                      d="M54 55 Q60 60 66 55 Z"
                      fill="#7a1f4d"
                      stroke="#7a1f4d"
                      strokeWidth="1"
                    />
                    <rect x="58.2" y="55" width="3.6" height="2.2" rx="0.6" fill="#ffffff" />
                  </>
                )}

                {currentMood.mouthType === "worried" && (
                  <>
                    {/* Shy worried mouth */}
                    <path
                      d="M54 58 Q60 54 66 58"
                      stroke="#7a1f4d"
                      strokeWidth="1.8"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <rect x="58.5" y="55.5" width="3" height="2" rx="0.5" fill="#ffffff" opacity="0.8" />
                  </>
                )}

                {currentMood.mouthType === "sad" && (
                  <>
                    {/* Sad open mouth */}
                    <path
                      d="M53 59 Q60 53 67 59 Z"
                      fill="#7a1f4d"
                      stroke="#7a1f4d"
                      strokeWidth="1"
                    />
                    <rect x="58.5" y="55.5" width="3" height="1.8" rx="0.5" fill="#ffffff" opacity="0.8" />
                  </>
                )}
              </g>

              {/* Optional Sparkles for Excited Mood */}
              {currentMood.sparkle && (
                <>
                  <motion.path
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    d="M26 25 L28 30 L33 32 L28 34 L26 39 L24 34 L19 32 L24 30 Z"
                    fill="#ffd700"
                  />
                  <motion.path
                    animate={{ scale: [1.2, 0.8, 1.2], opacity: [1, 0.7, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    d="M94 22 L95.5 25.5 L99 27 L95.5 28.5 L94 32 L92.5 28.5 L89 27 L92.5 25.5 Z"
                    fill="#4f8a86"
                  />
                </>
              )}
            </motion.g>
          </svg>

          {/* Floating Status Indicator Badge */}
          <span className="absolute bottom-1 right-2 text-base bg-white/95 rounded-full px-1.5 py-0.5 shadow-md border border-blush/60">
            {currentMood.emoji}
          </span>
        </motion.div>
      </div>

      {/* Creature's Dynamic Mood Feedback */}
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-xs mt-2 font-semibold text-center max-w-[220px] leading-tight drop-shadow-sm"
      >
        {currentMood.text}
      </motion.p>
    </div>
  );
}
