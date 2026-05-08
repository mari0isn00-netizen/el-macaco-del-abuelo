"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Sparkles, X } from "lucide-react"

const lastBreakOptions = ["Hace semanas", "No me acuerdo", "Necesito parar ya"]
const companionOptions = ["En pareja", "Con familia", "Con alguien que quiero cuidar", "Solo/a"]
const needOptions = ["Silencio", "Agua y sol", "Conversar sin prisa", "Sentirme cuidado/a"]

function buildArgument(lastBreak: string, companion: string, need: string) {
  const needLine: Record<string, string> = {
    Silencio: "No vienes a llenar una agenda. Vienes a que el día baje el volumen.",
    "Agua y sol": "Piscina, jacuzzi, jardín y luz de Carmona: un plan sencillo, físico, de estar fuera y soltar pantalla.",
    "Conversar sin prisa": "Una mesa tranquila y una parcela familiar cambian el tono de cualquier conversación.",
    "Sentirme cuidado/a": "Aquí no hay recepción fría: los dueños viven en la casa principal y están cerca si necesitáis algo.",
  }

  const companionLine: Record<string, string> = {
    "En pareja": "Para dos, el refugio funciona como una pausa íntima: agua, calma y el chat directo con la casa si hace falta.",
    "Con familia": "Para familia, la clave es estar recogidos: apartamento independiente, exterior y propietarios cerca sin invadir.",
    "Con alguien que quiero cuidar": "Regalarle descanso a alguien también es elegir un sitio donde todo esté claro y acompañado.",
    "Solo/a": "A veces ir solo no es aislarse, es volver a escuchar lo que normalmente queda tapado.",
  }

  const urgency =
    lastBreak === "Necesito parar ya"
      ? "Si lo notas tan claro, no lo conviertas en otro pendiente."
      : lastBreak === "No me acuerdo"
        ? "Cuando no recuerdas la última desconexión real, el cuerpo ya te está contestando."
        : "Si han pasado semanas, quizá no necesitas un viaje enorme: necesitas un sitio que te saque del ruido."

  return `${urgency} ${needLine[need]} ${companionLine[companion]} El Macaco del Abuelo no intenta parecer un hotel: es una casa con historia, parcela compartida con los dueños y una forma de reservar hablada, escrita y sin prisa.`
}

export function ConvinceMode() {
  const [open, setOpen] = useState(false)
  const [lastBreak, setLastBreak] = useState(lastBreakOptions[0])
  const [companion, setCompanion] = useState(companionOptions[0])
  const [need, setNeed] = useState(needOptions[0])

  const argument = useMemo(() => buildArgument(lastBreak, companion, need), [companion, lastBreak, need])
  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 text-sm text-current/65 underline decoration-current/20 underline-offset-4 transition-colors hover:text-current"
      >
        No sé si ir
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#201812]/95 text-white backdrop-blur">
          <button
            type="button"
            onClick={close}
            className="fixed left-4 top-4 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            Volver a la web
          </button>
          <button
            type="button"
            onClick={close}
            className="fixed right-4 top-4 rounded-full border border-white/20 bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
                <Sparkles className="h-4 w-4" />
                Modo convénceme
              </p>
              <h2 className="font-serif text-4xl font-bold leading-tight md:text-6xl">No reserves todavía. Contesta esto.</h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <QuestionBlock title="¿Cuándo fue la última vez que desconectaste de verdad?" options={lastBreakOptions} value={lastBreak} onChange={setLastBreak} />
              <QuestionBlock title="¿Con quién irías?" options={companionOptions} value={companion} onChange={setCompanion} />
              <QuestionBlock title="¿Qué necesitas ahora mismo?" options={needOptions} value={need} onChange={setNeed} />
            </div>

            <div className="mt-10 border-l border-white/25 pl-5">
              <div className="mb-3 flex items-center gap-2 text-white/70">
                <Heart className="h-4 w-4" />
                <span className="text-sm uppercase tracking-[0.18em]">Tu respuesta</span>
              </div>
              <p className="max-w-4xl font-serif text-2xl leading-relaxed text-white md:text-3xl">{argument}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link href="/reservar">Ver disponibilidad</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                  <Link href="/contactar">
                    <MessageCircle className="h-4 w-4" />
                    Preguntar antes
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function QuestionBlock({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <h3 className="min-h-14 text-lg font-semibold leading-7 text-white">{title}</h3>
      <div className="mt-4 flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
              value === option ? "border-white bg-white text-primary" : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
