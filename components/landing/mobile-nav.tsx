"use client"

import Link from "next/link"
import { Home, Calendar, MessageCircle, Info, UserRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/historia", icon: Info, label: "Historia" },
  { href: "/reservar", icon: Calendar, label: "Reservar" },
  { href: "/contactar", icon: MessageCircle, label: "Chat" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [clientReservationId, setClientReservationId] = useState<string | null>(null)

  useEffect(() => {
    const syncClientArea = () => {
      setClientReservationId(window.localStorage.getItem("macaco_client_reservation_id"))
    }

    syncClientArea()
    window.addEventListener("storage", syncClientArea)
    window.addEventListener("macaco-client-area", syncClientArea)

    return () => {
      window.removeEventListener("storage", syncClientArea)
      window.removeEventListener("macaco-client-area", syncClientArea)
    }
  }, [])

  const visibleNavItems = clientReservationId
    ? [
        { href: "/", icon: Home, label: "Inicio" },
        { href: "/reservar", icon: Calendar, label: "Reservar" },
        { href: "/contactar", icon: MessageCircle, label: "Chat" },
        { href: `/cliente/${clientReservationId}`, icon: UserRound, label: "Estancia" },
      ]
    : navItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="grid grid-flow-col auto-cols-fr items-center px-1 py-1.5">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href.replace("/#", "/")))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 transition-all duration-200 active:scale-95",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="max-w-full truncate text-[11px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
