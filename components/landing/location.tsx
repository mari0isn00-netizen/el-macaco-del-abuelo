import Link from "next/link"
import { Car, Clock, ExternalLink, MapPin, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"

const nearbyPlaces = [
  { name: "Carmona centro", distance: "12 min aprox.", icon: Car },
  { name: "Sevilla centro", distance: "35-40 min aprox.", icon: Car },
  { name: "Aeropuerto de Sevilla", distance: "25-30 min aprox.", icon: Plane },
  { name: "Arahal", distance: "20-25 min aprox.", icon: Car },
]

export function Location() {
  return (
    <section id="ubicacion" className="relative overflow-hidden bg-[#fff7ea] py-20 md:py-32">
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#8f6237_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#704624]">Ubicación</span>
            <h2 className="mt-4 text-balance font-serif text-4xl font-bold leading-tight text-[#2f2114] md:text-5xl lg:text-6xl">
              En Urbanización Las Monjas, Carmona.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#66482d]">
              El alojamiento está en Urbanización Las Monjas, Carmona, Sevilla. El origen emocional
              del nombre viene de Arahal, pero la estancia se vive aquí: una parcela familiar compartida con los dueños,
              tranquila y bien comunicada.
            </p>

            <div className="mt-8 rounded-[8px] border border-[#8f6237]/16 bg-[#f2e2c7]/82 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-[#704624]" />
                <div>
                  <p className="font-serif text-xl font-bold text-[#2f2114]">Urbanización Las Monjas</p>
                  <p className="text-[#66482d]">Carmona, Sevilla, Andalucía</p>
                  <Button asChild className="mt-4 rounded-full bg-[#704624] text-[#fff7ea] hover:bg-[#3b2717]" size="sm">
                    <Link href="/contactar">
                      <ExternalLink className="h-4 w-4" />
                      Pedir indicaciones exactas
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {nearbyPlaces.map((place) => (
                <div key={place.name} className="rounded-[8px] bg-[#f2e2c7]/75 p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#704624]/10 text-[#704624]">
                    <place.icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-bold text-[#2f2114]">{place.name}</p>
                  <p className="text-sm text-[#66482d]">{place.distance}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[8px] border border-[#6b7d3f]/20 bg-[#6b7d3f]/10 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#6b7d3f]" />
                <div>
                  <p className="font-bold text-[#2f2114]">Entrada y salida</p>
                  <p className="text-sm text-[#66482d]">Se acuerdan por el chat web de la reserva.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[10px] bg-[#f2e2c7]" />
            <div className="relative aspect-square overflow-hidden rounded-[10px] border-[10px] border-[#fffaf0] bg-[#f2e2c7] shadow-[0_28px_90px_rgba(73,43,19,.18)] lg:aspect-[4/3]">
              <Link href="/contactar" className="absolute inset-0 z-10" aria-label="Pedir indicaciones exactas" />
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
              <div className="absolute left-4 top-4 rounded-[7px] bg-[#fff7ea]/95 px-4 py-2 shadow-lg backdrop-blur-sm">
                <p className="text-sm font-bold text-[#2f2114]">El Macaco del Abuelo</p>
                <p className="text-xs text-[#66482d]">Urbanización Las Monjas, Carmona</p>
              </div>
              <div className="absolute bottom-4 right-4 rounded-full bg-[#704624] px-4 py-2 text-sm font-semibold text-[#fff7ea] shadow-lg">
                Ruta por privado
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
