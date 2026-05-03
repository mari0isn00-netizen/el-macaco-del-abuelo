"use client"

import { useState } from "react"
import { deleteReservation } from "@/app/actions/reservations"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteReservationButtonProps {
  reservationId: string
  className?: string
  redirectTo?: string
  size?: "sm" | "default"
}

export function DeleteReservationButton({
  reservationId,
  className,
  redirectTo = "/admin",
  size = "sm",
}: DeleteReservationButtonProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const remove = async () => {
    const confirmed = window.confirm("¿Borrar esta reserva y todos sus mensajes? Esta acción no se puede deshacer.")
    if (!confirmed) return

    setBusy(true)
    setError("")
    const result = await deleteReservation(reservationId)
    setBusy(false)

    if (!result.success) {
      setError(result.error || "No se pudo borrar la reserva.")
      return
    }

    window.location.href = redirectTo
  }

  return (
    <div className="space-y-1">
      <Button type="button" variant="destructive" size={size} className={className} onClick={remove} disabled={busy}>
        <Trash2 className="h-4 w-4" />
        {busy ? "Borrando..." : "Borrar"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
