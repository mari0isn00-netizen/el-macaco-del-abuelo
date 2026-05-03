"use client"

import { useMemo, useState } from "react"
import { sendChatMessage } from "@/app/actions/chat"
import { CLIENT_TELEGRAM_MARKER } from "@/lib/chat-state"
import type { ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BellRing } from "lucide-react"

export function TelegramOptIn({
  threadId,
  senderName,
  messages,
}: {
  threadId: string
  senderName: string
  messages: ChatMessage[]
}) {
  const alreadyOn = useMemo(() => messages.some((message) => message.message.startsWith(CLIENT_TELEGRAM_MARKER)), [messages])
  const [chatId, setChatId] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(alreadyOn)
  const [error, setError] = useState("")
  const botUser = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ""

  async function activate() {
    const clean = chatId.trim()
    if (!/^-?\d{5,}$/.test(clean)) {
      setError("Pega tu chat ID numérico de Telegram.")
      return
    }

    setBusy(true)
    setError("")
    const result = await sendChatMessage(threadId, `${CLIENT_TELEGRAM_MARKER}: ${clean}`, "guest", senderName)
    setBusy(false)

    if (!result.success) {
      setError(result.error || "No se pudieron activar los avisos.")
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-3 mt-3 rounded-[10px] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 sm:mx-4">
        Avisos por Telegram activados. Cuando respondan los propietarios, el bot te escribirá.
      </div>
    )
  }

  return (
    <div className="mx-3 mt-3 rounded-[12px] border border-primary/20 bg-primary/10 p-3 text-sm sm:mx-4">
      <div className="flex items-start gap-3">
        <BellRing className="mt-0.5 h-5 w-5 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">Avisos fuertes por Telegram</p>
          <p className="mt-1 text-muted-foreground">
            Inicia el bot{botUser ? ` @${botUser}` : ""}, pega aquí tu chat ID y te avisará cuando respondan.
          </p>
          <div className="mt-3 flex gap-2">
            <Input value={chatId} onChange={(event) => setChatId(event.target.value)} inputMode="numeric" placeholder="Tu chat ID de Telegram" className="bg-background" />
            <Button type="button" onClick={activate} disabled={busy}>
              Activar
            </Button>
          </div>
          {botUser ? (
            <a className="mt-2 inline-flex text-xs font-semibold text-primary underline" href={`https://t.me/${botUser}`} target="_blank" rel="noreferrer">
              Abrir bot en Telegram
            </a>
          ) : null}
          {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}
