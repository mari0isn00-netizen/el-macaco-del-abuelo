"use client"

import { useMemo, useState } from "react"
import { sendChatMessage } from "@/app/actions/chat"
import type { ChatMessage, Reservation } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Gift, Loader2, Send } from "lucide-react"

type WelcomeConfiguratorProps = {
  reservation: Reservation
  messages: ChatMessage[]
}

const marker = "CONFIGURADOR DE BIENVENIDA"

export function WelcomeConfigurator({ reservation, messages }: WelcomeConfiguratorProps) {
  const alreadySent = useMemo(() => messages.some((message) => message.message.startsWith(marker)), [messages])
  const [occasion, setOccasion] = useState("Descanso")
  const [firstVisit, setFirstVisit] = useState("Sí")
  const [children, setChildren] = useState("No")
  const [allergies, setAllergies] = useState("")
  const [note, setNote] = useState("")
  const [sent, setSent] = useState(alreadySent)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (sent || alreadySent) {
    return (
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 text-secondary" />
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Bienvenida enviada</p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">La casa ya tiene el resumen</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Si necesitáis cambiar algo, escribidlo directamente en el chat y quedará en el mismo hilo.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const submit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setError("")

    const message = [
      marker,
      `Huésped: ${reservation.guest_name}`,
      `Fechas: ${new Date(reservation.check_in).toLocaleDateString("es-ES")} - ${new Date(reservation.check_out).toLocaleDateString("es-ES")}`,
      `Motivo de la estancia: ${occasion}`,
      `Primera vez en Carmona: ${firstVisit}`,
      `Vienen niños: ${children}`,
      `Alergias o detalles importantes: ${allergies.trim() || "No indicado"}`,
      `Nota para preparar la llegada: ${note.trim() || "No indicado"}`,
    ].join("\n")

    const result = await sendChatMessage(reservation.id, message, "guest", reservation.guest_name)

    if (!result.success) {
      setError(result.error || "No se ha podido enviar ahora mismo.")
      setIsSubmitting(false)
      return
    }

    setSent(true)
    setIsSubmitting(false)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
          <Gift className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">Antes de llegar</p>
          <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">Preparar la bienvenida</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Un resumen corto para que los propietarios sepan si celebráis algo, si venís con niños o si hay algún detalle importante.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Select value={occasion} onValueChange={setOccasion}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Descanso">Descanso</SelectItem>
            <SelectItem value="Aniversario">Aniversario</SelectItem>
            <SelectItem value="Cumpleaños">Cumpleaños</SelectItem>
            <SelectItem value="Escapada familiar">Escapada familiar</SelectItem>
            <SelectItem value="Otro motivo">Otro motivo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={firstVisit} onValueChange={setFirstVisit}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sí">Primera vez en Carmona</SelectItem>
            <SelectItem value="No">Ya conocemos Carmona</SelectItem>
          </SelectContent>
        </Select>

        <Select value={children} onValueChange={setChildren}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="No">Sin niños</SelectItem>
            <SelectItem value="Sí">Con niños</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          value={allergies}
          onChange={(event) => setAllergies(event.target.value)}
          placeholder="Alergias o detalles importantes"
          className="min-h-11 resize-none bg-background"
        />
      </div>

      <Textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Algo que os gustaría que la casa supiera antes de llegar"
        className="mt-3 min-h-24 resize-none bg-background"
      />

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <Button type="button" className="mt-5 w-full sm:w-auto" onClick={submit} disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Enviar resumen de bienvenida
      </Button>
    </div>
  )
}
