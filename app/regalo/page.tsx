import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { MobileNav } from "@/components/landing/mobile-nav"
import { Footer } from "@/components/landing/footer"
import { GiftRequestForm } from "@/components/gift/gift-request-form"
import { Reveal } from "@/components/ui/reveal"
import { ArrowLeft, Gift, Heart, MessageCircle, Sparkles } from "lucide-react"

export default function RegaloPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f2e2c7] pt-20 md:pt-24">
        <section className="relative overflow-hidden px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(#8f6237_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#704624] hover:text-[#2f2114]">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8f6237]/25 bg-[#fff7ea]/75 px-4 py-2 text-sm font-semibold text-[#704624] shadow-sm">
                <Gift className="h-4 w-4 text-[#6b7d3f]" />
                Modo regalo
              </div>
              <h1 className="mt-6 max-w-3xl font-serif text-5xl font-bold leading-[0.96] text-[#2f2114] md:text-7xl">
                Regalar una escapada como quien entrega una carta.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#66482d]">
                Preparas una dedicatoria, la casa revisa disponibilidad y precio contigo, y generamos un enlace privado
                para que la persona regalada abra su carta y siga la conversación cuando toque elegir fechas.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Heart, text: "Carta personalizada" },
                  { icon: Sparkles, text: "Enlace privado" },
                  { icon: MessageCircle, text: "Chat con la casa" },
                ].map((item) => (
                  <div key={item.text} className="rounded-[8px] bg-[#fff7ea]/78 p-4 text-sm font-semibold text-[#5d4228] shadow-sm">
                    <item.icon className="mb-3 h-5 w-5 text-[#704624]" />
                    {item.text}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative min-h-[520px]">
                <div className="absolute left-0 top-4 h-80 w-[62%] -rotate-5 rounded-[8px] bg-[#fffaf0] p-3 shadow-[0_24px_70px_rgba(73,43,19,.22)]">
                  <div className="relative h-full overflow-hidden rounded-[5px]">
                    <Image src="/images/emda-detalle-mesa.webp" alt="Mesa preparada en El Macaco del Abuelo" fill priority sizes="(min-width: 1024px) 360px, 80vw" className="object-cover sepia-[0.12]" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-0 h-80 w-[64%] rotate-3 rounded-[8px] bg-[#fffaf0] p-3 shadow-[0_30px_90px_rgba(73,43,19,.26)]">
                  <div className="relative h-full overflow-hidden rounded-[5px]">
                    <Image src="/images/emda-piscina-atardecer.webp" alt="Piscina al atardecer" fill priority sizes="(min-width: 1024px) 380px, 80vw" className="object-cover" />
                  </div>
                </div>
                <div className="absolute bottom-24 left-8 max-w-[250px] -rotate-2 rounded-[5px] bg-[#fff2bf] px-5 py-4 font-serif text-lg italic leading-7 text-[#604221] shadow-lg">
                  “Te regalo unos días para bajar el ritmo.”
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr]">
            <Reveal>
              <div className="rounded-[10px] border border-[#8f6237]/18 bg-[#fff7ea]/74 p-7 shadow-[0_22px_80px_rgba(73,43,19,.12)]">
                <h2 className="font-serif text-3xl font-bold text-[#2f2114]">Cómo funciona</h2>
                <div className="mt-6 space-y-5 text-[#66482d]">
                  <Step number="01" title="Preparas la carta" text="Dejas dedicatoria, contacto y una fecha orientativa si la tienes." />
                  <Step number="02" title="La casa lo revisa" text="Los propietarios responden por chat con disponibilidad, precio y siguiente paso." />
                  <Step number="03" title="Compartes el enlace" text="La persona regalada abre su carta privada y puede seguir la conversación." />
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <GiftRequestForm />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </>
  )
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-serif text-3xl font-bold text-[#704624]/35">{number}</span>
      <div>
        <p className="font-bold text-[#2f2114]">{title}</p>
        <p className="mt-1 text-sm leading-6">{text}</p>
      </div>
    </div>
  )
}
