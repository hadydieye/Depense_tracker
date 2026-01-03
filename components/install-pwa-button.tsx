"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Download, Smartphone, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

declare global {
  interface Window {
    deferredPrompt: any;
  }
}

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInStandalone = (window.navigator as any).standalone === true
      return isStandalone || isInStandalone || document.referrer.includes('android-app://')
    }

    const installed = checkIfInstalled()
    setIsInstalled(installed)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      window.deferredPrompt = e
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    // Vérifier si on peut installer
    if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    } else {
      // Pour iOS et autres navigateurs, on peut toujours montrer les instructions
      setCanInstall(true)
    }

    window.addEventListener('appinstalled', () => {
      console.log('Application installée avec succès')
      setIsInstalled(true)
      setIsInstalling(false)
      setDeferredPrompt(null)
      toast.success("Application installée avec succès !")
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const showInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    
    let message = ""
    let description = ""

    if (isIOS) {
      message = "Installation sur iOS"
      description = "1. Appuyez sur le bouton de partage (icône carrée avec flèche)\n2. Faites défiler et sélectionnez 'Sur l'écran d'accueil'\n3. Appuyez sur 'Ajouter'"
    } else if (isAndroid) {
      message = "Installation sur Android"
      description = "1. Appuyez sur les trois points (⋮) en haut à droite\n2. Sélectionnez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'\n3. Confirmez l'installation"
    } else if (isSafari) {
      message = "Installation sur Safari"
      description = "1. Cliquez sur le bouton de partage dans la barre d'outils\n2. Sélectionnez 'Sur l'écran d'accueil'\n3. Cliquez sur 'Ajouter'"
    } else {
      message = "Installation de l'application"
      description = "Recherchez l'icône d'installation (➕) dans la barre d'adresse de votre navigateur, ou utilisez le menu du navigateur pour installer l'application."
    }

    toast.info(message, {
      description: description,
      duration: 8000,
      action: {
        label: "J'ai compris",
        onClick: () => {},
      },
    })
  }

  const handleInstallClick = async () => {
    if (isInstalling) return

    // Si on a l'événement beforeinstallprompt (Chrome, Edge, etc.)
    if (deferredPrompt) {
      try {
        setIsInstalling(true)
        const promptEvent = deferredPrompt
        
        // Afficher le prompt d'installation natif
        await promptEvent.prompt()
        const { outcome } = await promptEvent.userChoice
        
        if (outcome === 'accepted') {
          console.log('Installation acceptée')
          toast.success("Installation en cours...")
          // L'événement appinstalled sera déclenché automatiquement
        } else {
          console.log('Installation refusée')
          toast.info("Installation annulée. Vous pourrez installer plus tard.")
        }
        
        setDeferredPrompt(null)
        setIsInstalling(false)
      } catch (error) {
        console.error('Erreur lors de l\'installation:', error)
        toast.error("Erreur lors de l'installation. Veuillez réessayer.")
        setIsInstalling(false)
        // Montrer les instructions manuelles en cas d'erreur
        showInstallInstructions()
      }
    } else {
      // Pas de prompt automatique disponible (iOS, Safari, etc.)
      showInstallInstructions()
    }
  }

  if (isInstalled) {
    return (
      <div className="flex items-center p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <div className="flex-shrink-0 p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-green-900 dark:text-green-100">Application installée</h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            L'application est déjà installée sur votre appareil
          </p>
        </div>
      </div>
    )
  }

  if (!canInstall && !deferredPrompt) {
    return (
      <div className="flex items-center p-4 border rounded-lg bg-muted/50">
        <div className="flex-shrink-0 p-3 rounded-full bg-muted text-muted-foreground">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="ml-4">
          <h3 className="font-medium">Installation non disponible</h3>
          <p className="text-sm text-muted-foreground">
            L'installation n'est pas disponible sur ce navigateur. Utilisez Chrome, Edge ou Safari pour installer l'application.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={handleInstallClick}
      disabled={isInstalling}
      className="w-full justify-start h-auto p-4"
      variant="outline"
    >
      <div className="flex items-center w-full">
        <div className="flex-shrink-0 p-3 rounded-full bg-primary/10 text-primary mr-4">
          {isInstalling ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
        </div>
        <div className="text-left flex-1">
          <h3 className="font-medium">
            {isInstalling ? 'Installation en cours...' : 'Installer l\'application'}
          </h3>
          <p className="text-sm text-muted-foreground font-normal">
            {isInstalling 
              ? 'Veuillez suivre les instructions à l\'écran' 
              : deferredPrompt 
                ? 'Installez l\'application pour une meilleure expérience'
                : 'Cliquez pour voir les instructions d\'installation'}
          </p>
        </div>
      </div>
    </Button>
  )
}
