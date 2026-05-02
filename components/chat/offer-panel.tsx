"use client"

import { useMemo, useState } from "react"
import { deleteReservation, registerOffer, requestContractAndPayment, sendReservationDecision } from "@/app/actions/reservations"
import type { ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, FileSignature, HandCoins, Trash2, XCircle } from "lucide-react"

interface OfferPanelProps {
  reservationId: string
  senderType: "guest" | "admin"
  senderName: string
  messages: ChatMessage[]
}

const actionMarkers = {
  priceSet: "PRECIO ESTABLECIDO POR EL PROPIETARIO",
  contractRequested: "CONTRATO Y SEÑAL DISPONIBLES",
  accepted: "PRECIO ACEPTADO",
  rejected: "PRECIO RECHAZADO",
  cancelled: "SOLICITUD CANCELADA",
  contractAccepted: "Contrato aceptado.",
}

export function OfferPanel({ reservationId, senderType, senderName, messages }: OfferPanelProps) {
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [localMarkers, setLocalMarkers] = useState<string[]>([])

  const markers = useMemo(() => messages.map((message) => message.message).concat(localMarkers), [localMarkers, messages])
  const hasMarker = (marker: string) => markers.some((message) => message.startsWith(marker))
  const priceSet = hasMarker(actionMarkers.priceSet)
  const contractRequested = hasMarker(actionMarkers.contractRequested)
  const accepted = hasMarker(actionMarkers.accepted)
  const rejected = hasMarker(actionMarkers.rejected)
  const cancelled = hasMarker(actionMarkers.cancelled)
  const contractAccepted = hasMarker(actionMarkers.contractAccepted)
  const closed = accepted || rejected || cancelled || contractAccepted

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

    setLocalMarkers((current) => [...current, actionMarkers.priceSet])
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

    setLocalMarkers((current) => [...current, actionMarkers.contractRequested])
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
    if (!result.success) {
      setError(result.error || "No se pudo actualizar.")
      return
    }

    const marker =
      decision === "accept_offer"
        ? actionMarkers.accepted
        : decision === "reject_offer"
          ? actionMarkers.rejected
          : actionMarkers.cancelled
    setLocalMarkers((current) => [...current, marker])
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

  if (senderType === "guest" && !priceSet && !cancelled) {
    return (
      <div className="border-t border-border bg-muted/30 p-3 text-sm text-muted-foreground sm:p-4">
        La casa revisará las fechas y dejará aquí el precio cuando esté listo.
      </div>
    )
  }

  if (closed) {
    return (
      <div className="border-t border-border bg-muted/30 p-3 text-sm text-muted-foreground sm:p-4">
        {accepted
          ? "Precio aceptado. El siguiente paso quedará indicado en el chat."
          : rejected
            ? "Precio rechazado. Si queréis seguir hablando, escribid un mensaje normal."
            : cancelled
              ? "Solicitud cancelada."
              : "Contrato registrado."}
      </div>
    )
  }

  return (
    <div className="border-t border-border bg-muted/30 p-3 sm:p-4">
      {senderType === "admin" ? (
        <div className="space-y-3">
          {!priceSet ? (
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
          ) : null}
          <div className="flex flex-wrap gap-2">
            {priceSet && !contractRequested ? (
              <Button type="button" variant="secondary" size="sm" onClick={requestSignature} disabled={busy}>
                <FileSignature className="h-4 w-4" />
                Solicitar contrato y señal
              </Button>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={() => sendDecision("cancel_request")} disabled={busy}>
              <XCircle className="h-4 w-4" />
              Cancelar solicitud
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={removeRequest} disabled={busy}>
              <Trash2 className="h-4 w-4" />
              Borrar solicitud
            </Button>
          </div>
          {priceSet && contractRequested ? (
            <p className="text-sm text-muted-foreground">Precio fijado y contrato solicitado. Esperando respuesta del huésped.</p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            El propietario ha dejado el precio de la estancia. Puedes aceptarlo, rechazarlo o cancelar la solicitud.
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
