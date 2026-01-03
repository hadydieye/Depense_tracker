"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getCategories } from "@/lib/storage"
import type { Expense } from "@/lib/types"
import { useCurrency } from "@/hooks/use-currency"
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/currency"

interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (data: {
    amount: number
    category: string
    date: string
    note?: string
    isRecurring?: boolean
    recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly"
  }) => void
  onCancel?: () => void
}

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const categories = getCategories()
  const { currency } = useCurrency()
  const [amount, setAmount] = useState(
    expense?.amount ? formatCurrencyInput(expense.amount, currency) : ""
  )
  const [category, setCategory] = useState(expense?.category || "")
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split("T")[0])
  const [note, setNote] = useState(expense?.note || "")
  const [isRecurring, setIsRecurring] = useState(expense?.isRecurring || false)
  const [recurringFrequency, setRecurringFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">(
    expense?.recurringFrequency || "monthly",
  )

  // Mettre à jour le montant quand la devise change
  useEffect(() => {
    if (expense?.amount) {
      setAmount(formatCurrencyInput(expense.amount, currency))
    }
  }, [currency, expense?.amount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Formater selon la devise
    if (currency === "FG") {
      // Format avec points et virgule
      const parts = value.split(",")
      const integerPart = parts[0]?.replace(/\./g, "").replace(/\D/g, "") || ""
      const decimalPart = parts[1]?.replace(/\D/g, "").slice(0, 2) || ""
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      setAmount(decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger)
    } else {
      // Format avec espaces et virgule
      const parts = value.split(",")
      const integerPart = parts[0]?.replace(/\s/g, "").replace(/\D/g, "") || ""
      const decimalPart = parts[1]?.replace(/\D/g, "").slice(0, 2) || ""
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      setAmount(decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category || !date) return

    // Convertir le montant saisi vers FG pour le stockage
    const amountInFG = parseCurrencyInput(amount, currency)

    onSubmit({
      amount: amountInFG,
      category,
      date,
      note: note.trim() || undefined,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Montant ({currency === "FG" ? "FG" : currency === "EUR" ? "€" : "$"})</Label>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder={currency === "FG" ? "0,00" : "0,00"}
          value={amount}
          onChange={handleAmountChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
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
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (optionnelle)</Label>
        <Textarea
          id="note"
          placeholder="Ajouter une note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="recurring"
          checked={isRecurring}
          onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
        />
        <Label htmlFor="recurring" className="text-sm font-normal cursor-pointer">
          Dépense récurrente
        </Label>
      </div>

      {isRecurring && (
        <div className="space-y-2">
          <Label htmlFor="frequency">Fréquence</Label>
          <Select value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v as any)}>
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Quotidien</SelectItem>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
              <SelectItem value="monthly">Mensuel</SelectItem>
              <SelectItem value="yearly">Annuel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {expense ? "Mettre à jour" : "Ajouter"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Annuler
          </Button>
        )}
      </div>
    </form>
  )
}
