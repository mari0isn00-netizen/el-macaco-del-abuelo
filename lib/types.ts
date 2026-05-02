export interface Reservation {
  id: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  deposit_amount?: number
  deposit_status?: 'pending' | 'submitted' | 'paid'
  deposit_paid_at?: string
  contract_accepted_at?: string
  contract_acceptance_name?: string
  contract_acceptance_dni?: string
  contract_signature?: string
  agreed_price?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  reservation_id?: string
  sender_type: 'guest' | 'admin'
  sender_name: string
  message: string
  read: boolean
  created_at: string
}

export interface ConversationThread {
  id: string
  guest_name: string
  last_message: string
  last_message_at: string
  unread_count: number
  reservation?: Reservation | null
}

export interface Pricing {
  id: string
  season: 'low' | 'mid' | 'high'
  price_per_night: number
  start_date?: string
  end_date?: string
  created_at: string
}

export interface PropertyConfig {
  id: string
  key: string
  value: unknown
  updated_at: string
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}
