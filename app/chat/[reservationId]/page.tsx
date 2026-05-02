import { redirect } from "next/navigation"
import Link from "next/link"
import { getConversation } from "@/app/actions/chat"
import { SmartChat } from "@/components/chat/smart-chat"
import { Header } from "@/components/landing/header"
import { MobileNav } from "@/components/landing/mobile-nav"
import { ArrowLeft, Calendar, Users, MessageCircle, FileText } from "lucide-react"

interface ChatPageProps {
  params: Promise<{ reservationId: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { reservationId } = await params
  const { reservation, messages } = await getConversation(reservationId)

  if (!reservation && messages.length === 0) {
    redirect("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const statusLabels = {
    pending: "Solicitud en revisión",
    confirmed: "Aceptada",
    cancelled: "Cancelada",
    completed: "Finalizada",
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  }

  const hasPrice = reservation ? (reservation.agreed_price || reservation.total_price) > 0 : false

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col pt-16 md:pt-20">
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>

            {reservation ? (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Seguimiento de tu estancia</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{reservation.guests} huéspedes</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {reservation.contract_accepted_at || hasPrice ? (
                    <Link
                      href={reservation.contract_accepted_at ? `/contrato/${reservation.id}` : `/pago/${reservation.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <FileText className="h-4 w-4" />
                      {reservation.contract_accepted_at ? "Contrato" : "Revisar contrato"}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Precio pendiente
                    </span>
                  )}
                  <div className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[reservation.status]}`}>
                    {statusLabels[reservation.status]}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Conversación abierta con la casa</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Este hilo no está ligado todavía a una reserva confirmada. Seguimos por aquí.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <MessageCircle className="h-4 w-4" />
                  Chat web activo
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 pb-20 md:h-[calc(100vh-190px)] md:pb-0">
          <SmartChat
            reservationId={reservationId}
            initialMessages={messages}
            senderType="guest"
            senderName={reservation?.guest_name || "Invitado"}
            guestName={reservation?.guest_name?.split(" ")[0]}
          />
        </div>
      </main>
      <MobileNav />
    </>
  )
}
