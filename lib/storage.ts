/**
 * Gestion du stockage local (localStorage) pour les dépenses, budgets et catégories
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

import { type Expense, type Budget, type Category, DEFAULT_CATEGORIES } from "./types"
import { v4 as uuidv4 } from 'uuid';

const EXPENSES_KEY = "expenses"
const BUDGETS_KEY = "budgets"
const CATEGORIES_KEY = "categories"

// Expenses
export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(EXPENSES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveExpense(expense: Omit<Expense, "id" | "createdAt" | "updatedAt">): Expense {
  const expenses = getExpenses()
  const newExpense: Expense = {
    ...expense,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  expenses.push(newExpense)
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
  // Émettre un événement pour déclencher les notifications
  window.dispatchEvent(new CustomEvent("expenseUpdated"))
  return newExpense
}

export function updateExpense(id: string, updates: Partial<Expense>): Expense | null {
  const expenses = getExpenses()
  const index = expenses.findIndex((e) => e.id === id)
  if (index === -1) return null

  expenses[index] = {
    ...expenses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
  // Émettre un événement pour déclencher les notifications
  window.dispatchEvent(new CustomEvent("expenseUpdated"))
  return expenses[index]
}

export function deleteExpense(id: string): boolean {
  const expenses = getExpenses()
  const filtered = expenses.filter((e) => e.id !== id)
  if (filtered.length === expenses.length) return false
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered))
  return true
}

// Budgets
export function getBudgets(): Budget[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(BUDGETS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveBudget(budget: Omit<Budget, "id" | "createdAt" | "updatedAt">): Budget {
  const budgets = getBudgets()
  const existingIndex = budgets.findIndex((b) => b.category === budget.category && b.period === budget.period)

  if (existingIndex !== -1) {
    budgets[existingIndex] = {
      ...budgets[existingIndex],
      amount: budget.amount,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets))
    return budgets[existingIndex]
  }

  const newBudget: Budget = {
    ...budget,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  budgets.push(newBudget)
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets))
  return newBudget
}

export function deleteBudget(id: string): boolean {
  const budgets = getBudgets()
  const filtered = budgets.filter((b) => b.id !== id)
  if (filtered.length === budgets.length) return false
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(filtered))
  return true
}

// Categories
export function getCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES
  const data = localStorage.getItem(CATEGORIES_KEY)
  return data ? JSON.parse(data) : DEFAULT_CATEGORIES
}

export function saveCategory(category: Omit<Category, "id">): Category {
  const categories = getCategories()
  const newCategory: Category = {
    ...category,
    id: crypto.randomUUID(),
  }
  categories.push(newCategory)
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  return newCategory
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  const category = categories.find((c) => c.id === id)
  if (!category || category.isDefault) return false

  const filtered = categories.filter((c) => c.id !== id)
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered))
  return true
}

export function resetCategories(): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES))
}

// Export data
export function exportToCSV(): string {
  const expenses = getExpenses()
  const headers = ["Date", "Montant", "Catégorie", "Note"]
  const rows = expenses.map((e) => [
    new Date(e.date).toLocaleDateString("fr-FR"),
    e.amount.toString(),
    e.category,
    e.note || "",
  ])

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  return csv
}
