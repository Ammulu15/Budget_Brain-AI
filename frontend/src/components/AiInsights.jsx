import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

export default function AiInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/ai/insights");
      setInsights(res.data.insights);
    } catch (err) {
      setError("Couldn't get insights right now, try again in a bit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 border border-blush shadow-md mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-slate-700 font-semibold flex items-center gap-2">
          <span>🧠</span> AI Financial Assistant
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchInsights}
          disabled={loading}
          className="text-sm px-4 py-1.5 rounded-full bg-gradient-to-r from-wine to-mauve text-white font-medium shadow-sm disabled:opacity-50"
        >
          {loading ? "Thinking... ✨" : insights ? "Refresh" : "Get Insights"}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-rose-500 text-sm"
          >
            {error}
          </motion.p>
        )}

        {!error && insights && (
          <motion.p
            key="insights"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-600 text-sm leading-relaxed whitespace-pre-line"
          >
            {insights}
          </motion.p>
        )}

        {!error && !insights && !loading && (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-400 text-sm"
          >
            Tap "Get Insights" for a personalized look at your spending 🌸
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
