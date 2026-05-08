"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, MessageCircle, Sparkles, X } from "lucide-react"

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

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-current/15 bg-white/15 px-4 py-2 text-sm font-semibold text-current/75 transition-colors duration-150 hover:bg-white/25 hover:text-current"
      >
        <Sparkles className="h-4 w-4" />
        No sé si ir
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#201812]/86 p-4 text-[#fff8ea]">
          <div className="mx-auto flex min-h-full max-w-6xl items-center py-10">
            <section className="relative w-full overflow-hidden rounded-[18px] border border-[#f3d4ad]/22 bg-[#fff7ea] text-[#2f2114] shadow-xl">
              <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#8f6237_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
              <div className="relative grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="bg-[#2f2114] p-6 text-[#fff8ea] sm:p-8 lg:p-10">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </button>
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
                    <Sparkles className="h-4 w-4" />
                    Modo convénceme
                  </p>
                  <h2 className="mt-6 font-serif text-4xl font-bold leading-tight md:text-6xl">No reserves todavía. Escúchate primero.</h2>
                  <p className="mt-5 text-base leading-7 text-white/78">
                    Tres respuestas pequeñas bastan para saber si lo que necesitas es agua, silencio, conversación o simplemente parar.
                  </p>
                </div>

                <div className="relative p-5 sm:p-8 lg:p-10">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 rounded-full border border-[#704624]/15 bg-white/70 p-2 text-[#704624] transition hover:bg-white"
                    aria-label="Cerrar"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="grid gap-5 lg:grid-cols-3">
                    <QuestionBlock title="¿Cuándo desconectaste de verdad?" options={lastBreakOptions} value={lastBreak} onChange={setLastBreak} />
                    <QuestionBlock title="¿Con quién irías?" options={companionOptions} value={companion} onChange={setCompanion} />
                    <QuestionBlock title="¿Qué necesitas ahora mismo?" options={needOptions} value={need} onChange={setNeed} />
                  </div>

                  <div className="mt-8 rounded-[14px] border border-[#8f6237]/18 bg-[#fff2bf]/70 p-5">
                    <div className="mb-3 flex items-center gap-2 text-[#704624]">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-[0.18em]">Tu respuesta</span>
                    </div>
                    <p className="font-serif text-xl leading-8 text-[#3b2717] md:text-2xl">{argument}</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button asChild size="lg" className="bg-[#704624] text-[#fff7ea] hover:bg-[#3b2717]">
                        <Link href="/reservar">Ver disponibilidad</Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="border-[#704624]/25 bg-white/60 text-[#704624] hover:bg-white">
                        <Link href="/contactar">
                          <MessageCircle className="h-4 w-4" />
                          Preguntar antes
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
      <h3 className="min-h-12 text-base font-semibold leading-6 text-[#2f2114]">{title}</h3>
      <div className="mt-4 flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-[10px] border px-4 py-3 text-left text-sm transition-colors duration-150 ${
              value === option ? "border-[#704624] bg-[#704624] text-[#fff7ea]" : "border-[#8f6237]/18 bg-white/65 text-[#66482d] hover:bg-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
