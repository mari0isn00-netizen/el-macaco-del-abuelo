type WhatsAppNotificationInput = {
  threadId: string
  guestName: string
  preview: string
  kind: "new_thread" | "new_message"
}

function getConfig() {
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    adminTo: (process.env.WHATSAPP_ADMIN_TO || "")
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean),
    apiVersion: process.env.WHATSAPP_API_VERSION || "v23.0",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000",
  }
}

export function isWhatsAppConfigured() {
  const config = getConfig()
  return Boolean(config.accessToken && config.phoneNumberId && config.adminTo.length)
}

export async function sendWhatsAppAdminNotification(input: WhatsAppNotificationInput) {
  const config = getConfig()
  if (!isWhatsAppConfigured()) {
    return { sent: false, reason: "missing_config" as const }
  }

  const bodyText =
    input.kind === "new_thread"
      ? `Nuevo contacto web en El Macaco del Abuelo.\n\nInvitado: ${input.guestName}\nMensaje: ${input.preview}\nAbrir hilo: ${config.siteUrl}/admin/inbox/${input.threadId}`
      : `Nuevo mensaje web para los dueños.\n\nInvitado: ${input.guestName}\nMensaje: ${input.preview}\nAbrir hilo: ${config.siteUrl}/admin/inbox/${input.threadId}`

  const results = await Promise.all(
    config.adminTo.map(async (phone) => {
      const response = await fetch(
        `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: phone,
            type: "text",
            text: {
              preview_url: true,
              body: bodyText,
            },
          }),
          cache: "no-store",
        }
      )

      if (!response.ok) {
        return { phone, sent: false as const, detail: await response.text() }
      }

      return { phone, sent: true as const }
    })
  )

  const failed = results.filter((result) => !result.sent)
  if (failed.length) {
    return { sent: false, reason: "provider_error" as const, detail: JSON.stringify(failed) }
  }

  return { sent: true as const }
}
