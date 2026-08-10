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
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-wine to-navy-deep">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Your Budgets 🎯</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-deep to-mauve text-white text-sm font-medium shadow-md"
          >
            + New Budget
          </motion.button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleAddBudget}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-mauve/30 mb-6 space-y-3"
          >
            <input
              type="text"
              placeholder="Category (e.g. Groceries)"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep"
            />
            <input
              type="number"
              placeholder="Monthly limit (₹)"
              required
              value={form.limit_amount}
              onChange={(e) => setForm({ ...form, limit_amount: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white placeholder-blush/50 focus:outline-none focus:ring-2 focus:ring-teal-deep"
            />
            <input
              type="month"
              required
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-mauve/40 text-white focus:outline-none focus:ring-2 focus:ring-teal-deep"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-deep to-mauve text-white font-semibold shadow-md"
            >
              Save Budget 🌸
            </button>
          </motion.form>
        )}

        {loading ? (
          <p className="text-blush">Loading...</p>
        ) : budgets.length === 0 ? (
          <p className="text-blush">No budgets set yet — create one to start tracking!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((b) => {
              const spent = spentByCategory(b.category, b.month);
              const percent = Math.min((spent / b.limit_amount) * 100, 100);
              const overBudget = spent > b.limit_amount;

              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-mauve/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{b.category}</p>
                    <span className="text-blush text-xs">{b.month}</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${overBudget ? "bg-rose-400" : "bg-gradient-to-r from-teal-deep to-mauve"}`}
                    />
                  </div>
                  <p className={`text-sm ${overBudget ? "text-rose-300" : "text-blush"}`}>
                    ₹{spent.toLocaleString()} of ₹{b.limit_amount.toLocaleString()} spent
                    {overBudget && " — over budget!"}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
