/**
 * Hook pour gérer la devise actuelle
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

"use client"

import { useState, useEffect } from "react"
import { getCurrency, setCurrency, type Currency } from "@/lib/currency"

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>(getCurrency())

  useEffect(() => {
    // Écouter les changements de devise
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrencyState(event.detail as Currency)
    }

    window.addEventListener("currencyChanged", handleCurrencyChange as EventListener)

    return () => {
      window.removeEventListener("currencyChanged", handleCurrencyChange as EventListener)
    }
  }, [])

  const changeCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    setCurrencyState(newCurrency)
  }

  return {
    currency,
    changeCurrency,
  }
}

