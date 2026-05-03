import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CalendarDays } from "lucide-react"

const chapters = [
  {
    eyebrow: "Capítulo 1",
    title: "Arahal",
    image: "/images/emda-detalle-mesa.webp",
    alt: "Detalle cuidado del refugio",
    text: [
      "El origen emocional de El Macaco del Abuelo está en Arahal, entre campo, olivar y días de aceituna.",
      "No nace como una marca turística. Nace de una memoria familiar que se ha mantenido viva con el paso del tiempo.",
    ],
  },
  {
    eyebrow: "Capítulo 2",
    title: "Antonio y Amparo",
    image: "/images/emda-rincon-jardin.webp",
    alt: "Zona exterior de la piscina",
    text: [
      "Amparo iba con Antonio, su padre, a recoger aceitunas.",
      "De ese gesto sencillo sale el nombre: El Macaco del Abuelo. Campo, familia y una forma muy andaluza de recordar.",
    ],
  },
  {
    eyebrow: "Capítulo 3",
    title: "Las Monjas",
    image: "/images/emda-entrada-apartamento.webp",
    alt: "Entrada del apartamento independiente",
    text: [
      "El refugio actual está en Las Monjas, Carmona, Sevilla.",
      "La parcela se comparte con los dueños, que viven en la casa principal durante la estancia. No salen salvo que los necesitéis o queráis algo.",
    ],
  },
  {
    eyebrow: "Capítulo 4",
    title: "Ahora",
    image: "/images/emda-piscina-atardecer.webp",
    alt: "Piscina del refugio al atardecer",
    text: [
      "Hoy es un apartamento independiente con piscina, jacuzzi, jardín y conversación directa con la casa.",
      "La idea no es parecer un hotel. Es ofrecer una estancia cuidada, cercana y con presencia humana real.",
    ],
  },
]

export default function HistoriaPage() {
  return (
    <main className="min-h-screen bg-[#211811] text-[#fff7ea]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#211811]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#f3d4ad] transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/#galeria" className="hidden text-sm font-medium text-[#d8c5ad] transition hover:text-white sm:inline">
              Galería
            </Link>
            <Link
              href="/reservar"
              className="inline-flex items-center gap-2 rounded-full bg-[#f3d4ad] px-4 py-2 text-sm font-semibold text-[#211811] transition hover:bg-white"
            >
              <CalendarDays className="h-4 w-4" />
              Pedir estancia
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-screen items-end overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <Image
          src="/images/emda-piscina-atardecer.webp"
          alt="El Macaco del Abuelo al atardecer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211811] via-[#211811]/60 to-[#211811]/25" />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#f3d4ad]">El Macaco del Abuelo</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-[0.95] md:text-7xl">
            Una historia contada como se entra en una casa: despacio.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#ead9c4]">
            Cuatro capítulos para separar el origen familiar de Arahal y el refugio actual en Carmona.
          </p>
        </div>
      </section>

      {chapters.map((chapter, index) => (
        <section
          key={chapter.title}
          id={`capitulo-${index + 1}`}
          className="relative grid min-h-screen items-center overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 md:grid-cols-2 lg:px-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(243,212,173,.12),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(122,77,42,.22),transparent_38%)]" />
          <div className={`relative mx-auto w-full max-w-xl ${index % 2 === 1 ? "md:order-2" : ""}`}>
            <div className="rounded-[10px] bg-[#fff7ea] p-3 shadow-[0_30px_90px_rgba(0,0,0,.35)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
                <Image src={chapter.image} alt={chapter.alt} fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover" />
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-12 max-w-xl md:mt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c9905b]">{chapter.eyebrow}</p>
            <h2 className="mt-4 font-serif text-5xl font-bold leading-none md:text-7xl">{chapter.title}</h2>
            <div className="mt-8 space-y-5 text-lg leading-8 text-[#ead9c4]">
              {chapter.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  )
}
