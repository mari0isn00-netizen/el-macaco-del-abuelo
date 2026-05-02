import Link from "next/link"
import { redirect } from "next/navigation"
import { getConversation } from "@/app/actions/chat"
import { DepositFlow } from "@/components/reservation/deposit-flow"
import { Header } from "@/components/landing/header"
import { MobileNav } from "@/components/landing/mobile-nav"
import { ArrowLeft } from "lucide-react"

interface DepositPageProps {
  params: Promise<{ reservationId: string }>
}

export default async function DepositPage({ params }: DepositPageProps) {
  const { reservationId } = await params
  const { reservation } = await getConversation(reservationId)

  if (!reservation) {
    redirect("/")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/reservar" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Volver a fechas
          </Link>
          <DepositFlow reservation={reservation} />
        </div>
      </main>
      <MobileNav />
    </>
  )
}

