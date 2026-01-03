/**
 * Fonctions d'analyse et de calcul pour les dépenses et budgets
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

import type { Expense, Budget } from "./types"
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, format } from "date-fns"
import { fr } from "date-fns/locale"

export function getTotalByCategory(expenses: Expense[], startDate: Date, endDate: Date) {
  return expenses
    .filter((e) => {
      const expenseDate = new Date(e.date)
      return expenseDate >= startDate && expenseDate <= endDate
    })
    .reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )
}

export function getMonthlyTotal(expenses: Expense[], date: Date = new Date()) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return expenses
    .filter((e) => {
      const expenseDate = new Date(e.date)
      return expenseDate >= start && expenseDate <= end
    })
    .reduce((sum, e) => sum + e.amount, 0)
}

export function getBudgetProgress(expenses: Expense[], budget: Budget, date: Date = new Date()) {
  const start = budget.period === "monthly" ? startOfMonth(date) : startOfYear(date)
  const end = budget.period === "monthly" ? endOfMonth(date) : endOfYear(date)

  const spent = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date)
      return e.category === budget.category && expenseDate >= start && expenseDate <= end
    })
    .reduce((sum, e) => sum + e.amount, 0)

  return {
    spent,
    budget: budget.amount,
    percentage: (spent / budget.amount) * 100,
    remaining: budget.amount - spent,
  }
}

export function getMonthlyTrend(expenses: Expense[], monthsCount = 6) {
  const trend = []
  const now = new Date()

  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = subMonths(now, i)
    const start = startOfMonth(date)
    const end = endOfMonth(date)

    const total = expenses
      .filter((e) => {
        const expenseDate = new Date(e.date)
        return expenseDate >= start && expenseDate <= end
      })
      .reduce((sum, e) => sum + e.amount, 0)

    trend.push({
      month: format(date, "MMM", { locale: fr }),
      total,
    })
  }

  return trend
}

export function getCategoryTrend(expenses: Expense[], category: string, monthsCount = 6) {
  const trend = []
  const now = new Date()

  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = subMonths(now, i)
    const start = startOfMonth(date)
    const end = endOfMonth(date)

    const total = expenses
      .filter((e) => {
        const expenseDate = new Date(e.date)
        return e.category === category && expenseDate >= start && expenseDate <= end
      })
      .reduce((sum, e) => sum + e.amount, 0)

    trend.push({
      month: format(date, "MMM", { locale: fr }),
      total,
    })
  }

  return trend
}
