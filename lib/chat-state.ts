import type { ChatMessage } from "@/lib/types"

export const CLOSED_THREAD_MARKER = "HILO CERRADO"
export const CLIENT_TELEGRAM_MARKER = "AVISOS TELEGRAM ACTIVADOS"
export const CLIENT_EMAIL_MARKER = "AVISOS EMAIL ACTIVADOS"

export function isClosedThread(messages: Pick<ChatMessage, "message">[]) {
  return messages.some((message) => String(message.message || "").startsWith(CLOSED_THREAD_MARKER))
}

export function getClientTelegramChatId(messages: Pick<ChatMessage, "message">[]) {
  const marker = [...messages]
    .reverse()
    .find((message) => String(message.message || "").startsWith(CLIENT_TELEGRAM_MARKER))

  if (!marker) return null
  const value = String(marker.message).split(":").slice(1).join(":").trim()
  return /^-?\d{5,}$/.test(value) ? value : null
}

export function getClientNotificationEmail(messages: Pick<ChatMessage, "message">[]) {
  const marker = [...messages]
    .reverse()
    .find((message) => String(message.message || "").startsWith(CLIENT_EMAIL_MARKER))

  if (!marker) return null
  const value = String(marker.message).split(":").slice(1).join(":").trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null
}
