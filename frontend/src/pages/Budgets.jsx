import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const currentMonth = new Date().toISOString().slice(0, 7); // "2026-08"

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "", limit_amount: "", month: currentMonth });

  const fetchData = async () => {
    setLoading(true);
    const [budgetsRes, txRes] = await Promise.all([
      api.get("/budgets/"),
      api.get("/transactions/"),
    ]);
    setBudgets(budgetsRes.data);
    setTransactions(txRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const spentByCategory = (category, month) => {
    return transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category.toLowerCase() === category.toLowerCase() &&
          t.transaction_date.slice(0, 7) === month
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    await api.post("/budgets/", {
      ...form,
      limit_amount: parseFloat(form.limit_amount),
    });
    setForm({ category: "", limit_amount: "", month: currentMonth });
    setShowForm(false);
    fetchData();
  };

  return (
    <div className="min-h-screen" style={{ background: "transparent" }}>
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2 drop-shadow-md">
              <span>🎯</span> Monthly Budgets
            </h1>
            <p className="text-sky-200 text-sm font-medium mt-1">Set category limits and stay on track</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-full font-bold text-white text-sm shadow-lg transition"
            style={{
              background: "linear-gradient(135deg, #1e6fff, #3ab5ff)",
              boxShadow: "0 4px 20px rgba(30,111,255,0.4)",
            }}
          >
            {showForm ? "✕ Close" : "+ New Budget"}
          </motion.button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddBudget}
            className="glass-card rounded-3xl p-6 mb-8 space-y-4"
          >
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <span>✨</span> Create New Monthly Budget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Category (e.g. Groceries)"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              />
              <input
                type="number"
                placeholder="Monthly limit (₹)"
                required
                value={form.limit_amount}
                onChange={(e) => setForm({ ...form, limit_amount: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              />
              <input
                type="month"
                required
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
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
              Save Budget 🌸
            </button>
          </motion.form>
        )}

        {loading ? (
          <p className="text-sky-200 text-sm font-medium">Loading your budgets...</p>
        ) : budgets.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center">
            <p className="text-white text-base font-semibold">No budgets set yet 🌱</p>
            <p className="text-sky-200 text-sm mt-1">Create your first monthly limit above to manage expenses intelligently!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgets.map((b) => {
              const spent = spentByCategory(b.category, b.month);
              const percent = Math.min((spent / b.limit_amount) * 100, 100);
              const overBudget = spent > b.limit_amount;

              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-3xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white font-bold text-base">{b.category}</p>
                    <span className="text-sky-200 text-xs font-semibold bg-white/10 px-2.5 py-1 rounded-full">{b.month}</span>
                  </div>
                  <div className="w-full h-3.5 bg-black/25 rounded-full overflow-hidden mb-3 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${
                        overBudget ? "bg-rose-400" : "bg-gradient-to-r from-[#3de8c5] via-[#3ab5ff] to-[#1e6fff]"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className={overBudget ? "text-rose-300 font-bold" : "text-sky-100"}>
                      ₹{spent.toLocaleString()} of ₹{b.limit_amount.toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      overBudget ? "bg-rose-500/20 text-rose-300 border border-rose-400/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                    }`}>
                      {percent.toFixed(0)}% {overBudget ? "Over Limit!" : "Used"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
