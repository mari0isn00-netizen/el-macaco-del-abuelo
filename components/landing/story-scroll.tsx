import Image from "next/image"

const memories = [
  {
    title: "Arahal",
    text: "El origen no está en un anuncio turístico. Está en Arahal, en el campo, en los días de aceituna y en una memoria familiar que siguió pasando de boca en boca.",
    image: "/images/emda-detalle-mesa.webp",
    caption: "Una historia que empieza antes que la casa",
    rotate: "-rotate-2",
  },
  {
    title: "Antonio y Amparo",
    text: "Amparo iba con Antonio, su padre, a recoger aceitunas. De ese gesto sencillo sale el nombre: El Macaco del Abuelo.",
    image: "/images/emda-rincon-jardin.webp",
    caption: "Campo, familia y olivar",
    rotate: "rotate-2",
  },
  {
    title: "Las Monjas",
    text: "El refugio actual está en Carmona, en Las Monjas. No copia aquella historia: la trae al presente, con una parcela familiar compartida con los dueños.",
    image: "/images/emda-entrada-apartamento.webp",
    caption: "La parcela donde ahora se descansa",
    rotate: "-rotate-1",
  },
  {
    title: "Ahora",
    text: "Apartamento independiente, piscina, jacuzzi, jardín y una conversación directa con la casa. No se trata de parecer un hotel: se trata de cuidar una estancia con alma.",
    image: "/images/emda-piscina-atardecer.webp",
    caption: "Un refugio con presencia cercana",
    rotate: "rotate-1",
  },
]

export function StoryScroll() {
  return (
    <section className="relative overflow-hidden bg-[#2b2119] py-24 text-[#f8efe2] md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,229,181,.14),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(172,107,58,.2),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d6a66c]">Caja de recuerdos</p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">La historia no se inventa. Se abre.</h2>
          <p className="mt-6 text-lg leading-8 text-[#decfbd]">
            Antes de reservar, merece la pena entender el nombre. No viene de una plantilla, ni de una estrategia:
            viene de una familia, de Arahal y de una forma muy concreta de recordar el campo.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {memories.map((memory, index) => (
            <article
              key={memory.title}
              className={`grid items-center gap-8 md:grid-cols-2 ${index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
            >
              <div className={`relative mx-auto w-full max-w-lg ${memory.rotate}`}>
                <div className="absolute -inset-3 rounded-xl bg-[#f4dec0] shadow-2xl" />
                <div className="relative rounded-lg bg-[#fff7ea] p-3 text-[#2f241d] shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                    <Image src={memory.image} alt={memory.caption} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover sepia-[0.18]" />
                  </div>
                  <p className="mt-3 font-serif text-lg italic">{memory.caption}</p>
                </div>
              </div>

              <div className="max-w-xl">
                <span className="font-serif text-7xl leading-none text-[#d6a66c]/35">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-serif text-4xl font-bold text-[#fff7ea]">{memory.title}</h3>
                <p className="mt-5 text-lg leading-8 text-[#decfbd]">{memory.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
