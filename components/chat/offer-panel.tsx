"use client"

import { useState } from "react"
import { deleteReservation, registerOffer, requestContractAndPayment, sendReservationDecision } from "@/app/actions/reservations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, FileSignature, HandCoins, Trash2, XCircle } from "lucide-react"

interface OfferPanelProps {
  reservationId: string
  senderType: "guest" | "admin"
  senderName: string
}

export function OfferPanel({ reservationId, senderType, senderName }: OfferPanelProps) {
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const submitOwnerPrice = async () => {
    if (senderType !== "admin") return

    setBusy(true)
    setError("")
    const result = await registerOffer({
      reservationId,
      amount: Number(amount),
      senderType,
      senderName,
      note,
    })
    setBusy(false)

    if (!result.success) {
      setError(result.error || "No se pudo fijar el precio.")
      return
    }

    setAmount("")
    setNote("")
  }

  const requestSignature = async () => {
    if (senderType !== "admin") return

    setBusy(true)
    setError("")
    const result = await requestContractAndPayment({
      reservationId,
      senderName,
      note,
    })
    setBusy(false)

    if (!result.success) {
      setError(result.error || "No se pudo solicitar la firma.")
      return
    }

    setNote("")
  }

  const sendDecision = async (decision: "reject_offer" | "cancel_request" | "accept_offer") => {
    setBusy(true)
    setError("")
    const result = await sendReservationDecision({
      reservationId,
      senderType,
      senderName,
      decision,
      amount: amount ? Number(amount) : undefined,
      paymentDate,
      note,
    })
    setBusy(false)
    if (!result.success) setError(result.error || "No se pudo actualizar.")
  }

  const removeRequest = async () => {
    if (senderType !== "admin") return
    const confirmed = window.confirm("¿Borrar esta solicitud de reserva?")
    if (!confirmed) return

    setBusy(true)
    const result = await deleteReservation(reservationId)
    setBusy(false)
    if (result.success) {
      window.location.href = "/admin"
    } else {
      setError(result.error || "No se pudo borrar la solicitud.")
    }
  }

  return (
    <div className="border-t border-border bg-muted/30 p-3 sm:p-4">
      {senderType === "admin" ? (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[120px_1fr_auto]">
            <Input
              inputMode="numeric"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Importe EUR"
              className="bg-background"
            />
            <Input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Nota para el huésped: qué incluye el precio, condiciones o detalle relevante"
              className="bg-background"
            />
            <Button type="button" onClick={submitOwnerPrice} disabled={busy || !amount}>
              <HandCoins className="h-4 w-4" />
              Fijar precio
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={requestSignature} disabled={busy}>
              <FileSignature className="h-4 w-4" />
              Solicitar contrato y señal
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => sendDecision("cancel_request")} disabled={busy}>
              <XCircle className="h-4 w-4" />
              Cancelar solicitud
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={removeRequest} disabled={busy}>
              <Trash2 className="h-4 w-4" />
              Borrar solicitud
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Cuando el propietario revise las fechas, dejará aquí el precio de la estancia. Podrás aceptarlo o rechazarlo.
          </p>
          <div className="grid gap-2 sm:grid-cols-[150px_1fr]">
            <Input
              type="date"
              value={paymentDate}
              onChange={(event) => setPaymentDate(event.target.value)}
              className="bg-background"
              title="Día de pago acordado"
            />
            <Input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Nota opcional"
              className="bg-background"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => sendDecision("accept_offer")} disabled={busy}>
              <CheckCircle2 className="h-4 w-4" />
              Aceptar precio
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => sendDecision("reject_offer")} disabled={busy}>
              <XCircle className="h-4 w-4" />
              Rechazar precio
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => sendDecision("cancel_request")} disabled={busy}>
              <XCircle className="h-4 w-4" />
              Cancelar solicitud
            </Button>
          </div>
        </div>
      )}
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
