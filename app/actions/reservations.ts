"use server"

import { createClient } from "@/lib/supabase/server"
import type { Reservation, Pricing } from "@/lib/types"
import { sendTelegramAdminNotification } from "@/lib/admin-notifications"
import {
  createLocalChatMessage,
  createLocalReservation,
  confirmLocalDepositPayment,
  deleteLocalReservation,
  getLocalBlockedDates,
  getLocalPricing,
  getLocalReservations,
  setLocalAgreedPrice,
  submitLocalContractAndDeposit,
  updateLocalReservationStatus,
} from "@/lib/local-store"

export async function getReservations(): Promise<Reservation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("check_in", { ascending: true })

  if (error) {
    console.error("Error fetching reservations:", error)
    return getLocalReservations()
  }

  return data || []
}

export async function getBlockedDates(): Promise<{ start: Date; end: Date }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reservations")
    .select("check_in, check_out")
    .in("status", ["confirmed", "pending"])

  if (error) {
    console.error("Error fetching blocked dates:", error)
    return getLocalBlockedDates()
  }

  return (data || []).map((r) => ({
    start: new Date(r.check_in),
    end: new Date(r.check_out),
  }))
}

export async function getPricing(): Promise<Pricing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pricing")
    .select("*")
    .order("season", { ascending: true })

  if (error) {
    console.error("Error fetching pricing:", error)
    return getLocalPricing()
  }

  return data || []
}

export async function calculatePrice(
  checkIn: Date,
  checkOut: Date
): Promise<{ total: number; nights: number; pricePerNight: number; needsOffer: boolean }> {
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (nights <= 0) {
    return { total: 0, nights: 0, pricePerNight: 0, needsOffer: false }
  }

  return {
    total: 0,
    nights,
    pricePerNight: 0,
    needsOffer: true,
  }
}

export async function createReservation(formData: {
  guest_name: string
  guest_email?: string
  guest_phone?: string
  check_in: string
  check_out: string
  guests: number
  notes?: string
}): Promise<{ success: boolean; reservation?: Reservation; error?: string }> {
  const supabase = await createClient()
  const safeName = String(formData.guest_name || "").trim()
  const generatedEmail = `web-${Date.now()}@elmacacodelabuelo.local`

  // Calculate total price
  const priceInfo = await calculatePrice(
    new Date(formData.check_in),
    new Date(formData.check_out)
  )

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      ...formData,
      guest_name: safeName,
      guest_email: formData.guest_email || generatedEmail,
      guest_phone: formData.guest_phone || null,
      total_price: priceInfo.total,
      agreed_price: priceInfo.total,
      status: "pending",
      deposit_amount: 100,
      deposit_status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating reservation:", error)
    const reservation = await createLocalReservation({
      ...formData,
      guest_name: safeName,
      guest_email: formData.guest_email || generatedEmail,
      guest_phone: formData.guest_phone || undefined,
      total_price: priceInfo.total,
    })

    const introMessage = [
      "Nueva solicitud de estancia enviada desde la web.",
      `Nombre: ${safeName}`,
      formData.guest_phone ? `Teléfono: ${formData.guest_phone}` : null,
      `Fechas: ${formData.check_in} - ${formData.check_out}`,
      `Huéspedes: ${formData.guests}`,
      formData.notes ? `Mensaje: ${formData.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    await createLocalChatMessage({
      reservation_id: reservation.id,
      sender_type: "guest",
      sender_name: safeName,
      message: introMessage,
      read: false,
    })

    await sendTelegramAdminNotification({
      threadId: reservation.id,
      guestName: safeName,
      preview: introMessage.slice(0, 240),
      kind: "new_thread",
    }).catch(() => null)

    return { success: true, reservation }
  }

  const introMessage = [
    "Nueva solicitud de estancia enviada desde la web.",
    `Nombre: ${safeName}`,
    formData.guest_phone ? `Teléfono: ${formData.guest_phone}` : null,
    `Fechas: ${formData.check_in} - ${formData.check_out}`,
    `Huéspedes: ${formData.guests}`,
    formData.notes ? `Mensaje: ${formData.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  await supabase.from("chat_messages").insert({
    reservation_id: data.id,
    sender_type: "guest",
    sender_name: safeName,
    message: introMessage,
    read: false,
  })

  await sendTelegramAdminNotification({
    threadId: data.id,
    guestName: safeName,
    preview: introMessage.slice(0, 240),
    kind: "new_thread",
  }).catch(() => null)

  return { success: true, reservation: data }
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

export async function acceptContractAndSubmitDeposit(input: {
  reservationId: string
  acceptanceName: string
  acceptanceDni: string
  signature: string
}): Promise<{ success: boolean; reservation?: Reservation; error?: string }> {
  const supabase = await createClient()
  const acceptanceName = String(input.acceptanceName || "").trim()

  if (acceptanceName.length < 2) {
    return { success: false, error: "Escribe el nombre de quien acepta el contrato." }
  }
  const acceptanceDni = String(input.acceptanceDni || "").trim().toUpperCase()
  const signature = String(input.signature || "").trim()

  if (acceptanceDni.length < 6) {
    return { success: false, error: "Escribe un DNI/NIE válido para el contrato." }
  }

  if (signature.length < 2) {
    return { success: false, error: "Dibuja la firma para aceptar el contrato." }
  }

  const acceptedAt = new Date().toISOString()
  const update = {
    deposit_amount: 100,
    deposit_status: "submitted",
    contract_accepted_at: acceptedAt,
    contract_acceptance_name: acceptanceName,
    contract_acceptance_dni: acceptanceDni,
    contract_signature: signature,
    updated_at: acceptedAt,
  }

  const { data, error } = await supabase
    .from("reservations")
    .update(update)
    .eq("id", input.reservationId)
    .select()
    .single()

  if (error) {
    console.error("Error submitting contract and deposit:", error)
    const reservation = await submitLocalContractAndDeposit({
      id: input.reservationId,
      acceptanceName,
      acceptanceDni,
      signature,
    })

    if (!reservation) {
      return { success: false, error: "No hemos encontrado esta reserva." }
    }

    await createLocalChatMessage({
      reservation_id: reservation.id,
      sender_type: "guest",
      sender_name: acceptanceName,
      message: "Contrato aceptado. El huésped indica que ha enviado la señal de reserva por Bizum, pendiente de confirmación.",
      read: false,
    })

    return { success: true, reservation }
  }

  await supabase.from("chat_messages").insert({
    reservation_id: input.reservationId,
    sender_type: "guest",
    sender_name: acceptanceName,
    message: "Contrato aceptado. El huésped indica que ha enviado la señal de reserva por Bizum, pendiente de confirmación.",
    read: false,
  })

  return { success: true, reservation: data }
}

export async function confirmDepositPayment(input: {
  reservationId: string
  senderName: string
}): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString()
  const supabase = await createClient()

  const { error } = await supabase
    .from("reservations")
    .update({
      deposit_status: "paid",
      deposit_paid_at: now,
      status: "confirmed",
      updated_at: now,
    })
    .eq("id", input.reservationId)

  if (error) {
    console.error("Error confirming deposit:", error)
    const reservation = await confirmLocalDepositPayment(input.reservationId)
    if (!reservation) {
      return { success: false, error: "No hemos encontrado esta reserva." }
    }
  } else {
    await confirmLocalDepositPayment(input.reservationId)
  }

  const text = [
    "SEÑAL CONFIRMADA POR LA CASA",
    "La casa ha comprobado el Bizum de 100 EUR y deja la reserva confirmada en la web.",
    "Siguiente paso: usad este mismo chat para coordinar llegada, acceso y cualquier detalle previo.",
  ].join("\n")

  const { error: messageError } = await supabase.from("chat_messages").insert({
    reservation_id: input.reservationId,
    sender_type: "admin",
    sender_name: input.senderName,
    message: text,
    read: false,
  })

  if (messageError) {
    await createLocalChatMessage({
      reservation_id: input.reservationId,
      sender_type: "admin",
      sender_name: input.senderName,
      message: text,
      read: false,
    })
  }

  return { success: true }
}

export async function registerOffer(input: {
  reservationId: string
  amount: number
  senderType: "guest" | "admin"
  senderName: string
  note?: string
}): Promise<{ success: boolean; message?: string; error?: string }> {
  if (input.senderType !== "admin") {
    return { success: false, error: "El precio lo establece el propietario tras revisar la solicitud." }
  }

  const amount = Number(input.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Indica una cantidad válida." }
  }

  const text = [
    `PRECIO ESTABLECIDO POR EL PROPIETARIO: ${amount} EUR`,
    input.note ? `Nota: ${input.note}` : null,
    "El huésped puede aceptar o rechazar este importe por el chat.",
  ]
    .filter(Boolean)
    .join("\n")

  const supabase = await createClient()
  const { error } = await supabase.from("chat_messages").insert({
    reservation_id: input.reservationId,
    sender_type: input.senderType,
    sender_name: input.senderName,
    message: text,
    read: false,
  })

  await setLocalAgreedPrice(input.reservationId, amount)
  await supabase
    .from("reservations")
    .update({ agreed_price: amount, total_price: amount, updated_at: new Date().toISOString() })
    .eq("id", input.reservationId)
    .then(() => null)

  if (error) {
    await createLocalChatMessage({
      reservation_id: input.reservationId,
      sender_type: input.senderType,
      sender_name: input.senderName,
      message: text,
      read: false,
    })
  }

  return { success: true, message: text }
}

export async function requestContractAndPayment(input: {
  reservationId: string
  senderName: string
  note?: string
}): Promise<{ success: boolean; error?: string }> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
  const contractUrl = siteUrl ? `${siteUrl}/pago/${input.reservationId}` : `/pago/${input.reservationId}`
  const text = [
    "CONTRATO Y SEÑAL DISPONIBLES",
    "Ya podéis revisar el contrato completo, indicar DNI/NIE, dibujar la firma y registrar la señal de reserva.",
    `Enlace: ${contractUrl}`,
    input.note ? `Nota: ${input.note}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  const supabase = await createClient()
  const { error } = await supabase.from("chat_messages").insert({
    reservation_id: input.reservationId,
    sender_type: "admin",
    sender_name: input.senderName,
    message: text,
    read: false,
  })

  if (error) {
    await createLocalChatMessage({
      reservation_id: input.reservationId,
      sender_type: "admin",
      sender_name: input.senderName,
      message: text,
      read: false,
    })
  }

  return { success: true }
}

export async function sendReservationDecision(input: {
  reservationId: string
  senderType: "guest" | "admin"
  senderName: string
  decision: "reject_offer" | "cancel_request" | "accept_offer"
  amount?: number
  paymentDate?: string
  note?: string
}): Promise<{ success: boolean; error?: string }> {
  const text = (() => {
    if (input.decision === "accept_offer") {
      const amount = Number(input.amount)
      return [
        `PRECIO ACEPTADO: ${Number.isFinite(amount) && amount > 0 ? `${amount} EUR` : "importe acordado"}`,
        input.paymentDate ? `Día de pago acordado: ${input.paymentDate}` : "Día de pago: pendiente de acordar",
        input.note ? `Nota: ${input.note}` : null,
        "Este acuerdo queda registrado en el hilo web.",
      ]
        .filter(Boolean)
        .join("\n")
    }

    if (input.decision === "reject_offer") {
      return ["PRECIO RECHAZADO", input.note ? `Motivo: ${input.note}` : null, "Podéis seguir hablando por el chat antes de cerrar la estancia."]
        .filter(Boolean)
        .join("\n")
    }

    return ["SOLICITUD CANCELADA", input.note ? `Motivo: ${input.note}` : null, "La solicitud queda cancelada en el hilo web."]
      .filter(Boolean)
      .join("\n")
  })()

  if (input.decision === "cancel_request") {
    await updateReservationStatus(input.reservationId, "cancelled")
  }
  if (input.decision === "accept_offer" && input.amount) {
    await setLocalAgreedPrice(input.reservationId, Number(input.amount))
  }

  const supabase = await createClient()
  const { error } = await supabase.from("chat_messages").insert({
    reservation_id: input.reservationId,
    sender_type: input.senderType,
    sender_name: input.senderName,
    message: text,
    read: false,
  })

  if (error) {
    await createLocalChatMessage({
      reservation_id: input.reservationId,
      sender_type: input.senderType,
      sender_name: input.senderName,
      message: text,
      read: false,
    })
  }

  return { success: true }
}

export async function deleteReservation(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  await supabase.from("chat_messages").delete().eq("reservation_id", id)
  const { error } = await supabase.from("reservations").delete().eq("id", id)

  if (error) {
    console.error("Error deleting reservation:", error)
    const deleted = await deleteLocalReservation(id)
    return deleted ? { success: true } : { success: false, error: error.message }
  }

  await deleteLocalReservation(id)
  return { success: true }
}


