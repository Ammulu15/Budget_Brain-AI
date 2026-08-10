import { motion } from "framer-motion";

export default function StatCard({ label, value, gradient, emoji }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`rounded-3xl p-6 bg-gradient-to-br ${gradient} shadow-md`}
    >
      <div className="flex items-center justify-between">
        <p className="text-white/90 text-sm font-medium">{label}</p>
        <span className="text-2xl">{emoji}</span>
      </div>
      <p className="text-white text-3xl font-bold mt-2">₹{value.toLocaleString()}</p>
    </motion.div>
  );
}