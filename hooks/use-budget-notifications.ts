/**
 * Hook personnalisé pour gérer les notifications de budget
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

"use client"

import { useEffect, useRef } from "react"
import { getExpenses, getBudgets } from "@/lib/storage"
import { getBudgetProgress } from "@/lib/analytics"
import { requestNotificationPermission, showBudgetNotification, type BudgetAlert } from "@/lib/notifications"
import type { Budget } from "@/lib/types"

const NOTIFICATION_COOLDOWN = 60000 // 1 minute entre les notifications pour le même budget
const BUDGET_ALERT_THRESHOLD = 80 // Seuil d'alerte à 80%
const BUDGET_CRITICAL_THRESHOLD = 100 // Seuil critique à 100%

interface NotificationState {
  lastNotificationTime: Map<string, number>
  notifiedBudgets: Set<string>
}

export function useBudgetNotifications(enabled: boolean = true) {
  const stateRef = useRef<NotificationState>({
    lastNotificationTime: new Map(),
    notifiedBudgets: new Set(),
  })

  useEffect(() => {
    if (!enabled) return

    // Demander la permission au chargement
    requestNotificationPermission().catch(console.error)

    const checkBudgets = () => {
      const budgets = getBudgets()
      const expenses = getExpenses()
      const now = Date.now()

      budgets.forEach((budget: Budget) => {
        const progress = getBudgetProgress(expenses, budget)
        const budgetKey = `${budget.id}-${budget.period}`
        const lastNotification = stateRef.current.lastNotificationTime.get(budgetKey) || 0

        // Vérifier le cooldown
        if (now - lastNotification < NOTIFICATION_COOLDOWN) {
          return
        }

        // Notification si budget dépassé (>100%)
        if (progress.percentage >= BUDGET_CRITICAL_THRESHOLD && !stateRef.current.notifiedBudgets.has(budgetKey)) {
          const alert: BudgetAlert = {
            category: budget.category,
            percentage: progress.percentage,
            spent: progress.spent,
            budget: budget.amount,
            remaining: progress.remaining,
            isOverBudget: true,
          }

          showBudgetNotification(alert)
          stateRef.current.lastNotificationTime.set(budgetKey, now)
          stateRef.current.notifiedBudgets.add(budgetKey)
        }
        // Notification si proche de la limite (80-100%)
        else if (
          progress.percentage >= BUDGET_ALERT_THRESHOLD &&
          progress.percentage < BUDGET_CRITICAL_THRESHOLD &&
          !stateRef.current.notifiedBudgets.has(budgetKey)
        ) {
          const alert: BudgetAlert = {
            category: budget.category,
            percentage: progress.percentage,
            spent: progress.spent,
            budget: budget.amount,
            remaining: progress.remaining,
            isOverBudget: false,
          }

          showBudgetNotification(alert)
          stateRef.current.lastNotificationTime.set(budgetKey, now)
          stateRef.current.notifiedBudgets.add(budgetKey)
        }
        // Réinitialiser si le budget est revenu sous les seuils
        else if (progress.percentage < BUDGET_ALERT_THRESHOLD) {
          stateRef.current.notifiedBudgets.delete(budgetKey)
        }
      })
    }

    // Vérifier immédiatement
    checkBudgets()

    // Vérifier toutes les 5 minutes
    const interval = setInterval(checkBudgets, 5 * 60 * 1000)

    // Vérifier aussi quand une dépense est ajoutée (via storage event)
    const handleStorageChange = () => {
      checkBudgets()
    }

    window.addEventListener("storage", handleStorageChange)

    // Écouter les changements dans le même onglet (via custom event)
    const handleCustomStorage = () => {
      checkBudgets()
    }

    window.addEventListener("expenseUpdated", handleCustomStorage as EventListener)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("expenseUpdated", handleCustomStorage as EventListener)
    }
  }, [enabled])
}

