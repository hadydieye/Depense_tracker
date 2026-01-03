/**
 * Système de notifications pour les alertes de budget
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

export interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("Ce navigateur ne supporte pas les notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export function getNotificationPermission(): NotificationPermission {
  if (!("Notification" in window)) {
    return { granted: false, denied: false, default: false }
  }

  return {
    granted: Notification.permission === "granted",
    denied: Notification.permission === "denied",
    default: Notification.permission === "default",
  }
}

export interface BudgetAlert {
  category: string
  percentage: number
  spent: number
  budget: number
  remaining: number
  isOverBudget: boolean
}

export function showBudgetNotification(alert: BudgetAlert): void {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return
  }

  const title = alert.isOverBudget
    ? `🚨 Budget dépassé : ${alert.category}`
    : `⚠️ Attention : Budget ${alert.category}`

  const body = alert.isOverBudget
    ? `Vous avez dépassé votre budget de ${Math.abs(alert.remaining).toFixed(2)} FG. Dépensé : ${alert.spent.toFixed(2)} / ${alert.budget.toFixed(2)} FG`
    : `Vous avez utilisé ${alert.percentage.toFixed(0)}% de votre budget. Il reste ${alert.remaining.toFixed(2)} FG.`

  const notification = new Notification(title, {
    body,
    icon: "/icon-192.jpg",
    badge: "/icon-192.jpg",
    tag: `budget-${alert.category}`,
    requireInteraction: false,
    silent: false,
  })

  // Fermer automatiquement après 5 secondes
  setTimeout(() => {
    notification.close()
  }, 5000)

  // Ouvrir l'application quand on clique sur la notification
  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

