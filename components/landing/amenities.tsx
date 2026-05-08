import Link from "next/link"
import { Waves, TreePine, Flame, Wifi, Wind, UtensilsCrossed, Car, Sun, Shirt, Coffee } from "lucide-react"

const amenities = [
  { icon: Waves, title: "Piscina", description: "Agua tranquila para pasar el día fuera sin compartir la estancia con otras reservas." },
  { icon: TreePine, title: "Jardín y olivos", description: "Sombra, tierra y silencio alrededor del apartamento independiente." },
  { icon: Flame, title: "Jacuzzi", description: "Un rincón pensado para bajar el ritmo al final del día." },
  { icon: Wifi, title: "WiFi", description: "Conexión estable para seguir conectados solo si hace falta." },
  { icon: Wind, title: "Aire acondicionado", description: "Confort interior para los meses de más calor en Carmona." },
  { icon: UtensilsCrossed, title: "Cocina resuelta", description: "Frigorífico, microondas y lo necesario para organizar la estancia." },
  { icon: Sun, title: "Zona exterior", description: "Espacio para alargar la tarde y vivir la parcela con calma." },
  { icon: Car, title: "Llegada cómoda", description: "Acceso sencillo y ubicación clara en Urbanización Las Monjas, Carmona." },
  { icon: Shirt, title: "Base preparada", description: "Ropa de cama, baño completo y una llegada lista para quedarse." },
]

export function Amenities() {
  return (
    <section id="comodidades" className="relative overflow-hidden bg-[#f2e2c7] py-20 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(112,70,35,.08)_1px,transparent_1px)] [background-size:84px_84px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#704624]">El refugio</span>
          <h2 className="mt-4 text-balance font-serif text-4xl font-bold text-[#2f2114] md:text-5xl lg:text-6xl">
            Lo importante está resuelto sin convertirlo en hotel.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#66482d]">
            Piscina, jacuzzi, jardín, descanso y propietarios cerca si necesitáis algo. Todo pensado para que la estancia sea cómoda y humana.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity, index) => (
            <div
              key={amenity.title}
              className={`group rounded-[8px] border border-[#8f6237]/16 bg-[#fff7ea]/82 p-6 shadow-[0_14px_45px_rgba(73,43,19,.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(73,43,19,.16)] ${
                index % 3 === 1 ? "lg:translate-y-5" : ""
              }`}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#704624]/10 text-[#704624] transition group-hover:bg-[#704624] group-hover:text-[#fff7ea]">
                <amenity.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2f2114]">{amenity.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#66482d]">{amenity.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-4xl rounded-[10px] border border-[#8f6237]/18 bg-[#fff7ea]/86 p-6 shadow-[0_22px_80px_rgba(73,43,19,.14)] md:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#6b7d3f]/12 p-3 text-[#6b7d3f]">
                <Coffee className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2f2114]">Antes de pedir estancia, podéis preguntar sin compromiso.</h3>
                <p className="mt-2 text-sm leading-6 text-[#66482d]">
                  Abrid conversación por la web y os respondemos sobre disponibilidad, normas, contrato o cualquier detalle.
                </p>
              </div>
            </div>
            <Link href="/contactar" className="rounded-full bg-[#704624] px-5 py-3 text-sm font-semibold text-[#fff7ea] shadow-sm transition hover:bg-[#3b2717]">
              Hablar por chat
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
