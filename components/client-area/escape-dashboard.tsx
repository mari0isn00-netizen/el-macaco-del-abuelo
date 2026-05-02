"use client"

import { useEffect } from "react"
import type { ComponentType } from "react"
import Link from "next/link"
import type { ChatMessage, Reservation } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { WelcomeConfigurator } from "@/components/client-area/welcome-configurator"
import { CheckCircle2, FileSignature, Handshake, Home, MapPin, MessageCircle, ShieldCheck, Sparkles, WalletCards } from "lucide-react"

type EscapeDashboardProps = {
  reservation: Reservation
  messages: ChatMessage[]
}

const mapsUrl = "https://maps.app.goo.gl/4mM3XHJwqo9bBHNC9"

function statusText(reservation: Reservation, hasPrice: boolean, hasContract: boolean) {
  if (reservation.status === "cancelled") return "Solicitud cancelada"
  if (reservation.deposit_status === "paid") return "Señal confirmada"
  if (hasContract || reservation.deposit_status === "submitted") return "Señal en revisión"
  if (hasPrice) return "Precio listo para revisar"
  return "Solicitud en revisión"
}

export function EscapeDashboard({ reservation, messages }: EscapeDashboardProps) {
  const total = reservation.agreed_price || reservation.total_price
  const hasPrice = total > 0
  const hasContract = Boolean(reservation.contract_accepted_at)
  const depositConfirmed = reservation.deposit_status === "paid"
  const lastMessage = [...messages].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]

  useEffect(() => {
    window.localStorage.setItem("macaco_client_reservation_id", reservation.id)
    window.dispatchEvent(new Event("macaco-client-area"))
  }, [reservation.id])

  const steps = [
    { label: "Solicitud recibida por la casa", done: true },
    { label: "Precio fijado en el chat", done: hasPrice },
    { label: "Precio aceptado por el huésped", done: messages.some((message) => message.message.startsWith("PRECIO ACEPTADO")) },
    { label: "Contrato y firma registrados", done: hasContract },
    { label: "Señal comprobada por la casa", done: depositConfirmed },
  ]

  return (
    <main className="min-h-screen bg-background pt-20 md:pt-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/emda-entrada-apartamento.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,25,16,.86),rgba(35,25,16,.56),rgba(35,25,16,.18))]" />
        </div>
        <div className="relative mx-auto grid min-h-[430px] max-w-7xl items-end gap-8 px-4 py-10 text-white sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="pb-4">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.22em] backdrop-blur">
              Área de cliente
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">Seguimiento directo con la casa.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              La parcela se comparte con los dueños, que viven en la casa principal. La estancia busca una sensación cercana,
              cuidada y de comunidad, con respeto total y ayuda disponible si la necesitáis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href={`/chat/${reservation.id}`}>
                  <MessageCircle className="h-4 w-4" />
                  Volver al chat
                </Link>
              </Button>
              {hasPrice ? (
                <Button asChild size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
                  <Link href={hasContract ? `/contrato/${reservation.id}` : `/pago/${reservation.id}`}>
                    <FileSignature className="h-4 w-4" />
                    {hasContract ? "Ver contrato" : "Revisar contrato"}
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/15 p-5 shadow-2xl backdrop-blur-md sm:p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">Estado de la reserva</p>
            <p className="mt-4 font-serif text-4xl font-bold">{statusText(reservation, hasPrice, hasContract)}</p>
            <div className="mt-5 rounded-xl bg-black/20 p-4 text-sm leading-6 text-white/80">
              Importe: <strong>{hasPrice ? `${total} EUR` : "pendiente de revisión"}</strong>
              <br />
              Señal: <strong>{depositConfirmed ? "confirmada" : reservation.deposit_status === "submitted" ? "en comprobación" : "pendiente"}</strong>
            </div>
            {depositConfirmed ? (
              <p className="mt-4 rounded-xl bg-green-500/20 p-4 text-sm leading-6 text-white">
                La casa ha comprobado el Bizum. Ahora el hilo queda para coordinar llegada, acceso y detalles finales.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-primary">Parcela compartida</p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">Una casa con presencia cercana</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Los dueños viven en la casa principal de la misma parcela. No es un hotel aislado ni una entrega anónima:
                  hay una convivencia tranquila, supervisión discreta y trato directo si necesitáis cualquier cosa.
                </p>
              </div>
            </div>
          </div>

          <PaymentSupervision confirmed={depositConfirmed} submitted={reservation.deposit_status === "submitted"} />

          <WelcomeConfigurator reservation={reservation} messages={messages} />

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-3xl font-bold text-foreground">Último movimiento</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {lastMessage ? lastMessage.message : "Todavía no hay mensajes en el hilo."}
            </p>
            <Button asChild className="mt-5">
              <Link href={`/chat/${reservation.id}`}>
                <MessageCircle className="h-4 w-4" />
                Abrir conversación
              </Link>
            </Button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">Resumen</p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">Estado</h2>
            <div className="mt-5 grid gap-3">
              <SummaryRow icon={Handshake} label="Solicitud" value={reservation.status === "cancelled" ? "Cancelada" : "Activa"} />
              <SummaryRow icon={WalletCards} label="Importe" value={hasPrice ? `${total} EUR` : "Pendiente"} />
              <SummaryRow icon={ShieldCheck} label="Señal" value={depositConfirmed ? "Confirmada" : "Pendiente de comprobación"} />
              <SummaryRow icon={FileSignature} label="Contrato" value={hasContract ? "Firmado" : "Pendiente"} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Seguimiento</p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">Pasos</h2>
            <div className="mt-5 space-y-3">
              {steps.map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${step.done ? "bg-secondary" : "bg-muted"}`} />
                  <span className={step.done ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Cómo llegar</h2>
                <p className="text-sm text-muted-foreground">Las Monjas, Carmona, Sevilla</p>
              </div>
            </div>
            <Button asChild className="mt-5 w-full">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                <MapPin className="h-4 w-4" />
                Abrir en Google Maps
              </a>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  )
}

function PaymentSupervision({ confirmed, submitted }: { confirmed: boolean; submitted: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
          {confirmed ? <CheckCircle2 className="h-5 w-5" /> : <WalletCards className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">Supervisión del pago</p>
          <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">
            {confirmed ? "Señal confirmada por la casa" : submitted ? "Señal en comprobación" : "Señal pendiente"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {confirmed
              ? "La casa ha revisado el Bizum y ha dejado constancia en el hilo. A partir de aquí, el chat sirve para coordinar llegada, acceso y cualquier detalle final."
              : submitted
                ? "El contrato y el aviso de Bizum ya están registrados. Los dueños revisan manualmente el movimiento bancario antes de marcarlo como confirmado."
                : "Cuando el contrato esté disponible y el precio esté aceptado, la señal se registrará desde la propia página y quedará pendiente de comprobación manual."}
          </p>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
