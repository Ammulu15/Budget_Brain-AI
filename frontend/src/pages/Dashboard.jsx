import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import FoodDoodle, { getCharacterType } from "../components/FoodDoodle";
import MoodBuddy from "../components/MoodBuddy";
import AiInsights from "../components/AiInsights";

const COLORS = ["#1e6fff", "#3ab5ff", "#b0698f", "#7a1f4d", "#ffd23f", "#3de8c5"];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    goal_id: "",
    transaction_date: new Date().toISOString().slice(0, 10),
  });
  const [saveAmount, setSaveAmount] = useState("");

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

  useEffect(() => { fetchTransactions(); }, []);

  const incomeList = transactions.filter((t) => t.type === "income");
  const expenseList = transactions.filter((t) => t.type === "expense");
  const income = incomeList.reduce((sum, t) => sum + t.amount, 0);
  const expenses = expenseList.reduce((sum, t) => sum + t.amount, 0);
  const allocatedToGoals = goals.reduce((sum, g) => sum + g.saved_amount, 0);
  const netSavings = income - expenses - allocatedToGoals;

  const categoryData = Object.values(
    expenseList.reduce((acc, t) => {
      acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
      acc[t.category].value += t.amount;
      return acc;
    }, {})
  );

  const displayedTransactions =
    filterType === "expense" ? expenseList
    : filterType === "income" ? incomeList
    : transactions;

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    await api.post("/transactions/", {
      ...form,
      amount: parseFloat(form.amount),
      goal_id: form.goal_id ? parseInt(form.goal_id) : null,
      save_amount: form.goal_id && saveAmount ? parseFloat(saveAmount) : null,
      transaction_date: form.transaction_date ? new Date(form.transaction_date).toISOString() : null,
    });
    setForm({ amount: "", type: "expense", category: "", description: "", goal_id: "", transaction_date: new Date().toISOString().slice(0, 10) });
    setSaveAmount("");
    setShowForm(false);
    fetchTransactions();
  };

  const renderTransactionItem = (t) => (
    <motion.div
      key={t.id}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, scale: 1.01 }}
      className="flex items-center justify-between rounded-2xl px-4 py-3 transition cursor-default"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <div className="flex items-center gap-3">
        <FoodDoodle type={getCharacterType(t.category, t.type)} size={42} />
        <div>
          <p className="text-white/90 text-sm font-semibold">{t.category}</p>
          <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
            {t.description && <span>{t.description}</span>}
            {t.description && <span>•</span>}
            <span style={{ color: "rgba(58,181,255,0.8)" }}>
              {new Date(t.transaction_date).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>
      </div>
      <p className={`font-bold text-sm ${t.type === "income" ? "" : ""}`}
        style={{ color: t.type === "income" ? "#3de8c5" : "#ff9db5" }}
      >
        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen" style={{ background: "transparent" }}>
      <Navbar />

      {/* Cinematic floating ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-16 left-8 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #1e6fff, transparent)" }} />
        <div className="absolute top-48 right-16 w-96 h-96 rounded-full opacity-18 blur-3xl"
          style={{ background: "radial-gradient(circle, #b0698f, transparent)" }} />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 rounded-full opacity-22 blur-3xl"
          style={{ background: "radial-gradient(circle, #3ab5ff, transparent)" }} />
        <div className="absolute bottom-16 right-8 w-64 h-64 rounded-full opacity-18 blur-3xl"
          style={{ background: "radial-gradient(circle, #ffd23f, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #3de8c5, transparent)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl font-black mb-3 leading-tight"
            style={{
              background: "linear-gradient(90deg, #3ab5ff 0%, #ffffff 40%, #ffd23f 70%, #3de8c5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(58,181,255,0.5))",
            }}
          >
            Your Financial Universe 🌌
          </motion.h1>
          <p className="text-base font-medium" style={{ color: "rgba(227,184,201,0.75)" }}>
            Smart budgeting · Pixar magic ✨
          </p>
        </motion.div>

        {/* ===== 3D CHARACTER STAT CARDS — characters float FREE above each card ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 pt-10">
          <StatCard
            label="Total Income"
            value={income}
            gradient="from-[#1e6fff] via-[#3ab5ff] to-[#00cfff]"
            image="/characters/currency.jpg"
            active={filterType === "income"}
            onClick={() => setFilterType(filterType === "income" ? "all" : "income")}
          />
          <StatCard
            label="Total Expenses"
            value={expenses}
            gradient="from-[#7a1f4d] via-[#ff6b6b] to-[#b0698f]"
            image="/characters/burger.jpg"
            active={filterType === "expense"}
            onClick={() => setFilterType(filterType === "expense" ? "all" : "expense")}
          />
          <StatCard
            label="Saved in Goals"
            value={allocatedToGoals}
            gradient="from-[#0a2463] via-[#6a8fff] to-[#3ab5ff]"
            image="/characters/popcorn.jpg"
            onClick={() => setFilterType("all")}
          />
          <StatCard
            label="Net Savings"
            value={netSavings}
            gradient="from-[#3de8c5] via-[#4f8a86] to-[#1e6fff]"
            image="/characters/piggy.jpg"
            active={filterType === "all"}
            onClick={() => setFilterType("all")}
          />
        </div>

        {/* ===== MOODBUDDY + AI INSIGHTS ===== */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center flex-shrink-0 w-full md:w-60"
          >
            <p className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ color: "rgba(58,181,255,0.85)" }}
            >
              💙 Mood Buddy
            </p>
            <MoodBuddy income={income} expenses={expenses + allocatedToGoals} />
          </motion.div>
          <div className="flex-1">
            <AiInsights />
          </div>
        </div>

        {/* ===== FILTER + ADD TRANSACTION BAR ===== */}
        <div className="glass-card rounded-2xl p-3 flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-widest px-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >View:</span>
            {[
              { key: "all", label: `All (${transactions.length})`, icon: "🌐" },
              { key: "expense", label: `Expenses (${expenseList.length})`, icon: "🛍️" },
              { key: "income", label: `Income (${incomeList.length})`, icon: "💰" },
              { key: "split", label: "Split View", icon: "⚖️" },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilterType(tab.key)}
                className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all"
                style={
                  filterType === tab.key
                    ? { background: "linear-gradient(135deg, #1e6fff, #3ab5ff)", color: "#fff", boxShadow: "0 2px 16px rgba(30,111,255,0.55)" }
                    : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.14)" }
                }
              >
                <span>{tab.icon}</span> {tab.label}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.07, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="text-xs px-5 py-2 rounded-full font-black text-white shadow-lg"
            style={
              showForm
                ? { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }
                : { background: "linear-gradient(135deg, #b0698f, #7a1f4d)", boxShadow: "0 4px 20px rgba(176,105,143,0.55)" }
            }
          >
            {showForm ? "✕ Close" : "+ Add Transaction"}
          </motion.button>
        </div>

        {/* ===== ADD TRANSACTION FORM ===== */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={handleAddTransaction}
            className="glass-card rounded-3xl p-6 mb-6 space-y-4"
          >
            <h3 className="font-black text-white/90 flex items-center gap-2 text-base">
              <span className="text-xl">💫</span> New Transaction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="number" placeholder="Amount (₹)" required value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)" }} />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <option value="expense" style={{ background: "#1a2a6c" }}>Expense 🛍️</option>
                <option value="income" style={{ background: "#1a2a6c" }}>Income 💰</option>
              </select>
              <input type="date" value={form.transaction_date}
                onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)" }} />
            </div>

            {form.type === "income" && goals.length > 0 && (
              <div className="p-3 rounded-2xl space-y-2"
                style={{ background: "rgba(106,143,255,0.13)", border: "1px solid rgba(106,143,255,0.28)" }}>
                <select value={form.goal_id}
                  onChange={(e) => { setForm({ ...form, goal_id: e.target.value }); setSaveAmount(""); }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)" }}>
                  <option value="" style={{ background: "#1a2a6c" }}>Not linked to a goal</option>
                  {goals.map((g) => <option key={g.id} value={g.id} style={{ background: "#1a2a6c" }}>→ {g.title}</option>)}
                </select>
                {form.goal_id && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>How much goes toward the goal?</p>
                    <div className="flex gap-2 flex-wrap">
                      {[100, 500, 1000].map((preset) => {
                        const tooMuch = form.amount && preset > parseFloat(form.amount);
                        return (
                          <button type="button" key={preset} disabled={tooMuch}
                            onClick={() => setSaveAmount(String(preset))}
                            className="px-3 py-1 rounded-full text-xs font-bold transition disabled:opacity-30"
                            style={saveAmount === String(preset)
                              ? { background: "linear-gradient(135deg, #1e6fff, #3ab5ff)", color: "#fff" }
                              : { background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.2)" }
                            }>
                            ₹{preset}
                          </button>
                        );
                      })}
                    </div>
                    <input type="number" placeholder="Custom amount (₹)" value={saveAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSaveAmount(form.amount && parseFloat(val) > parseFloat(form.amount) ? form.amount : val);
                      }}
                      className="w-full px-4 py-2 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)" }} />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Category (e.g. Groceries, Salary)" required value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)" }} />
              <input type="text" placeholder="Description (optional)" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#3ab5ff]"
                style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)" }} />
            </div>

            <button type="submit"
              className="w-full py-3 rounded-2xl font-black text-sm text-white"
              style={{ background: "linear-gradient(135deg, #1e6fff, #b0698f)", boxShadow: "0 4px 28px rgba(30,111,255,0.45)" }}>
              Save Transaction ✨
            </button>
          </motion.form>
        )}

        {/* ===== SPLIT VIEW ===== */}
        {filterType === "split" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3"
                style={{ borderBottom: "1px solid rgba(58,181,255,0.2)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <h2 className="font-black text-white/90">Income Stream</h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(61,232,197,0.18)", color: "#3de8c5" }}>
                  +₹{income.toLocaleString()}
                </span>
              </div>
              {incomeList.length === 0
                ? <p className="text-white/35 text-sm py-6 text-center">No income records yet</p>
                : <div className="space-y-2 max-h-96 overflow-y-auto">{incomeList.slice().reverse().map(renderTransactionItem)}</div>}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3"
                style={{ borderBottom: "1px solid rgba(176,105,143,0.25)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛍️</span>
                  <h2 className="font-black text-white/90">Expenses Stream</h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,107,107,0.18)", color: "#ff9db5" }}>
                  -₹{expenses.toLocaleString()}
                </span>
              </div>
              {expenseList.length === 0
                ? <p className="text-white/35 text-sm py-6 text-center">No expenses yet</p>
                : <div className="space-y-2 max-h-96 overflow-y-auto">{expenseList.slice().reverse().map(renderTransactionItem)}</div>}
            </motion.div>
          </div>

        ) : (
          /* ===== STANDARD / FILTERED VIEW ===== */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-3xl p-6">
              <h2 className="font-black text-white/90 mb-5 flex items-center gap-2">
                <span>🎨</span> Spending by Category
              </h2>
              {categoryData.length === 0
                ? <p className="text-white/35 text-sm py-6 text-center">No expenses yet — start tracking! 🌱</p>
                : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} paddingAngle={3}>
                        {categoryData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{
                        background: "rgba(10,36,99,0.92)",
                        border: "1px solid rgba(58,181,255,0.35)",
                        borderRadius: "14px",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "600",
                      }} />
                      <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="font-black text-white/90 flex items-center gap-2">
                  <span>{filterType === "expense" ? "🛍️" : filterType === "income" ? "💰" : "✨"}</span>
                  {filterType === "expense" ? "Expenses" : filterType === "income" ? "Income" : "Recent Transactions"}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(58,181,255,0.2)", color: "#3ab5ff" }}>
                  {displayedTransactions.length}
                </span>
              </div>
              {loading
                ? <p className="text-white/35 text-sm">Loading...</p>
                : displayedTransactions.length === 0
                  ? <p className="text-white/35 text-sm py-6 text-center">No transactions to show yet ✨</p>
                  : <div className="space-y-2 max-h-80 overflow-y-auto pr-1">{displayedTransactions.slice().reverse().map(renderTransactionItem)}</div>}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
