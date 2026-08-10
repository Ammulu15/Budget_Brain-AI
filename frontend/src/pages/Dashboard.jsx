import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import FoodDoodle from "../components/FoodDoodle";
import MoodBuddy from "../components/MoodBuddy";
import AiInsights from "../components/AiInsights";

const COLORS = ["#7a1f4d", "#b0698f", "#4f8a86", "#1f3a44", "#e3b8c9", "#e8c4cb"];

function getDoodleType(category, type) {
  const c = category.toLowerCase();
  if (c.includes("pizza") || c.includes("food") || c.includes("restaurant")) return "pizza";
  if (c.includes("burger")) return "burger";
  if (c.includes("coffee") || c.includes("cafe")) return "coffee";
  if (type === "income") return "savings";
  return "shopping";
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", type: "expense", category: "", description: "", goal_id: "" });

  const fetchTransactions = async () => {
    setLoading(true);
    const [txRes, goalsRes] = await Promise.all([
      api.get("/transactions/"),
      api.get("/goals/"),
    ]);
    setTransactions(txRes.data);
    setGoals(goalsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const savings = income - expenses;

  const categoryData = Object.values(
    transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
        return acc;
      }, {})
  );

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    await api.post("/transactions/", {
      ...form,
      amount: parseFloat(form.amount),
      goal_id: form.goal_id ? parseInt(form.goal_id) : null,
    });
    setForm({ amount: "", type: "expense", category: "", description: "", goal_id: "" });
    setShowForm(false);
    fetchTransactions();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-light via-blush to-mauve/30">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Income" value={income} gradient="from-teal-deep to-teal-deep/70" emoji="💰" />
          <StatCard label="Total Expenses" value={expenses} gradient="from-wine to-mauve" emoji="🛍️" />
          <StatCard label="Net Savings" value={savings} gradient="from-navy-deep to-teal-deep" emoji="🐷" />
        </div>

        <div className="flex justify-center mb-8">
          <MoodBuddy income={income} expenses={expenses} />
        </div>

        <AiInsights />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 border border-blush shadow-md"
          >
            <h2 className="text-slate-700 font-semibold mb-4">Spending by Category 🎀</h2>
            {categoryData.length === 0 ? (
              <p className="text-slate-400 text-sm">No expenses yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 border border-blush shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-700 font-semibold">Recent Transactions ✨</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-wine to-mauve text-white font-medium shadow-sm"
              >
                + Add
              </motion.button>
            </div>

            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onSubmit={handleAddTransaction}
                className="mb-4 space-y-2"
              >
                <input
                  type="number"
                  placeholder="Amount"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-blush text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mauve"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-blush text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-mauve"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                {form.type === "income" && goals.length > 0 && (
                  <select
                    value={form.goal_id}
                    onChange={(e) => setForm({ ...form, goal_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/80 border border-blush text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-mauve"
                  >
                    <option value="">Not linked to a goal</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>Put toward: {g.title}</option>
                    ))}
                  </select>
                )}

                <input
                  type="text"
                  placeholder="Category (e.g. Groceries)"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-blush text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mauve"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-blush text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mauve"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-wine to-mauve text-white text-sm font-medium shadow-sm"
                >
                  Save Transaction 🌸
                </button>
              </motion.form>
            )}

            {loading ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="text-slate-400 text-sm">No transactions yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.slice().reverse().map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between bg-blush-light/60 rounded-2xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <FoodDoodle type={getDoodleType(t.category, t.type)} size={32} />
                      <div>
                        <p className="text-slate-700 text-sm font-medium">{t.category}</p>
                        <p className="text-slate-400 text-xs">{t.description || "—"}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${t.type === "income" ? "text-teal-deep" : "text-wine"}`}>
                      {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
