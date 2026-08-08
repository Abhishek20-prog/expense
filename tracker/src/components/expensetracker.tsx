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

    // Form states
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState("");

    // Editing state
    const [editingExpense, setEditingExpense] =
        useState<Expense | null>(null);

    // Filter
    const [filter, setFilter] = useState("All");

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
    // TOTAL
    // -------------------------

    const totalExpense = useMemo(() => {
        return expenses.reduce(
            (total, expense) => total + expense.amount,
            0
        );
    }, [expenses]);

    // -------------------------
    // FILTER
    // -------------------------

    const filteredExpenses = useMemo(() => {
        if (filter === "All") {
            return expenses;
        }

        return expenses.filter(
            (expense) => expense.category === filter
        );
    }, [expenses, filter]);

    return (
        <div className="min-h-screen bg-slate-950 text-white px-4 py-8">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}

                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        Expense Tracker
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Track your spending and manage your expenses.
                    </p>
                </div>


                {/* SUMMARY CARDS */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <p className="text-slate-400 text-sm">
                            Total Expenses
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            ₹{totalExpense.toLocaleString("en-IN")}
                        </h2>
                    </div>


                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <p className="text-slate-400 text-sm">
                            Transactions
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {expenses.length}
                        </h2>
                    </div>


                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <p className="text-slate-400 text-sm">
                            Average Expense
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            ₹
                            {expenses.length
                                ? Math.round(
                                    totalExpense / expenses.length
                                ).toLocaleString("en-IN")
                                : 0}
                        </h2>
                    </div>

                </div>


                {/* MAIN GRID */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                    {/* FORM */}

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <h2 className="text-xl font-semibold mb-6">
                            {editingExpense
                                ? "Edit Expense"
                                : "Add Expense"}
                        </h2>


                        {/* TITLE */}

                        <div className="mb-4">

                            <label className="block text-sm text-slate-400 mb-2">
                                Expense Name
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="e.g. Lunch"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>


                        {/* AMOUNT */}

                        <div className="mb-4">

                            <label className="block text-sm text-slate-400 mb-2">
                                Amount
                            </label>

                            <input
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                placeholder="e.g. 250"
                                min="1"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="mb-4">

                            <label className="block text-sm text-slate-400 mb-2">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                            >

                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}

                            </select>

                        </div>


                        {/* DATE */}

                        <div className="mb-6">

                            <label className="block text-sm text-slate-400 mb-2">
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>


                        {/* BUTTONS */}

                        {editingExpense ? (
                            <div className="flex gap-3">

                                <button
                                    onClick={handleUpdateExpense}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
                                >
                                    Update
                                </button>

                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>

                            </div>
                        ) : (

                            <button
                                onClick={handleAddExpense}
                                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
                            >
                                Add Expense
                            </button>

                        )}

                    </div>


                    {/* EXPENSE LIST */}

                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        {/* LIST HEADER */}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Your Expenses
                                </h2>

                                <p className="text-slate-400 text-sm mt-1">
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
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none"
                            >

                                <option value="All">
                                    All Categories
                                </option>

                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}

                            </select>

                        </div>


                        {/* EMPTY STATE */}

                        {filteredExpenses.length === 0 ? (

                            <div className="text-center py-16">

                                <div className="text-5xl mb-4">
                                    💸
                                </div>

                                <h3 className="text-lg font-semibold">
                                    No expenses found
                                </h3>

                                <p className="text-slate-400 mt-2">
                                    Add your first expense to get started.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {filteredExpenses.map((expense) => (

                                    <div
                                        key={expense.id}
                                        className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >

                                        {/* EXPENSE INFO */}

                                        <div>

                                            <h3 className="font-semibold text-lg">
                                                {expense.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-2 mt-2">

                                                <span className="text-sm text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">
                                                    {expense.category}
                                                </span>

                                                <span className="text-sm text-slate-400">
                                                    {expense.date}
                                                </span>

                                            </div>

                                        </div>


                                        {/* AMOUNT + BUTTONS */}

                                        <div className="flex items-center gap-4">

                                            <p className="font-bold text-lg">
                                                ₹{expense.amount.toLocaleString("en-IN")}
                                            </p>


                                            <button
                                                onClick={() =>
                                                    handleEditExpense(expense)
                                                }
                                                className="text-yellow-400 hover:text-yellow-300 font-medium"
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={() =>
                                                    removeExpense(expense.id)
                                                }
                                                className="text-red-400 hover:text-red-300 font-medium"
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