import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CursorBuddy() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 text-2xl"
      animate={{ x: pos.x + 16, y: pos.y + 16 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      ✨
    </motion.div>
  );
}