"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CURRENCIES, type Currency, hasStoredCurrency } from "@/lib/currency"
import { useCurrency } from "@/hooks/use-currency"

export default function InitialSetup() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Currency | "">("")
  const { changeCurrency } = useCurrency()

  useEffect(() => {
    if (!hasStoredCurrency()) setOpen(true)
  }, [])

  const handleOpenChange = (value: boolean) => {
    // Ne pas autoriser la fermeture tant qu'aucune devise n'est sélectionnée
    if (!value && !selected) setOpen(true)
    else setOpen(value)
  }

  const handleConfirm = () => {
    if (!selected) return
    changeCurrency(selected as Currency)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bienvenue</DialogTitle>
          <DialogDescription>Avant de commencer, choisissez votre devise préférée.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={selected} onValueChange={(v) => setSelected(v as Currency)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une devise" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CURRENCIES).map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.name} ({c.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <Button onClick={handleConfirm} disabled={!selected}>
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
