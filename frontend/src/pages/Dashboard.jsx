import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  Sparkles,
  Clock,
  Pencil,
  Trash2,
  Layers,
  ShoppingCart,
  TrendingUp,
  Columns3,
  PieChart as PieChartIcon,
  Plus,
  X,
  Heart,
} from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import FoodDoodle, { getCharacterType } from "../components/FoodDoodle";
import MoodBuddy from "../components/MoodBuddy";
import AiInsights from "../components/AiInsights";

const COLORS = ["#1e6fff", "#3ab5ff", "#b0698f", "#7a1f4d", "#ffd23f", "#3de8c5"];

const getNowForDateTimeInput = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const dateFormatted = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeFormatted = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateFormatted} • ${timeFormatted}`;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    goal_id: "",
    transaction_date: getNowForDateTimeInput(),
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

  const handleOpenAddForm = () => {
    setEditingId(null);
    setForm({
      amount: "",
      type: "expense",
      category: "",
      description: "",
      goal_id: "",
      transaction_date: getNowForDateTimeInput(),
    });
    setSaveAmount("");
    setShowForm(!showForm);
  };

  const handleEditInit = (t) => {
    setEditingId(t.id);
    let dtInput = getNowForDateTimeInput();
    if (t.transaction_date) {
      const d = new Date(t.transaction_date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      dtInput = d.toISOString().slice(0, 16);
    }
    setForm({
      amount: t.amount,
      type: t.type,
      category: t.category,
      description: t.description || "",
      goal_id: t.goal_id ? String(t.goal_id) : "",
      transaction_date: dtInput,
    });
    setSaveAmount("");
    setShowForm(true);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction entry?")) return;
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      goal_id: form.goal_id ? parseInt(form.goal_id) : null,
      save_amount: form.goal_id && saveAmount ? parseFloat(saveAmount) : null,
      transaction_date: form.transaction_date ? new Date(form.transaction_date).toISOString() : null,
    };

    if (editingId) {
      await api.put(`/transactions/${editingId}`, payload);
    } else {
      await api.post("/transactions/", payload);
    }

    setEditingId(null);
    setForm({
      amount: "",
      type: "expense",
      category: "",
      description: "",
      goal_id: "",
      transaction_date: getNowForDateTimeInput(),
    });
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
      className="flex items-center justify-between rounded-2xl px-4 py-3 transition cursor-default group"
      style={{ background: "rgba(10, 25, 60, 0.75)", border: "1px solid rgba(255,255,255,0.18)" }}
    >
      <div className="flex items-center gap-3">
        <FoodDoodle type={getCharacterType(t.category, t.type)} size={42} />
        <div>
          <p className="text-white font-bold text-sm tracking-wide">{t.category}</p>
          <div className="flex items-center gap-2 text-xs mt-0.5">
            {t.description && <span className="text-sky-100 font-medium">{t.description}</span>}
            {t.description && <span className="text-slate-400">•</span>}
            <span className="text-sky-300 font-semibold bg-sky-950/70 px-2 py-0.5 rounded-md border border-sky-400/30 flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-300" /> {formatDateTime(t.transaction_date)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <p className="font-black text-sm drop-shadow-sm"
          style={{ color: t.type === "income" ? "#3de8c5" : "#ff6b6b" }}
        >
          {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
        </p>
        
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
          <button
            title="Edit Transaction Entry"
            onClick={() => handleEditInit(t)}
            className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 text-sky-200 border border-sky-400/40 text-xs font-bold transition flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button
            title="Delete Entry"
            onClick={() => handleDelete(t.id)}
            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/40 text-xs font-bold transition flex items-center justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
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
            Your Financial Universe <Sparkles className="w-8 h-8 inline text-amber-300 ml-1 mb-1 animate-pulse" />
          </motion.h1>
          <p className="text-base font-bold text-sky-100 drop-shadow">
            Smart budgeting · Pixar 3D mascots
          </p>
        </motion.div>

        {/* ===== 3D CHARACTER STAT CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 pt-10">
          <StatCard
            label="Total Income"
            value={income}
            gradient="from-[#1e6fff] via-[#3ab5ff] to-[#00cfff]"
            image="/characters/currency.png"
            active={filterType === "income"}
            onClick={() => setFilterType(filterType === "income" ? "all" : "income")}
          />
          <StatCard
            label="Total Expenses"
            value={expenses}
            gradient="from-[#7a1f4d] via-[#ff6b6b] to-[#b0698f]"
            image="/characters/burger.png"
            active={filterType === "expense"}
            onClick={() => setFilterType(filterType === "expense" ? "all" : "expense")}
          />
          <StatCard
            label="Saved in Goals"
            value={allocatedToGoals}
            gradient="from-[#0a2463] via-[#6a8fff] to-[#3ab5ff]"
            image="/characters/popcorn.png"
            onClick={() => setFilterType("all")}
          />
          <StatCard
            label="Net Savings"
            value={netSavings}
            gradient="from-[#3de8c5] via-[#4f8a86] to-[#1e6fff]"
            image="/characters/piggy.png"
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
            <p className="text-xs font-black uppercase tracking-widest mb-4 text-sky-300 drop-shadow flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-sky-400 fill-sky-400" /> Mood Buddy
            </p>
            <MoodBuddy income={income} expenses={expenses + allocatedToGoals} />
          </motion.div>
          <div className="flex-1">
            <AiInsights />
          </div>
        </div>

        {/* ===== FILTER + ADD/EDIT TRANSACTION BAR ===== */}
        <div className="glass-card rounded-2xl p-3 flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-widest px-2 text-white/90">View:</span>
            {[
              { key: "all", label: `All (${transactions.length})`, icon: Layers },
              { key: "expense", label: `Expenses (${expenseList.length})`, icon: ShoppingCart },
              { key: "income", label: `Income (${incomeList.length})`, icon: TrendingUp },
              { key: "split", label: "Split View", icon: Columns3 },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setFilterType(tab.key)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all"
                  style={
                    filterType === tab.key
                      ? { background: "linear-gradient(135deg, #1e6fff, #3ab5ff)", color: "#fff", boxShadow: "0 2px 16px rgba(30,111,255,0.55)" }
                      : { background: "rgba(10, 25, 60, 0.7)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.2)" }
                  }
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.07, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAddForm}
            className="text-xs px-5 py-2 rounded-full font-black text-white shadow-lg flex items-center gap-1.5"
            style={
              showForm
                ? { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)" }
                : { background: "linear-gradient(135deg, #b0698f, #7a1f4d)", boxShadow: "0 4px 20px rgba(176,105,143,0.55)" }
            }
          >
            {showForm ? (
              <>
                <X className="w-3.5 h-3.5" /> Close
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add Transaction
              </>
            )}
          </motion.button>
        </div>

        {/* ===== ADD / EDIT TRANSACTION FORM ===== */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={handleSaveTransaction}
            className="glass-card rounded-3xl p-6 mb-6 space-y-4 border border-sky-400/40"
            style={{ background: "rgba(15, 32, 67, 0.9)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white flex items-center gap-2 text-base">
                {editingId ? <Pencil className="w-5 h-5 text-amber-300" /> : <Sparkles className="w-5 h-5 text-sky-300" />}
                {editingId ? "Edit Transaction Entry (Fix Mistake)" : "New Transaction Entry"}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setShowForm(false); }}
                  className="text-xs text-sky-300 hover:text-white font-bold bg-sky-900/60 px-3 py-1 rounded-lg border border-sky-400/30"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount (₹)"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900/90 border border-sky-400/40 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900/90 border border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="expense" style={{ background: "#0a192f" }}>Expense</option>
                  <option value="income" style={{ background: "#0a192f" }}>Income</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={form.transaction_date}
                  onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900/90 border border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            {!editingId && form.type === "income" && goals.length > 0 && (
              <div className="p-3 rounded-2xl space-y-2 bg-sky-950/70 border border-sky-400/30">
                <select
                  value={form.goal_id}
                  onChange={(e) => { setForm({ ...form, goal_id: e.target.value }); setSaveAmount(""); }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900/90 border border-sky-400/40 focus:outline-none"
                >
                  <option value="" style={{ background: "#0a192f" }}>Not linked to a goal</option>
                  {goals.map((g) => <option key={g.id} value={g.id} style={{ background: "#0a192f" }}>→ Put toward: {g.title}</option>)}
                </select>
                {form.goal_id && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-sky-200">How much goes toward the goal?</p>
                    <div className="flex gap-2 flex-wrap">
                      {[100, 500, 1000].map((preset) => {
                        const tooMuch = form.amount && preset > parseFloat(form.amount);
                        return (
                          <button
                            type="button"
                            key={preset}
                            disabled={tooMuch}
                            onClick={() => setSaveAmount(String(preset))}
                            className="px-3 py-1 rounded-full text-xs font-bold transition disabled:opacity-30"
                            style={saveAmount === String(preset)
                              ? { background: "linear-gradient(135deg, #1e6fff, #3ab5ff)", color: "#fff" }
                              : { background: "rgba(255,255,255,0.12)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.3)" }
                            }
                          >
                            ₹{preset}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="number"
                      placeholder="Custom amount (₹)"
                      value={saveAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSaveAmount(form.amount && parseFloat(val) > parseFloat(form.amount) ? form.amount : val);
                      }}
                      className="w-full px-4 py-2 rounded-xl text-sm font-bold text-white bg-slate-900/90 border border-sky-400/40 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1">Category</label>
                <input
                  type="text"
                  list="category-suggestions"
                  placeholder="Category (e.g. Drinks, Food, Groceries)"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900/90 border border-sky-400/40 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <datalist id="category-suggestions">
                  <option value="Food & Dining" />
                  <option value="Drinks & Beverages" />
                  <option value="Coffee & Cafe" />
                  <option value="Groceries" />
                  <option value="Shopping" />
                  <option value="Entertainment" />
                  <option value="Travel & Transport" />
                  <option value="Bills & Utilities" />
                  <option value="Salary" />
                  <option value="Investments" />
                </datalist>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    { label: "Drinks", cat: "Drinks & Beverages" },
                    { label: "Food", cat: "Food & Dining" },
                    { label: "Coffee", cat: "Coffee & Cafe" },
                    { label: "Groceries", cat: "Groceries" },
                    { label: "Shopping", cat: "Shopping" },
                    { label: "Fun", cat: "Entertainment" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setForm({ ...form, category: item.cat })}
                      className={`text-[11px] px-2 py-0.5 rounded-full border transition flex items-center gap-1 font-semibold ${
                        form.category === item.cat
                          ? "bg-sky-500/40 text-white border-sky-400"
                          : "bg-white/10 hover:bg-white/20 text-sky-200 border-white/10"
                      }`}
                    >
                      <FoodDoodle type={getCharacterType(item.cat)} size={16} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900/90 border border-sky-400/40 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-black text-sm text-white shadow-lg transition hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #1e6fff, #b0698f)", boxShadow: "0 4px 28px rgba(30,111,255,0.45)" }}
            >
              {editingId ? "Update Transaction Entry" : "Save Transaction Entry"}
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
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-black text-white">Income Stream</h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  +₹{income.toLocaleString()}
                </span>
              </div>
              {incomeList.length === 0
                ? <p className="text-sky-200/70 text-sm py-6 text-center font-medium">No income records yet</p>
                : <div className="space-y-2 max-h-96 overflow-y-auto">{incomeList.slice().reverse().map(renderTransactionItem)}</div>}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3"
                style={{ borderBottom: "1px solid rgba(176,105,143,0.25)" }}>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-rose-400" />
                  <h2 className="font-black text-white">Expenses Stream</h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  -₹{expenses.toLocaleString()}
                </span>
              </div>
              {expenseList.length === 0
                ? <p className="text-sky-200/70 text-sm py-6 text-center font-medium">No expenses yet</p>
                : <div className="space-y-2 max-h-96 overflow-y-auto">{expenseList.slice().reverse().map(renderTransactionItem)}</div>}
            </motion.div>
          </div>

        ) : (
          /* ===== STANDARD / FILTERED VIEW ===== */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-3xl p-6">
              <h2 className="font-black text-white mb-5 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-sky-400" /> Spending by Category
              </h2>
              {categoryData.length === 0
                ? <p className="text-sky-200/70 text-sm py-6 text-center font-medium">No expenses yet — start tracking!</p>
                : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} paddingAngle={3}>
                        {categoryData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{
                        background: "rgba(10,25,60,0.95)",
                        border: "1px solid rgba(58,181,255,0.4)",
                        borderRadius: "14px",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "700",
                      }} />
                      <Legend wrapperStyle={{ color: "rgba(255,255,255,0.9)", fontSize: "12px", fontWeight: "600" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="font-black text-white flex items-center gap-2">
                  {filterType === "expense" ? (
                    <ShoppingCart className="w-5 h-5 text-rose-400" />
                  ) : filterType === "income" ? (
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-sky-300" />
                  )}
                  {filterType === "expense" ? "Expenses" : filterType === "income" ? "Income" : "Recent Transactions"}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {displayedTransactions.length}
                </span>
              </div>
              {loading
                ? <p className="text-sky-200 text-sm font-medium">Loading...</p>
                : displayedTransactions.length === 0
                  ? <p className="text-sky-200/70 text-sm py-6 text-center font-medium">No transactions to show yet</p>
                  : <div className="space-y-2 max-h-80 overflow-y-auto pr-1">{displayedTransactions.slice().reverse().map(renderTransactionItem)}</div>}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
