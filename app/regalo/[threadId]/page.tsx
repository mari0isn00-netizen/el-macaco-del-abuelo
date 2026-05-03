import Link from "next/link"
import { getConversation } from "@/app/actions/chat"
import { ChatWindow } from "@/components/chat/chat-window"
import { ArrowLeft, Gift, MessageCircle } from "lucide-react"

type GiftPageProps = {
  params: Promise<{ threadId: string }>
}

function extractField(message: string, label: string) {
  const line = message.split("\n").find((item) => item.startsWith(`${label}:`))
  return line ? line.replace(`${label}:`, "").trim() : ""
}

function extractDedication(message: string) {
  const marker = "Dedicatoria para la carta:\n"
  const end = "\nEnlace privado"
  const startIndex = message.indexOf(marker)
  if (startIndex === -1) return ""
  const start = startIndex + marker.length
  const endIndex = message.indexOf(end, start)
  return message.slice(start, endIndex === -1 ? undefined : endIndex).trim()
}

export default async function GiftPrivatePage({ params }: GiftPageProps) {
  const { threadId } = await params
  const { messages } = await getConversation(threadId)
  const firstMessage = messages[0]?.message || ""
  const recipientName = extractField(firstMessage, "Persona que recibirá la escapada") || "Para ti"
  const giverName = extractField(firstMessage, "Regala") || "Alguien especial"
  const dedication = extractDedication(firstMessage)

  return (
    <main className="min-h-screen bg-[#2f2114] px-4 py-8 text-[#fff7ea] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#f3d4ad] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Volver al refugio
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[12px] border border-[#f3d4ad]/18 bg-[#fff7ea] p-8 text-[#2f2114] shadow-[0_30px_100px_rgba(0,0,0,.28)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f2e2c7] px-4 py-2 text-sm font-semibold text-[#704624]">
              <Gift className="h-4 w-4" />
              Carta regalo
            </div>
            <p className="mt-8 text-sm uppercase tracking-[0.28em] text-[#704624]">El Macaco del Abuelo</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-none md:text-6xl">{recipientName}</h1>
            <p className="mt-5 text-lg leading-8 text-[#66482d]">
              {giverName} quiere regalarte unos días en el refugio de Las Monjas, Carmona.
            </p>
            {dedication ? (
              <blockquote className="mt-8 rounded-[8px] bg-[#fff2bf] p-6 font-serif text-2xl italic leading-9 text-[#604221]">
                “{dedication}”
              </blockquote>
            ) : null}
            <p className="mt-8 text-sm leading-6 text-[#765b3e]">
              Las fechas se coordinan con la casa según disponibilidad. Podéis usar el chat de esta página para resolverlo con calma.
            </p>
          </section>

          <section className="overflow-hidden rounded-[12px] border border-white/10 bg-[#fff7ea] text-[#2f2114] shadow-[0_30px_100px_rgba(0,0,0,.28)]">
            <div className="flex items-center gap-3 border-b border-[#8f6237]/14 bg-[#f2e2c7] px-5 py-4">
              <MessageCircle className="h-5 w-5 text-[#704624]" />
              <div>
                <h2 className="font-serif text-xl font-bold">Chat del regalo</h2>
                <p className="text-sm text-[#66482d]">Hablad con la casa para elegir fechas y cerrar detalles.</p>
              </div>
            </div>
            <div className="h-[620px]">
              <ChatWindow
                reservationId={threadId}
                initialMessages={messages}
                senderType="guest"
                senderName={recipientName}
                showOfferPanel={false}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
