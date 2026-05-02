import Link from "next/link"
import { redirect } from "next/navigation"
import { getConversation } from "@/app/actions/chat"
import { Header } from "@/components/landing/header"
import { MobileNav } from "@/components/landing/mobile-nav"
import { Button } from "@/components/ui/button"
import { Calendar, FileSignature, Home, MessageCircle, ShieldCheck, UserRound } from "lucide-react"

interface ClientAreaPageProps {
  params: Promise<{ reservationId: string }>
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

export default async function ClientAreaPage({ params }: ClientAreaPageProps) {
  const { reservationId } = await params
  const { reservation, messages } = await getConversation(reservationId)

  if (!reservation) {
    redirect("/")
  }

  const total = reservation.agreed_price || reservation.total_price
  const hasPrice = total > 0
  const hasContract = Boolean(reservation.contract_accepted_at)
  const lastMessage = [...messages].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20 md:pt-24">
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-primary">Área de cliente</p>
                <h1 className="mt-3 font-serif text-4xl font-bold text-foreground md:text-5xl">Tu estancia en El Macaco</h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Desde aquí vuelves siempre al chat, revisas el estado de la solicitud y accedes al contrato cuando la casa lo deje preparado.
                </p>
              </div>
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link href={`/chat/${reservation.id}`}>
                  <MessageCircle className="h-4 w-4" />
                  Volver al chat
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Fechas solicitadas</h2>
                  <p className="text-sm text-muted-foreground">La casa las revisará antes de formalizar nada.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Entrada</p>
                  <p className="mt-2 font-medium text-foreground">{formatDate(reservation.check_in)}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Salida</p>
                  <p className="mt-2 font-medium text-foreground">{formatDate(reservation.check_out)}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Huéspedes</p>
                  <p className="mt-2 font-medium text-foreground">{reservation.guests}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-3 text-secondary">
                  <FileSignature className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Contrato y señal</h2>
                  <p className="text-sm text-muted-foreground">
                    El contrato aparece cuando el precio queda aceptado y el propietario lo envía por el chat.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {hasPrice ? (
                  <Button asChild variant={hasContract ? "outline" : "secondary"}>
                    <Link href={hasContract ? `/contrato/${reservation.id}` : `/pago/${reservation.id}`}>
                      <FileSignature className="h-4 w-4" />
                      {hasContract ? "Ver contrato firmado" : "Revisar contrato"}
                    </Link>
                  </Button>
                ) : (
                  <span className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">Precio pendiente de revisión</span>
                )}
                <Button asChild variant="outline">
                  <Link href={`/chat/${reservation.id}`}>
                    <MessageCircle className="h-4 w-4" />
                    Hablar con la casa
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-foreground">Estado</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-background p-3">
                  <ShieldCheck className="h-5 w-5 text-secondary" />
                  <span className="text-sm text-foreground">Solicitud en revisión</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-background p-3">
                  <UserRound className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">Cliente: {reservation.guest_name}</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-background p-3">
                  <Home className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">Las Monjas, Carmona</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-foreground">Último movimiento</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {lastMessage ? lastMessage.message : "Todavía no hay mensajes en el hilo."}
              </p>
              <Button asChild className="mt-5 w-full">
                <Link href={`/chat/${reservation.id}`}>
                  <MessageCircle className="h-4 w-4" />
                  Abrir chat
                </Link>
              </Button>
            </div>
          </aside>
        </section>
      </main>
      <MobileNav />
    </>
  )
}
