"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, CalendarDays, ShieldCheck } from "lucide-react"

export function Contact() {
  return (
    <section id="contacto" className="bg-primary/5 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-secondary">
              Contacto real
            </span>
            <h2 className="mt-4 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Todo queda dentro de la web
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Si queréis preguntar algo o abrir una solicitud, hacedlo por aquí. El mensaje entra en la
              bandeja real de los propietarios y os responderán en el mismo hilo, sin llamadas ni respuestas
              inventadas.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <MessageCircle className="mb-3 h-5 w-5 text-primary" />
                <p className="font-medium text-foreground">Chat web</p>
                <p className="mt-1 text-sm text-muted-foreground">Conversación persistente con propietarios.</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <CalendarDays className="mb-3 h-5 w-5 text-primary" />
                <p className="font-medium text-foreground">Reserva conectada</p>
                <p className="mt-1 text-sm text-muted-foreground">Tus fechas y mensajes quedan en el mismo hilo.</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
                <p className="font-medium text-foreground">Seguimiento claro</p>
                <p className="mt-1 text-sm text-muted-foreground">Sin perder lo hablado al volver más tarde.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-primary">Abrir conversación</p>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">Cuéntanos qué necesitas</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Puedes escribir para preguntar por fechas, normas, piscina, jacuzzi o pedir estancia. Lo revisamos
              con calma y seguimos por aquí.
            </p>
            <div className="mt-8 space-y-3">
              <Link href="/contactar" className="block">
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Ir al chat web
                </Button>
              </Link>
              <Link href="/reservar" className="block">
                <Button size="lg" variant="outline" className="w-full">
                  Ver disponibilidad
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Si ya hablasteis con nosotros antes, al volver os llevaremos al mismo hilo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
