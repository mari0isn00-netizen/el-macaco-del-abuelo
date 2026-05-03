import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function StoryTeaser() {
  return (
    <section id="historia" className="relative overflow-hidden bg-[#f2e2c7] py-20 text-[#2f241d] md:py-28">
      <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(#8f6237_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9d6b42]/35 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative min-h-[390px]">
          <div className="absolute left-2 top-4 h-64 w-48 -rotate-6 rounded-[7px] bg-[#fffaf0] p-2 shadow-[0_24px_70px_rgba(73,43,19,.22)] md:h-80 md:w-60">
            <div className="relative h-full w-full overflow-hidden rounded-[5px]">
              <Image
                src="/images/emda-detalle-mesa.webp"
                alt="Detalle del refugio El Macaco del Abuelo"
                fill
                sizes="(min-width: 768px) 280px, 55vw"
                className="object-cover sepia-[0.18]"
              />
            </div>
          </div>
          <div className="absolute bottom-4 right-3 h-64 w-52 rotate-3 rounded-[7px] bg-[#fffaf0] p-2 shadow-[0_28px_80px_rgba(73,43,19,.26)] md:h-80 md:w-64">
            <div className="relative h-full w-full overflow-hidden rounded-[5px]">
              <Image
                src="/images/emda-piscina-atardecer.webp"
                alt="Piscina del refugio en Carmona"
                fill
                sizes="(min-width: 768px) 300px, 60vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-10 max-w-[220px] -rotate-2 rounded-[5px] bg-[#fff2bf] px-4 py-3 font-serif text-base italic leading-6 text-[#604221] shadow-lg">
            Arahal como raíz. Carmona como refugio.
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8f6237]/25 bg-[#fff7ea]/75 px-4 py-2 text-sm font-semibold text-[#704624] shadow-sm">
            <Sparkles className="h-4 w-4 text-[#6b7d3f]" />
            La historia de la casa
          </div>
          <h2 className="mt-5 font-serif text-4xl font-bold leading-tight md:text-6xl">
            Mejor como un cuaderno abierto que como una sección más.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#69523e]">
            El nombre nace en Arahal, con Amparo y Antonio, su padre, y continúa hoy en Las Monjas,
            Carmona. Ahora la historia tiene una página propia, más cálida, más artesanal y con los
            capítulos unidos como recuerdos de la misma familia.
          </p>
          <Link
            href="/historia"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#704624] px-6 py-3 text-sm font-semibold text-[#fff7ea] shadow-sm transition hover:bg-[#3b2717]"
          >
            Abrir la historia
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
