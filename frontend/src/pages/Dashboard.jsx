import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

const COLORS = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", type: "expense", category: "", description: "" });

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await api.get("/transactions/");
    setTransactions(res.data);
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
    });
    setForm({ amount: "", type: "expense", category: "", description: "" });
    setShowForm(false);
    fetchTransactions();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Income" value={income} gradient="from-emerald-500 to-teal-500" />
          <StatCard label="Total Expenses" value={expenses} gradient="from-rose-500 to-red-500" />
          <StatCard label="Net Savings" value={savings} gradient="from-purple-500 to-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-white font-semibold mb-4">Spending by Category</h2>
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
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Recent Transactions</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white"
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
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-slate-400"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                >
                  <option value="expense" className="text-black">Expense</option>
                  <option value="income" className="text-black">Income</option>
                </select>
                <input
                  type="text"
                  placeholder="Category (e.g. Groceries)"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-slate-400"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium"
                >
                  Save Transaction
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
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{t.category}</p>
                      <p className="text-slate-400 text-xs">{t.description || "—"}</p>
                    </div>
                    <p className={`font-semibold ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
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