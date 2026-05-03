import Image from "next/image"
import Link from "next/link"
import { getConversation } from "@/app/actions/chat"
import { GiftLetterActions } from "@/components/gift/gift-letter-actions"
import { ArrowLeft, Gift, MapPin, Sparkles } from "lucide-react"

type GiftLetterPageProps = {
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

export default async function GiftLetterPage({ params }: GiftLetterPageProps) {
  const { threadId } = await params
  const { messages } = await getConversation(threadId)
  const firstMessage = messages[0]?.message || ""
  const recipientName = extractField(firstMessage, "Persona que recibirá la escapada") || "Para ti"
  const giverName = extractField(firstMessage, "Regala") || "Alguien especial"
  const occasion = extractField(firstMessage, "Motivo") || "Regalo especial"
  const preferredWindow = extractField(firstMessage, "Fechas orientativas") || "A elegir según disponibilidad"
  const dedication = extractDedication(firstMessage) || "Te regalo unos días para bajar el ritmo y vivir el refugio con calma."
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
  const giftUrl = siteUrl ? `${siteUrl}/regalo/${threadId}` : `/regalo/${threadId}`

  if (messages.length === 0) {
    return (
      <main className="min-h-screen bg-[#f2e2c7] px-4 py-8 text-[#2f2114]">
        <div className="mx-auto max-w-3xl rounded-[12px] bg-[#fff7ea] p-8 text-center shadow-xl">
          <h1 className="font-serif text-4xl font-bold">Carta no disponible</h1>
          <p className="mt-4 text-[#66482d]">Este regalo se ha cerrado o ya no está activo.</p>
          <Link href="/regalo" className="mt-6 inline-flex rounded-full bg-[#704624] px-5 py-3 text-sm font-semibold text-[#fff7ea]">
            Crear otro regalo
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#ead3ac] px-4 py-6 text-[#2f2114] sm:px-6 lg:px-8">
      <div className="no-print mx-auto mb-6 flex max-w-5xl items-center justify-between gap-4">
        <Link href={`/regalo/${threadId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#704624] hover:text-[#2f2114]">
          <ArrowLeft className="h-4 w-4" />
          Volver al regalo
        </Link>
        <div className="w-full max-w-md">
          <GiftLetterActions giftUrl={giftUrl} />
        </div>
      </div>

      <article className="print-letter mx-auto max-w-5xl overflow-hidden rounded-[16px] border border-[#8f6237]/20 bg-[#fff7ea] shadow-[0_35px_120px_rgba(73,43,19,.24)]">
        <section className="relative min-h-[660px] overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(#8f6237_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
          <div className="relative grid min-h-[570px] items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8f6237]/20 bg-[#f2e2c7]/80 px-4 py-2 text-sm font-bold text-[#704624]">
                <Gift className="h-4 w-4" />
                Carta regalo
              </div>
              <p className="mt-10 text-sm uppercase tracking-[0.32em] text-[#704624]">El Macaco del Abuelo</p>
              <h1 className="mt-5 font-serif text-6xl font-bold leading-[0.92] md:text-8xl">{recipientName}</h1>
              <p className="mt-7 max-w-xl text-xl leading-9 text-[#66482d]">
                {giverName} te regala una escapada al refugio de Las Monjas, Carmona.
              </p>
              <div className="mt-10 rounded-[10px] bg-[#fff2bf] p-7 font-serif text-3xl italic leading-[1.35] text-[#604221] shadow-sm">
                "{dedication}"
              </div>
            </div>

            <div className="relative min-h-[520px]">
              <div className="absolute left-0 top-0 h-72 w-56 -rotate-6 rounded-[8px] bg-white p-3 shadow-2xl">
                <div className="relative h-full overflow-hidden rounded-[5px]">
                  <Image src="/images/emda-detalle-mesa.webp" alt="Detalle de bienvenida en el apartamento" fill priority sizes="280px" className="object-cover sepia-[0.12]" />
                </div>
              </div>
              <div className="absolute bottom-8 right-0 h-80 w-64 rotate-3 rounded-[8px] bg-white p-3 shadow-2xl">
                <div className="relative h-full overflow-hidden rounded-[5px]">
                  <Image src="/images/emda-piscina-atardecer.webp" alt="Piscina del refugio al atardecer" fill priority sizes="320px" className="object-cover" />
                </div>
              </div>
              <div className="absolute bottom-0 left-10 rounded-[6px] bg-[#6b7d3f] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff7ea] shadow-lg">
                Carmona, Sevilla
              </div>
            </div>
          </div>
        </section>

        <section className="print-page-break border-t border-[#8f6237]/16 bg-[#f7ead4] p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border-[10px] border-white shadow-xl">
                <Image src="/images/emda-salon-dormitorio.webp" alt="Interior del apartamento independiente" fill sizes="(min-width: 768px) 420px, 90vw" className="object-cover" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden rounded-[8px] border-[8px] border-white shadow-lg">
                  <Image src="/images/emda-piscina-jacuzzi.webp" alt="Piscina y jacuzzi" fill sizes="220px" className="object-cover" />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-[8px] border-[8px] border-white shadow-lg">
                  <Image src="/images/emda-entrada-apartamento.webp" alt="Entrada del apartamento" fill sizes="220px" className="object-cover" />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff7ea] px-4 py-2 text-sm font-bold text-[#704624]">
                <Sparkles className="h-4 w-4" />
                Lo que incluye la intención del regalo
              </div>
              <h2 className="mt-6 font-serif text-5xl font-bold leading-tight text-[#2f2114]">
                Unos días para parar, hablar y vivir la casa con calma.
              </h2>
              <div className="mt-8 grid gap-4 text-[#66482d]">
                <Info label="Lugar" value="Las Monjas, Carmona, Sevilla" />
                <Info label="Motivo" value={occasion} />
                <Info label="Fechas orientativas" value={preferredWindow} />
                <Info label="Siguiente paso" value="Coordinar disponibilidad, precio y detalles por el chat privado del regalo." />
              </div>
              <div className="mt-8 rounded-[10px] border border-[#8f6237]/18 bg-[#fff7ea] p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-[#6b7d3f]" />
                  <p className="text-sm leading-6 text-[#66482d]">
                    El origen del nombre viene de Arahal. La estancia se vive en Las Monjas, Carmona, en una parcela familiar compartida con los dueños.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-[#fff7ea] p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#704624]">{label}</p>
      <p className="mt-2 font-semibold text-[#2f2114]">{value}</p>
    </div>
  )
}
