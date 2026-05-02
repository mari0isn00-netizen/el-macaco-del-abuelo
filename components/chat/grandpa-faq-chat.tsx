"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, RotateCcw, Send } from "lucide-react"

type FaqItem = {
  question: string
  answer: string
  keywords: string[]
}

const faqs: FaqItem[] = [
  {
    question: "¿Dónde está el alojamiento?",
    answer: "Está en Las Monjas, Carmona, Sevilla. La dirección completa se comparte en la reserva confirmada y en el contrato.",
    keywords: ["donde", "ubicacion", "dirección", "direccion", "carmona", "monjas"],
  },
  {
    question: "¿La piscina es privada?",
    answer: "Sí. La piscina y el jacuzzi forman parte de la zona privada de la estancia.",
    keywords: ["piscina", "privada", "jacuzzi", "agua"],
  },
  {
    question: "¿Los dueños viven allí?",
    answer: "Los dueños estarán en la casa principal de la parcela durante la estancia, pero respetan vuestra privacidad y no saldrán salvo que lo necesitéis o pidáis algo.",
    keywords: ["dueños", "propietarios", "viven", "casa principal", "privacidad"],
  },
  {
    question: "¿Cómo se fija el precio?",
    answer: "Primero enviáis las fechas. El propietario revisa disponibilidad, duración y condiciones de la estancia, y deja por escrito el precio final en el chat web.",
    keywords: ["precio", "cuesta", "oferta", "importe", "presupuesto", "coste"],
  },
  {
    question: "¿Hay que firmar contrato?",
    answer: "Sí. Antes de formalizar la reserva se muestra un contrato detallado con precio, fechas, cláusulas, DNI/NIE y firma dibujada desde la propia página.",
    keywords: ["contrato", "firmar", "firma", "dni", "nie", "clausulas"],
  },
  {
    question: "¿Cuánto es la señal?",
    answer: "La señal para reservar la estancia es de 100 EUR y se explica dentro del contrato antes de registrarla.",
    keywords: ["señal", "senal", "reserva", "100", "bizum"],
  },
  {
    question: "¿La cancelación es gratis?",
    answer: "Sí, la cancelación es gratuita hasta una semana antes de la entrada.",
    keywords: ["cancelacion", "cancelación", "gratis", "cancelar"],
  },
  {
    question: "¿Se puede preguntar antes de reservar?",
    answer: "Claro. Si necesitáis consultar algo antes, podéis escribir por el chat real sin compromiso.",
    keywords: ["preguntar", "duda", "antes", "consultar", "chat"],
  },
  {
    question: "¿Qué ofrece la estancia?",
    answer: "Apartamento independiente, piscina privada, jacuzzi, jardín, parcela privada, tranquilidad, privacidad y espacio exterior.",
    keywords: ["ofrece", "incluye", "apartamento", "jardin", "jardín", "parcela"],
  },
  {
    question: "¿Cuál es la historia del nombre?",
    answer: "El nombre viene de una memoria familiar: Amparo iba con Antonio, su padre, a recoger aceitunas en Arahal.",
    keywords: ["historia", "nombre", "abuelo", "amparo", "antonio", "arahal", "aceitunas"],
  },
]

function shuffleQuestions() {
  return [...faqs].sort(() => Math.random() - 0.5).slice(0, 6)
}

function normalizeText(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function findAnswer(text: string) {
  const normalized = normalizeText(text)
  return faqs.find((item) => item.keywords.some((keyword) => normalized.includes(normalizeText(keyword))))
}

export function GrandpaFaqChat() {
  const [visibleQuestions, setVisibleQuestions] = useState(() => shuffleQuestions())
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState(faqs[0].answer)
  const [activeQuestion, setActiveQuestion] = useState(faqs[0].question)

  const fallback = useMemo(
    () => "Esa no me la sé con seguridad. Mejor escríbela abajo en el chat real y os responderán los propietarios.",
    []
  )

  const ask = (text: string) => {
    const found = findAnswer(text)
    setActiveQuestion(found?.question || "Pregunta no encontrada")
    setAnswer(found?.answer || fallback)
    setQuestion("")
  }

  const reshuffle = () => {
    setVisibleQuestions(shuffleQuestions())
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">Preguntas frecuentes</p>
          <h2 className="mt-1 text-2xl font-serif font-bold text-foreground">El abuelo responde rápido</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prueba primero con estas dudas. Si no aparece lo que buscas, escribe en el chat real de abajo.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{activeQuestion}</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{answer}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleQuestions.map((item) => (
          <Button key={item.question} type="button" variant="outline" size="sm" onClick={() => ask(item.question)}>
            {item.question}
          </Button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Escribe una duda rápida..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              ask(question)
            }
          }}
        />
        <Button type="button" size="icon" onClick={() => ask(question)} disabled={!question.trim()}>
          <Send className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={reshuffle}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
