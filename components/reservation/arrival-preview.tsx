"use client"

import type { DateRange } from "@/lib/types"
import type { ComponentType } from "react"
import { Clock, Moon, Sparkles, Sunrise, ThermometerSun } from "lucide-react"

interface ArrivalPreviewProps {
  dateRange: DateRange
}

const seasons = [
  {
    months: [2, 3, 4],
    title: "Primavera de olivar",
    image: "/images/emda-piscina-jardin.webp",
    temperature: "20-27 °C",
    sunrise: "07:25",
    sunset: "21:05",
    moon: "Noches templadas",
    light: "Luz dorada y limpia",
    phrase: "Mañanas suaves, jardín despierto y tardes largas para llegar sin prisa.",
    bring: ["Algo ligero para el día", "Chaqueta fina", "Ganas de piscina al atardecer"],
  },
  {
    months: [5, 6, 7],
    title: "Verano de piscina",
    image: "/images/emda-piscina-atardecer.webp",
    temperature: "30-38 °C",
    sunrise: "07:05",
    sunset: "21:35",
    moon: "Noches abiertas",
    light: "Tardes muy largas",
    phrase: "Días de agua, sombra y siesta. La escapada se vive alrededor de la piscina.",
    bring: ["Bañador", "Protección solar", "Plan de visita temprano a Carmona"],
  },
  {
    months: [8, 9, 10],
    title: "Otoño tranquilo",
    image: "/images/emda-rincon-jardin.webp",
    temperature: "18-28 °C",
    sunrise: "08:00",
    sunset: "19:45",
    moon: "Noches frescas",
    light: "Luz baja y cálida",
    phrase: "El campo baja el ritmo: tardes serenas, desayuno exterior y descanso sin ruido.",
    bring: ["Ropa cómoda", "Algo de abrigo", "Tiempo para pasear Carmona"],
  },
  {
    months: [11, 0, 1],
    title: "Invierno de refugio",
    image: "/images/emda-entrada-apartamento.webp",
    temperature: "10-18 °C",
    sunrise: "08:25",
    sunset: "18:20",
    moon: "Noches frías y claras",
    light: "Sol bajo de campo",
    phrase: "Mañanas frescas, calma de parcela y una estancia íntima de conversación y descanso.",
    bring: ["Chaqueta", "Plan de comida larga", "Ganas de refugio tranquilo"],
  },
]

function getSeason(date?: Date) {
  if (!date) return seasons[1]
  const month = date.getMonth()
  return seasons.find((season) => season.months.includes(month)) || seasons[1]
}

function formatDate(date?: Date) {
  if (!date) return "Selecciona fechas"
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long" })
}

export function ArrivalPreview({ dateRange }: ArrivalPreviewProps) {
  const selectedDate = dateRange.from
  const season = getSeason(selectedDate)

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative min-h-[280px]">
        <img src={season.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,28,18,.82),rgba(37,28,18,.48),rgba(37,28,18,.18))]" />
        <div className="relative flex min-h-[280px] flex-col justify-end p-5 text-white sm:p-7">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Cómo estará el refugio
          </p>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">{season.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">{season.phrase}</p>
          <p className="mt-4 text-sm text-white/70">
            Entrada orientativa: <span className="font-medium text-white">{formatDate(dateRange.from)}</span>
            {dateRange.to ? <> · Salida: <span className="font-medium text-white">{formatDate(dateRange.to)}</span></> : null}
          </p>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <PreviewStat icon={ThermometerSun} label="Temperatura media" value={season.temperature} />
        <PreviewStat icon={Sunrise} label="Amanecer aprox." value={season.sunrise} />
        <PreviewStat icon={Clock} label="Atardecer aprox." value={season.sunset} />
        <PreviewStat icon={Moon} label="Noche" value={season.moon} />
      </div>

      <div className="border-t border-border p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">{season.light}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {season.bring.map((item) => (
            <span key={item} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function PreviewStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
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
