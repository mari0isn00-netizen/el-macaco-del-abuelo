"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createReservation } from "@/app/actions/reservations"
import type { DateRange } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"

interface ReservationFormProps {
  dateRange: DateRange
  guests: number
  onGuestsChange: (guests: number) => void
}

export function ReservationForm({ dateRange, guests, onGuestsChange }: ReservationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    reservationId?: string
  } | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!dateRange.from || !dateRange.to) {
      setResult({
        success: false,
        message: "Selecciona las fechas de entrada y salida antes de enviar la solicitud.",
      })
      return
    }

    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await createReservation({
        guest_name: formData.get("name") as string,
        check_in: dateRange.from.toISOString().split("T")[0],
        check_out: dateRange.to.toISOString().split("T")[0],
        guests,
        notes: (formData.get("notes") as string) || undefined,
      })

      if (response.success && response.reservation) {
        setResult({
          success: true,
          message: "Solicitud creada. La conversación queda abierta para revisar disponibilidad, precio y contrato.",
          reservationId: response.reservation.id,
        })
        setTimeout(() => {
          router.push(`/chat/${response.reservation?.id}`)
        }, 1400)
      } else {
        setResult({
          success: false,
          message: response.error || "No hemos podido guardar la solicitud ahora mismo. Prueba otra vez en un momento.",
        })
      }
    } catch {
      setResult({
        success: false,
        message: "No hemos podido guardar la solicitud ahora mismo. Prueba otra vez en un momento.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = dateRange.from && dateRange.to && guests > 0

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-primary/5 p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary">Solicitud revisada</p>
        <h3 className="font-semibold text-foreground">Fechas, precio y contrato por escrito</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enviaremos la solicitud al propietario para revisar fechas y fijar el importe. Antes de formalizar nada verás el contrato completo.
        </p>
      </div>

      {result && (
        <div
          className={`mx-6 mt-6 flex items-start gap-3 rounded-lg p-4 ${
            result.success ? "bg-secondary/20 text-secondary" : "bg-destructive/10 text-destructive"
          }`}
        >
          {result.success ? (
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          )}
          <p className="text-sm">{result.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="guests">Número de huéspedes</Label>
          <Select value={guests.toString()} onValueChange={(value) => onGuestsChange(parseInt(value, 10))}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "huésped" : "huéspedes"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input id="name" name="name" placeholder="Cómo quieres que te llamemos" required className="bg-background" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Mensaje para la casa (opcional)</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Si quieres, deja algo importante sobre la estancia, la llegada o cualquier detalle a revisar."
            rows={3}
            className="resize-none bg-background"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          La cancelación gratuita se mantiene hasta 7 días antes de la entrada. La señal de reserva se explica dentro del contrato.
        </p>
      </form>
    </div>
  )
}
