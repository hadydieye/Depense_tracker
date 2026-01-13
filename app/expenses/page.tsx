"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getExpenses, saveExpense, updateExpense, deleteExpense, getCategories } from "@/lib/storage"
import type { Expense, Category } from "@/lib/types"
import { ExpenseForm } from "@/components/expense-form"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { useCurrency } from "@/hooks/use-currency"
import { formatCurrency } from "@/lib/currency"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const { currency } = useCurrency()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterExpenses()
  }, [expenses, searchQuery, categoryFilter, dateFilter])

  const loadData = () => {
    const loadedExpenses = getExpenses()
    const loadedCategories = getCategories()
    setExpenses(loadedExpenses)
    setCategories(loadedCategories)
  }

  const filterExpenses = () => {
    let filtered = [...expenses]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((e) => e.category === categoryFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      if (dateFilter === "month") {
        const start = startOfMonth(now)
        const end = endOfMonth(now)
        filtered = filtered.filter((e) => {
          const date = new Date(e.date)
          return date >= start && date <= end
        })
      }
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredExpenses(filtered)
  }

  const handleAddExpense = (data: any) => {
    saveExpense(data)
    loadData()
    setIsAddDialogOpen(false)
  }

  const handleUpdateExpense = (data: any) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data)
      loadData()
      setEditingExpense(null)
    }
  }

  const handleDeleteExpense = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) {
      deleteExpense(id)
      loadData()
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.icon || "📦"
  }

  const getCategoryColor = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.color || "#6b7280"
  }

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:pl-64 with-nav-padding">
      <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dépenses</h1>
            <p className="text-muted-foreground mt-1">
              {filteredExpenses.length} dépense{filteredExpenses.length !== 1 ? "s" : ""} • {formatCurrency(totalAmount, currency)}
            </p>
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
                <DialogTitle>Nouvelle dépense</DialogTitle>
              </DialogHeader>
              <ExpenseForm onSubmit={handleAddExpense} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <div className="space-y-2">
          {filteredExpenses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Aucune dépense trouvée</p>
              </CardContent>
            </Card>
          ) : (
            filteredExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: `${getCategoryColor(expense.category)}20` }}
                      >
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="font-medium truncate">{expense.category}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
                        </p>
                        {expense.note && <p className="text-sm text-muted-foreground truncate">{expense.note}</p>}
                        {expense.isRecurring && (
                          <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 truncate">
                            Récurrent
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg min-w-[6rem] md:min-w-[8rem] max-w-[11rem] text-right truncate">{formatCurrency(expense.amount, currency)}</p>
                      <div className="flex gap-1">
                        <Dialog
                          open={editingExpense?.id === expense.id}
                          onOpenChange={(open) => !open && setEditingExpense(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingExpense(expense)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier la dépense</DialogTitle>
                            </DialogHeader>
                            <ExpenseForm
                              expense={expense}
                              onSubmit={handleUpdateExpense}
                              onCancel={() => setEditingExpense(null)}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
