import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bath, Bed, MapPin, Users } from "lucide-react"

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-screen items-center pt-16 md:pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/emda-piscina-atardecer.webp"
          alt="Piscina al atardecer en El Macaco del Abuelo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/58 to-background/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/20 px-4 py-2">
            <MapPin className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Las Monjas, Carmona, Sevilla</span>
          </div>

          <h1 className="mb-6 text-balance font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            El Macaco del Abuelo
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Una parcela familiar en Carmona, compartida con los dueños y convertida en refugio cercano:
            apartamento independiente, piscina, jacuzzi, jardín y una historia que viene del campo de Arahal.
          </p>

          <div className="mb-10 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-muted p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacidad</p>
                <p className="font-semibold text-foreground">Hasta 4 huéspedes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-muted p-2">
                <Bed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estancia</p>
                <p className="font-semibold text-foreground">Apartamento independiente</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-muted p-2">
                <Bath className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exterior</p>
                <p className="font-semibold text-foreground">Piscina y jacuzzi</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/reservar">
              <Button size="lg" className="bg-primary px-8 text-lg text-primary-foreground hover:bg-primary/90">
                Consultar disponibilidad
              </Button>
            </Link>
            <a href="#galeria">
              <Button size="lg" variant="outline" className="border-foreground/20 px-8 text-lg">
                Ver galería
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-foreground/30 p-2">
          <div className="h-2 w-1 rounded-full bg-foreground/50" />
        </div>
      </div>
    </section>
  )
}



