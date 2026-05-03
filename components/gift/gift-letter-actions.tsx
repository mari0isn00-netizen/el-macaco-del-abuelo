"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Printer } from "lucide-react"

export function GiftLetterActions({ giftUrl }: { giftUrl: string }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(giftUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="no-print mt-7 grid gap-3 sm:grid-cols-2">
      <Button type="button" className="rounded-full bg-[#704624] text-[#fff7ea] hover:bg-[#3b2717]" onClick={() => window.print()}>
        <Printer className="h-4 w-4" />
        Guardar carta como PDF
      </Button>
      <Button type="button" variant="outline" className="rounded-full border-[#704624]/25 text-[#704624] hover:bg-[#f2e2c7]" onClick={copyLink}>
        <Copy className="h-4 w-4" />
        {copied ? "Enlace copiado" : "Copiar enlace"}
      </Button>
    </div>
  )
}
