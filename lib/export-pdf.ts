"use client"

import { getExpenses, getBudgets, getCategories } from "./storage"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function openPrintableExport() {
  // Collect data
  const expenses = getExpenses()
  const budgets = getBudgets()
  const categories = getCategories()

  // Compute totals
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)

  // Build HTML
  const title = `Export des données - ${new Date().toLocaleDateString('fr-FR')}`
  const styles = `
    body { font-family: Arial, Helvetica, sans-serif; color: #111; padding: 20px; }
    header { text-align: center; margin-bottom: 20px }
    h1 { margin: 0; font-size: 20px }
    .section { margin-bottom: 18px }
    table { width: 100%; border-collapse: collapse; font-size: 12px }
    th, td { border: 1px solid #ddd; padding: 8px }
    th { background: #f7f7f7; text-align: left }
    .muted { color: #666; font-size: 11px }
    .totals { text-align: right; font-weight: 600 }
  `

  const expensesRows = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (e) => `
        <tr>
          <td>${new Date(e.date).toLocaleDateString('fr-FR')}</td>
          <td style="text-align:right">${formatCurrency(Number(e.amount))}</td>
          <td>${e.category}</td>
          <td>${(e.note || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
        </tr>`,
    )
    .join('\n')

  const budgetsRows = budgets
    .map(
      (b) => `
        <tr>
          <td>${b.category}</td>
          <td>${b.period}</td>
          <td style="text-align:right">${formatCurrency(Number(b.amount))}</td>
        </tr>`,
    )
    .join('\n')

  const categoriesRows = categories
    .map(
      (c) => `
        <tr>
          <td>${c.name}</td>
          <td>${c.icon || ''}</td>
          <td>${c.isDefault ? 'Oui' : 'Non'}</td>
        </tr>`,
    )
    .join('\n')

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>
        <header>
          <h1>Export des données — Gestionnaire de Dépenses</h1>
          <div class="muted">Généré le ${new Date().toLocaleString('fr-FR')}</div>
        </header>

        <section class="section">
          <h2>Dépenses (${expenses.length})</h2>
          <table>
            <thead>
              <tr><th>Date</th><th>Montant</th><th>Catégorie</th><th>Note</th></tr>
            </thead>
            <tbody>
              ${expensesRows || '<tr><td colspan="4" class="muted">Aucune dépense</td></tr>'}
            </tbody>
            <tfoot>
              <tr><td colspan="3" class="totals">Total dépenses</td><td style="text-align:right">${formatCurrency(totalExpenses)}</td></tr>
            </tfoot>
          </table>
        </section>

        <section class="section">
          <h2>Budgets (${budgets.length})</h2>
          <table>
            <thead>
              <tr><th>Catégorie</th><th>Période</th><th>Montant</th></tr>
            </thead>
            <tbody>
              ${budgetsRows || '<tr><td colspan="3" class="muted">Aucun budget</td></tr>'}
            </tbody>
          </table>
        </section>

        <section class="section">
          <h2>Catégories (${categories.length})</h2>
          <table>
            <thead>
              <tr><th>Nom</th><th>Icône</th><th>Par défaut</th></tr>
            </thead>
            <tbody>
              ${categoriesRows}
            </tbody>
          </table>
        </section>

      </body>
    </html>
  `

  // Open printable window immediately to avoid popup blockers
  const w = window.open('', '_blank')
  if (!w) {
    alert("Impossible d'ouvrir la fenêtre d'export. Vérifiez les bloqueurs.")
    return
  }

  try {
    // Optional: prevent access to opener for security
    try {
      // some browsers allow setting opener to null
      // @ts-ignore
      w.opener = null
    } catch (e) {
      // ignore
    }

    w.document.open()
    w.document.write(html)
    w.document.close()

    // Give the new window a short time to render then trigger print
    setTimeout(() => {
      try {
        w.focus()
        w.print()
      } catch (err) {
        console.error('Erreur lors du print:', err)
      }
    }, 600)
  } catch (err) {
    console.error('Erreur lors de l\'ouverture de la fenêtre d\'export:', err)
    alert("Une erreur est survenue lors de la préparation de l'export PDF.")
  }
}

export default openPrintableExport
