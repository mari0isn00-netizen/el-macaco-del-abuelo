import { redirect } from "next/navigation"
import Link from "next/link"
import {
  checkAdminAuth,
  getAdminReservations,
  getUnreadMessagesCount,
  getReservationStats,
  adminLogout,
  getAdminThreads,
} from "@/app/actions/admin"
import { confirmDepositPayment, deleteReservation } from "@/app/actions/reservations"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, Euro, Clock, CheckCircle, LogOut, ExternalLink, ArrowRight, Trash2 } from "lucide-react"

export default async function AdminDashboardPage() {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  const [reservations, unreadCount, stats, threads] = await Promise.all([
    getAdminReservations(),
    getUnreadMessagesCount(),
    getReservationStats(),
    getAdminThreads(),
  ])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

  const statusLabels = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  }

  async function confirmBizumFromList(formData: FormData) {
    "use server"
    const reservationId = String(formData.get("reservationId") || "")
    if (reservationId) {
      await confirmDepositPayment({
        reservationId,
        senderName: "El Macaco del Abuelo",
      })
    }
    redirect("/admin")
  }

  async function deleteReservationFromList(formData: FormData) {
    "use server"
    const reservationId = String(formData.get("reservationId") || "")
    if (reservationId) {
      await deleteReservation(reservationId)
    }
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-serif font-bold text-foreground">La casa por dentro</h1>
              <span className="text-sm text-muted-foreground">El Macaco del Abuelo</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Ver web
                <ExternalLink className="ml-1 inline-block h-3 w-3" />
              </Link>
              <form action={adminLogout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmadas</p>
                <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mensajes sin leer</p>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20">
                <Euro className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold text-foreground">{stats.revenue}€</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-primary">Bandeja</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">Conversaciones que requieren atención</h2>
              </div>
              <Link href="/admin/inbox" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
                Abrir bandeja
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {threads.slice(0, 4).map((thread) => (
                <Link
                  key={thread.id}
                  href={`/admin/inbox/${thread.id}`}
                  className="block rounded-xl border border-border p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{thread.guest_name}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{thread.last_message}</p>
                    </div>
                    {thread.unread_count > 0 ? (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {thread.unread_count} nuevos
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}

              {threads.length === 0 ? <p className="text-sm text-muted-foreground">Todavía no hay conversaciones web activas.</p> : null}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border p-6">
              <h2 className="text-xl font-semibold text-foreground">Reservas</h2>
              <p className="mt-2 text-sm text-muted-foreground">Las solicitudes y reservas siguen un hilo web asociado. Desde aquí abres su ficha completa.</p>
            </div>

            {reservations.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No hay reservas todavía.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Huésped</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Fechas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Huéspedes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{reservation.guest_name}</p>
                            <p className="text-sm text-muted-foreground">Seguimiento por chat web</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          <p>{formatDate(reservation.check_in)}</p>
                          <p className="text-muted-foreground">al {formatDate(reservation.check_out)}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{reservation.guests}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{reservation.total_price}€</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[reservation.status]}`}>
                            {statusLabels[reservation.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/admin/reservations/${reservation.id}`}
                              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                            >
                              Ver ficha
                            </Link>
                            {reservation.deposit_status !== "paid" ? (
                              <form action={confirmBizumFromList}>
                                <input type="hidden" name="reservationId" value={reservation.id} />
                                <Button type="submit" size="sm" className="bg-green-700 text-white hover:bg-green-800">
                                  <CheckCircle className="h-4 w-4" />
                                  Bizum recibido
                                </Button>
                              </form>
                            ) : null}
                            <form action={deleteReservationFromList}>
                              <input type="hidden" name="reservationId" value={reservation.id} />
                              <Button type="submit" size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                                Borrar
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
