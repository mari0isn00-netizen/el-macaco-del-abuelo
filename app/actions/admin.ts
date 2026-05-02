"use server"

import { redirect } from "next/navigation"
import {
  validateAdminCredentials,
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
} from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import type { Reservation, ChatMessage, ConversationThread } from "@/lib/types"
import {
  getLocalChatMessages,
  getLocalReservation,
  getLocalReservations,
  getLocalThreads,
  getLocalUnreadCount,
  deleteLocalThread,
  updateLocalReservationStatus,
} from "@/lib/local-store"

export async function adminLogin(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  const isValid = await validateAdminCredentials(username, password)

  if (!isValid) {
    return { error: "Credenciales incorrectas" }
  }

  await createAdminSession()
  redirect("/admin")
}

export async function adminLogout(): Promise<void> {
  await destroyAdminSession()
  redirect("/admin/login")
}

export async function checkAdminAuth(): Promise<boolean> {
  return isAdminAuthenticated()
}

export async function getAdminReservations(): Promise<Reservation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reservations:", error)
    return getLocalReservations()
  }

  return data || []
}

export async function getReservationWithMessages(
  id: string
): Promise<{ reservation: Reservation | null; messages: ChatMessage[] }> {
  const supabase = await createClient()

  const { data: reservation, error: resError } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single()

  if (resError) {
    console.error("Error fetching reservation:", resError)
    return {
      reservation: await getLocalReservation(id),
      messages: await getLocalChatMessages(id),
    }
  }

  const { data: messages, error: msgError } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("reservation_id", id)
    .order("created_at", { ascending: true })

  if (msgError) {
    console.error("Error fetching messages:", msgError)
    return { reservation, messages: await getLocalChatMessages(id) }
  }

  return { reservation, messages: messages || [] }
}

export async function updateReservationStatus(
  id: string,
  status: Reservation["status"]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("reservations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating reservation:", error)
    const updated = await updateLocalReservationStatus(id, status)
    return updated ? { success: true } : { success: false, error: error.message }
  }

  return { success: true }
}

export async function getUnreadMessagesCount(): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("sender_type", "guest")
    .eq("read", false)

  if (error) {
    console.error("Error getting unread count:", error)
    return getLocalUnreadCount()
  }

  return count || 0
}

export async function getAdminThreads(): Promise<ConversationThread[]> {
  const supabase = await createClient()

  const { data: messages, error } = await supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error || !messages) {
    console.error("Error fetching admin threads:", error)
    return getLocalThreads()
  }

  const grouped = new Map<string, ChatMessage[]>()
  messages.forEach((message) => {
    const threadId = message.reservation_id
    if (!threadId) return
    const bucket = grouped.get(threadId) || []
    bucket.push(message)
    grouped.set(threadId, bucket)
  })

  const threadIds = Array.from(grouped.keys())
  let reservationsById = new Map<string, Reservation>()
  if (threadIds.length) {
    const { data: reservations } = await supabase
      .from("reservations")
      .select("*")
      .in("id", threadIds)

    reservationsById = new Map((reservations || []).map((reservation) => [reservation.id, reservation]))
  }

  return threadIds.map((threadId) => {
    const threadMessages = grouped.get(threadId) || []
    const lastMessage = threadMessages[0]
    const firstGuestMessage = [...threadMessages].reverse().find((item) => item.sender_type === "guest")
    const unreadCount = threadMessages.filter((item) => item.sender_type === "guest" && !item.read).length

    return {
      id: threadId,
      guest_name: firstGuestMessage?.sender_name || lastMessage?.sender_name || "Invitado",
      last_message: lastMessage?.message || "",
      last_message_at: lastMessage?.created_at || "",
      unread_count: unreadCount,
      reservation: reservationsById.get(threadId) || null,
    }
  }).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
}

export async function getReservationStats(): Promise<{
  pending: number
  confirmed: number
  total: number
  revenue: number
}> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("reservations").select("status, total_price")

  if (error || !data) {
    const localReservations = await getLocalReservations()
    const pending = localReservations.filter((r) => r.status === "pending").length
    const confirmed = localReservations.filter((r) => r.status === "confirmed").length
    const revenue = localReservations
      .filter((r) => r.status === "confirmed" || r.status === "completed")
      .reduce((sum, r) => sum + Number(r.total_price), 0)

    return { pending, confirmed, total: localReservations.length, revenue }
  }

  const pending = data.filter((r) => r.status === "pending").length
  const confirmed = data.filter((r) => r.status === "confirmed").length
  const revenue = data
    .filter((r) => r.status === "confirmed" || r.status === "completed")
    .reduce((sum, r) => sum + Number(r.total_price), 0)

  return {
    pending,
    confirmed,
    total: data.length,
    revenue,
  }
}

export async function closeWebThread(threadId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("reservation_id", threadId)

  if (error) {
    console.error("Error closing web thread:", error)
    const deleted = await deleteLocalThread(threadId)
    return deleted ? { success: true } : { success: false, error: error.message }
  }

  await deleteLocalThread(threadId)
  return { success: true }
}
