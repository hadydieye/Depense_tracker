import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "./client-providers"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gestionnaire de Dépenses",
  description: "Application de gestion de dépenses personnelles avec budgets et analyses",
  generator: "Artemis99 (Chef de projet) & scriptseinsei",
  authors: [{ name: "Artemis99", role: "Chef de projet" }, { name: "scriptseinsei" }],
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dépenses",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Gestionnaire de Dépenses" />
      </head>
      <body className={`${geist.className} font-sans antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}