import type { ChatMessage } from "@/lib/types"

export const CLOSED_THREAD_MARKER = "HILO CERRADO"

export function isClosedThread(messages: Pick<ChatMessage, "message">[]) {
  return messages.some((message) => String(message.message || "").startsWith(CLOSED_THREAD_MARKER))
}
