"use server"

import { createClient } from "@/lib/supabase/server"
import type { ChatMessage, Reservation } from "@/lib/types"
import { sendClientEmailNotification, sendTelegramAdminNotification, sendTelegramClientNotification } from "@/lib/admin-notifications"
import {
  createLocalChatMessage,
  getLocalChatMessages,
  getLocalReservation,
  getLocalUnreadCount,
  markLocalMessagesAsRead,
} from "@/lib/local-store"
import { CLIENT_EMAIL_MARKER, getClientNotificationEmail, getClientTelegramChatId, isClosedThread } from "@/lib/chat-state"

export async function getReservation(id: string): Promise<Reservation | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching reservation:", error)
    return getLocalReservation(id)
  }

  return data
}

export async function getConversation(
  threadId: string
): Promise<{ reservation: Reservation | null; messages: ChatMessage[] }> {
  const [reservation, messages] = await Promise.all([
    getReservation(threadId),
    getChatMessages(threadId),
  ])

  return { reservation, messages }
}

export async function getChatMessages(reservationId: string): Promise<ChatMessage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("reservation_id", reservationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching chat messages:", error)
    return getLocalChatMessages(reservationId)
  }

  return data || []
}

export async function sendChatMessage(
  reservationId: string,
  message: string,
  senderType: "guest" | "admin",
  senderName: string
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  const supabase = await createClient()
  const currentMessages = await getChatMessages(reservationId)

  if (isClosedThread(currentMessages)) {
    return { success: false, error: "Este chat ya está cerrado. Para volver a escribir, abre una conversación nueva." }
  }

  if (senderType === "guest" && message.startsWith(CLIENT_EMAIL_MARKER)) {
    const email = message.split(":").slice(1).join(":").trim()
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
    const test = await sendClientEmailNotification({
      email,
      subject: "Avisos activados - El Macaco del Abuelo",
      preview: "Los avisos por email quedan activados. Cuando los propietarios respondan, recibirás un correo con el enlace al chat.",
      threadUrl: `${siteUrl || ""}/chat/${reservationId}`,
    })

    if (!test.sent) {
      return {
        success: false,
        error:
          test.reason === "missing_config"
            ? "Falta configurar el envío de emails: RESEND_API_KEY y RESEND_FROM_EMAIL."
            : "No hemos podido enviar el correo de prueba. Revisa el remitente o la configuración de Resend.",
      }
    }
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      reservation_id: reservationId,
      message,
      sender_type: senderType,
      sender_name: senderName,
    })
    .select()
    .single()

  if (error) {
    console.error("Error sending message:", error)
    const localMessage = await createLocalChatMessage({
      reservation_id: reservationId,
      message,
      sender_type: senderType,
      sender_name: senderName,
    })

    if (senderType === "guest") {
      await sendTelegramAdminNotification({
        threadId: reservationId,
        guestName: senderName,
        preview: message.slice(0, 240),
        kind: "new_message",
      }).catch(() => null)
    } else {
      const clientChatId = getClientTelegramChatId(currentMessages)
      const clientEmail = getClientNotificationEmail(currentMessages)
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
      if (clientChatId) {
        await sendTelegramClientNotification({
          chatId: clientChatId,
          title: "Nueva respuesta de los propietarios",
          preview: message.slice(0, 240),
          threadUrl: `${siteUrl || ""}/chat/${reservationId}`,
        }).catch(() => null)
      }
      if (clientEmail) {
        await sendClientEmailNotification({
          email: clientEmail,
          subject: "Nueva respuesta de El Macaco del Abuelo",
          preview: message.slice(0, 500),
          threadUrl: `${siteUrl || ""}/chat/${reservationId}`,
        }).catch(() => null)
      }
    }

    return { success: true, message: localMessage }
  }

  if (senderType === "guest") {
    await sendTelegramAdminNotification({
      threadId: reservationId,
      guestName: senderName,
      preview: message.slice(0, 240),
      kind: "new_message",
    }).catch(() => null)
  } else {
    const clientChatId = getClientTelegramChatId(currentMessages)
    const clientEmail = getClientNotificationEmail(currentMessages)
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
    if (clientChatId) {
      await sendTelegramClientNotification({
        chatId: clientChatId,
        title: "Nueva respuesta de los propietarios",
        preview: message.slice(0, 240),
        threadUrl: `${siteUrl || ""}/chat/${reservationId}`,
      }).catch(() => null)
    }
    if (clientEmail) {
      await sendClientEmailNotification({
        email: clientEmail,
        subject: "Nueva respuesta de El Macaco del Abuelo",
        preview: message.slice(0, 500),
        threadUrl: `${siteUrl || ""}/chat/${reservationId}`,
      }).catch(() => null)
    }
  }

  return { success: true, message: data }
}

export async function createWebConversation(input: {
  guest_name: string
  message: string
}): Promise<{ success: boolean; threadId?: string; error?: string }> {
  const supabase = await createClient()
  const threadId = crypto.randomUUID()
  const guestName = String(input.guest_name || "").trim()
  const message = String(input.message || "").trim()

  if (!guestName || guestName.length < 2) {
    return { success: false, error: "Necesitamos al menos un nombre para abrir la conversación." }
  }

  if (!message) {
    return { success: false, error: "Escribe un mensaje para abrir la conversación." }
  }

  const { error } = await supabase.from("chat_messages").insert({
    reservation_id: threadId,
    sender_type: "guest",
    sender_name: guestName,
    message,
    read: false,
  })

  if (error) {
    console.error("Error creating web conversation:", error)
    await createLocalChatMessage({
      reservation_id: threadId,
      sender_type: "guest",
      sender_name: guestName,
      message,
      read: false,
    })

    await sendTelegramAdminNotification({
      threadId,
      guestName,
      preview: message.slice(0, 240),
      kind: "new_thread",
    }).catch(() => null)

    return { success: true, threadId }
  }

  await sendTelegramAdminNotification({
    threadId,
    guestName,
    preview: message.slice(0, 240),
    kind: "new_thread",
  }).catch(() => null)

  return { success: true, threadId }
}

export async function createGiftConversation(input: {
  giverName: string
  giverContact: string
  recipientName: string
  occasion?: string
  preferredWindow?: string
  personalMessage: string
}): Promise<{ success: boolean; threadId?: string; giftUrl?: string; error?: string }> {
  const giverName = String(input.giverName || "").trim()
  const giverContact = String(input.giverContact || "").trim()
  const recipientName = String(input.recipientName || "").trim()
  const personalMessage = String(input.personalMessage || "").trim()

  if (giverName.length < 2) {
    return { success: false, error: "Escribe tu nombre para preparar el regalo." }
  }

  if (giverContact.length < 5) {
    return { success: false, error: "Deja un teléfono o email para poder coordinar el regalo." }
  }

  if (recipientName.length < 2) {
    return { success: false, error: "Escribe el nombre de la persona que recibirá el regalo." }
  }

  if (personalMessage.length < 12) {
    return { success: false, error: "Escribe una dedicatoria un poco más completa para la carta." }
  }

  const threadId = crypto.randomUUID()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
  const giftUrl = siteUrl ? `${siteUrl}/regalo/${threadId}` : `/regalo/${threadId}`
  const message = [
    "MODO REGALO ACTIVADO",
    `Regala: ${giverName}`,
    `Contacto de quien regala: ${giverContact}`,
    `Persona que recibirá la escapada: ${recipientName}`,
    input.occasion ? `Motivo: ${input.occasion}` : null,
    input.preferredWindow ? `Fechas orientativas: ${input.preferredWindow}` : "Fechas orientativas: las elegirá la persona regalada según disponibilidad.",
    "Dedicatoria para la carta:",
    personalMessage,
    `Enlace privado para compartir: ${giftUrl}`,
    "Siguiente paso: la casa revisa disponibilidad, precio y forma de formalizarlo por este mismo hilo.",
  ]
    .filter(Boolean)
    .join("\n")

  const supabase = await createClient()
  const { error } = await supabase.from("chat_messages").insert({
    reservation_id: threadId,
    sender_type: "guest",
    sender_name: giverName,
    message,
    read: false,
  })

  if (error) {
    console.error("Error creating gift conversation:", error)
    await createLocalChatMessage({
      reservation_id: threadId,
      sender_type: "guest",
      sender_name: giverName,
      message,
      read: false,
    })
  }

  await sendTelegramAdminNotification({
    threadId,
    guestName: giverName,
    preview: `MODO REGALO: ${giverName} quiere regalar una escapada a ${recipientName}. ${personalMessage}`.slice(0, 240),
    kind: "new_thread",
  }).catch(() => null)

  return { success: true, threadId, giftUrl }
}

export async function markMessagesAsRead(
  reservationId: string,
  senderType: "guest" | "admin"
): Promise<void> {
  const supabase = await createClient()
  
  // Mark messages from the OTHER sender as read
  const otherSenderType = senderType === "guest" ? "admin" : "guest"
  
  const { error } = await supabase
    .from("chat_messages")
    .update({ read: true })
    .eq("reservation_id", reservationId)
    .eq("sender_type", otherSenderType)
    .eq("read", false)

  if (error) {
    await markLocalMessagesAsRead(reservationId, senderType)
  }
}

export async function getUnreadCount(reservationId: string, forSenderType: "guest" | "admin"): Promise<number> {
  const supabase = await createClient()
  
  // Count unread messages from the OTHER sender
  const otherSenderType = forSenderType === "guest" ? "admin" : "guest"
  
  const { count, error } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("reservation_id", reservationId)
    .eq("sender_type", otherSenderType)
    .eq("read", false)

  if (error) {
    console.error("Error getting unread count:", error)
    return getLocalUnreadCount(forSenderType)
  }

  return count || 0
}
