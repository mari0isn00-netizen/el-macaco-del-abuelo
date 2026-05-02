"use client"

import { useState } from "react"
import { closeWebThread } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { ArchiveX } from "lucide-react"

interface CloseThreadButtonProps {
  threadId: string
}

export function CloseThreadButton({ threadId }: CloseThreadButtonProps) {
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
    <div className="space-y-2">
      <Button type="button" variant="destructive" className="w-full" onClick={closeThread} disabled={busy}>
        <ArchiveX className="h-4 w-4" />
        {busy ? "Cerrando..." : "Cerrar conversación"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
