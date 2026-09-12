import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function CursorBuddy() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center"
      animate={{ x: pos.x + 16, y: pos.y + 16 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300/40 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
    </motion.div>
  );
}