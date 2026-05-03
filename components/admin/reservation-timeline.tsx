import type { Reservation } from "@/lib/types"
import { CheckCircle2, Circle, Clock3 } from "lucide-react"

export function ReservationTimeline({ reservation }: { reservation: Reservation }) {
  const hasPrice = Number(reservation.agreed_price || reservation.total_price) > 0
  const steps = [
    { label: "Solicitud recibida", detail: formatDate(reservation.created_at), done: true },
    { label: "Precio establecido", detail: hasPrice ? `${reservation.agreed_price || reservation.total_price} EUR` : "Pendiente", done: hasPrice },
    {
      label: "Depósito enviado",
      detail: reservation.deposit_status === "pending" ? "Pendiente" : "En comprobación",
      done: reservation.deposit_status === "submitted" || reservation.deposit_status === "paid",
    },
    {
      label: "Depósito verificado",
      detail: reservation.deposit_paid_at ? formatDate(reservation.deposit_paid_at) : "Pendiente",
      done: reservation.deposit_status === "paid",
    },
    {
      label: "Contrato firmado",
      detail: reservation.contract_accepted_at ? formatDate(reservation.contract_accepted_at) : "Pendiente",
      done: Boolean(reservation.contract_accepted_at),
    },
    {
      label: "Reserva confirmada",
      detail: reservation.status === "confirmed" ? "Activa" : reservation.status === "completed" ? "Completada" : "Pendiente",
      done: reservation.status === "confirmed" || reservation.status === "completed",
    },
  ]

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-semibold text-foreground">Línea de tiempo</h2>
      <div className="mt-5 space-y-4">
        {steps.map((step) => (
          <div key={step.label} className="grid grid-cols-[28px_1fr] gap-3">
            <div className="flex flex-col items-center">
              {step.done ? <CheckCircle2 className="h-5 w-5 text-secondary" /> : <Circle className="h-5 w-5 text-muted-foreground/50" />}
              <span className="mt-1 h-full w-px bg-border" />
            </div>
            <div className="pb-2">
              <p className="text-sm font-medium text-foreground">{step.label}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                {!step.done ? <Clock3 className="h-3.5 w-3.5" /> : null}
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
