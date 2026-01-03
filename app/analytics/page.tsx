"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getExpenses, getCategories } from "@/lib/storage"
import { getMonthlyTrend, getTotalByCategory, getCategoryTrend } from "@/lib/analytics"
import type { Expense, Category } from "@/lib/types"
import { BarChart3, PieChart, TrendingUp } from "lucide-react"
import { startOfMonth, endOfMonth, format } from "date-fns"
import { fr } from "date-fns/locale"
import { useCurrency } from "@/hooks/use-currency"
import { formatCurrency } from "@/lib/currency"

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [monthlyTrend, setMonthlyTrend] = useState<Array<{ month: string; total: number }>>([])
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({})
  const { currency } = useCurrency()

  useEffect(() => {
    const loadedExpenses = getExpenses()
    const loadedCategories = getCategories()

    setExpenses(loadedExpenses)
    setCategories(loadedCategories)

    const trend = getMonthlyTrend(loadedExpenses, 6)
    setMonthlyTrend(trend)

    const now = new Date()
    const totals = getTotalByCategory(loadedExpenses, startOfMonth(now), endOfMonth(now))
    setCategoryTotals(totals)
  }, [])

  const getCategoryIcon = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.icon || "📦"
  }

  const getCategoryColor = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.color || "#6b7280"
  }

  const maxTrendValue = Math.max(...monthlyTrend.map((t) => t.total), 1)
  const totalCurrentMonth = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)

  const categoryTrendData = selectedCategory !== "all" ? getCategoryTrend(expenses, selectedCategory, 6) : []
  const maxCategoryTrendValue = Math.max(...categoryTrendData.map((t) => t.total), 1)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:pl-64">
      <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analyses</h1>
          <p className="text-muted-foreground mt-1">Visualisez vos dépenses et tendances</p>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Tendance mensuelle</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyTrend.map((item) => (
                <div key={item.month} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{item.month}</span>
                    <span className="text-muted-foreground">{formatCurrency(item.total, currency)}</span>
                  </div>
                  <div className="h-8 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${(item.total / maxTrendValue) * 100}%` }}
                    >
                      {item.total > 0 && (
                        <span className="text-xs font-medium text-primary-foreground">{formatCurrency(item.total, currency)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle>Répartition par catégorie</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">{format(new Date(), "MMMM yyyy", { locale: fr })}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const percentage = totalCurrentMonth > 0 ? (amount / totalCurrentMonth) * 100 : 0

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCategoryIcon(category)}</span>
                        <span className="font-medium">{category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(amount, currency)}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getCategoryColor(category),
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            {Object.keys(categoryTotals).length === 0 && (
              <p className="text-center text-muted-foreground py-8">Aucune dépense ce mois-ci</p>
            )}
          </CardContent>
        </Card>

        {/* Category Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Évolution par catégorie</CardTitle>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCategory === "all" ? (
              <p className="text-center text-muted-foreground py-8">
                Sélectionnez une catégorie pour voir son évolution
              </p>
            ) : (
              <div className="space-y-3">
                {categoryTrendData.map((item) => (
                  <div key={item.month} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{item.month}</span>
                      <span className="text-muted-foreground">{formatCurrency(item.total, currency)}</span>
                    </div>
                    <div className="h-8 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 flex items-center justify-end pr-2"
                        style={{
                          width: `${(item.total / maxCategoryTrendValue) * 100}%`,
                          backgroundColor: getCategoryColor(selectedCategory),
                        }}
                      >
                        {item.total > 0 && (
                          <span className="text-xs font-medium text-white">{formatCurrency(item.total, currency)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total ce mois</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCurrentMonth, currency)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Nombre de dépenses</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Dépense moyenne</p>
              <p className="text-2xl font-bold">
                {expenses.length > 0
                  ? formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length, currency)
                  : formatCurrency(0, currency)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
