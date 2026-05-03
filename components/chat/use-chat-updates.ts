"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getChatMessages } from "@/app/actions/chat"
import type { ChatMessage } from "@/lib/types"
import type React from "react"

type NotificationState = "unsupported" | "off" | "blocked" | "on"

type UseChatUpdatesInput = {
  threadId: string | null
  senderType: "guest" | "admin"
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  pollMs?: number
}

const preferenceKey = (threadId: string) => `macaco_notifications_${threadId}`

function getNotificationState(threadId: string | null): NotificationState {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported"
  if (!threadId) return "off"
  if (Notification.permission === "denied") return "blocked"
  if (Notification.permission === "granted" && window.localStorage.getItem(preferenceKey(threadId)) === "1") return "on"
  return "off"
}

function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]) {
  const currentIds = new Set(current.map((message) => message.id))
  const nextMessages = incoming.filter((message) => !currentIds.has(message.id))
  if (nextMessages.length === 0) return current

  return [...current, ...nextMessages].sort((a, b) => {
    if (a.id === "welcome") return -1
    if (b.id === "welcome") return 1
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}

export function useChatUpdates({
  threadId,
  senderType,
  messages,
  setMessages,
  pollMs = 3500,
}: UseChatUpdatesInput) {
  const [notificationState, setNotificationState] = useState<NotificationState>("off")
  const seenIdsRef = useRef<Set<string>>(new Set(messages.map((message) => message.id)))
  const originalTitleRef = useRef<string>("")

  useEffect(() => {
    setNotificationState(getNotificationState(threadId))
    if (typeof document !== "undefined" && !originalTitleRef.current) {
      originalTitleRef.current = document.title
    }
  }, [threadId])

  useEffect(() => {
    seenIdsRef.current = new Set(messages.map((message) => message.id))
  }, [messages])

  const maybeNotify = useCallback(
    (newMessages: ChatMessage[]) => {
      if (!threadId || typeof window === "undefined" || !("Notification" in window)) return
      if (getNotificationState(threadId) !== "on") return

      const reply = newMessages.find((message) => message.sender_type !== senderType)
      if (!reply) return

      if (typeof document !== "undefined") {
        document.title = "Nueva respuesta - El Macaco"
      }

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([120, 60, 120])
      }

      new Notification("Nueva respuesta de El Macaco del Abuelo", {
        body: reply.message.slice(0, 120),
        tag: `macaco-${threadId}`,
      })
    },
    [senderType, threadId]
  )

  const refreshMessages = useCallback(async () => {
    if (!threadId) return

    const latest = await getChatMessages(threadId)
    const unseen = latest.filter((message) => !seenIdsRef.current.has(message.id))
    if (unseen.length > 0) {
      maybeNotify(unseen)
      setMessages((current) => mergeMessages(current, latest))
    }
  }, [maybeNotify, setMessages, threadId])

  useEffect(() => {
    if (!threadId) return

    refreshMessages()
    const intervalId = window.setInterval(refreshMessages, pollMs)
    const onFocus = () => refreshMessages()
    const onVisibilityChange = () => {
      if (!document.hidden) {
        if (originalTitleRef.current) document.title = originalTitleRef.current
        refreshMessages()
      }
    }

    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [pollMs, refreshMessages, threadId])

  const enableNotifications = useCallback(async () => {
    if (!threadId || typeof window === "undefined" || !("Notification" in window)) {
      setNotificationState("unsupported")
      return
    }

    if (Notification.permission === "denied") {
      setNotificationState("blocked")
      return
    }

    const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission()
    if (permission === "granted") {
      window.localStorage.setItem(preferenceKey(threadId), "1")
      setNotificationState("on")
    } else {
      setNotificationState(permission === "denied" ? "blocked" : "off")
    }
  }, [threadId])

  const disableNotifications = useCallback(() => {
    if (threadId && typeof window !== "undefined") {
      window.localStorage.removeItem(preferenceKey(threadId))
    }
    setNotificationState(getNotificationState(threadId))
  }, [threadId])

  return useMemo(
    () => ({
      disableNotifications,
      enableNotifications,
      notificationState,
      refreshMessages,
    }),
    [disableNotifications, enableNotifications, notificationState, refreshMessages]
  )
}
