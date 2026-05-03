"use client"

import { useState } from "react"
import { confirmDepositPayment, registerOffer, requestContractAndPayment } from "@/app/actions/reservations"
import { sendChatMessage } from "@/app/actions/chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, FileSignature, HandCoins, MessageSquareText, Send } from "lucide-react"

const templates = [
  {
    label: "Parcela compartida",
    text: "Os recordamos que la parcela es compartida con los dueños, que viven en la casa principal. No salen salvo que necesitéis algo o queráis consultarnos cualquier detalle.",
  },
  {
    label: "Preparar llegada",
    text: "Cuando se acerque la fecha, coordinamos por aquí hora aproximada de llegada, indicaciones y cualquier detalle previo para que esté todo preparado.",
  },
  {
    label: "Contrato y señal",
    text: "Antes de formalizar nada, revisad con calma el contrato completo. La señal queda pendiente de comprobación manual hasta que confirmemos el Bizum recibido.",
  },
]

export function AdminReservationTools({ reservationId }: { reservationId: string }) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [busy, setBusy] = useState("")
  const [status, setStatus] = useState("")

  async function run(label: string, action: () => Promise<{ success: boolean; error?: string }>) {
    setBusy(label)
    setStatus("")
    const result = await action()
    setBusy("")
    setStatus(result.success ? "Acción realizada." : result.error || "No se pudo realizar la acción.")
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div>
        <h2 className="font-semibold text-foreground">Herramientas rápidas</h2>
        <p className="mt-1 text-sm text-muted-foreground">Precio, contrato, Bizum y mensajes útiles sin entrar al chat.</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
        <Input inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="EUR" />
        <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Nota para acompañar precio o contrato" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() =>
            run("price", async () =>
              registerOffer({ reservationId, amount: Number(amount), senderType: "admin", senderName: "El Macaco del Abuelo", note })
            )
          }
          disabled={busy !== "" || !amount}
        >
          <HandCoins className="h-4 w-4" />
          Fijar precio
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => run("contract", async () => requestContractAndPayment({ reservationId, senderName: "El Macaco del Abuelo", note }))}
          disabled={busy !== ""}
        >
          <FileSignature className="h-4 w-4" />
          Enviar contrato
        </Button>
        <Button
          type="button"
          size="sm"
          className="bg-green-700 text-white hover:bg-green-800"
          onClick={() => run("bizum", async () => confirmDepositPayment({ reservationId, senderName: "El Macaco del Abuelo" }))}
          disabled={busy !== ""}
        >
          <CheckCircle2 className="h-4 w-4" />
          Confirmar Bizum
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Plantillas</p>
        <div className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <Button key={template.label} type="button" variant="outline" size="sm" onClick={() => setCustomMessage(template.text)}>
              <MessageSquareText className="h-4 w-4" />
              {template.label}
            </Button>
          ))}
        </div>
        <Textarea value={customMessage} onChange={(event) => setCustomMessage(event.target.value)} rows={4} placeholder="Mensaje rápido al huésped" />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => run("message", async () => sendChatMessage(reservationId, customMessage, "admin", "El Macaco del Abuelo"))}
          disabled={busy !== "" || !customMessage.trim()}
        >
          <Send className="h-4 w-4" />
          Enviar mensaje
        </Button>
      </div>

      {status ? <p className="rounded-md bg-muted p-2 text-sm text-muted-foreground">{status}</p> : null}
    </div>
  )
}
