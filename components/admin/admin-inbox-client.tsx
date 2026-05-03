"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { getAdminThreads } from "@/app/actions/admin"
import type { ConversationThread } from "@/lib/types"
import { CloseThreadButton } from "@/components/admin/close-thread-button"
import { DeleteReservationButton } from "@/components/admin/delete-reservation-button"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Calendar, Circle, MessageCircle } from "lucide-react"

type NotificationState = "unsupported" | "off" | "blocked" | "on"

interface AdminInboxClientProps {
  initialThreads: ConversationThread[]
}

const preferenceKey = "macaco_admin_inbox_notifications"

function getNotificationState(): NotificationState {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported"
  if (Notification.permission === "denied") return "blocked"
  if (Notification.permission === "granted" && window.localStorage.getItem(preferenceKey) === "1") return "on"
  return "off"
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function AdminInboxClient({ initialThreads }: AdminInboxClientProps) {
  const [threads, setThreads] = useState(initialThreads)
  const [notificationState, setNotificationState] = useState<NotificationState>("off")
  const lastSeenByThreadRef = useRef(
    new Map(initialThreads.map((thread) => [thread.id, thread.last_message_at]))
  )

  useEffect(() => {
    setNotificationState(getNotificationState())
  }, [])

  const notify = useCallback((thread: ConversationThread) => {
    if (getNotificationState() !== "on") return
    if (thread.unread_count <= 0) return

    const options: NotificationOptions & { renotify?: boolean; timestamp?: number } = {
      body: `${thread.guest_name}: ${thread.last_message.slice(0, 120)}`,
      tag: `macaco-admin-${thread.id}-${thread.last_message_at}`,
      renotify: true,
      timestamp: new Date(thread.last_message_at).getTime(),
    }

    new Notification("Nuevo mensaje en El Macaco del Abuelo", options)
  }, [])

  const refreshThreads = useCallback(async () => {
    const latest = await getAdminThreads()
    const newUnread = latest.filter((thread) => {
      const lastSeen = lastSeenByThreadRef.current.get(thread.id)
      return thread.unread_count > 0 && thread.last_message_at !== lastSeen
    })

    for (const thread of latest) {
      lastSeenByThreadRef.current.set(thread.id, thread.last_message_at)
    }

    newUnread.forEach(notify)
    setThreads(latest)
  }, [notify])

  useEffect(() => {
    const intervalId = window.setInterval(refreshThreads, 3500)
    const onFocus = () => refreshThreads()
    const onVisibilityChange = () => {
      if (!document.hidden) refreshThreads()
    }

    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [refreshThreads])

  const enableNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationState("unsupported")
      return
    }

    if (Notification.permission === "denied") {
      setNotificationState("blocked")
      return
    }

    const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission()
    if (permission === "granted") {
      window.localStorage.setItem(preferenceKey, "1")
      setNotificationState("on")
    } else {
      setNotificationState(permission === "denied" ? "blocked" : "off")
    }
  }

  const disableNotifications = () => {
    window.localStorage.removeItem(preferenceKey)
    setNotificationState(getNotificationState())
  }

  const notificationLabel = useMemo(() => {
    if (notificationState === "on") return "Avisos activados"
    if (notificationState === "blocked") return "Avisos bloqueados"
    if (notificationState === "unsupported") return "No soportado"
    return "Activar avisos"
  }, [notificationState])

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-primary">Bandeja web</p>
          <h1 className="mt-2 text-3xl font-serif font-bold text-foreground">Conversaciones reales</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Aquí entra todo lo que escriben desde la web. Activa los avisos del navegador para enterarte cuando alguien escriba.
          </p>
        </div>

        <Button
          type="button"
          variant={notificationState === "on" ? "outline" : "default"}
          onClick={notificationState === "on" ? disableNotifications : enableNotifications}
          disabled={notificationState === "blocked" || notificationState === "unsupported"}
          className="w-full md:w-auto"
        >
          {notificationState === "on" ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {notificationLabel}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {threads.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <MessageCircle className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Todavía no ha entrado ninguna conversación web.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {threads.map((thread) => (
              <div key={thread.id} className="px-6 py-5 transition-colors hover:bg-muted/30">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="truncate font-medium text-foreground">{thread.guest_name}</p>
                      {thread.unread_count > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          <Circle className="h-2.5 w-2.5 fill-current" />
                          {thread.unread_count} sin leer
                        </span>
                      ) : null}
                      {thread.reservation ? (
                        <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                          Reserva
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          Contacto web
                        </span>
                      )}
                    </div>
                    <p className="mt-2 truncate text-sm text-muted-foreground">{thread.last_message}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {thread.reservation ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{thread.reservation.check_in}</span>
                      </div>
                    ) : null}
                    <span>{formatDateTime(thread.last_message_at)}</span>
                    <Link href={`/admin/inbox/${thread.id}`} className="font-medium text-primary hover:text-primary/80">
                      Abrir
                    </Link>
                    {thread.reservation ? (
                      <DeleteReservationButton reservationId={thread.reservation.id} redirectTo="/admin/inbox" />
                    ) : (
                      <CloseThreadButton threadId={thread.id} compact />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
