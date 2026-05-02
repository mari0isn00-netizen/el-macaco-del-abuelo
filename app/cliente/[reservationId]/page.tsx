import { redirect } from "next/navigation"
import { getConversation } from "@/app/actions/chat"
import { EscapeDashboard } from "@/components/client-area/escape-dashboard"
import { Header } from "@/components/landing/header"
import { MobileNav } from "@/components/landing/mobile-nav"

interface ClientAreaPageProps {
  params: Promise<{ reservationId: string }>
}

export default async function ClientAreaPage({ params }: ClientAreaPageProps) {
  const { reservationId } = await params
  const { reservation, messages } = await getConversation(reservationId)

  if (!reservation) {
    redirect("/")
  }

  return (
    <>
      <Header />
      <EscapeDashboard reservation={reservation} messages={messages} />
      <MobileNav />
    </>
  )
}
