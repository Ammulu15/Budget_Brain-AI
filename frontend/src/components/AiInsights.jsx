import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
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
      className="glass-card rounded-3xl p-6 h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" /> AI Financial Assistant
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchInsights}
            disabled={loading}
            className="text-xs px-4 py-2 rounded-full font-bold text-white shadow-md disabled:opacity-50 transition flex items-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #1e6fff, #b0698f)",
              boxShadow: "0 2px 14px rgba(30,111,255,0.4)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {loading ? "Analyzing..." : insights ? "Refresh Analysis" : "Get AI Insights"}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-300 text-sm font-medium bg-rose-500/20 p-3 rounded-2xl border border-rose-400/30"
            >
              {error}
            </motion.p>
          )}

          {!error && insights && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/95 text-sm leading-relaxed whitespace-pre-line bg-white/10 p-4 rounded-2xl border border-white/20"
            >
              {insights}
            </motion.div>
          )}

          {!error && !insights && !loading && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sky-200/90 text-sm font-medium py-3"
            >
              Tap <span className="font-bold text-white">"Get AI Insights"</span> for personalized financial advice and smart savings breakdowns powered by AI.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
