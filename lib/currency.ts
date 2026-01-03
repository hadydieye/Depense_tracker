/**
 * Gestion des devises et conversions
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

export type Currency = "FG" | "EUR" | "USD"

export interface CurrencyInfo {
  code: Currency
  name: string
  symbol: string
  // Taux de change par rapport au Franc Guinéen (FG)
  rate: number
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  FG: {
    code: "FG",
    name: "Franc Guinéen",
    symbol: "FG",
    rate: 1, // Devise de base
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: 9000, // 1 EUR = 9000 FG (approximatif)
  },
  USD: {
    code: "USD",
    name: "Dollar US",
    symbol: "$",
    rate: 8500, // 1 USD = 8500 FG (approximatif)
  },
}

const CURRENCY_KEY = "currency"

/**
 * Récupère la devise actuelle depuis le localStorage
 */
export function getCurrency(): Currency {
  if (typeof window === "undefined") return "FG"
  const stored = localStorage.getItem(CURRENCY_KEY)
  return (stored as Currency) || "FG"
}

/**
 * Définit la devise actuelle
 */
export function setCurrency(currency: Currency): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CURRENCY_KEY, currency)
  // Émettre un événement pour mettre à jour l'interface
  window.dispatchEvent(new CustomEvent("currencyChanged", { detail: currency }))
}

/**
 * Convertit un montant depuis FG vers la devise cible
 */
export function convertFromFG(amount: number, targetCurrency: Currency): number {
  if (targetCurrency === "FG") return amount
  const currency = CURRENCIES[targetCurrency]
  return amount / currency.rate
}

/**
 * Convertit un montant vers FG depuis la devise source
 */
export function convertToFG(amount: number, sourceCurrency: Currency): number {
  if (sourceCurrency === "FG") return amount
  const currency = CURRENCIES[sourceCurrency]
  return amount * currency.rate
}

/**
 * Convertit un montant d'une devise vers une autre
 */
export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount
  // Convertir d'abord vers FG, puis vers la devise cible
  const inFG = convertToFG(amount, from)
  return convertFromFG(inFG, to)
}

/**
 * Formate un montant selon la devise
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const currencyInfo = CURRENCIES[currency]
  const converted = convertFromFG(amount, currency)
  
  // Formatage selon la devise
  if (currency === "FG") {
    // Format français : 1.000,50
    const parts = converted.toFixed(2).split(".")
    const integerPart = parts[0]
    const decimalPart = parts[1]
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return `${formattedInteger},${decimalPart} ${currencyInfo.symbol}`
  } else {
    // Format européen pour EUR et USD : 1 000,50
    const parts = converted.toFixed(2).split(".")
    const integerPart = parts[0]
    const decimalPart = parts[1]
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    return `${currencyInfo.symbol} ${formattedInteger},${decimalPart}`
  }
}

/**
 * Formate un montant sans le symbole (pour les inputs)
 */
export function formatCurrencyInput(amount: number, currency: Currency): string {
  const currencyInfo = CURRENCIES[currency]
  const converted = convertFromFG(amount, currency)
  
  if (currency === "FG") {
    const parts = converted.toFixed(2).split(".")
    const integerPart = parts[0]
    const decimalPart = parts[1]
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return `${formattedInteger},${decimalPart}`
  } else {
    const parts = converted.toFixed(2).split(".")
    const integerPart = parts[0]
    const decimalPart = parts[1]
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    return `${formattedInteger},${decimalPart}`
  }
}

/**
 * Parse un montant saisi et le convertit en FG
 */
export function parseCurrencyInput(value: string, currency: Currency): number {
  if (!value) return 0
  
  // Normaliser selon la devise
  let normalized: string
  if (currency === "FG") {
    // Format: 1.000,50 -> 1000.50
    normalized = value.replace(/\./g, "").replace(",", ".")
  } else {
    // Format: 1 000,50 -> 1000.50
    normalized = value.replace(/\s/g, "").replace(",", ".")
  }
  
  const parsed = Number.parseFloat(normalized)
  if (Number.isNaN(parsed)) return 0
  
  // Convertir vers FG
  return convertToFG(parsed, currency)
}

