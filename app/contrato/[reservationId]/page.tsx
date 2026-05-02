import Link from "next/link"
import { notFound } from "next/navigation"
import { getConversation } from "@/app/actions/chat"
import { ContractDocument } from "@/components/contract/contract-document"
import { PrintButton } from "@/components/contract/print-button"
import { ArrowLeft } from "lucide-react"

interface ContractPageProps {
  params: Promise<{ reservationId: string }>
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { reservationId } = await params
  const { reservation } = await getConversation(reservationId)

  if (!reservation) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground print:bg-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href={`/chat/${reservation.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Volver al chat
          </Link>
          <PrintButton />
        </div>

        <ContractDocument reservation={reservation} />
      </div>
    </main>
  )
}
