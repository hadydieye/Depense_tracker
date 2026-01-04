"use client"

/**
 * ClientProviders - Fournisseurs de contexte pour l'application
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

import { ThemeProvider } from "@/components/theme-provider"
import { Navigation, DesktopSidebar } from "@/components/navigation"
// Install prompt removed
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
  // Background worker registration removed

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DesktopSidebar />
      {children}
      <Navigation />
      {/* Install-related components removed: install prompt and background worker */}
      <NotificationManager />
      <Toaster position="top-center" richColors />
      <Analytics />
    </ThemeProvider>
  )
}
