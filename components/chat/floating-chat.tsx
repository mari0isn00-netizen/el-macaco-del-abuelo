"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"

export function FloatingChat() {
  return (
    <Link
      href="/contactar"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
      aria-label="Abrir contacto web"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
    </Link>
  )
}
