"use client"

import { useState } from "react"
import Link from "next/link"
import { createGiftConversation } from "@/app/actions/chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Gift, Loader2 } from "lucide-react"

export function GiftRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [giftUrl, setGiftUrl] = useState("")
  const [threadId, setThreadId] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(event.currentTarget)

    try {
      const response = await createGiftConversation({
        giverName: String(formData.get("giverName") || ""),
        giverContact: String(formData.get("giverContact") || ""),
        recipientName: String(formData.get("recipientName") || ""),
        occasion: String(formData.get("occasion") || ""),
        preferredWindow: String(formData.get("preferredWindow") || ""),
        personalMessage: String(formData.get("personalMessage") || ""),
      })

      if (!response.success || !response.threadId) {
        setError(response.error || "No hemos podido preparar el regalo ahora mismo.")
        return
      }

      setThreadId(response.threadId)
      setGiftUrl(response.giftUrl || `/regalo/${response.threadId}`)
      window.localStorage.setItem("macaco_gift_thread_id", response.threadId)
    } catch {
      setError("No hemos podido preparar el regalo ahora mismo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (giftUrl) {
    return (
      <div className="rounded-[10px] border border-[#8f6237]/18 bg-[#fff7ea]/90 p-7 shadow-[0_26px_80px_rgba(73,43,19,.16)]">
        <CheckCircle className="h-9 w-9 text-[#6b7d3f]" />
        <h2 className="mt-5 font-serif text-3xl font-bold text-[#2f2114]">Regalo preparado</h2>
        <p className="mt-3 leading-7 text-[#66482d]">
          Se ha creado un hilo privado para coordinarlo con la casa. Este es el enlace bonito para la persona regalada:
        </p>
        <div className="mt-5 rounded-[8px] bg-[#f2e2c7] p-4 text-sm font-semibold text-[#704624]">
          {giftUrl}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href={giftUrl}>
            <Button className="w-full rounded-full bg-[#704624] text-[#fff7ea] hover:bg-[#3b2717]">
              Ver carta regalo
            </Button>
          </Link>
          <Link href={`/chat/${threadId}`}>
            <Button variant="outline" className="w-full rounded-full border-[#704624]/25 text-[#704624] hover:bg-[#f2e2c7]">
              Ir al chat
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[10px] border border-[#8f6237]/18 bg-[#fff7ea]/90 p-6 shadow-[0_26px_80px_rgba(73,43,19,.16)] md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-[#704624]/10 p-3 text-[#704624]">
          <Gift className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#704624]">Modo regalo</p>
          <h2 className="font-serif text-2xl font-bold text-[#2f2114]">Preparar carta y solicitud</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tu nombre" name="giverName" placeholder="Quién regala" required />
        <Field label="Tu teléfono o email" name="giverContact" placeholder="Para coordinarlo contigo" required />
        <Field label="Nombre de quien recibe" name="recipientName" placeholder="Para la carta" required />
        <Field label="Motivo" name="occasion" placeholder="Cumpleaños, aniversario..." />
        <div className="sm:col-span-2">
          <Field label="Fechas orientativas" name="preferredWindow" placeholder="Ej. primavera, julio, fin de semana..." />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="personalMessage">Dedicatoria</Label>
          <Textarea
            id="personalMessage"
            name="personalMessage"
            required
            rows={5}
            className="resize-none bg-[#fffaf0]"
            placeholder="Escribe la carta que verá la persona regalada."
          />
        </div>
      </div>

      {error ? <p className="mt-4 rounded-[8px] bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <Button disabled={isSubmitting} className="mt-6 w-full rounded-full bg-[#704624] text-[#fff7ea] hover:bg-[#3b2717]">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparando regalo...
          </>
        ) : (
          "Crear regalo"
        )}
      </Button>
      <p className="mt-4 text-center text-xs leading-5 text-[#765b3e]">
        No se confirma ninguna estancia automáticamente. La casa revisa disponibilidad, precio y forma de formalizarlo por el chat.
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string
  name: string
  placeholder: string
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} placeholder={placeholder} required={required} className="bg-[#fffaf0]" />
    </div>
  )
}
