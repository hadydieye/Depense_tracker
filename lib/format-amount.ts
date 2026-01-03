/**
 * Fonctions utilitaires pour le formatage des montants
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

/**
 * Formate un nombre avec des points comme séparateurs de milliers
 * Exemple: 1000 -> "1.000", 12345.67 -> "12.345,67"
 */
export function formatAmount(value: string | number): string {
  if (value === "" || value === null || value === undefined) return ""
  if (value === 0) return "0"
  
  // Convertir en string si c'est un nombre
  let stringValue = typeof value === "number" ? value.toString() : value
  
  // Si la valeur est juste un point ou une virgule, permettre la saisie
  if (stringValue === "." || stringValue === ",") return stringValue
  
  // Si on a une virgule, c'est le séparateur décimal
  if (stringValue.includes(",")) {
    const parts = stringValue.split(",")
    const integerPart = parts[0] || ""
    const decimalPart = parts[1] || ""
    
    // Nettoyer la partie entière (enlever tout sauf les chiffres et points existants)
    // Enlever d'abord tous les points, puis reformater
    const cleanInteger = integerPart.replace(/\./g, "").replace(/\D/g, "")
    
    // Formater avec des points tous les 3 chiffres
    const formattedInteger = cleanInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    
    // Si on a une partie décimale, l'ajouter
    if (decimalPart) {
      // Limiter à 2 décimales et ne garder que les chiffres
      const cleanDecimal = decimalPart.replace(/\D/g, "").slice(0, 2)
      return formattedInteger + "," + cleanDecimal
    }
    
    return formattedInteger + ","
  }
  
  // Si on a un point et pas de virgule, traiter comme séparateur décimal potentiel
  if (stringValue.includes(".") && !stringValue.includes(",")) {
    // Si c'est juste un point à la fin, le convertir en virgule
    if (stringValue.endsWith(".") && stringValue.split(".").length === 2) {
      const integerPart = stringValue.replace(".", "")
      const cleanInteger = integerPart.replace(/\D/g, "")
      const formattedInteger = cleanInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      return formattedInteger + ","
    }
    // Si on a plusieurs points, ce sont des séparateurs de milliers
    // Les enlever et reformater
    const cleanValue = stringValue.replace(/\./g, "").replace(/\D/g, "")
    if (cleanValue === "") return ""
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }
  
  // Sinon, traiter comme un entier
  const cleanValue = stringValue.replace(/\D/g, "")
  if (cleanValue === "") return ""
  
  // Formater avec des points tous les 3 chiffres
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

/**
 * Parse une valeur formatée pour obtenir un nombre
 * Exemple: "1.000,50" -> 1000.50, "12.345" -> 12345
 */
export function parseAmount(value: string): number {
  if (!value) return 0
  
  // Remplacer les points (séparateurs de milliers) et les virgules (décimales) par des points
  const normalized = value.replace(/\./g, "").replace(",", ".")
  
  const parsed = Number.parseFloat(normalized)
  return Number.isNaN(parsed) ? 0 : parsed
}

/**
 * Formate un nombre pour l'affichage (avec points et virgule pour les décimales)
 * Exemple: 1000.5 -> "1.000,50"
 */
export function formatAmountDisplay(amount: number): string {
  if (amount === 0) return "0"
  
  // Formater avec 2 décimales
  const parts = amount.toFixed(2).split(".")
  const integerPart = parts[0]
  const decimalPart = parts[1]
  
  // Ajouter des points tous les 3 chiffres
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  
  return formattedInteger + "," + decimalPart
}

