import React, { useMemo, useState } from "react";
import { useStore } from "../store/useStore";

interface Expense {
    id: number;
    title: string;
    amount: number;
    category: string;
    date: string;
}

const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
];

const ExpenseTracker: React.FC = () => {
    const {
        expenses,
        addExpense,
        removeExpense,
        updateExpense,
    } = useStore();

    // -------------------------
    // FORM STATE
    // -------------------------

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState("");

    // -------------------------
    // EDITING STATE
    // -------------------------

    const [editingExpense, setEditingExpense] =
        useState<Expense | null>(null);

    // -------------------------
    // FILTER STATE
    // -------------------------

    const [filter, setFilter] = useState("All");

    // -------------------------
    // CLEAR FORM
    // -------------------------

    const clearForm = () => {
        setTitle("");
        setAmount("");
        setCategory("Food");
        setDate("");
        setEditingExpense(null);
    };

    // -------------------------
    // ADD EXPENSE
    // -------------------------

    const handleAddExpense = () => {
        if (
            title.trim() === "" ||
            amount === "" ||
            Number(amount) <= 0 ||
            category === "" ||
            date === ""
        ) {
            return;
        }

        addExpense({
            id: Date.now(),
            title: title.trim(),
            amount: Number(amount),
            category,
            date,
        });

        clearForm();
    };

    // -------------------------
    // EDIT EXPENSE
    // -------------------------

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);

        setTitle(expense.title);
        setAmount(String(expense.amount));
        setCategory(expense.category);
        setDate(expense.date);
    };

    // -------------------------
    // UPDATE EXPENSE
    // -------------------------

    const handleUpdateExpense = () => {
        if (!editingExpense) return;

        if (
            title.trim() === "" ||
            amount === "" ||
            Number(amount) <= 0 ||
            category === "" ||
            date === ""
        ) {
            return;
        }

        updateExpense(editingExpense.id, {
            id: editingExpense.id,
            title: title.trim(),
            amount: Number(amount),
            category,
            date,
        });

        clearForm();
    };

    // -------------------------
    // CANCEL EDIT
    // -------------------------

    const handleCancelEdit = () => {
        clearForm();
    };

    // -------------------------
    // TOTAL EXPENSE
    // -------------------------

    const totalExpense = useMemo(() => {
        return expenses.reduce(
            (total, expense) => total + expense.amount,
            0
        );
    }, [expenses]);

    // -------------------------
    // AVERAGE EXPENSE
    // -------------------------

    const averageExpense = useMemo(() => {
        if (expenses.length === 0) {
            return 0;
        }

        return Math.round(totalExpense / expenses.length);
    }, [expenses, totalExpense]);

    // -------------------------
    // FILTER EXPENSES
    // -------------------------

    const filteredExpenses = useMemo(() => {
        if (filter === "All") {
            return expenses;
        }

        return expenses.filter(
            (expense) => expense.category === filter
        );
    }, [expenses, filter]);

    // -------------------------
    // FORMAT DATE
    // -------------------------

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[#171614] text-stone-100 px-4 py-5">

            <div className="max-w-6xl mx-auto">

                {/* =========================================
            HEADER
        ========================================= */}

                <div className="mb-10">

                    <div className="flex items-center gap-3 mb-3">

                        <div className="w-3 h-3 rounded-full bg-amber-400" />

                        <span className="text-sm uppercase tracking-[0.25em] text-stone-500">
                            Personal Finance
                        </span>

                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-stone-100">
                        Expense Tracker
                    </h1>

                    <p className="text-stone-500 mt-3 max-w-xl">
                        Keep an eye on where your money goes.
                    </p>

                </div>


                {/* =========================================
            SUMMARY CARDS
        ========================================= */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    {/* TOTAL */}

                    <div className="bg-[#211F1B] border border-[#3A362D] rounded-2xl p-6">

                        <p className="text-stone-500 text-sm uppercase tracking-wider">
                            Total Spent
                        </p>

                        <h2 className="text-3xl font-bold mt-3 text-amber-400">
                            ₹{totalExpense.toLocaleString("en-IN")}
                        </h2>

                    </div>


                    {/* TRANSACTIONS */}

                    <div className="bg-[#211F1B] border border-[#3A362D] rounded-2xl p-6">

                        <p className="text-stone-500 text-sm uppercase tracking-wider">
                            Transactions
                        </p>

                        <h2 className="text-3xl font-bold mt-3 text-stone-100">
                            {expenses.length}
                        </h2>

                    </div>


                    {/* AVERAGE */}

                    <div className="bg-[#211F1B] border border-[#3A362D] rounded-2xl p-6">

                        <p className="text-stone-500 text-sm uppercase tracking-wider">
                            Average Expense
                        </p>

                        <h2 className="text-3xl font-bold mt-3 text-stone-100">
                            ₹{averageExpense.toLocaleString("en-IN")}
                        </h2>

                    </div>

                </div>


                {/* =========================================
            MAIN CONTENT
        ========================================= */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                    {/* =======================================
              FORM
          ======================================= */}

                    <div className="bg-[#211F1B] border border-[#3A362D] rounded-2xl p-6">

                        <h2 className="text-xl font-semibold text-stone-100 mb-6">

                            {editingExpense
                                ? "Edit Expense"
                                : "Add Expense"}

                        </h2>


                        {/* TITLE */}

                        <div className="mb-5">

                            <label className="block text-sm text-stone-500 mb-2">
                                Expense Name
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="e.g. Lunch"
                                className="w-full bg-[#29261F] border border-[#3A362D] text-stone-100 placeholder:text-stone-600 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition"
                            />

                        </div>


                        {/* AMOUNT */}

                        <div className="mb-5">

                            <label className="block text-sm text-stone-500 mb-2">
                                Amount
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    placeholder="250"
                                    min="1"
                                    className="w-full bg-[#29261F] border border-[#3A362D] text-stone-100 placeholder:text-stone-600 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-amber-500 transition"
                                />

                            </div>

                        </div>


                        {/* CATEGORY */}

                        <div className="mb-5">

                            <label className="block text-sm text-stone-500 mb-2">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="w-full bg-[#29261F] border border-[#3A362D] text-stone-100 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition"
                            >

                                {categories.map((cat) => (
                                    <option
                                        key={cat}
                                        value={cat}
                                        className="bg-[#29261F]"
                                    >
                                        {cat}
                                    </option>
                                ))}

                            </select>

                        </div>


                        {/* DATE */}

                        <div className="mb-6">

                            <label className="block text-sm text-stone-500 mb-2">
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                className="w-full bg-[#29261F] border border-[#3A362D] text-stone-100 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition"
                            />

                        </div>


                        {/* =====================================
                FORM BUTTONS
            ===================================== */}

                        {editingExpense ? (

                            <div className="flex gap-3">

                                <button
                                    onClick={handleUpdateExpense}
                                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-[#171614] py-3 rounded-xl font-bold transition"
                                >
                                    Update
                                </button>

                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-[#3A362D] hover:bg-[#484338] text-stone-200 py-3 rounded-xl font-semibold transition"
                                >
                                    Cancel
                                </button>

                            </div>

                        ) : (

                            <button
                                onClick={handleAddExpense}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-[#171614] py-3 rounded-xl font-bold transition"
                            >
                                Add Expense
                            </button>

                        )}

                    </div>


                    {/* =======================================
              EXPENSE LIST
          ======================================= */}

                    <div className="lg:col-span-2 bg-[#211F1B] border border-[#3A362D] rounded-2xl p-6">

                        {/* LIST HEADER */}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                            <div>

                                <h2 className="text-xl font-semibold text-stone-100">
                                    Your Expenses
                                </h2>

                                <p className="text-stone-500 text-sm mt-1">
                                    {filteredExpenses.length} expense
                                    {filteredExpenses.length !== 1
                                        ? "s"
                                        : ""}
                                </p>

                            </div>


                            {/* FILTER */}

                            <select
                                value={filter}
                                onChange={(e) =>
                                    setFilter(e.target.value)
                                }
                                className="bg-[#29261F] border border-[#3A362D] text-stone-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-500 transition"
                            >

                                <option
                                    value="All"
                                    className="bg-[#29261F]"
                                >
                                    All Categories
                                </option>

                                {categories.map((cat) => (
                                    <option
                                        key={cat}
                                        value={cat}
                                        className="bg-[#29261F]"
                                    >
                                        {cat}
                                    </option>
                                ))}

                            </select>

                        </div>


                        {/* =====================================
                EMPTY STATE
            ===================================== */}

                        {filteredExpenses.length === 0 ? (

                            <div className="text-center py-16">

                                <div className="text-5xl mb-5">
                                    ₹
                                </div>

                                <h3 className="text-lg font-semibold text-stone-200">
                                    No expenses found
                                </h3>

                                <p className="text-stone-500 mt-2">
                                    Add your first expense to get started.
                                </p>

                            </div>

                        ) : (

                            /* ===================================
                               EXPENSE ITEMS
                            =================================== */

                            <div className="space-y-3">

                                {filteredExpenses.map((expense) => (

                                    <div
                                        key={expense.id}
                                        className="bg-[#29261F] border border-[#3A362D] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#514B3E] transition"
                                    >

                                        {/* EXPENSE INFORMATION */}

                                        <div className="min-w-0">

                                            <h3 className="font-semibold text-lg text-stone-100 truncate">
                                                {expense.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-2 mt-2">

                                                {/* CATEGORY */}

                                                <span className="text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md text-xs font-medium">
                                                    {expense.category}
                                                </span>

                                                {/* DATE */}

                                                <span className="text-sm text-stone-500">
                                                    {formatDate(expense.date)}
                                                </span>

                                            </div>

                                        </div>


                                        {/* AMOUNT + ACTIONS */}

                                        <div className="flex items-center gap-4">

                                            <p className="font-bold text-lg text-stone-100 whitespace-nowrap">
                                                ₹{expense.amount.toLocaleString("en-IN")}
                                            </p>


                                            {/* EDIT */}

                                            <button
                                                onClick={() =>
                                                    handleEditExpense(expense)
                                                }
                                                className="text-amber-400 hover:text-amber-300 font-medium transition"
                                            >
                                                Edit
                                            </button>


                                            {/* DELETE */}

                                            <button
                                                onClick={() =>
                                                    removeExpense(expense.id)
                                                }
                                                className="text-[#D66B5D] hover:text-[#E27B6C] font-medium transition"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ExpenseTracker;