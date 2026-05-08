import Image from "next/image"
import Link from "next/link"
import { getConversation } from "@/app/actions/chat"
import { ChatWindow } from "@/components/chat/chat-window"
import { GiftLetterActions } from "@/components/gift/gift-letter-actions"
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

  if (messages.length === 0) {
    return (
      <main className="min-h-screen bg-[#2f2114] px-4 py-8 text-[#fff7ea] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#f3d4ad] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver al refugio
          </Link>
          <section className="mt-10 rounded-[12px] border border-[#f3d4ad]/18 bg-[#fff7ea] p-8 text-center text-[#2f2114] shadow-[0_30px_100px_rgba(0,0,0,.28)]">
            <Gift className="mx-auto h-10 w-10 text-[#704624]" />
            <h1 className="mt-5 font-serif text-4xl font-bold">Este regalo ya no está activo</h1>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-[#66482d]">
              La conversación se ha cerrado desde la casa. Si queréis preparar otro regalo o resolver algo, podéis abrir un nuevo hilo.
            </p>
            <Link href="/regalo" className="mt-7 inline-flex rounded-full bg-[#704624] px-5 py-3 text-sm font-semibold text-[#fff7ea] hover:bg-[#3b2717]">
              Crear nuevo regalo
            </Link>
          </section>
        </div>
      </main>
    )
  }

  const firstMessage = messages[0]?.message || ""
  const recipientName = extractField(firstMessage, "Persona que recibirá la escapada") || "Para ti"
  const giverName = extractField(firstMessage, "Regala") || "Alguien especial"
  const occasion = extractField(firstMessage, "Motivo")
  const preferredWindow = extractField(firstMessage, "Fechas orientativas")
  const dedication = extractDedication(firstMessage)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
  const giftUrl = siteUrl ? `${siteUrl}/regalo/${threadId}` : `/regalo/${threadId}`
  const letterUrl = `/regalo/${threadId}/carta`

  return (
    <main className="min-h-screen bg-[#2f2114] px-4 py-8 text-[#fff7ea] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="no-print inline-flex items-center gap-2 text-sm font-semibold text-[#f3d4ad] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Volver al refugio
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="print-letter rounded-[12px] border border-[#f3d4ad]/18 bg-[#fff7ea] p-6 text-[#2f2114] shadow-[0_30px_100px_rgba(0,0,0,.28)] md:p-8">
            <div className="grid gap-4 sm:grid-cols-[1fr_0.8fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f2e2c7] px-4 py-2 text-sm font-semibold text-[#704624]">
                  <Gift className="h-4 w-4" />
                  Carta regalo
                </div>
                <p className="mt-7 text-sm uppercase tracking-[0.28em] text-[#704624]">El Macaco del Abuelo</p>
                <h1 className="mt-4 font-serif text-5xl font-bold leading-none md:text-6xl">{recipientName}</h1>
                <p className="mt-5 text-lg leading-8 text-[#66482d]">
                  {giverName} quiere regalarte unos días en el refugio de Urbanización Las Monjas, Carmona.
                </p>
              </div>
              <div className="relative min-h-[220px]">
                <div className="absolute left-0 top-3 h-44 w-36 -rotate-6 rounded-[7px] bg-white p-2 shadow-xl">
                  <div className="relative h-full overflow-hidden rounded-[5px]">
                    <Image src="/images/emda-detalle-mesa.webp" alt="Detalle preparado en el apartamento" fill sizes="180px" className="object-cover sepia-[0.12]" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 h-48 w-40 rotate-3 rounded-[7px] bg-white p-2 shadow-xl">
                  <div className="relative h-full overflow-hidden rounded-[5px]">
                    <Image src="/images/emda-piscina-atardecer.webp" alt="Piscina del refugio al atardecer" fill sizes="200px" className="object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {dedication ? (
              <blockquote className="mt-8 rounded-[8px] bg-[#fff2bf] p-6 font-serif text-2xl italic leading-9 text-[#604221]">
                "{dedication}"
              </blockquote>
            ) : null}

            <div className="mt-7 grid gap-4 text-sm leading-6 text-[#66482d] sm:grid-cols-3">
              <Info label="Incluye" value="Escapada a coordinar con la casa" />
              <Info label="Motivo" value={occasion || "Regalo especial"} />
              <Info label="Fechas" value={preferredWindow || "Según disponibilidad"} />
            </div>

            <div className="mt-8 rounded-[8px] border border-[#8f6237]/18 bg-[#f2e2c7]/75 p-5">
              <p className="font-serif text-xl font-bold text-[#2f2114]">Qué pasa ahora</p>
              <p className="mt-2 text-sm leading-6 text-[#66482d]">
                Las fechas se coordinan con la casa según disponibilidad. Usad el chat de esta página para resolverlo con calma y cerrar los detalles.
              </p>
            </div>

            <GiftLetterActions giftUrl={giftUrl} letterUrl={letterUrl} />
          </section>

          <section className="no-print overflow-hidden rounded-[12px] border border-white/10 bg-[#fff7ea] text-[#2f2114] shadow-[0_30px_100px_rgba(0,0,0,.28)]">
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
                closeWhenDeleted
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-[#f2e2c7]/75 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#704624]">{label}</p>
      <p className="mt-2 font-semibold text-[#2f2114]">{value}</p>
    </div>
  )
}
