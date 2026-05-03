"use client"

import { useState } from "react"
import { closeWebThread } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { ArchiveX } from "lucide-react"

interface CloseThreadButtonProps {
  threadId: string
  compact?: boolean
}

export function CloseThreadButton({ threadId, compact = false }: CloseThreadButtonProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const closeThread = async () => {
    const confirmed = window.confirm("¿Cerrar esta conversación sin reserva? Se borrará de la bandeja.")
    if (!confirmed) return

    setBusy(true)
    setError("")
    const result = await closeWebThread(threadId)
    setBusy(false)

    if (!result.success) {
      setError(result.error || "No se pudo cerrar la conversación.")
      return
    }

    window.location.href = "/admin/inbox"
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant="destructive"
        size={compact ? "sm" : "default"}
        className={compact ? "" : "w-full"}
        onClick={closeThread}
        disabled={busy}
      >
        <ArchiveX className="h-4 w-4" />
        {busy ? "Cerrando..." : compact ? "Cerrar" : "Cerrar conversación"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
