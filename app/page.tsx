"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getExpenses, getBudgets, getCategories } from "@/lib/storage"
import { getMonthlyTotal, getTotalByCategory, getBudgetProgress } from "@/lib/analytics"
import type { Expense, Budget, Category } from "@/lib/types"
import { Plus, TrendingUp, Wallet, Target } from "lucide-react"
import Link from "next/link"
import { startOfMonth, endOfMonth, format } from "date-fns"
import { fr } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"
import { useCurrency } from "@/hooks/use-currency"
import { formatCurrency } from "@/lib/currency"

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({})
  const { currency } = useCurrency()

  useEffect(() => {
    const loadedExpenses = getExpenses()
    const loadedBudgets = getBudgets()
    const loadedCategories = getCategories()

    setExpenses(loadedExpenses)
    setBudgets(loadedBudgets)
    setCategories(loadedCategories)

    const total = getMonthlyTotal(loadedExpenses)
    setMonthlyTotal(total)

    const now = new Date()
    const totals = getTotalByCategory(loadedExpenses, startOfMonth(now), endOfMonth(now))
    setCategoryTotals(totals)
  }, [])

  // Recharger les données quand la devise change
  useEffect(() => {
    const handleCurrencyChange = () => {
      // Forcer le re-render
      setExpenses([...getExpenses()])
    }
    window.addEventListener("currencyChanged", handleCurrencyChange)
    return () => window.removeEventListener("currencyChanged", handleCurrencyChange)
  }, [])

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const getCategoryColor = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.color || "#6b7280"
  }

  const getCategoryIcon = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.icon || "📦"
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:pl-64">
      <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Bonjour 👋</h1>
            <p className="text-muted-foreground mt-1">{format(new Date(), "d MMMM yyyy", { locale: fr })}</p>
          </div>
          <Link href="/expenses">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Ajouter</span>
            </Button>
          </Link>
        </div>

        {/* Monthly Summary Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 opacity-90" />
              <span className="text-sm font-medium opacity-90">Dépenses du mois</span>
            </div>
            <div className="text-4xl font-bold mb-1">{formatCurrency(monthlyTotal, currency)}</div>
            <p className="text-sm opacity-80">{format(new Date(), "MMMM yyyy", { locale: fr })}</p>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Par catégorie</h2>
          <div className="grid gap-3">
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const percentage = monthlyTotal > 0 ? (amount / monthlyTotal) * 100 : 0
                const budget = budgets.find((b) => b.category === category && b.period === "monthly")
                const progress = budget ? getBudgetProgress(expenses, budget) : null

                return (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCategoryIcon(category)}</span>
                          <span className="font-medium">{category}</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(amount, currency)}</span>
                      </div>
                      <div className="space-y-1">
                        <Progress
                          value={percentage}
                          className="h-2"
                          style={{
                            // @ts-ignore
                            "--progress-background": getCategoryColor(category),
                          }}
                        />
                        {progress && (
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress.percentage.toFixed(0)}% du budget</span>
                            <span>{formatCurrency(progress.remaining, currency)} restants</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>

        {/* Recent Expenses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Dépenses récentes</h2>
            <Link href="/expenses">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {recentExpenses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <p>Aucune dépense enregistrée</p>
                  <Link href="/expenses">
                    <Button className="mt-4">Ajouter une dépense</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              recentExpenses.map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{ backgroundColor: `${getCategoryColor(expense.category)}20` }}
                        >
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <p className="font-medium">{expense.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(expense.date), "d MMM yyyy", { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">-{formatCurrency(expense.amount, currency)}</p>
                        {expense.note && <p className="text-xs text-muted-foreground">{expense.note}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/budgets">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">Gérer les budgets</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/analytics">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">Voir les analyses</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
