import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Home, Trees } from "lucide-react"

export function About() {
  return (
    <section id="propiedad" className="relative overflow-hidden bg-[#fff7ea] py-20 md:py-32">
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#8f6237_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8f6237]/20 bg-[#f2e2c7]/70 px-4 py-2 text-sm font-semibold text-[#704624]">
              <Trees className="h-4 w-4 text-[#6b7d3f]" />
              La casa y la parcela
            </div>
            <h2 className="mt-5 text-balance font-serif text-4xl font-bold leading-tight text-[#2f2114] md:text-5xl lg:text-6xl">
              Un refugio familiar en Carmona, con raíz en Arahal.
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-[#66482d]">
              <p>
                El nombre El Macaco del Abuelo nace de una memoria concreta: Amparo iba con Antonio,
                su padre, a recoger aceitunas en Arahal. Campo, olivar, familia y trabajo quedaron unidos a ese recuerdo.
              </p>
              <p>
                El alojamiento está en Urbanización Las Monjas, Carmona, Sevilla. Es una parcela familiar compartida
                con los dueños, con apartamento independiente, piscina, jacuzzi, jardín y espacio exterior para bajar el ritmo.
              </p>
              <p>
                Durante vuestra estancia, los dueños viven en la casa principal. Es una convivencia tranquila: pueden entrar
                y salir con normalidad, y están cerca si necesitáis algo o queréis consultar cualquier detalle.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#f2e2c7] px-4 py-2 text-sm font-semibold text-[#5d4228]">Apartamento independiente</span>
              <span className="rounded-full bg-[#f2e2c7] px-4 py-2 text-sm font-semibold text-[#5d4228]">Piscina y jacuzzi</span>
              <span className="rounded-full bg-[#f2e2c7] px-4 py-2 text-sm font-semibold text-[#5d4228]">Dueños cerca si hace falta</span>
            </div>

            <Link href="/historia" className="mt-9 inline-flex items-center gap-2 font-semibold text-[#704624] transition hover:text-[#2f2114]">
              Leer la historia completa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-[520px]">
            <div className="absolute left-0 top-0 h-72 w-[58%] -rotate-3 rounded-[8px] bg-[#fffaf0] p-3 shadow-lg">
              <div className="relative h-full overflow-hidden rounded-[5px]">
                <Image src="/images/emda-salon-dormitorio.webp" alt="Salón dormitorio del apartamento independiente" fill sizes="(min-width: 1024px) 340px, 70vw" className="object-cover" />
              </div>
            </div>
            <div className="absolute right-0 top-24 h-80 w-[58%] rotate-3 rounded-[8px] bg-[#fffaf0] p-3 shadow-lg">
              <div className="relative h-full overflow-hidden rounded-[5px]">
                <Image src="/images/emda-piscina-jacuzzi.webp" alt="Piscina con jacuzzi" fill sizes="(min-width: 1024px) 360px, 70vw" className="object-cover" />
              </div>
            </div>
            <div className="absolute bottom-0 left-14 h-64 w-[55%] -rotate-1 rounded-[8px] bg-[#fffaf0] p-3 shadow-lg">
              <div className="relative h-full overflow-hidden rounded-[5px]">
                <Image src="/images/emda-entrada-apartamento.webp" alt="Entrada del apartamento bajo la pérgola" fill sizes="(min-width: 1024px) 320px, 70vw" className="object-cover" />
              </div>
            </div>
            <div className="absolute bottom-12 right-3 max-w-[220px] rounded-[5px] bg-[#fff2bf] px-5 py-4 font-serif text-base italic leading-6 text-[#604221] shadow-lg">
              Una casa preparada con calma, no un alojamiento de catálogo.
            </div>
            <div className="absolute left-4 top-80 hidden items-center gap-2 rounded-full bg-[#6b7d3f] px-4 py-2 text-sm font-bold text-[#fff7ea] shadow-lg sm:flex">
              <Home className="h-4 w-4" />
              Urbanización Las Monjas
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
