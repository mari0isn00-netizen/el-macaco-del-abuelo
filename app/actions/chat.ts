"use server"

import { createClient } from "@/lib/supabase/server"
import type { ChatMessage, Reservation } from "@/lib/types"
import { sendTelegramAdminNotification } from "@/lib/admin-notifications"
import {
  createLocalChatMessage,
  getLocalChatMessages,
  getLocalReservation,
  getLocalUnreadCount,
  markLocalMessagesAsRead,
} from "@/lib/local-store"

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
