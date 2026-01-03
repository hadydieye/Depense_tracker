"use client"

/**
 * ClientProviders - Fournisseurs de contexte pour l'application
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

import { ThemeProvider } from "@/components/theme-provider"
import { Navigation, DesktopSidebar } from "@/components/navigation"
import { InstallPrompt } from "@/components/install-prompt"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/next"
import dynamic from 'next/dynamic'
import { useEffect, Suspense } from 'react'
import { useBudgetNotifications } from "@/hooks/use-budget-notifications"

function NotificationManager() {
  useBudgetNotifications(true)
  return null
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const RegisterServiceWorker = dynamic(
    () => import('@/app/register-sw').then((mod) => {
      const RegisterSW = () => {
        useEffect(() => {
          mod.register()
        }, [])
        return null
      }
      return RegisterSW
    }),
    { ssr: false }
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DesktopSidebar />
      {children}
      <Navigation />
      <InstallPrompt />
      <Suspense fallback={null}>
        <RegisterServiceWorker />
        <NotificationManager />
      </Suspense>
      <Toaster position="top-center" richColors />
      <Analytics />
    </ThemeProvider>
  )
}
