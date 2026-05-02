import Image from "next/image"

export function About() {
  return (
    <section id="propiedad" className="bg-card py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <Image src="/images/emda-salon-dormitorio.png" alt="Salón dormitorio del apartamento independiente" fill className="object-cover" />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image src="/images/emda-piscina-jacuzzi.png" alt="Piscina privada con jacuzzi" fill className="object-cover" />
              </div>
            </div>
            <div className="pt-8">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image src="/images/emda-entrada-apartamento.png" alt="Entrada del apartamento bajo la pérgola" fill className="object-cover" />
              </div>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-secondary">Nuestra historia</span>
            <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              De Arahal a Las Monjas, con una memoria de campo.
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                El nombre El Macaco del Abuelo nace de una memoria familiar concreta: Amparo iba con Antonio,
                su padre, a recoger aceitunas en Arahal. Campo, olivar, familia y trabajo quedaron unidos a ese recuerdo.
              </p>
              <p>
                El alojamiento no está en Arahal. Está en Las Monjas, parcela 121, Carmona, Sevilla: una parcela
                privada convertida en refugio con apartamento independiente, piscina privada, jacuzzi, jardín y
                espacio exterior para descansar sin ruido.
              </p>
              <p>
                Durante vuestra estancia, los dueños estarán en la casa principal de la parcela. La idea es que
                tengáis privacidad: no saldrán ni intervendrán salvo que lo necesitéis, pidáis ayuda o queráis
                cualquier detalle para estar más a gusto.
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <p className="font-serif text-xl italic text-foreground">&ldquo;Un refugio familiar en Carmona, con raíz en Arahal.&rdquo;</p>
              <p className="mt-2 text-sm text-muted-foreground">La familia del Macaco</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
