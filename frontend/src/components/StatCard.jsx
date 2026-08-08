import { motion } from "framer-motion";

export default function StatCard({ label, value, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} shadow-lg`}
    >
      <p className="text-white/80 text-sm font-medium">{label}</p>
      <p className="text-white text-3xl font-bold mt-2">₹{value.toLocaleString()}</p>
    </motion.div>
  );
}