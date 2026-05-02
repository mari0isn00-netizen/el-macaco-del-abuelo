import { redirect } from "next/navigation"
import Link from "next/link"
import { checkAdminAuth } from "@/app/actions/admin"
import { getConversation } from "@/app/actions/chat"
import { CloseThreadButton } from "@/components/admin/close-thread-button"
import { ChatWindow } from "@/components/chat/chat-window"
import { ArrowLeft, Calendar, Users, MessageCircle, FileText } from "lucide-react"

interface AdminInboxThreadPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminInboxThreadPage({ params }: AdminInboxThreadPageProps) {
  const { id } = await params
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  const { reservation, messages } = await getConversation(id)

  if (!reservation && messages.length === 0) {
    redirect("/admin/inbox")
  }

  const guestName =
    reservation?.guest_name || messages.find((message) => message.sender_type === "guest")?.sender_name || "Invitado"

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/admin/inbox"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a bandeja
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6">
              <h1 className="text-2xl font-semibold text-foreground">{guestName}</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Hilo web real. El aviso por Telegram solo notifica; la conversación se resuelve aquí.
              </p>
            </div>

            {reservation ? (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-semibold text-foreground">Reserva asociada</h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{reservation.guests} huéspedes</span>
                  </div>
                  <Link href={`/admin/reservations/${reservation.id}`} className="inline-flex text-primary hover:text-primary/80">
                    Abrir ficha completa de reserva
                  </Link>
                  <Link href={`/contrato/${reservation.id}`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                    <FileText className="h-4 w-4" />
                    Abrir contrato
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-semibold text-foreground">Contacto sin reserva cerrada</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Este hilo todavía no está ligado a unas fechas aceptadas. Sirve para resolver dudas o iniciar la solicitud.
                    </p>
                  </div>
                </div>
                <div className="mt-5 border-t border-border pt-5">
                  <CloseThreadButton threadId={id} />
                </div>
              </div>
            )}
          </div>

          <div className="min-h-0 lg:col-span-2">
            <div className="flex h-[calc(100vh-220px)] min-h-[440px] flex-col overflow-hidden rounded-xl border border-border bg-card lg:h-[min(72vh,680px)]">
              <div className="border-b border-border p-4">
                <h2 className="font-semibold text-foreground">Chat con {guestName}</h2>
              </div>
              <ChatWindow
                reservationId={id}
                initialMessages={messages}
                senderType="admin"
                senderName="El Macaco del Abuelo"
                showOfferPanel={Boolean(reservation)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
