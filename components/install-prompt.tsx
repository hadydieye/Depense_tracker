'use client';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X, Smartphone } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

declare global {
  interface Window {
    deferredPrompt: any;
  }
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    
    setIsMobile(checkIfMobile())

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      window.deferredPrompt = e
      setDeferredPrompt(e)
      setTimeout(() => setIsVisible(true), 3000)
    }

    const checkIfAppInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInStandalone = window.navigator.standalone === true
      return isStandalone || isInStandalone
    }

    if (!checkIfAppInstalled()) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      
      if (isMobile) {
        setTimeout(() => {
          if (!deferredPrompt) {
            setIsVisible(true)
          }
        }, 5000)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isMobile, deferredPrompt])

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
          toast.success("L'application sera installée sous peu !")
        } else {
          toast.info("Vous pourrez installer l'application plus tard depuis le menu.")
        }
      } catch (err) {
        console.error('Erreur lors de l\'installation:', err)
        showManualInstallInstructions()
      }
      setDeferredPrompt(null)
    } else {
      showManualInstallInstructions()
    }
    setIsVisible(false)
  }

  const showManualInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/i.test(navigator.userAgent)

    if (isIOS) {
      toast.info("Pour installer l'application :", {
        description: "1. Appuyez sur le bouton de partage\n2. Sélectionnez 'Sur l'écran d'accueil'",
        duration: 10000,
        action: {
          label: "J'ai compris",
          onClick: () => {},
        },
      })
    } else if (isAndroid) {
      toast.info("Pour installer l'application :", {
        description: "Appuyez sur les trois points en haut à droite et sélectionnez 'Installer l'application'",
        duration: 10000,
      })
    } else {
      toast.info("Pour installer l'application, cherchez l'icône d'installation dans la barre d'adresse de votre navigateur.")
    }
  }

  if (isVisible) {
    return (
      <Dialog open={isVisible} onOpenChange={setIsVisible}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              <DialogTitle>Installer l'application</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Installez cette application sur votre appareil pour :
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Accéder à vos dépenses hors ligne</li>
                <li>Profiter d'un chargement plus rapide</li>
                <li>Recevoir des notifications</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsVisible(false)
                localStorage.setItem('installPromptDismissed', new Date().toISOString())
              }}
              className="w-full sm:w-auto"
            >
              <X className="mr-2 h-4 w-4" /> Plus tard
            </Button>
            <Button 
              onClick={handleInstall}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <Download className="mr-2 h-4 w-4" /> Installer maintenant
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}