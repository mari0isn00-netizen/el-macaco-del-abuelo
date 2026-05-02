"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { ChatMessage, Reservation } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  CloudSun,
  Compass,
  FileSignature,
  MapPin,
  MessageCircle,
  Moon,
  Sparkles,
  Sunrise,
  ThermometerSun,
} from "lucide-react"

type EscapeDashboardProps = {
  reservation: Reservation
  messages: ChatMessage[]
}

const mapsUrl = "https://maps.app.goo.gl/4mM3XHJwqo9bBHNC9"

const seasonalData = [
  {
    months: [2, 3, 4],
    title: "Primavera de olivar",
    image: "/images/emda-piscina-jardin.webp",
    tone: "Mañanas suaves, jardín despierto y tardes largas para abrir la casa sin prisa.",
    temperature: "20-27 °C",
    sunrise: "07:25",
    sunset: "21:05",
    light: "Luz dorada y limpia",
    moon: "Noches templadas",
    ideas: ["Paseo por el casco histórico de Carmona", "Tarde de piscina sin calor extremo", "Cena tranquila al aire libre"],
  },
  {
    months: [5, 6, 7],
    title: "Verano de piscina",
    image: "/images/emda-piscina-atardecer.webp",
    tone: "Días intensos de agua, sombra y siesta. La escapada se vive alrededor de la piscina.",
    temperature: "30-38 °C",
    sunrise: "07:05",
    sunset: "21:35",
    light: "Tardes muy largas",
    moon: "Noches abiertas",
    ideas: ["Piscina al caer la tarde", "Visita temprana a Carmona", "Plan lento de jardín y jacuzzi"],
  },
  {
    months: [8, 9, 10],
    title: "Otoño tranquilo",
    image: "/images/emda-rincon-jardin.webp",
    tone: "El campo baja el ritmo: tardes serenas, luz cálida y descanso sin el ruido del verano.",
    temperature: "18-28 °C",
    sunrise: "08:00",
    sunset: "19:45",
    light: "Luz baja y cálida",
    moon: "Noches frescas",
    ideas: ["Ruta por Carmona sin prisas", "Desayuno exterior", "Jacuzzi y manta al anochecer"],
  },
  {
    months: [11, 0, 1],
    title: "Invierno de refugio",
    image: "/images/emda-entrada-apartamento.webp",
    tone: "Mañanas frescas, calma de parcela y una estancia más íntima, de conversación y descanso.",
    temperature: "10-18 °C",
    sunrise: "08:25",
    sunset: "18:20",
    light: "Sol bajo de campo",
    moon: "Noches frías y claras",
    ideas: ["Carmona monumental", "Comida larga en la zona", "Atardecer en la parcela"],
  },
]

function getSeason(dateString: string) {
  const month = new Date(dateString).getMonth()
  return seasonalData.find((season) => season.months.includes(month)) || seasonalData[0]
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getTimeLeft(checkIn: string) {
  const target = new Date(`${checkIn}T12:00:00`).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    arrived: diff === 0,
  }
}

function statusText(reservation: Reservation, hasPrice: boolean, hasContract: boolean) {
  if (reservation.status === "cancelled") return "Solicitud cancelada"
  if (hasContract) return "Contrato firmado"
  if (reservation.deposit_status === "submitted") return "Señal avisada"
  if (hasPrice) return "Precio listo para revisar"
  return "Solicitud en revisión"
}

export function EscapeDashboard({ reservation, messages }: EscapeDashboardProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(reservation.check_in))
  const season = useMemo(() => getSeason(reservation.check_in), [reservation.check_in])
  const total = reservation.agreed_price || reservation.total_price
  const hasPrice = total > 0
  const hasContract = Boolean(reservation.contract_accepted_at)
  const lastMessage = [...messages].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft(reservation.check_in)), 30_000)
    return () => window.clearInterval(interval)
  }, [reservation.check_in])

  useEffect(() => {
    window.localStorage.setItem("macaco_client_reservation_id", reservation.id)
    window.dispatchEvent(new Event("macaco-client-area"))
  }, [reservation.id])

  const steps = [
    { label: "Solicitud enviada", done: true },
    { label: "Precio fijado", done: hasPrice },
    { label: "Precio aceptado", done: messages.some((message) => message.message.startsWith("PRECIO ACEPTADO")) },
    { label: "Contrato enviado", done: messages.some((message) => message.message.startsWith("CONTRATO Y SEÑAL DISPONIBLES")) },
    { label: "Contrato firmado", done: hasContract },
  ]

  return (
    <main className="min-h-screen bg-background pt-20 md:pt-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={season.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,25,16,.82),rgba(35,25,16,.52),rgba(35,25,16,.12))]" />
        </div>
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-end gap-8 px-4 py-10 text-white sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="pb-4">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.22em] backdrop-blur">
              Tu escapada privada
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">El refugio ya os está esperando.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              {season.tone}
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
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">Cuenta atrás</p>
            {timeLeft.arrived ? (
              <p className="mt-4 font-serif text-4xl font-bold">Hoy empieza la estancia</p>
            ) : (
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/15 p-4 text-center">
                  <p className="font-serif text-4xl font-bold">{timeLeft.days}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-white/70">días</p>
                </div>
                <div className="rounded-xl bg-white/15 p-4 text-center">
                  <p className="font-serif text-4xl font-bold">{timeLeft.hours}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-white/70">horas</p>
                </div>
                <div className="rounded-xl bg-white/15 p-4 text-center">
                  <p className="font-serif text-4xl font-bold">{timeLeft.minutes}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-white/70">min</p>
                </div>
              </div>
            )}
            <div className="mt-5 rounded-xl bg-black/20 p-4 text-sm leading-6 text-white/80">
              Entrada prevista: <strong>{formatDate(reservation.check_in)}</strong>
              <br />
              Estado: <strong>{statusText(reservation, hasPrice, hasContract)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <CloudSun className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-primary">Cómo estará el refugio</p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">{season.title}</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard icon={ThermometerSun} label="Temperatura media" value={season.temperature} />
              <InfoCard icon={Sunrise} label="Amanecer aprox." value={season.sunrise} />
              <InfoCard icon={Clock} label="Atardecer aprox." value={season.sunset} />
              <InfoCard icon={Moon} label="Noche" value={season.moon} />
            </div>
            <p className="mt-5 rounded-xl bg-muted p-4 text-sm leading-7 text-muted-foreground">{season.light}. {season.tone}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-secondary">Plan sugerido</p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">Ideas para esas fechas</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {season.ideas.map((idea) => (
                <div key={idea} className="rounded-xl border border-border bg-background p-4 text-sm text-foreground">
                  {idea}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-3xl font-bold text-foreground">Último movimiento</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
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
            <p className="text-sm uppercase tracking-[0.2em] text-primary">Reserva</p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">Resumen</h2>
            <div className="mt-5 grid gap-3">
              <SummaryRow icon={Calendar} label="Entrada" value={formatDate(reservation.check_in)} />
              <SummaryRow icon={Calendar} label="Salida" value={formatDate(reservation.check_out)} />
              <SummaryRow icon={Compass} label="Huéspedes" value={`${reservation.guests}`} />
              <SummaryRow icon={FileSignature} label="Importe" value={hasPrice ? `${total} EUR` : "Pendiente"} />
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

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
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
