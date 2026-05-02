"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { createWebConversation, getChatMessages, markMessagesAsRead, sendChatMessage } from "@/app/actions/chat"
import type { ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, BellOff, MessageCircle, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatUpdates } from "@/components/chat/use-chat-updates"
import { MessageText } from "@/components/chat/message-text"

const THREAD_STORAGE_KEY = "macaco_web_thread_id"
const NAME_STORAGE_KEY = "macaco_web_guest_name"

export function WebContactChat() {
  const [threadId, setThreadId] = useState<string | null>(null)
  const [guestName, setGuestName] = useState("")
  const [draftName, setDraftName] = useState("")
  const [draftMessage, setDraftMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = useMemo(() => createClient(), [])
  const { disableNotifications, enableNotifications, notificationState } = useChatUpdates({
    threadId,
    senderType: "guest",
    messages,
    setMessages,
  })

  useEffect(() => {
    const savedThread = window.localStorage.getItem(THREAD_STORAGE_KEY)
    const savedName = window.localStorage.getItem(NAME_STORAGE_KEY) || ""
    setGuestName(savedName)
    setDraftName(savedName)

    if (!savedThread) {
      setLoading(false)
      return
    }

    setThreadId(savedThread)
    getChatMessages(savedThread)
      .then((data) => {
        if (data.length === 0) {
          window.localStorage.removeItem(THREAD_STORAGE_KEY)
          setThreadId(null)
          setMessages([])
          return
        }

        setMessages(data)
        return markMessagesAsRead(savedThread, "guest")
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!threadId) return

    const channel = supabase
      .channel(`public-thread:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `reservation_id=eq.${threadId}`,
        },
        (payload) => {
          const message = payload.new as ChatMessage
          setMessages((prev) => (prev.some((item) => item.id === message.id) ? prev : [...prev, message]))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [threadId, supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    if (threadId) markMessagesAsRead(threadId, "guest")
  }, [messages, threadId])

  const startConversation = async () => {
    setError("")
    setSending(true)
    try {
      const response = await createWebConversation({
        guest_name: draftName,
        message: draftMessage,
      })

      if (!response.success || !response.threadId) {
        setError(response.error || "No se pudo abrir la conversación.")
        return
      }

      const nextThreadId = response.threadId
      window.localStorage.setItem(THREAD_STORAGE_KEY, nextThreadId)
      window.localStorage.setItem(NAME_STORAGE_KEY, draftName)
      setGuestName(draftName)
      setThreadId(nextThreadId)
      const nextMessages = await getChatMessages(nextThreadId)
      setMessages(nextMessages)
      setDraftMessage("")
    } finally {
      setSending(false)
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!threadId || !newMessage.trim() || sending) return
    setSending(true)
    setError("")
    const content = newMessage.trim()
    setNewMessage("")

    try {
      const currentMessages = await getChatMessages(threadId)
      if (currentMessages.length === 0) {
        window.localStorage.removeItem(THREAD_STORAGE_KEY)
        const response = await createWebConversation({
          guest_name: guestName || "Invitado",
          message: content,
        })

        if (!response.success || !response.threadId) {
          setError(response.error || "No se pudo abrir una conversación nueva.")
          setNewMessage(content)
          return
        }

        window.localStorage.setItem(THREAD_STORAGE_KEY, response.threadId)
        const nextMessages = await getChatMessages(response.threadId)
        setThreadId(response.threadId)
        setMessages(nextMessages)
        return
      }

      const response = await sendChatMessage(threadId, content, "guest", guestName || "Invitado")
      if (!response.success) {
        setError(response.error || "No se pudo enviar el mensaje.")
        setNewMessage(content)
      } else if (response.message) {
        const sentMessage = response.message
        setMessages((prev) => (prev.some((item) => item.id === sentMessage.id) ? prev : [...prev, sentMessage]))
      }
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">Preparando el chat...</div>
  }

  if (!threadId) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Hablar con los propietarios</h2>
            <p className="text-sm text-muted-foreground">Este contacto se queda dentro de la web. Te responderemos por aquí.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Tu nombre</label>
            <Input value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="Cómo quieres que te llamemos" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Tu mensaje</label>
            <Textarea
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              placeholder="Cuéntanos qué necesitas: fechas, dudas sobre la estancia, normas o cualquier detalle."
              rows={6}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" disabled={sending} onClick={startConversation}>
            {sending ? "Abriendo conversación..." : "Empezar conversación"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex max-h-[min(72vh,720px)] min-h-[460px] w-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">Conversación con los propietarios</h2>
          <p className="text-sm text-muted-foreground">Tu hilo sigue guardado en este navegador. Seguimos por aquí.</p>
        </div>
        {notificationState === "on" ? (
          <Button type="button" variant="outline" size="sm" onClick={disableNotifications}>
            <BellOff className="h-4 w-4" />
            Quitar avisos
          </Button>
        ) : notificationState === "blocked" ? (
          <p className="text-xs text-muted-foreground">Avisos bloqueados.</p>
        ) : notificationState !== "unsupported" ? (
          <Button type="button" variant="outline" size="sm" onClick={enableNotifications}>
            <Bell className="h-4 w-4" />
            Avisarme
          </Button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
        {messages.map((message) => {
          const isOwn = message.sender_type === "guest"
          return (
            <div key={message.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[78%]",
                  isOwn ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted text-foreground"
                )}
              >
                {!isOwn ? <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">{message.sender_name}</div> : null}
                <div>
                  <MessageText text={message.message} />
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            placeholder="Escribe un mensaje para los propietarios"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                handleSend()
              }
            }}
          />
          <Button size="icon" onClick={handleSend} disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  )
}
