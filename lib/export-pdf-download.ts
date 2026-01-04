"use client"

import { getExpenses, getBudgets, getCategories } from "./storage"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export async function downloadPDF() {
  // dynamic imports so app can still run if deps missing
  let html2canvas: any
  let jsPDF: any
  try {
    html2canvas = (await import('html2canvas')).default
    jsPDF = (await import('jspdf')).jsPDF || (await import('jspdf')).default
  } catch (err) {
    console.error('Dépendances PDF manquantes:', err)
    alert("Les dépendances pour l'export PDF ne sont pas installées. Exécutez 'npm install' puis relancez l'application.")
    return
  }

  const expenses = getExpenses()
  const budgets = getBudgets()
  const categories = getCategories()

  // Create a printable container element (offscreen)
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = '800px'
  container.style.padding = '20px'
  container.style.background = '#fff'
  container.style.color = '#111'
  container.style.fontFamily = 'Arial, Helvetica, sans-serif'

  const title = `<h1 style="margin:0 0 8px 0">Export des données — Gestionnaire de Dépenses</h1>`
  const meta = `<div style="color:#666;font-size:12px;margin-bottom:12px">Généré le ${new Date().toLocaleString('fr-FR')}</div>`

  const expensesRows = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (e) => `
        <tr>
          <td style="padding:6px;border:1px solid #ddd">${new Date(e.date).toLocaleDateString('fr-FR')}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:right">${formatCurrency(Number(e.amount))}</td>
          <td style="padding:6px;border:1px solid #ddd">${e.category}</td>
          <td style="padding:6px;border:1px solid #ddd">${(e.note || '').replace(/</g,'&lt;')}</td>
        </tr>`,
    )
    .join('')

  const budgetsRows = budgets
    .map(
      (b) => `
        <tr>
          <td style="padding:6px;border:1px solid #ddd">${b.category}</td>
          <td style="padding:6px;border:1px solid #ddd">${b.period}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:right">${formatCurrency(Number(b.amount))}</td>
        </tr>`,
    )
    .join('')

  const categoriesRows = categories
    .map(
      (c) => `
        <tr>
          <td style="padding:6px;border:1px solid #ddd">${c.name}</td>
          <td style="padding:6px;border:1px solid #ddd">${c.icon || ''}</td>
          <td style="padding:6px;border:1px solid #ddd">${c.isDefault ? 'Oui' : 'Non'}</td>
        </tr>`,
    )
    .join('')

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0)

  container.innerHTML = `
    ${title}
    ${meta}

    <h2 style="font-size:16px;margin:12px 0 6px">Dépenses (${expenses.length})</h2>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px">
      <thead>
        <tr>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:left">Date</th>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:right">Montant</th>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:left">Catégorie</th>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:left">Note</th>
        </tr>
      </thead>
      <tbody>
        ${expensesRows || '<tr><td colspan="4" style="padding:6px;border:1px solid #ddd;color:#666">Aucune dépense</td></tr>'}
      </tbody>
      <tfoot>
        <tr>
          <td style="padding:6px;border:1px solid #ddd" colspan="3"><strong>Total dépenses</strong></td>
          <td style="padding:6px;border:1px solid #ddd;text-align:right"><strong>${formatCurrency(total)}</strong></td>
        </tr>
      </tfoot>
    </table>

    <h2 style="font-size:16px;margin:12px 0 6px">Budgets (${budgets.length})</h2>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px">
      <thead>
        <tr>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:left">Catégorie</th>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:left">Période</th>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:right">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${budgetsRows || '<tr><td colspan="3" style="padding:6px;border:1px solid #ddd;color:#666">Aucun budget</td></tr>'}
      </tbody>
    </table>

    <h2 style="font-size:16px;margin:12px 0 6px">Catégories (${categories.length})</h2>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px">
      <thead>
        <tr>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:left">Nom</th>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:left">Icône</th>
          <th style="padding:6px;border:1px solid #ddd;background:#f7f7f7;text-align:left">Par défaut</th>
        </tr>
      </thead>
      <tbody>
        ${categoriesRows}
      </tbody>
    </table>
  `

  document.body.appendChild(container)

  try {
    // Render the container to canvas
    // Add useCORS / allowTaint and more logging to help diagnose issues (cross-origin images, fonts, etc.)
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    })
    const imgData = canvas.toDataURL('image/jpeg', 0.95)

    const pdf = new jsPDF({ unit: 'px', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Calculate image dimensions to fit A4 while keeping aspect ratio
    const imgProps = { width: canvas.width, height: canvas.height }
    const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height)
    const imgWidth = imgProps.width * ratio
    const imgHeight = imgProps.height * ratio

    pdf.addImage(imgData, 'JPEG', 20, 20, imgWidth - 40, imgHeight - 40)

    const filename = `depenses_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(filename)
  } catch (err) {
    console.error('Erreur génération PDF:', err)
    const message = (err && (err.message || String(err))) || 'Erreur inconnue'
    alert(`Erreur lors de la génération du PDF: ${message}. Voir la console pour plus de détails.`)
  } finally {
    // cleanup
    container.remove()
  }
}

export default downloadPDF
