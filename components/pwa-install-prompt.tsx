"use client"

import { usePWA } from "@/lib/pwa"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X } from "lucide-react"
import { useState } from "react"

export function PWAInstallPrompt() {
  const { isInstallable, installApp } = usePWA()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isInstallable || isDismissed) return null

  const handleInstall = async () => {
    const installed = await installApp()
    if (installed) {
      setIsDismissed(true)
    }
  }

  return (
    <Card className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Installer l'application</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Installez l'application pour un accès rapide et une utilisation hors ligne.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Installer
              </Button>
              <Button onClick={() => setIsDismissed(true)} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
