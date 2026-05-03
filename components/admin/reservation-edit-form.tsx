import { redirect } from "next/navigation"
import { updateReservationDetailsFromAdmin } from "@/app/actions/admin"
import type { Reservation } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ReservationEditForm({ reservation }: { reservation: Reservation }) {
  async function save(formData: FormData) {
    "use server"
    const result = await updateReservationDetailsFromAdmin(reservation.id, formData)
    if (result.success) redirect(`/admin/reservations/${reservation.id}`)
  }

  return (
    <form action={save} className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div>
        <h2 className="font-semibold text-foreground">Editar reserva</h2>
        <p className="mt-1 text-sm text-muted-foreground">Cambia datos, fechas, precio, estado y notas desde aquí.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nombre" name="guest_name" defaultValue={reservation.guest_name} />
        <Field label="Email" name="guest_email" defaultValue={reservation.guest_email} />
        <Field label="Teléfono" name="guest_phone" defaultValue={reservation.guest_phone || ""} />
        <Field label="Huéspedes" name="guests" type="number" defaultValue={String(reservation.guests)} />
        <Field label="Entrada" name="check_in" type="date" defaultValue={reservation.check_in} />
        <Field label="Salida" name="check_out" type="date" defaultValue={reservation.check_out} />
        <Field label="Precio total" name="total_price" type="number" defaultValue={String(reservation.total_price)} />
        <Field label="Precio acordado" name="agreed_price" type="number" defaultValue={String(reservation.agreed_price || reservation.total_price)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField
          label="Estado"
          name="status"
          defaultValue={reservation.status}
          options={[
            ["pending", "Pendiente"],
            ["confirmed", "Confirmada"],
            ["cancelled", "Cancelada"],
            ["completed", "Completada"],
          ]}
        />
        <SelectField
          label="Señal"
          name="deposit_status"
          defaultValue={reservation.deposit_status || "pending"}
          options={[
            ["pending", "Pendiente"],
            ["submitted", "En comprobación"],
            ["paid", "Pagada"],
          ]}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="notes">Notas internas / mensaje</label>
        <Textarea id="notes" name="notes" defaultValue={reservation.notes || ""} rows={4} />
      </div>

      <Button className="w-full" type="submit">Guardar cambios</Button>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string
  name: string
  defaultValue: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor={name}>{label}</label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
    </div>
  )
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string
  name: string
  defaultValue: string
  options: [string, string][]
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
      >
        {options.map(([value, labelText]) => (
          <option key={value} value={value}>{labelText}</option>
        ))}
      </select>
    </div>
  )
}
