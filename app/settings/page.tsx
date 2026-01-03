"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { exportToCSV, getCategories, saveCategory, deleteCategory, resetCategories } from "@/lib/storage"
import { Download, Plus, Trash2, RefreshCw, Info, DollarSign } from "lucide-react"
import { useEffect } from "react"
import type { Category } from "@/lib/types"
import { ThemeToggle } from "@/components/theme-toggle"
import { InstallPWAButton } from "@/components/install-pwa-button"
import { useCurrency } from "@/hooks/use-currency"
import { CURRENCIES, type Currency } from "@/lib/currency"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", icon: "", color: "#6b7280" })
  const { currency, changeCurrency } = useCurrency()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    setCategories(getCategories())
  }

  const handleExport = () => {
    const csv = exportToCSV()
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `depenses_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.name || !newCategory.icon) return

    saveCategory({
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color,
      isDefault: false,
    })

    loadCategories()
    setIsAddCategoryOpen(false)
    setNewCategory({ name: "", icon: "", color: "#6b7280" })
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      const success = deleteCategory(id)
      if (success) {
        loadCategories()
      } else {
        alert("Impossible de supprimer une catégorie par défaut")
      }
    }
  }

  const handleResetCategories = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les catégories ?")) {
      resetCategories()
      loadCategories()
    }
  }

  const handleClearAllData = () => {
    if (
      confirm(
        "⚠️ ATTENTION: Cela supprimera TOUTES vos données (dépenses, budgets, catégories personnalisées). Cette action est irréversible. Continuer ?",
      )
    ) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:pl-64">
      <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Réglages</h1>
          <p className="text-muted-foreground mt-1">Gérez les paramètres de l'application</p>
        </div>

        {/* Application section */}
        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
            <CardDescription>Gérez les paramètres de l'application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium leading-none mb-2">Installation</h3>
              <p className="text-sm text-muted-foreground mb-3">Installez l'application sur votre appareil pour une meilleure expérience</p>
              <InstallPWAButton />
            </div>
          </CardContent>
        </Card>

        {/* Currency section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Devise
            </CardTitle>
            <CardDescription>Choisissez la devise d'affichage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={currency} onValueChange={(value) => changeCurrency(value as Currency)}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CURRENCIES).map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tous les montants seront convertis et affichés dans la devise sélectionnée.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance section with theme toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Apparence</CardTitle>
            <CardDescription>Personnalisez le thème de l'application</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mode sombre</p>
              <p className="text-sm text-muted-foreground">Basculer entre les thèmes clair et sombre</p>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle>Exporter les données</CardTitle>
            <CardDescription>Téléchargez vos dépenses au format CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exporter en CSV
            </Button>
          </CardContent>
        </Card>

        {/* Categories Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Catégories personnalisées</CardTitle>
                <CardDescription>Ajoutez vos propres catégories de dépenses</CardDescription>
              </div>
              <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouvelle catégorie</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cat-name">Nom</Label>
                      <Input
                        id="cat-name"
                        placeholder="Ex: Voyages"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cat-icon">Icône (emoji)</Label>
                      <Input
                        id="cat-icon"
                        placeholder="✈️"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cat-color">Couleur</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cat-color"
                          type="color"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={newCategory.color}
                          onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        Ajouter
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddCategoryOpen(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    {category.isDefault && <p className="text-xs text-muted-foreground">Par défaut</p>}
                  </div>
                </div>
                {!category.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reset Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Réinitialiser les catégories</CardTitle>
            <CardDescription>Restaurer les catégories par défaut</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleResetCategories} variant="outline" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />À propos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Gestionnaire de Dépenses</strong> - Application web progressive pour gérer vos finances
              personnelles.
            </p>
            <p>
              <strong>Chef de projet :</strong> <a href="https://github.com/dashboard"><strong>Artemis99</strong></a>
            </p>
            <p>
              <strong>Développement :</strong> Artemis99 (Chef de projet) & scriptseinsei
            </p>
            <p>📱 Cette application fonctionne hors ligne et peut être installée sur votre appareil.</p>
            <p>
              💾 Vos données sont stockées localement dans votre navigateur et ne sont jamais envoyées à un serveur.
            </p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
            <CardDescription>Actions irréversibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleClearAllData} variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Supprimer toutes les données
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
