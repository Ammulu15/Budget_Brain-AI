import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", target_amount: "", target_date: "" });
  const [contributingId, setContributingId] = useState(null);
  
  
const [contributeAmount, setContributeAmount] = useState("");
  const handleContribute = async (goalId) => {
  if (!contributeAmount) return;
  await api.patch(`/goals/${goalId}/contribute`, { amount: parseFloat(contributeAmount) });
  setContributeAmount("");
  setContributingId(null);
  fetchGoals();
};
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-wine to-navy-deep">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Your Goals 🌟</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-deep to-mauve text-white text-sm font-medium shadow-md"
          >
            + New Goal
          </motion.button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleAddGoal}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-mauve/30 mb-6 space-y-3"
          >
            <input
              type="text"
              placeholder="Goal title (e.g. Emergency Fund)"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep"
            />
            <input
              type="number"
              placeholder="Target amount (₹)"
              required
              value={form.target_amount}
              onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep"
            />
            <input
              type="date"
              value={form.target_date}
              onChange={(e) => setForm({ ...form, target_date: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white focus:outline-none focus:ring-2 focus:ring-teal-deep"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-deep to-mauve text-white font-semibold shadow-md"
            >
              Save Goal 🌸
            </button>
          </motion.form>
        )}

        {loading ? (
          <p className="text-blush">Loading...</p>
        ) : goals.length === 0 ? (
          <p className="text-blush">No goals yet — set one to start saving toward something!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => {
              const percent = Math.min((g.saved_amount / g.target_amount) * 100, 100);
              const reached = g.saved_amount >= g.target_amount;

              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-mauve/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{g.title}</p>
                    {reached && <span className="text-lg">🎉</span>}
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-teal-deep to-mauve"
                    />
                  </div>
                  <p className="text-blush text-sm">
                    ₹{g.saved_amount.toLocaleString()} of ₹{g.target_amount.toLocaleString()} saved
                    {reached && " — goal reached!"}
                  </p>
                  {g.target_date && (
                    <p className="text-blush/60 text-xs mt-1">
                      Target: {new Date(g.target_date).toLocaleDateString()}
                    </p>
                  )}
                  {contributingId === g.id ? (
  <div className="flex gap-2 mt-3">
    <input
      type="number"
      placeholder="Amount"
      value={contributeAmount}
      onChange={(e) => setContributeAmount(e.target.value)}
      className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-mauve/40 text-white text-sm placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep"
    />
    <button
      onClick={() => handleContribute(g.id)}
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-deep to-mauve text-white text-sm font-medium"
    >
      Add
    </button>
  </div>
) : (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => setContributingId(g.id)}
    className="mt-3 text-sm text-teal-deep hover:text-mauve font-medium"
  >
    + Add contribution
  </motion.button>
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
