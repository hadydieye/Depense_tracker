/**
 * Types TypeScript pour l'application de gestion de dépenses
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

export interface Expense {
  id: string
  amount: number
  category: string
  date: string
  note?: string
  isRecurring?: boolean
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly"
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  category: string
  amount: number
  period: "monthly" | "yearly"
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  isDefault: boolean
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Alimentation", icon: "🍔", color: "#10b981", isDefault: true },
  { id: "2", name: "Transport", icon: "🚗", color: "#3b82f6", isDefault: true },
  { id: "3", name: "Loisirs", icon: "🎮", color: "#8b5cf6", isDefault: true },
  { id: "4", name: "Santé", icon: "🏥", color: "#ef4444", isDefault: true },
  { id: "5", name: "Logement", icon: "🏠", color: "#f59e0b", isDefault: true },
  { id: "6", name: "Autres", icon: "📦", color: "#6b7280", isDefault: true },
]
