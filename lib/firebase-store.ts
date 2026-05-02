import type { ChatMessage, Pricing, Reservation } from "@/lib/types"

export type StoreData = {
  reservations: Reservation[]
  chat_messages: ChatMessage[]
  pricing: Pricing[]
}

const defaultPath = "store"

function getFirebaseConfig() {
  const databaseUrl = (process.env.FIREBASE_DATABASE_URL || "").replace(/\/$/, "")
  const databasePath = (process.env.FIREBASE_DATABASE_PATH || defaultPath).replace(/^\/|\/$/g, "")
  const auth = process.env.FIREBASE_DATABASE_AUTH || process.env.FIREBASE_DATABASE_SECRET || ""

  return { auth, databasePath, databaseUrl }
}

export function isFirebaseStoreConfigured() {
  return Boolean(getFirebaseConfig().databaseUrl)
}

function getStoreUrl() {
  const { auth, databasePath, databaseUrl } = getFirebaseConfig()
  if (!databaseUrl) return null

  const authQuery = auth ? `?auth=${encodeURIComponent(auth)}` : ""
  return `${databaseUrl}/${databasePath}.json${authQuery}`
}

function normalizeStore(data: Partial<StoreData> | null): StoreData {
  return {
    reservations: Array.isArray(data?.reservations) ? data.reservations : [],
    chat_messages: Array.isArray(data?.chat_messages) ? data.chat_messages : [],
    pricing: Array.isArray(data?.pricing) ? data.pricing : [],
  }
}

export async function readFirebaseStore(): Promise<StoreData | null> {
  const url = getStoreUrl()
  if (!url) return null

  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`Firebase read failed: ${response.status} ${await response.text()}`)
  }

  return normalizeStore((await response.json()) as Partial<StoreData> | null)
}

export async function writeFirebaseStore(data: StoreData): Promise<boolean> {
  const url = getStoreUrl()
  if (!url) return false

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Firebase write failed: ${response.status} ${await response.text()}`)
  }

  return true
}
