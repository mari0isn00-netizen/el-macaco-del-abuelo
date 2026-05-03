"use client"

import { useState } from "react"
import { closeWebThread, deleteWebThread } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { ArchiveX, Trash2 } from "lucide-react"

interface CloseThreadButtonProps {
  threadId: string
  compact?: boolean
}

type Action = "close" | "delete" | null

export function CloseThreadButton({ threadId, compact = false }: CloseThreadButtonProps) {
  const [busyAction, setBusyAction] = useState<Action>(null)
  const [error, setError] = useState("")

  const closeThread = async () => {
    const confirmed = window.confirm("¿Cerrar esta conversación? Se archivará y el cliente no podrá escribir en este hilo.")
    if (!confirmed) return

    setBusyAction("close")
    setError("")
    const result = await closeWebThread(threadId)
    setBusyAction(null)

    if (!result.success) {
      setError(result.error || "No se pudo cerrar la conversación.")
      return
    }

    window.location.href = "/admin/inbox"
  }

  const deleteThread = async () => {
    const confirmed = window.confirm("¿Borrar definitivamente este chat? Se eliminarán todos sus mensajes y no se podrá recuperar.")
    if (!confirmed) return

    setBusyAction("delete")
    setError("")
    const result = await deleteWebThread(threadId)
    setBusyAction(null)

    if (!result.success) {
      setError(result.error || "No se pudo borrar el chat.")
      return
    }

    window.location.href = "/admin/inbox"
  }

  const disabled = busyAction !== null

  return (
    <div className="space-y-1">
      <div className={compact ? "flex flex-wrap gap-2" : "grid gap-2"}>
        <Button
          type="button"
          variant="outline"
          size={compact ? "sm" : "default"}
          className={compact ? "" : "w-full"}
          onClick={closeThread}
          disabled={disabled}
        >
          <ArchiveX className="h-4 w-4" />
          {busyAction === "close" ? "Cerrando..." : compact ? "Cerrar" : "Cerrar conversación"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size={compact ? "sm" : "default"}
          className={compact ? "" : "w-full"}
          onClick={deleteThread}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
          {busyAction === "delete" ? "Borrando..." : compact ? "Borrar" : "Borrar chat"}
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
