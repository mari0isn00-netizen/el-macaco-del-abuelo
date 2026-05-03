import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function StoryTeaser() {
  return (
    <section id="historia" className="relative overflow-hidden bg-[#f7efe3] py-20 text-[#2f241d] md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9d6b42]/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="relative min-h-[360px]">
          <div className="absolute left-3 top-4 h-64 w-48 -rotate-6 overflow-hidden rounded-[6px] bg-white p-2 shadow-2xl md:h-80 md:w-60">
            <div className="relative h-full w-full overflow-hidden rounded-[4px]">
              <Image
                src="/images/emda-detalle-mesa.webp"
                alt="Detalle del refugio El Macaco del Abuelo"
                fill
                sizes="(min-width: 768px) 280px, 55vw"
                className="object-cover sepia-[0.18]"
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-4 h-64 w-52 rotate-3 overflow-hidden rounded-[6px] bg-white p-2 shadow-2xl md:h-80 md:w-64">
            <div className="relative h-full w-full overflow-hidden rounded-[4px]">
              <Image
                src="/images/emda-piscina-atardecer.webp"
                alt="Piscina del refugio en Carmona"
                fill
                sizes="(min-width: 768px) 300px, 60vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8f5e37]">La historia</p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">
            Esto no cabe bien en una sección cualquiera.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#69523e]">
            El nombre nace en Arahal, con Amparo y Antonio, su padre, y continúa hoy en Las Monjas,
            Carmona. Por eso la historia tiene su propio sitio: contada por capítulos, sin parecer una
            plantilla de hotel.
          </p>
          <Link
            href="/historia"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2f241d] px-6 py-3 text-sm font-semibold text-[#fff7ea] transition hover:bg-[#5d3c27]"
          >
            Abrir la historia
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
