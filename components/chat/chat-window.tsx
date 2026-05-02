"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { sendChatMessage, markMessagesAsRead } from "@/app/actions/chat"
import type { ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, BellOff, Send, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatUpdates } from "@/components/chat/use-chat-updates"
import { OfferPanel } from "@/components/chat/offer-panel"

interface ChatWindowProps {
  reservationId: string
  initialMessages: ChatMessage[]
  senderType: "guest" | "admin"
  senderName: string
  showOfferPanel?: boolean
}

export function ChatWindow({
  reservationId,
  initialMessages,
  senderType,
  senderName,
  showOfferPanel = true,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { disableNotifications, enableNotifications, notificationState } = useChatUpdates({
    threadId: reservationId,
    senderType,
    messages,
    setMessages,
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark messages as read on mount and when new messages arrive
  useEffect(() => {
    markMessagesAsRead(reservationId, senderType)
  }, [reservationId, senderType, messages])

  // Subscribe to real-time updates
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
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) {
              return prev
            }
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [reservationId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    setError("")
    const messageText = newMessage
    setNewMessage("")

    try {
      const result = await sendChatMessage(
        reservationId,
        messageText,
        senderType,
        senderName
      )

      if (!result.success) {
        // Restore message if failed
        setError(result.error || "No se pudo enviar el mensaje.")
        setNewMessage(messageText)
      } else if (result.message) {
        const sentMessage = result.message
        setMessages((prev) => (prev.some((msg) => msg.id === sentMessage.id) ? prev : [...prev, sentMessage]))
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setError("No se pudo enviar el mensaje.")
      setNewMessage(messageText)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    }
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    })
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = []
  messages.forEach((msg) => {
    const date = formatDate(msg.created_at)
    const lastGroup = groupedMessages[groupedMessages.length - 1]
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg)
    } else {
      groupedMessages.push({ date, messages: [msg] })
    }
  })

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">Se actualiza automaticamente cada pocos segundos.</p>
        {notificationState === "on" ? (
          <Button type="button" variant="outline" size="sm" onClick={disableNotifications}>
            <BellOff className="h-4 w-4" />
            Quitar avisos
          </Button>
        ) : notificationState === "blocked" ? (
          <p className="text-xs text-muted-foreground">Notificaciones bloqueadas en el navegador.</p>
        ) : notificationState !== "unsupported" ? (
          <Button type="button" variant="outline" size="sm" onClick={enableNotifications}>
            <Bell className="h-4 w-4" />
            Avisarme
          </Button>
        ) : null}
      </div>
      {/* Messages */}
      <div className="chat-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto p-3 sm:p-4">
        {groupedMessages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay mensajes todavía. ¡Escribe el primero!
            </p>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date separator */}
              <div className="flex items-center justify-center mb-4">
                <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                  {group.date}
                </span>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                {group.messages.map((msg) => {
                  const isOwn = msg.sender_type === senderType
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        isOwn ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isOwn && (
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-secondary" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[86%] rounded-2xl px-4 py-2 sm:max-w-[72%]",
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        )}
                      >
                        {!isOwn && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {msg.sender_name}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {showOfferPanel ? <OfferPanel reservationId={reservationId} senderType={senderType} senderName={senderName} /> : null}
      <div className="border-t border-border bg-card p-3 sm:p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-background"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!newMessage.trim() || isSending}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
        {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  )
}
