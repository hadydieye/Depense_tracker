"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { getExpenses, getBudgets, saveBudget, deleteBudget, getCategories } from "@/lib/storage"
import { getBudgetProgress } from "@/lib/analytics"
import type { Budget, Category } from "@/lib/types"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from "@/lib/currency"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    period: "monthly" as "monthly" | "yearly",
  })
  const { currency } = useCurrency()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setBudgets(getBudgets())
    setCategories(getCategories())
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Formater selon la devise
    if (currency === "FG") {
      const parts = value.split(",")
      const integerPart = parts[0]?.replace(/\./g, "").replace(/\D/g, "") || ""
      const decimalPart = parts[1]?.replace(/\D/g, "").slice(0, 2) || ""
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      setNewBudget({ ...newBudget, amount: decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger })
    } else {
      const parts = value.split(",")
      const integerPart = parts[0]?.replace(/\s/g, "").replace(/\D/g, "") || ""
      const decimalPart = parts[1]?.replace(/\D/g, "").slice(0, 2) || ""
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      setNewBudget({ ...newBudget, amount: decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger })
    }
  }

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBudget.category || !newBudget.amount) return

    // Convertir vers FG pour le stockage
    const amountInFG = parseCurrencyInput(newBudget.amount, currency)

    saveBudget({
      category: newBudget.category,
      amount: amountInFG,
      period: newBudget.period,
    })

    loadData()
    setIsAddDialogOpen(false)
    setNewBudget({ category: "", amount: "", period: "monthly" })
  }

  const handleDeleteBudget = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce budget ?")) {
      deleteBudget(id)
      loadData()
    }
  }

  const expenses = getExpenses()
  const usedCategories = new Set(budgets.map((b) => b.category))
  const availableCategories = categories.filter((c) => !usedCategories.has(c.name))

  const getCategoryIcon = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.icon || "📦"
  }

  const getCategoryColor = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.color || "#6b7280"
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:pl-64">
      <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Budgets</h1>
            <p className="text-muted-foreground mt-1">Gérez vos budgets par catégorie</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Ajouter</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau budget</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-category">Catégorie</Label>
                  <Select
                    value={newBudget.category}
                    onValueChange={(value) => setNewBudget({ ...newBudget, category: value })}
                    required
                  >
                    <SelectTrigger id="budget-category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget-amount">Montant ({currency === "FG" ? "FG" : currency === "EUR" ? "€" : "$"})</Label>
                  <Input
                    id="budget-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={newBudget.amount}
                    onChange={handleAmountChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget-period">Période</Label>
                  <Select
                    value={newBudget.period}
                    onValueChange={(value: "monthly" | "yearly") => setNewBudget({ ...newBudget, period: value })}
                  >
                    <SelectTrigger id="budget-period">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="yearly">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Ajouter
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Budgets List */}
        <div className="space-y-4">
          {budgets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Aucun budget configuré</p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  Créer votre premier budget
                </Button>
              </CardContent>
            </Card>
          ) : (
            budgets.map((budget) => {
              const progress = getBudgetProgress(expenses, budget)
              const isOverBudget = progress.spent > budget.amount
              const isNearLimit = progress.percentage >= 80 && progress.percentage < 100

              return (
                <Card key={budget.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${getCategoryColor(budget.category)}20` }}
                        >
                          {getCategoryIcon(budget.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{budget.category}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Budget {budget.period === "monthly" ? "mensuel" : "annuel"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dépensé</span>
                      <span className="font-semibold">
                        {formatCurrency(progress.spent, currency)} / {formatCurrency(budget.amount, currency)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(progress.percentage, 100)}
                      className="h-3"
                      style={{
                        // @ts-ignore
                        "--progress-background": isOverBudget ? "#ef4444" : getCategoryColor(budget.category),
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{progress.percentage.toFixed(0)}%</span>
                      {isOverBudget ? (
                        <div className="flex items-center gap-1 text-destructive text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>Dépassé de {formatCurrency(Math.abs(progress.remaining), currency)}</span>
                        </div>
                      ) : isNearLimit ? (
                        <div className="flex items-center gap-1 text-orange-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>Attention: {formatCurrency(progress.remaining, currency)} restants</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(progress.remaining, currency)} restants
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
