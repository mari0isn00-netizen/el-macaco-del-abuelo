"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, MessageCircle, ShieldCheck } from "lucide-react"

export function Contact() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-[#2f2114] py-20 text-[#fff7ea] md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(243,212,173,.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(107,125,63,.18),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f3d4ad]">Contacto real</span>
            <h2 className="mt-4 text-balance font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
              Una conversación con la casa, no con una plataforma.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#ead9c4]">
              Si queréis preguntar algo o abrir una solicitud, hacedlo por aquí. El mensaje entra en la bandeja
              real de los propietarios y se responde en el mismo hilo, con las fechas, el contrato y el pago bien ordenados.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: MessageCircle, title: "Chat web", text: "Conversación persistente con propietarios." },
                { icon: CalendarDays, title: "Solicitud conectada", text: "Fechas y mensajes quedan juntos." },
                { icon: ShieldCheck, title: "Seguimiento claro", text: "Contrato y reserva sin perder el hilo." },
              ].map((item) => (
                <div key={item.title} className="rounded-[8px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                  <item.icon className="mb-3 h-5 w-5 text-[#f3d4ad]" />
                  <p className="font-serif text-xl font-bold">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#d8c5ad]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#f3d4ad]/18 bg-[#fff7ea] p-7 text-[#2f2114] shadow-[0_30px_90px_rgba(0,0,0,.26)] md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#704624]">Abrir conversación</p>
            <h3 className="mt-3 font-serif text-3xl font-bold">Contadnos qué necesitáis</h3>
            <p className="mt-4 leading-7 text-[#66482d]">
              Podéis escribir para preguntar por fechas, normas, piscina, jacuzzi o pedir una estancia. Lo revisamos
              con calma y seguimos por aquí.
            </p>
            <div className="mt-8 space-y-3">
              <Link href="/contactar" className="block">
                <Button size="lg" className="w-full rounded-full bg-[#704624] text-[#fff7ea] hover:bg-[#3b2717]">
                  Ir al chat web
                </Button>
              </Link>
              <Link href="/reservar" className="block">
                <Button size="lg" variant="outline" className="w-full rounded-full border-[#704624]/25 text-[#704624] hover:bg-[#f2e2c7]">
                  Pedir estancia
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#765b3e]">
              Si ya hablasteis con nosotros antes, al volver os llevaremos al mismo hilo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
