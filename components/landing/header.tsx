"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/historia", label: "Historia" },
  { href: "/#propiedad", label: "La casa" },
  { href: "/#comodidades", label: "Comodidades" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#ubicacion", label: "Ubicación" },
  { href: "/contactar", label: "Chat" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-primary md:text-2xl">
              El Macaco del Abuelo
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            {clientReservationId ? (
              <Link
                href={`/cliente/${clientReservationId}`}
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Mi estancia
              </Link>
            ) : null}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="/reservar">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Pedir estancia
              </Button>
            </Link>
          </div>

          <button
            className="p-2 text-foreground md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {clientReservationId ? (
                <Link
                  href={`/cliente/${clientReservationId}`}
                  className="text-base font-medium text-primary transition-colors hover:text-primary/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi estancia
                </Link>
              ) : null}
              <Link href="/reservar" onClick={() => setIsMenuOpen(false)}>
                <Button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Pedir estancia
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
