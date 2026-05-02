"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { sendChatMessage, markMessagesAsRead } from "@/app/actions/chat"
import type { ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, MessageCircle, Calendar, HelpCircle, FileText, Waves, Bell, BellOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatUpdates } from "@/components/chat/use-chat-updates"
import { OfferPanel } from "@/components/chat/offer-panel"
import { MessageText } from "@/components/chat/message-text"

interface SmartChatProps {
  reservationId: string
  initialMessages: ChatMessage[]
  senderType: "guest" | "admin"
  senderName: string
  guestName?: string
}

const quickActions = [
  { id: "fechas", label: "Quiero revisar fechas", icon: Calendar },
  { id: "incluye", label: "Quiero confirmar qué incluye", icon: FileText },
  { id: "normas", label: "Quiero revisar las normas", icon: HelpCircle },
  { id: "piscina", label: "Quiero preguntar por piscina y jacuzzi", icon: Waves },
]

const quickMessages: Record<string, string> = {
  fechas: "Hola. Quiero revisar fechas y disponibilidad para la estancia.",
  incluye: "Hola. Quiero confirmar bien qué incluye el apartamento y la zona exterior.",
  normas: "Hola. Quiero revisar las normas de la estancia antes de seguir.",
  piscina: "Hola. Quiero preguntar por el uso de la piscina, el jacuzzi y la zona exterior.",
}

export function SmartChat({
  reservationId,
  initialMessages,
  senderType,
  senderName,
  guestName,
}: SmartChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(messages.length === 0 && senderType === "guest")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { disableNotifications, enableNotifications, notificationState } = useChatUpdates({
    threadId: reservationId,
    senderType,
    messages,
    setMessages,
  })

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    markMessagesAsRead(reservationId, senderType)
  }, [reservationId, senderType, messages])

  useEffect(() => {
    if (messages.length === 0 && senderType === "guest") {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        reservation_id: reservationId,
        sender_type: "admin",
        sender_name: "El Macaco del Abuelo",
        message: `Hola${guestName ? ` ${guestName}` : ""}.

Este chat va directo a los propietarios.

Puedes escribir por aquí sobre fechas, normas o cualquier detalle de la estancia. Si todavía no te hemos respondido, no verás una contestación automática inventada: cuando contestemos, aparecerá aquí.`,
        read: true,
        created_at: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }
  }, [guestName, messages.length, reservationId, senderType])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`chat:${reservationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `reservation_id=eq.${reservationId}`,
        },
        (payload) => {
          const nextMessage = payload.new as ChatMessage
          setMessages((prev) => {
            if (prev.some((message) => message.id === nextMessage.id)) return prev
            return [...prev, nextMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [reservationId])

  const submitMessage = async (messageText: string) => {
    if (!messageText.trim() || isSending) return

    setIsSending(true)
    setShowQuickActions(false)
    const cleanMessage = messageText.trim()
    setNewMessage("")

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      reservation_id: reservationId,
      sender_type: senderType,
      sender_name: senderName,
      message: cleanMessage,
      read: false,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMessage])

    try {
      const result = await sendChatMessage(reservationId, cleanMessage, senderType, senderName)

      if (!result.success) {
        setNewMessage(cleanMessage)
        setMessages((prev) => prev.filter((message) => message.id !== tempMessage.id))
      } else if (result.message) {
        const sentMessage = result.message
        setMessages((prev) => prev.map((message) => (message.id === tempMessage.id ? sentMessage : message)))
      }
    } catch {
      setNewMessage(cleanMessage)
      setMessages((prev) => prev.filter((message) => message.id !== tempMessage.id))
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const handleQuickAction = async (actionId: string) => {
    const presetMessage = quickMessages[actionId]
    if (!presetMessage) return
    await submitMessage(presetMessage)
  }

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault()
    await submitMessage(newMessage)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Hoy"
    if (date.toDateString() === yesterday.toDateString()) return "Ayer"
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "long" })
  }

  const groupedMessages: { date: string; messages: ChatMessage[] }[] = []
  messages.forEach((message) => {
    const date = formatDate(message.created_at)
    const lastGroup = groupedMessages[groupedMessages.length - 1]
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(message)
    } else {
      groupedMessages.push({ date, messages: [message] })
    }
  })

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background">
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card p-3 sm:p-4">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">Canal de estancia</h3>
          <p className="text-xs text-muted-foreground">Este hilo lo ven los propietarios desde su bandeja web.</p>
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
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="mb-4 flex items-center justify-center">
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{group.date}</span>
            </div>

            <div className="space-y-3">
              {group.messages.map((message) => {
                const isOwn = message.sender_type === senderType
                const isHouse = message.sender_type === "admin"

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2 animate-in slide-in-from-bottom-2 duration-300",
                      isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isOwn && (
                      <div
                        className={cn(
                          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                          isHouse ? "bg-primary/10" : "bg-secondary/20"
                        )}
                      >
                        {isHouse ? <MessageCircle className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-secondary" />}
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[86%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%]",
                        isOwn
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md border border-border bg-card text-foreground"
                      )}
                    >
                      {!isOwn && <p className="mb-1 text-xs font-medium opacity-70">{message.sender_name}</p>}
                      <p className="text-sm leading-relaxed">
                        <MessageText text={message.message} />
                      </p>
                      <p className={cn("mt-2 text-xs", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {showQuickActions && senderType === "guest" && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.id)}
                className="gap-2 rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <action.icon className="h-3.5 w-3.5" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <OfferPanel reservationId={reservationId} senderType={senderType} senderName={senderName} />

      <div className="safe-area-bottom border-t border-border bg-card p-3 sm:p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            placeholder="Escribe a los propietarios"
            className="flex-1 rounded-full bg-background px-4"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!newMessage.trim() || isSending}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
