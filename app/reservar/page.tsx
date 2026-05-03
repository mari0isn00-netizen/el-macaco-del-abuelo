"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ReservationCalendar } from "@/components/reservation/reservation-calendar"
import { ReservationForm } from "@/components/reservation/reservation-form"
import { PriceCalculator } from "@/components/reservation/price-calculator"
import { ArrivalPreview } from "@/components/reservation/arrival-preview"
import { getBlockedDates } from "@/app/actions/reservations"
import type { DateRange } from "@/lib/types"
import { ArrowLeft, Calendar, FileSignature, WalletCards } from "lucide-react"

export default function ReservarPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [guests, setGuests] = useState(2)
  const [blockedDates, setBlockedDates] = useState<{ start: Date; end: Date }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadBlockedDates() {
      try {
        const dates = await getBlockedDates()
        setBlockedDates(dates)
      } catch (error) {
        console.error("Error loading blocked dates:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadBlockedDates()
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 md:pt-24">
        <div className="relative overflow-hidden bg-[url('/images/emda-piscina-jardin.webp')] bg-cover bg-center py-14 md:py-20">
          <div className="absolute inset-0 bg-black/45" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="relative mb-6 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
            <div className="relative max-w-3xl text-white">
              <p className="mb-4 text-xs uppercase tracking-[0.28em] text-white/75">Reserva directa</p>
              <h1 className="text-4xl font-serif font-bold md:text-6xl">Elegir fechas debería sentirse como llegar.</h1>
              <p className="mt-5 max-w-2xl text-lg text-white/85">
                Selecciona la estancia, solicita la reserva y sigue el depósito, contrato y conversación desde tu página privada.
              </p>
            </div>
            <div className="relative mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {["Calendario vivo", "Contrato con firma dibujada", "Señal supervisada por la casa"].map((item) => (
                <div key={item} className="rounded-lg border border-white/20 bg-white/12 p-4 text-sm font-medium text-white backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl border-b border-border px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paso 1</p>
                <p className="font-medium text-foreground">Fechas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <WalletCards className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paso 2</p>
                <p className="font-medium text-foreground">Depósito</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paso 3</p>
                <p className="font-medium text-foreground">Contrato</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Cargando disponibilidad...</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <ReservationCalendar dateRange={dateRange} onDateChange={setDateRange} blockedDates={blockedDates} />
                <ArrivalPreview dateRange={dateRange} />
              </div>

              <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                <PriceCalculator dateRange={dateRange} guests={guests} />
                <ReservationForm dateRange={dateRange} guests={guests} onGuestsChange={setGuests} />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Proceso claro</h3>
                <p className="text-sm text-muted-foreground">
                  La solicitud no se acepta sola. Se revisa y la conversación sigue en un hilo real dentro de la web.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Precio fijado por la casa</h3>
                <p className="text-sm text-muted-foreground">
                  El propietario revisa las fechas solicitadas y deja el importe final por escrito antes del contrato.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Si prefieres preguntar antes</h3>
                <p className="text-sm text-muted-foreground">
                  Puedes abrir primero el chat web y revisar con calma cualquier duda antes de enviar la solicitud.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}


