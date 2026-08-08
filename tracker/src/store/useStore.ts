import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseStore {
  expenses: Expense[];

  addExpense: (expense: Expense) => void;
  removeExpense: (id: number) => void;
  updateExpense: (
    id: number,
    updatedExpense: Expense
  ) => void;
}

export const useStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],

      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense],
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter(
            (expense) => expense.id !== id
          ),
        })),

      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id
              ? updatedExpense
              : expense
          ),
        })),
    }),
    {
      name: "expense-tracker-storage",
    }
  )
);