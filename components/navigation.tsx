"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Receipt, Target, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/expenses", label: "Dépenses", icon: Receipt },
  { href: "/budgets", label: "Budgets", icon: Target },
  { href: "/analytics", label: "Analyses", icon: BarChart3 },
  { href: "/settings", label: "Réglages", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-border bg-background p-6">
      <div className="mb-8 flex items-center gap-3">
        <Image src="/favicon.jpg" alt="Logo" width={40} height={40} className="flex-shrink-0 rounded-lg" />
        <h1 className="text-xl font-bold text-balance">Gestionnaire de Dépenses</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
