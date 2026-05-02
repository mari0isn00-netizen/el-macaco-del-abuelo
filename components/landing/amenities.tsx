import Link from "next/link"
import { Waves, TreePine, Flame, Wifi, Wind, UtensilsCrossed, Car, Sun, Shirt, Coffee } from "lucide-react"

const amenities = [
  {
    icon: Waves,
    title: "Piscina y agua",
    description: "Agua tranquila para ir despacio, dentro de una estancia cuidada y sin otras reservas en paralelo.",
  },
  {
    icon: TreePine,
    title: "Jardín con olivos",
    description: "Sombra, tierra y silencio alrededor del apartamento independiente.",
  },
  {
    icon: Flame,
    title: "Jacuzzi y descanso",
    description: "Un rincón pensado para bajar el ritmo al final del día.",
  },
  {
    icon: Wifi,
    title: "WiFi",
    description: "Conexión estable para seguir conectados solo si hace falta.",
  },
  {
    icon: Wind,
    title: "Aire acondicionado",
    description: "Confort interior en verano, con ventilación y calma.",
  },
  {
    icon: Flame,
    title: "Cocina resuelta",
    description: "Frigorífico, microondas y lo necesario para organizar la estancia.",
  },
  {
    icon: UtensilsCrossed,
    title: "Zona chill out",
    description: "Salida exterior para alargar la tarde junto al jardín.",
  },
  {
    icon: Car,
    title: "Acceso cómodo",
    description: "La llegada y la salida están pensadas para ser sencillas.",
  },
  {
    icon: Sun,
    title: "Parcela familiar",
    description: "Los dueños viven en la casa principal y están cerca si necesitáis algo.",
  },
  {
    icon: Shirt,
    title: "Estancia preparada",
    description: "Ropa de cama, baño completo y base lista para llegar y quedarse.",
  },
]

export function Amenities() {
  return (
    <section id="comodidades" className="bg-background py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-secondary">El refugio</span>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Lo importante está resuelto
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            El apartamento está pensado para estar a gusto dentro y fuera, con una estancia clara y sin ruido.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {amenities.map((amenity, index) => (
            <div key={index} className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <amenity.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{amenity.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{amenity.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-secondary/20 bg-secondary/10 p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <Coffee className="h-8 w-8 text-secondary" />
              <div>
                <h3 className="font-semibold text-foreground">Si queréis preguntar algo antes</h3>
                <p className="text-sm text-muted-foreground">
                  Abrid conversación por web y os respondemos con disponibilidad, normas o detalles de la estancia.
                </p>
              </div>
            </div>
            <Link href="/contactar" className="whitespace-nowrap font-medium text-secondary transition-colors hover:text-secondary/80">
              Hablar por chat
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
