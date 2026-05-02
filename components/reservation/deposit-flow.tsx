"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { acceptContractAndSubmitDeposit } from "@/app/actions/reservations"
import { formatContractDate, getCancellationDeadline } from "@/lib/contract"
import { ContractDocument } from "@/components/contract/contract-document"
import { SignaturePad } from "@/components/contract/signature-pad"
import type { Reservation } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Copy, FileSignature, LockKeyhole, MessageCircle, ShieldCheck, Sparkles } from "lucide-react"

interface DepositFlowProps {
  reservation: Reservation
}

export function DepositFlow({ reservation }: DepositFlowProps) {
  const [accepted, setAccepted] = useState(Boolean(reservation.contract_accepted_at))
  const [acceptanceName, setAcceptanceName] = useState(reservation.contract_acceptance_name || reservation.guest_name)
  const [acceptanceDni, setAcceptanceDni] = useState(reservation.contract_acceptance_dni || "")
  const [signature, setSignature] = useState(reservation.contract_signature || "")
  const [bizumSent, setBizumSent] = useState(reservation.deposit_status === "submitted" || reservation.deposit_status === "paid")
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(reservation.deposit_status === "submitted" || reservation.deposit_status === "paid")

  const contractPreview = useMemo(
    () => ({
      ...reservation,
      contract_acceptance_name: acceptanceName,
      contract_acceptance_dni: acceptanceDni,
      contract_signature: signature,
    }),
    [acceptanceDni, acceptanceName, reservation, signature]
  )

  const cancellationDeadline = formatContractDate(getCancellationDeadline(reservation))
  const bizumConcept = `Reserva ${reservation.id.slice(0, 8)} El Macaco del Abuelo`
  const bizumDetails = `Bizum: 687416734\nImporte: 100 EUR\nConcepto: ${bizumConcept}`
  const total = reservation.agreed_price || reservation.total_price

  const handleSubmit = async () => {
    if (!accepted) {
      setError("Tienes que aceptar el contrato antes de registrar la firma.")
      return
    }
    if (!bizumSent) {
      setError("Marca que has enviado el Bizum antes de dejar el contrato registrado.")
      return
    }

    setIsSubmitting(true)
    setError("")
    const result = await acceptContractAndSubmitDeposit({
      reservationId: reservation.id,
      acceptanceName,
      acceptanceDni,
      signature,
    })
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error || "No hemos podido registrar el contrato.")
      return
    }

    setSubmitted(true)
  }

  const copyBizumDetails = async () => {
    await navigator.clipboard?.writeText(bizumDetails)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="relative min-h-[260px] bg-[url('/images/emda-entrada-apartamento.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative flex min-h-[260px] flex-col justify-end p-6 text-white sm:p-8">
            <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.18em] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Contrato de estancia
            </p>
            <h1 className="max-w-2xl text-3xl font-serif font-bold sm:text-5xl">Revisa todo antes de formalizar la reserva.</h1>
            <p className="mt-4 max-w-xl text-sm text-white/85 sm:text-base">
              Aquí tienes el contrato completo con fechas, precio, inclusiones, cancelación, privacidad y uso de la estancia.
              Si necesitas consultar algo antes, háblanos por el chat sin compromiso.
            </p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-border p-5 sm:grid-cols-3 sm:p-6">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Importe estancia</p>
            <p className="mt-2 text-lg font-bold text-foreground">{total > 0 ? `${total} EUR` : "Pendiente"}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Cancelación</p>
            <p className="mt-2 text-sm font-medium text-foreground">Gratis hasta {cancellationDeadline}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Contrato</p>
            <p className="mt-2 text-sm font-medium text-foreground">{submitted ? "Firmado" : "Pendiente de firma"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Contrato completo</h2>
        <ContractDocument reservation={contractPreview} previewSignature={signature} />
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        {submitted ? (
          <div className="mx-auto max-w-xl text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-secondary" />
            <h2 className="text-2xl font-semibold text-foreground">Contrato firmado</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              El contrato queda registrado y la señal de 100 EUR queda pendiente de confirmación bancaria.
              Cuando tengamos Bizum comercio, esto se podrá confirmar automáticamente.
            </p>
            <Button asChild className="mt-6">
              <Link href={`/chat/${reservation.id}`}>
                <MessageCircle className="h-4 w-4" />
                Ir al chat de la reserva
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-primary">Después de leer el contrato</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Firma y señal de reserva</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Cuando el contrato esté claro, puedes registrar la firma y avisar del Bizum. La señal es de 100 EUR
                y queda pendiente de confirmación bancaria por parte de la casa.
              </p>

              <div className="mt-5 rounded-lg border border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <LockKeyhole className="h-4 w-4 text-primary" />
                  Datos de Bizum
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-border bg-card p-3 text-sm">
                  <span className="text-muted-foreground">Estado</span>
                  <span className="font-medium text-foreground">Pendiente de confirmación</span>
                  <span className="text-muted-foreground">Bizum</span>
                  <span className="font-medium text-foreground">687416734</span>
                  <span className="text-muted-foreground">Concepto</span>
                  <span className="text-right font-medium text-foreground">{bizumConcept}</span>
                  <span className="text-muted-foreground">Política</span>
                  <span className="font-medium text-foreground">Gratis hasta 7 días antes</span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Button type="button" onClick={copyBizumDetails}>
                    <Copy className="h-4 w-4" />
                    {copied ? "Datos copiados" : "Copiar datos"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigator.clipboard?.writeText("687416734")}>
                    <Copy className="h-4 w-4" />
                    Copiar teléfono
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Abre tu app bancaria, entra en Bizum, envía 100 EUR al 687416734 y usa el concepto indicado.
                  Un Bizum personal no puede confirmar pagos automáticamente en la web.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-muted-foreground">
                  He leído y acepto el contrato de estancia, el precio fijado por la casa, la señal de 100 EUR y la cancelación gratuita hasta una semana antes.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm">
                <input
                  type="checkbox"
                  checked={bizumSent}
                  onChange={(event) => setBizumSent(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span className="text-muted-foreground">
                  He enviado la señal de 100 EUR por Bizum y entiendo que queda pendiente de confirmación bancaria.
                </span>
              </label>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre de quien firma</label>
                <Input value={acceptanceName} onChange={(event) => setAcceptanceName(event.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">DNI/NIE</label>
                <Input value={acceptanceDni} onChange={(event) => setAcceptanceDni(event.target.value.toUpperCase())} placeholder="12345678A" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Firma dibujada</label>
                <SignaturePad value={signature} onChange={setSignature} />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button className="w-full" disabled={isSubmitting || !accepted || !bizumSent} onClick={handleSubmit}>
                <FileSignature className="h-4 w-4" />
                {isSubmitting ? "Registrando..." : "Firmar contrato y avisar del Bizum"}
              </Button>

              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                Los datos quedan unidos al hilo web de la reserva.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
