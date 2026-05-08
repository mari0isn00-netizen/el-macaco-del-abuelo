"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createReservation } from "@/app/actions/reservations"
import { calculateReservationPrice } from "@/lib/reservation-pricing"
import type { DateRange } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, UserRound } from "lucide-react"

interface ReservationFormProps {
  dateRange: DateRange
  guests: number
  onGuestsChange: (guests: number) => void
}

export function ReservationForm({ dateRange, guests, onGuestsChange }: ReservationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; reservationId?: string } | null>(null)

  const price = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return null
    return calculateReservationPrice(dateRange.from, dateRange.to)
  }, [dateRange.from, dateRange.to])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!dateRange.from || !dateRange.to || !price || price.nights < 2) {
      setResult({ success: false, message: "Selecciona al menos 2 noches libres antes de solicitar la reserva." })
      return
    }

    setIsSubmitting(true)
    setResult(null)
    const formData = new FormData(event.currentTarget)

    try {
      const response = await createReservation({
        guest_name: formData.get("name") as string,
        guest_email: formData.get("email") as string,
        guest_phone: (formData.get("phone") as string) || undefined,
        check_in: dateRange.from.toISOString().split("T")[0],
        check_out: dateRange.to.toISOString().split("T")[0],
        guests,
        notes: "Solicitud creada desde el flujo visual de reservas.",
      })

      if (response.success && response.reservation) {
        window.localStorage.setItem("macaco_client_reservation_id", response.reservation.id)
        window.dispatchEvent(new Event("macaco-client-area"))
        setResult({
          success: true,
          message: "Solicitud creada. Tu área privada queda abierta para seguir el proceso.",
          reservationId: response.reservation.id,
        })
        setTimeout(() => router.push(`/tu-escapada/${response.reservation?.id}`), 1000)
      } else {
        setResult({
          success: false,
          message: response.error || "No hemos podido guardar la solicitud ahora mismo. Prueba otra vez en un momento.",
        })
      }
    } catch {
      setResult({ success: false, message: "No hemos podido guardar la solicitud ahora mismo. Prueba otra vez en un momento." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#ead9c4] bg-[#fff8ee] shadow-sm">
      <div className="border-b border-[#ead9c4] p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Solicitud</p>
            <h3 className="font-serif text-2xl font-bold text-[#4f2f1f]">Tus datos</h3>
          </div>
        </div>
      </div>

      {result ? (
        <div className={`mx-5 mt-5 flex items-start gap-3 rounded-lg p-4 ${result.success ? "bg-secondary/20 text-secondary" : "bg-destructive/10 text-destructive"}`}>
          {result.success ? <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" /> : <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />}
          <p className="text-sm">{result.message}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-5 p-5 lg:grid-cols-[1fr_260px]">
        <div className="space-y-3">
          <Input name="name" placeholder="Nombre completo" required className="h-12 bg-white/80 text-base" />
          <Input name="email" type="email" placeholder="Email" required className="h-12 bg-white/80 text-base" />
          <Input name="phone" inputMode="tel" placeholder="Teléfono" className="h-12 bg-white/80 text-base" />
          <Input
            value={guests}
            onChange={(event) => onGuestsChange(Math.max(1, Math.min(4, Number(event.target.value) || 1)))}
            type="number"
            min={1}
            max={4}
            placeholder="Huéspedes"
            className="h-12 bg-white/80 text-base"
          />
          <Button type="submit" className="h-12 w-full text-base" disabled={!price || price.nights < 2 || isSubmitting}>
            {isSubmitting ? "Solicitando..." : "Solicitar reserva"}
          </Button>
        </div>

        <aside className="rounded-[14px] border border-[#ead9c4] bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Resumen</p>
          {price && dateRange.from && dateRange.to ? (
            <div className="mt-4 space-y-3 text-sm">
              <Line label="Entrada" value={dateRange.from.toLocaleDateString("es-ES")} />
              <Line label="Salida" value={dateRange.to.toLocaleDateString("es-ES")} />
              <Line label="Noches" value={String(price.nights)} />
              <div className="border-t border-[#ead9c4] pt-3">
                <Line label="Precio base" value={`${price.base}€`} />
                <Line label="Limpieza" value={price.cleaning > 0 ? `${price.cleaning}€` : "Incluida"} />
                <Line label="Total" value={`${price.total}€`} strong />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">El resumen aparecerá al elegir fechas.</p>
          )}
        </aside>
      </form>
    </div>
  )
}

function Line({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "text-lg font-bold text-[#4f2f1f]" : "font-medium text-foreground"}>{value}</span>
    </div>
  )
}
