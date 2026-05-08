import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CalendarDays, MapPin, Sprout } from "lucide-react"

const chapters = [
  {
    eyebrow: "Capítulo 1",
    title: "Septiembre en Arahal",
    image: "/images/emda-detalle-mesa.webp",
    alt: "Detalle cuidado del refugio",
    note: "Cuando acaba el verano",
    text: [
      "La historia empieza en los días de cogida de aceituna, en septiembre, cuando el verano va acabando y el campo cambia de ritmo.",
      "El origen emocional de El Macaco del Abuelo está en Arahal, entre olivar, familia y memoria cotidiana.",
    ],
  },
  {
    eyebrow: "Capítulo 2",
    title: "Antonio y Amparo",
    image: "/images/emda-entrada-apartamento.webp",
    alt: "Entrada del apartamento independiente",
    note: "El viejo macaco",
    text: [
      "Amparo iba con Antonio, su padre, a coger aceitunas.",
      "Antonio usaba su viejo macaco para recogerlas. De ahí nace el nombre: una palabra de campo convertida en recuerdo familiar.",
    ],
  },
  {
    eyebrow: "Capítulo 3",
    title: "Urbanización Las Monjas",
    image: "/images/emda-piscina-jardin.webp",
    alt: "Piscina del refugio",
    note: "Carmona, Sevilla",
    text: [
      "El refugio actual está en Urbanización Las Monjas, Carmona, Sevilla.",
      "La parcela se comparte con los dueños, que viven en la casa principal. Es una convivencia cercana y tranquila: pueden entrar y salir con normalidad, y también están disponibles si necesitáis algo.",
    ],
  },
  {
    eyebrow: "Capítulo 4",
    title: "Ahora",
    image: "/images/emda-piscina-atardecer.webp",
    alt: "Piscina del refugio al atardecer",
    note: "Una casa con alma",
    text: [
      "Hoy es un apartamento independiente con piscina, jacuzzi, jardín y conversación directa con la casa.",
      "La idea no es parecer un hotel. Es ofrecer una estancia cuidada, cercana y con presencia humana real.",
    ],
  },
]

export default function HistoriaPage() {
  return (
    <main className="min-h-screen bg-[#f2e2c7] text-[#352414]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.32] [background-image:radial-gradient(#8f6237_0.6px,transparent_0.6px)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_15%_10%,rgba(143,91,48,.22),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(88,112,63,.18),transparent_30%),linear-gradient(90deg,rgba(112,70,35,.08)_1px,transparent_1px)] [background-size:auto,auto,84px_84px]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#7a4d2b]/15 bg-[#f4e7d1]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#704624] transition hover:text-[#2a1a0d]">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/#galeria" className="hidden text-sm font-medium text-[#6d5439] transition hover:text-[#2a1a0d] sm:inline">
              Galería
            </Link>
            <Link
              href="/reservar"
              className="inline-flex items-center gap-2 rounded-full bg-[#704624] px-4 py-2 text-sm font-semibold text-[#fff7ea] shadow-sm transition hover:bg-[#3b2717]"
            >
              <CalendarDays className="h-4 w-4" />
              Pedir estancia
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 md:grid-cols-[1fr_0.86fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8f6237]/25 bg-[#fff5e6]/70 px-4 py-2 text-sm font-semibold text-[#6f4d2f] shadow-sm">
            <Sprout className="h-4 w-4 text-[#6b7d3f]" />
            Una memoria familiar, no una plantilla
          </div>
          <h1 className="mt-7 max-w-4xl font-serif text-5xl font-bold leading-[0.96] text-[#2f2114] md:text-7xl">
            La historia se lee como un cuaderno abierto.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6a4a2d]">
            Arahal, Antonio y Amparo, Urbanización Las Monjas y el refugio de hoy unidos en una sola pieza.
            Cada capítulo tiene su lugar, pero todo respira como la misma casa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-[#5d4228]">
            <span className="rounded-full bg-[#fff7ea]/80 px-4 py-2 shadow-sm">Arahal como origen</span>
            <span className="rounded-full bg-[#fff7ea]/80 px-4 py-2 shadow-sm">Carmona como refugio</span>
            <span className="rounded-full bg-[#fff7ea]/80 px-4 py-2 shadow-sm">Dueños cerca si hace falta</span>
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <div className="absolute left-0 top-8 h-72 w-56 -rotate-6 rounded-[7px] bg-[#fffaf0] p-3 shadow-[0_24px_70px_rgba(73,43,19,.24)]">
            <div className="relative h-full overflow-hidden rounded-[5px]">
              <Image src="/images/emda-detalle-mesa.webp" alt="Detalle del refugio" fill priority sizes="280px" className="object-cover sepia-[0.16]" />
            </div>
          </div>
          <div className="absolute right-0 top-24 h-80 w-64 rotate-3 rounded-[7px] bg-[#fffaf0] p-3 shadow-[0_28px_80px_rgba(73,43,19,.28)]">
            <div className="relative h-full overflow-hidden rounded-[5px]">
              <Image src="/images/emda-piscina-atardecer.webp" alt="Piscina del refugio al atardecer" fill priority sizes="320px" className="object-cover" />
            </div>
          </div>
          <div className="absolute bottom-8 left-14 max-w-[230px] -rotate-2 rounded-[5px] bg-[#fff2bf] px-5 py-4 font-serif text-lg italic leading-7 text-[#604221] shadow-lg">
            “No se trata de vender una estancia. Se trata de cuidar una llegada.”
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#8f6237]/45 to-transparent md:block" />

        <div className="space-y-14 md:space-y-20">
          {chapters.map((chapter, index) => (
            <article
              key={chapter.title}
              className={`relative grid items-center gap-8 md:grid-cols-2 ${index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="absolute left-1/2 top-1/2 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#f2e2c7] bg-[#8f6237] shadow-[0_0_0_8px_rgba(255,247,234,.72)] md:block" />

              <div className="relative mx-auto w-full max-w-lg">
                <div className={`rounded-[8px] bg-[#fffaf0] p-3 shadow-[0_24px_70px_rgba(73,43,19,.22)] ${index % 2 === 0 ? "-rotate-2" : "rotate-2"}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[5px]">
                    <Image src={chapter.image} alt={chapter.alt} fill sizes="(min-width: 768px) 40vw, 92vw" className="object-cover" />
                  </div>
                  <p className="mt-3 font-serif text-lg italic text-[#704624]">{chapter.note}</p>
                </div>
                <div className="absolute -bottom-5 -right-3 rounded-full bg-[#6b7d3f] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#fff7ea] shadow-lg">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="relative mx-auto max-w-xl">
                <div className="rounded-[8px] border border-[#8f6237]/16 bg-[#fff7ea]/78 p-6 shadow-[0_20px_60px_rgba(73,43,19,.14)] backdrop-blur-sm md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9a6130]">{chapter.eyebrow}</p>
                  <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#2f2114] md:text-6xl">{chapter.title}</h2>
                  <div className="mt-6 space-y-4 text-lg leading-8 text-[#66482d]">
                    {chapter.text.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl rounded-[10px] border border-[#8f6237]/18 bg-[#fff7ea]/82 p-8 text-center shadow-[0_22px_80px_rgba(73,43,19,.16)]">
          <MapPin className="mx-auto h-6 w-6 text-[#6b7d3f]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#2f2114] md:text-4xl">De Arahal a Carmona, sin perder la raíz.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#66482d]">
            El origen está en Arahal. El descanso, hoy, está en Urbanización Las Monjas, Carmona, Sevilla.
          </p>
        </div>
      </section>
    </main>
  )
}
