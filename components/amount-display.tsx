/**
 * Composant pour afficher un montant avec la devise actuelle
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

"use client"

import { useCurrency } from "@/hooks/use-currency"
import { formatCurrency } from "@/lib/currency"

interface AmountDisplayProps {
  amount: number // Montant en FG
  className?: string
}

export function AmountDisplay({ amount, className }: AmountDisplayProps) {
  const { currency } = useCurrency()
  return <span className={className}>{formatCurrency(amount, currency)}</span>
}

