import { promises as fs } from "fs"
import path from "path"
import type { ChatMessage, ConversationThread, Pricing, Reservation } from "@/lib/types"

type StoreData = {
  reservations: Reservation[]
  chat_messages: ChatMessage[]
  pricing: Pricing[]
}

const storeDir = path.join(process.cwd(), ".data")
const storePath = path.join(storeDir, "local-store.json")

const defaultPricing: Pricing[] = []

const emptyStore = (): StoreData => ({
  reservations: [],
  chat_messages: [],
  pricing: defaultPricing,
})

async function readStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(storePath, "utf8")
    const parsed = JSON.parse(raw) as Partial<StoreData>

    return {
      reservations: parsed.reservations || [],
      chat_messages: parsed.chat_messages || [],
      pricing: parsed.pricing?.length ? parsed.pricing : defaultPricing,
    }
  } catch {
    return emptyStore()
  }
}

async function writeStore(data: StoreData): Promise<void> {
  await fs.mkdir(storeDir, { recursive: true })
  await fs.writeFile(storePath, JSON.stringify(data, null, 2), "utf8")
}

export async function getLocalReservation(id: string): Promise<Reservation | null> {
  const store = await readStore()
  return store.reservations.find((reservation) => reservation.id === id) || null
}

export async function getLocalReservations(): Promise<Reservation[]> {
  const store = await readStore()
  return [...store.reservations].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getLocalBlockedDates(): Promise<{ start: Date; end: Date }[]> {
  const reservations = await getLocalReservations()
  return reservations
    .filter((reservation) => reservation.status === "confirmed" || reservation.status === "pending")
    .map((reservation) => ({
      start: new Date(reservation.check_in),
      end: new Date(reservation.check_out),
    }))
}

export async function getLocalPricing(): Promise<Pricing[]> {
  const store = await readStore()
  return store.pricing
}

export async function createLocalReservation(input: {
  guest_name: string
  guest_email?: string
  check_in: string
  check_out: string
  guests: number
  notes?: string
  total_price: number
}): Promise<Reservation> {
  const store = await readStore()
  const now = new Date().toISOString()
  const reservation: Reservation = {
    id: crypto.randomUUID(),
    guest_name: input.guest_name,
    guest_email: input.guest_email || `web-${Date.now()}@elmacacodelabuelo.local`,
    guest_phone: undefined,
    check_in: input.check_in,
    check_out: input.check_out,
    guests: input.guests,
    total_price: input.total_price,
    agreed_price: input.total_price,
    status: "pending",
    deposit_amount: 100,
    deposit_status: "pending",
    notes: input.notes,
    created_at: now,
    updated_at: now,
  }

  store.reservations.push(reservation)
  await writeStore(store)
  return reservation
}

export async function updateLocalReservationStatus(
  id: string,
  status: Reservation["status"]
): Promise<boolean> {
  const store = await readStore()
  const reservation = store.reservations.find((item) => item.id === id)
  if (!reservation) return false

  reservation.status = status
  reservation.updated_at = new Date().toISOString()
  await writeStore(store)
  return true
}

export async function submitLocalContractAndDeposit(input: {
  id: string
  acceptanceName: string
  acceptanceDni: string
  signature: string
}): Promise<Reservation | null> {
  const store = await readStore()
  const reservation = store.reservations.find((item) => item.id === input.id)
  if (!reservation) return null

  const now = new Date().toISOString()
  reservation.deposit_amount = 100
  reservation.deposit_status = "submitted"
  reservation.contract_accepted_at = now
  reservation.contract_acceptance_name = input.acceptanceName
  reservation.contract_acceptance_dni = input.acceptanceDni
  reservation.contract_signature = input.signature
  reservation.updated_at = now
  await writeStore(store)
  return reservation
}

export async function setLocalAgreedPrice(id: string, amount: number): Promise<Reservation | null> {
  const store = await readStore()
  const reservation = store.reservations.find((item) => item.id === id)
  if (!reservation) return null

  reservation.agreed_price = amount
  reservation.total_price = amount
  reservation.updated_at = new Date().toISOString()
  await writeStore(store)
  return reservation
}

export async function deleteLocalReservation(id: string): Promise<boolean> {
  const store = await readStore()
  const before = store.reservations.length
  store.reservations = store.reservations.filter((reservation) => reservation.id !== id)
  store.chat_messages = store.chat_messages.filter((message) => message.reservation_id !== id)

  if (store.reservations.length === before) return false
  await writeStore(store)
  return true
}

export async function deleteLocalThread(threadId: string): Promise<boolean> {
  const store = await readStore()
  const before = store.chat_messages.length
  store.chat_messages = store.chat_messages.filter((message) => message.reservation_id !== threadId)

  if (store.chat_messages.length === before) return false
  await writeStore(store)
  return true
}

export async function getLocalChatMessages(threadId: string): Promise<ChatMessage[]> {
  const store = await readStore()
  return store.chat_messages
    .filter((message) => message.reservation_id === threadId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export async function createLocalChatMessage(input: {
  reservation_id: string
  sender_type: "guest" | "admin"
  sender_name: string
  message: string
  read?: boolean
}): Promise<ChatMessage> {
  const store = await readStore()
  const chatMessage: ChatMessage = {
    id: crypto.randomUUID(),
    reservation_id: input.reservation_id,
    sender_type: input.sender_type,
    sender_name: input.sender_name,
    message: input.message,
    read: input.read ?? false,
    created_at: new Date().toISOString(),
  }

  store.chat_messages.push(chatMessage)
  await writeStore(store)
  return chatMessage
}

export async function markLocalMessagesAsRead(
  threadId: string,
  senderType: "guest" | "admin"
): Promise<void> {
  const store = await readStore()
  const otherSenderType = senderType === "guest" ? "admin" : "guest"
  let changed = false

  for (const message of store.chat_messages) {
    if (message.reservation_id === threadId && message.sender_type === otherSenderType && !message.read) {
      message.read = true
      changed = true
    }
  }

  if (changed) await writeStore(store)
}

export async function getLocalUnreadCount(forSenderType?: "guest" | "admin"): Promise<number> {
  const store = await readStore()
  if (!forSenderType) {
    return store.chat_messages.filter((message) => message.sender_type === "guest" && !message.read).length
  }

  const otherSenderType = forSenderType === "guest" ? "admin" : "guest"
  return store.chat_messages.filter((message) => message.sender_type === otherSenderType && !message.read).length
}

export async function getLocalThreads(): Promise<ConversationThread[]> {
  const store = await readStore()
  const grouped = new Map<string, ChatMessage[]>()

  for (const message of store.chat_messages) {
    if (!message.reservation_id) continue
    const bucket = grouped.get(message.reservation_id) || []
    bucket.push(message)
    grouped.set(message.reservation_id, bucket)
  }

  return Array.from(grouped.entries())
    .map(([threadId, messages]) => {
      const sorted = [...messages].sort((a, b) => b.created_at.localeCompare(a.created_at))
      const lastMessage = sorted[0]
      const firstGuestMessage = [...sorted].reverse().find((message) => message.sender_type === "guest")
      const reservation = store.reservations.find((item) => item.id === threadId) || null

      return {
        id: threadId,
        guest_name: reservation?.guest_name || firstGuestMessage?.sender_name || lastMessage?.sender_name || "Invitado",
        last_message: lastMessage?.message || "",
        last_message_at: lastMessage?.created_at || "",
        unread_count: messages.filter((message) => message.sender_type === "guest" && !message.read).length,
        reservation,
      }
    })
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
}
