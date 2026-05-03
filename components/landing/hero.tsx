"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ConvinceMode } from "@/components/landing/convince-mode"
import { Bath, Bed, Gift, MapPin, Sun, Users } from "lucide-react"

const atmospheres = {
  dawn: {
    image: "/images/emda-entrada-apartamento.webp",
    label: "Amanecer en Las Monjas",
    line: "Luz fría, parcela en calma y ese primer silencio antes de que Carmona despierte.",
    overlay: "from-[#dce9ee]/90 via-[#f3e2c8]/55 to-[#5b3b26]/10",
    text: "text-[#2f2a22]",
    muted: "text-[#5b5146]",
    glow: "bg-sky-100/45",
  },
  noon: {
    image: "/images/emda-piscina-jardin.webp",
    label: "Luz mediterránea",
    line: "A esta hora todo es agua, sombra, piel caliente y ganas de bajar el ritmo.",
    overlay: "from-[#fff4d8]/92 via-[#f6d89a]/48 to-[#9d5d2d]/5",
    text: "text-[#302318]",
    muted: "text-[#6f4b2d]",
    glow: "bg-amber-100/45",
  },
  dusk: {
    image: "/images/emda-piscina-atardecer.webp",
    label: "Tarde de piscina",
    line: "La hora buena: la luz se vuelve dorada y la parcela empieza a pedir conversación larga.",
    overlay: "from-background/92 via-background/58 to-background/10",
    text: "text-foreground",
    muted: "text-muted-foreground",
    glow: "bg-secondary/20",
  },
  night: {
    image: "/images/emda-piscina-atardecer.webp",
    label: "Noche cálida",
    line: "La web baja la voz: luces encendidas, jardín quieto y la sensación de estar ya allí.",
    overlay: "from-[#16110d]/95 via-[#2b1b12]/70 to-[#7a431f]/20",
    text: "text-white",
    muted: "text-white/78",
    glow: "bg-orange-300/20",
  },
}

type AtmosphereKey = keyof typeof atmospheres

function getAtmosphere(hour: number): AtmosphereKey {
  if (hour >= 6 && hour < 10) return "dawn"
  if (hour >= 10 && hour < 17) return "noon"
  if (hour >= 17 && hour < 21) return "dusk"
  return "night"
}

export function Hero() {
  const [atmosphereKey, setAtmosphereKey] = useState<AtmosphereKey>("dusk")

  useEffect(() => {
    const update = () => setAtmosphereKey(getAtmosphere(new Date().getHours()))
    update()
    const interval = window.setInterval(update, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const atmosphere = atmospheres[atmosphereKey]

  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 z-0">
        <Image src={atmosphere.image} alt={atmosphere.label} fill className="object-cover transition-opacity duration-700" priority />
        <div className={`absolute inset-0 bg-gradient-to-r ${atmosphere.overlay}`} />
        <div className={`absolute left-[-8rem] top-24 h-72 w-72 rounded-full blur-3xl ${atmosphere.glow}`} />
        {atmosphereKey === "dawn" ? <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/18 blur-2xl" /> : null}
        {atmosphereKey === "night" ? <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_46%,rgba(255,191,122,.25),transparent_28%)]" /> : null}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
        <div className={`max-w-2xl ${atmosphere.text}`}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-current/20 bg-white/18 px-4 py-2 backdrop-blur">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Las Monjas, Carmona, Sevilla</span>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-current/15 bg-white/12 px-4 py-2 backdrop-blur">
            <Sun className="h-4 w-4" />
            <span className="text-sm font-medium">{atmosphere.label}</span>
          </div>

          <h1 className="mb-6 text-balance font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            El Macaco del Abuelo
          </h1>

          <p className={`mb-5 max-w-xl text-lg leading-relaxed md:text-xl ${atmosphere.muted}`}>
            Una parcela familiar en Carmona, compartida con los dueños y convertida en refugio cercano:
            apartamento independiente, piscina, jacuzzi, jardín y una historia que viene del campo de Arahal.
          </p>
          <p className="mb-8 max-w-xl font-serif text-xl italic leading-relaxed">{atmosphere.line}</p>

          <div className="mb-10 flex flex-wrap gap-6">
            <HeroFact icon={Users} label="Capacidad" value="Hasta 4 huéspedes" mutedClass={atmosphere.muted} />
            <HeroFact icon={Bed} label="Estancia" value="Apartamento independiente" mutedClass={atmosphere.muted} />
            <HeroFact icon={Bath} label="Exterior" value="Piscina y jacuzzi" mutedClass={atmosphere.muted} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/reservar">
              <Button size="lg" className="bg-primary px-8 text-lg text-primary-foreground hover:bg-primary/90">
                Consultar disponibilidad
              </Button>
            </Link>
            <a href="#galeria">
              <Button size="lg" variant="outline" className="border-current/20 bg-white/10 px-8 text-lg backdrop-blur hover:bg-white/20">
                Ver galería
              </Button>
            </a>
            <Link href="/regalo">
              <Button size="lg" variant="outline" className="border-current/20 bg-white/10 px-8 text-lg backdrop-blur hover:bg-white/20">
                <Gift className="h-5 w-5" />
                Modo regalo
              </Button>
            </Link>
          </div>

          <ConvinceMode />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-current/30 p-2">
          <div className="h-2 w-1 rounded-full bg-current/50" />
        </div>
      </div>
    </section>
  )
}

function HeroFact({
  icon: Icon,
  label,
  value,
  mutedClass,
}: {
  icon: typeof Users
  label: string
  value: string
  mutedClass: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-white/20 p-2 backdrop-blur">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className={`text-sm ${mutedClass}`}>{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  )
}
