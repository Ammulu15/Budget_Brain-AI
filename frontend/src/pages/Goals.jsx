import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Plus, X, Sparkles, Target, Trophy, History } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", target_amount: "", target_date: "" });
  const [contributingId, setContributingId] = useState(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const [historyFor, setHistoryFor] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchGoals = async () => {
    setLoading(true);
    const res = await api.get("/goals/");
    setGoals(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    await api.post("/goals/", {
      title: form.title,
      target_amount: parseFloat(form.target_amount),
      target_date: form.target_date ? new Date(form.target_date).toISOString() : null,
    });
    setForm({ title: "", target_amount: "", target_date: "" });
    setShowForm(false);
    fetchGoals();
  };

  const handleContribute = async (goalId) => {
    if (!contributeAmount) return;
    await api.patch(`/goals/${goalId}/contribute`, { amount: parseFloat(contributeAmount) });
    setContributeAmount("");
    setContributingId(null);
    fetchGoals();
    if (historyFor === goalId) {
      const res = await api.get(`/goals/${goalId}/history`);
      setHistory(res.data);
    }
  };

  const toggleHistory = async (goalId) => {
    if (historyFor === goalId) {
      setHistoryFor(null);
      return;
    }
    const res = await api.get(`/goals/${goalId}/history`);
    setHistory(res.data);
    setHistoryFor(goalId);
  };

  return (
    <div className="min-h-screen" style={{ background: "transparent" }}>
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3 drop-shadow-md">
              <Award className="w-8 h-8 text-sky-400" /> Savings Goals
            </h1>
            <p className="text-sky-200 text-sm font-medium mt-1">Track and conquer your long-term milestones</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-full font-bold text-white text-sm shadow-lg transition flex items-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #1e6fff, #3ab5ff)",
              boxShadow: "0 4px 20px rgba(30,111,255,0.4)",
            }}
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" /> Close
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> New Goal
              </>
            )}
          </motion.button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddGoal}
            className="glass-card rounded-3xl p-6 mb-8 space-y-4"
          >
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-300" /> Create New Savings Goal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Goal title (e.g. Emergency Fund)"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              />
              <input
                type="number"
                placeholder="Target amount (₹)"
                required
                value={form.target_amount}
                onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              />
              <input
                type="date"
                value={form.target_date}
                onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-bold text-white shadow-md hover:scale-[1.01] transition"
              style={{
                background: "linear-gradient(135deg, #1e6fff, #b0698f)",
                boxShadow: "0 4px 20px rgba(30,111,255,0.4)",
              }}
            >
              Save Goal
            </button>
          </motion.form>
        )}

        {loading ? (
          <p className="text-sky-200 text-sm font-medium">Loading goals...</p>
        ) : goals.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center">
            <p className="text-white text-base font-semibold">No goals created yet</p>
            <p className="text-sky-200 text-sm mt-1">Add your first target above to start building towards it!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((g) => {
              const percent = Math.min((g.saved_amount / g.target_amount) * 100, 100);
              const reached = g.saved_amount >= g.target_amount;

              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-3xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white font-bold text-base flex items-center gap-2">
                      {g.title}
                      {reached && <Trophy className="w-5 h-5 text-amber-300 inline" />}
                    </p>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      reached ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40" : "bg-sky-500/20 text-sky-200 border border-sky-400/30"
                    }`}>
                      {reached ? "Reached!" : `${percent.toFixed(0)}%`}
                    </span>
                  </div>

                  <div className="w-full h-3.5 bg-black/25 rounded-full overflow-hidden mb-3 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#ffd23f] via-[#3de8c5] to-[#1e6fff]"
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-white">
                      ₹{g.saved_amount.toLocaleString()} <span className="text-sky-200/80 font-normal">of ₹{g.target_amount.toLocaleString()}</span>
                    </span>
                    {g.target_date && (
                      <span className="text-sky-200/70 text-xs">
                        Target: {new Date(g.target_date).toLocaleDateString("en-GB")}
                      </span>
                    )}
                  </div>

                  {contributingId === g.id ? (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                      <input
                        type="number"
                        placeholder="Amount (₹)"
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                      />
                      <button
                        onClick={() => handleContribute(g.id)}
                        className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                        style={{ background: "linear-gradient(135deg, #1e6fff, #3ab5ff)" }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setContributingId(null)}
                        className="px-3 py-2 rounded-xl bg-white/10 text-white/80 text-sm font-medium hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setContributingId(g.id)}
                        className="text-sm text-sky-300 hover:text-white font-bold flex items-center gap-1"
                      >
                        + Add Contribution
                      </motion.button>
                      <button
                        onClick={() => toggleHistory(g.id)}
                        className="text-xs text-sky-200 hover:text-white font-semibold flex items-center gap-1.5"
                      >
                        {historyFor === g.id ? "Hide history" : (
                          <>
                            <History className="w-3.5 h-3.5 text-sky-300" /> History
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {historyFor === g.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 max-h-36 overflow-y-auto">
                      {history.length === 0 ? (
                        <p className="text-sky-200/60 text-xs py-1">No contributions recorded yet</p>
                      ) : (
                        history.map((h) => (
                          <div key={h.id} className="flex justify-between items-center text-xs bg-white/10 rounded-lg px-3 py-2">
                            <span className="text-sky-100">
                              {new Date(h.contributed_at).toLocaleDateString("en-GB")}
                            </span>
                            <span className="text-emerald-300 font-bold">+₹{h.amount.toLocaleString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
