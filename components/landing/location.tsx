import Link from "next/link"
import { Car, Clock, ExternalLink, MapPin, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"

const mapsUrl = "https://maps.app.goo.gl/4mM3XHJwqo9bBHNC9"

const nearbyPlaces = [
  { name: "Carmona centro", distance: "10 min", icon: Car },
  { name: "Sevilla centro", distance: "35 min", icon: Car },
  { name: "Aeropuerto de Sevilla", distance: "40 min", icon: Plane },
  { name: "Arahal", distance: "25 min", icon: Car },
]

export function Location() {
  return (
    <section id="ubicacion" className="bg-background py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-secondary">Ubicación</span>
            <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              En Las Monjas, Carmona
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              El alojamiento está en Las Monjas, parcela 121, Carmona, Sevilla. El origen emocional
              del nombre viene de Arahal, pero la estancia se vive aquí: una parcela familiar compartida con los dueños,
              tranquila y bien comunicada.
            </p>

            <div className="mt-8 flex items-start gap-4 rounded-lg bg-muted p-4">
              <MapPin className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Las Monjas, parcela 121</p>
                <p className="text-muted-foreground">Carmona, Sevilla, Andalucía</p>
                <Button asChild className="mt-4" size="sm">
                  <Link href={mapsUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Abrir en Google Maps
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-semibold text-foreground">Distancias</h3>
              <div className="grid grid-cols-2 gap-4">
                {nearbyPlaces.map((place) => (
                  <div key={place.name} className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <place.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{place.name}</p>
                      <p className="text-xs text-muted-foreground">{place.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-secondary/20 bg-secondary/10 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium text-foreground">Entrada y salida</p>
                  <p className="text-sm text-muted-foreground">Se acuerdan por el chat web de la reserva.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted lg:aspect-[4/3]">
            <Link
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 z-10"
              aria-label="Abrir ubicación en Google Maps"
            />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12694.891234567!2d-5.6378!3d37.4711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd11d5b0c5f0e7d1%3A0x1234567890abcdef!2sCarmona%2C%20Sevilla!5e0!3m2!1ses!2ses!4v1699999999999!5m2!1ses!2ses"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de El Macaco del Abuelo"
            />
            <div className="absolute left-4 top-4 rounded-lg bg-card/95 px-4 py-2 shadow-lg backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground">El Macaco del Abuelo</p>
              <p className="text-xs text-muted-foreground">Las Monjas, Carmona</p>
            </div>
            <div className="absolute bottom-4 right-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg">
              Abrir ruta
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
