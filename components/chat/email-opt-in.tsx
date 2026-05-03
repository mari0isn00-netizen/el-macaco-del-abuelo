"use client"

import { useMemo, useState } from "react"
import { sendChatMessage } from "@/app/actions/chat"
import { CLIENT_EMAIL_MARKER } from "@/lib/chat-state"
import type { ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MailCheck } from "lucide-react"

export function EmailOptIn({
  threadId,
  senderName,
  messages,
}: {
  threadId: string
  senderName: string
  messages: ChatMessage[]
}) {
  const alreadyOn = useMemo(() => messages.some((message) => message.message.startsWith(CLIENT_EMAIL_MARKER)), [messages])
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(alreadyOn)
  const [error, setError] = useState("")

  async function activate() {
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError("Escribe un email válido.")
      return
    }

    setBusy(true)
    setError("")
    const result = await sendChatMessage(threadId, `${CLIENT_EMAIL_MARKER}: ${clean}`, "guest", senderName)
    setBusy(false)

    if (!result.success) {
      setError(result.error || "No se pudieron activar los avisos. Si falta configuración, revisa RESEND_API_KEY en Vercel.")
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-3 mt-3 rounded-[10px] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 sm:mx-4">
        Avisos por email activados. Cuando respondan los propietarios, recibirás un correo.
      </div>
    )
  }

  return (
    <div className="mx-3 mt-3 rounded-[12px] border border-primary/20 bg-primary/10 p-3 text-sm sm:mx-4">
      <div className="flex items-start gap-3">
        <MailCheck className="mt-0.5 h-5 w-5 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">Avisarme cuando respondan</p>
          <p className="mt-1 text-muted-foreground">
            Déjanos tu email y el sistema te avisará automáticamente cuando contesten desde la casa.
          </p>
          <div className="mt-3 flex gap-2">
            <Input value={email} onChange={(event) => setEmail(event.target.value)} inputMode="email" placeholder="tu@email.com" className="bg-background" />
            <Button type="button" onClick={activate} disabled={busy}>
              Activar
            </Button>
          </div>
          {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}
