import { redirect } from "next/navigation"
import Link from "next/link"
import { checkAdminAuth, getReservationWithMessages, updateReservationStatus } from "@/app/actions/admin"
import { confirmDepositPayment } from "@/app/actions/reservations"
import { DeleteReservationButton } from "@/components/admin/delete-reservation-button"
import { CloseThreadButton } from "@/components/admin/close-thread-button"
import { ReservationEditForm } from "@/components/admin/reservation-edit-form"
import { AdminReservationTools } from "@/components/admin/admin-reservation-tools"
import { ChatWindow } from "@/components/chat/chat-window"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users, Euro, CheckCircle, XCircle, MessageCircle, FileText } from "lucide-react"
import type { Reservation } from "@/lib/types"

interface AdminReservationPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminReservationPage({ params }: AdminReservationPageProps) {
  const { id } = await params
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  const { reservation, messages } = await getReservationWithMessages(id)

  if (!reservation) {
    redirect("/admin")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const statusLabels = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  }

  const statusColors = {
    pending: "border-yellow-200 bg-yellow-100 text-yellow-800",
    confirmed: "border-green-200 bg-green-100 text-green-800",
    cancelled: "border-red-200 bg-red-100 text-red-800",
    completed: "border-blue-200 bg-blue-100 text-blue-800",
  }

  async function handleStatusChange(formData: FormData) {
    "use server"
    const newStatus = formData.get("status") as Reservation["status"]
    await updateReservationStatus(id, newStatus)
    redirect(`/admin/reservations/${id}`)
  }

  async function handleDepositConfirmation() {
    "use server"
    await confirmDepositPayment({
      reservationId: id,
      senderName: "El Macaco del Abuelo",
    })
    redirect(`/admin/reservations/${id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Estado</h2>
                <span className={`rounded-full border px-3 py-1 text-sm font-medium ${statusColors[reservation.status]}`}>
                  {statusLabels[reservation.status]}
                </span>
              </div>

              <form action={handleStatusChange} className="flex flex-wrap gap-2">
                {reservation.status === "pending" && (
                  <>
                    <Button type="submit" name="status" value="confirmed" size="sm" className="bg-green-600 text-white hover:bg-green-700">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Confirmar
                    </Button>
                    <Button type="submit" name="status" value="cancelled" size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      <XCircle className="mr-1 h-4 w-4" />
                      Cancelar
                    </Button>
                  </>
                )}
                {reservation.status === "confirmed" && (
                  <>
                    <Button type="submit" name="status" value="completed" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Completar
                    </Button>
                    <Button type="submit" name="status" value="cancelled" size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      <XCircle className="mr-1 h-4 w-4" />
                      Cancelar
                    </Button>
                  </>
                )}
              </form>
            </div>

            <ReservationEditForm reservation={reservation} />
            <AdminReservationTools reservationId={reservation.id} />

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-semibold text-foreground">Huésped</h2>
              <div className="space-y-3">
                <p className="text-lg font-medium text-foreground">{reservation.guest_name}</p>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MessageCircle className="mt-0.5 h-4 w-4 text-primary" />
                  <p>El contacto con esta reserva se gestiona por el chat web. Así queda todo escrito y supervisado.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-semibold text-foreground">Fechas</h2>
              <div className="space-y-3">
                <InfoLine icon={Calendar} label="Entrada" value={formatDate(reservation.check_in)} />
                <InfoLine icon={Calendar} label="Salida" value={formatDate(reservation.check_out)} />
                <InfoLine icon={Users} label="Huéspedes" value={`${reservation.guests} personas`} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-semibold text-foreground">Precio y señal</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Euro className="h-6 w-6 text-secondary" />
                  <p className="text-2xl font-bold text-foreground">{reservation.total_price} EUR</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3 text-sm">
                  <p className="text-muted-foreground">Señal de reserva</p>
                  <p className="mt-1 font-medium text-foreground">
                    {reservation.deposit_status === "paid"
                      ? "100 EUR confirmada"
                      : reservation.deposit_status === "submitted"
                        ? "100 EUR pendiente de confirmar"
                        : "100 EUR pendiente"}
                  </p>
                  {reservation.contract_accepted_at ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Contrato aceptado por {reservation.contract_acceptance_name}
                      {reservation.contract_acceptance_dni ? ` · DNI ${reservation.contract_acceptance_dni}` : ""}
                    </p>
                  ) : null}
                  {reservation.deposit_status !== "paid" ? (
                    <form action={handleDepositConfirmation} className="mt-3">
                      <Button type="submit" size="sm" className="w-full bg-green-700 text-white hover:bg-green-800">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Confirmar Bizum recibido
                      </Button>
                    </form>
                  ) : null}
                  {reservation.deposit_status === "paid" ? (
                    <p className="mt-2 rounded-md bg-green-50 p-2 text-xs text-green-800">
                      Pago revisado por la casa. La reserva queda lista para coordinar llegada.
                    </p>
                  ) : (
                    <p className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800">
                      El Bizum personal requiere comprobación manual antes de dar la señal por confirmada.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h2 className="mb-2 font-semibold text-red-900">Zona peligrosa</h2>
              <p className="mb-4 text-sm text-red-800">
                Borra la reserva y sus mensajes asociados. Úsalo para solicitudes duplicadas, pruebas o reservas que ya no deban aparecer.
              </p>
              <DeleteReservationButton reservationId={id} redirectTo="/admin" className="w-full" size="default" />
              <div className="mt-3">
                <CloseThreadButton threadId={id} />
              </div>
            </div>

            {reservation.notes && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-semibold text-foreground">Mensaje del huésped</h2>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{reservation.notes}</p>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">Contrato</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Borrador imprimible con importe, normas, pago y condiciones de la estancia.
                  </p>
                  <Link href={`/contrato/${reservation.id}`} className="mt-3 inline-flex text-sm font-medium text-primary hover:text-primary/80">
                    Abrir contrato
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-0 lg:col-span-2">
            <div className="flex h-[calc(100vh-220px)] min-h-[440px] flex-col overflow-hidden rounded-xl border border-border bg-card lg:h-[min(72vh,680px)]">
              <div className="border-b border-border p-4">
                <h2 className="font-semibold text-foreground">Chat con {reservation.guest_name}</h2>
              </div>
              <ChatWindow reservationId={id} initialMessages={messages} senderType="admin" senderName="El Macaco del Abuelo" closeWhenDeleted />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 text-primary" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
