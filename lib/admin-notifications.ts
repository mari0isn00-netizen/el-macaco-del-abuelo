type AdminNotificationInput = {
  threadId: string
  guestName: string
  preview: string
  kind: "new_thread" | "new_message"
}

function getConfig() {
  return {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
    telegramChatIds: (process.env.TELEGRAM_ADMIN_CHAT_ID || "")
      .split(",")
      .map((chatId) => chatId.trim())
      .filter(Boolean),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000",
  }
}

export function isTelegramConfigured() {
  const config = getConfig()
  return Boolean(config.telegramBotToken && config.telegramChatIds.length)
}

export async function sendTelegramAdminNotification(input: AdminNotificationInput) {
  const config = getConfig()
  if (!isTelegramConfigured()) {
    return { sent: false, reason: "missing_config" as const }
  }

  const title = input.kind === "new_thread" ? "Nueva conversación web" : "Nuevo mensaje web"
  const text = [
    `🏡 ${title} - El Macaco del Abuelo`,
    "",
    `Invitado: ${input.guestName}`,
    `Mensaje: ${input.preview}`,
    "",
    `Abrir hilo: ${config.siteUrl}/admin/inbox/${input.threadId}`,
  ].join("\n")

  const results = await Promise.all(
    config.telegramChatIds.map(async (chatId) => {
      const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
        cache: "no-store",
      })

      if (!response.ok) {
        return { chatId, sent: false as const, detail: await response.text() }
      }

      return { chatId, sent: true as const }
    })
  )

  const failed = results.filter((result) => !result.sent)
  if (failed.length) {
    return { sent: false, reason: "provider_error" as const, detail: JSON.stringify(failed) }
  }

  return { sent: true as const }
}

export async function sendTelegramClientNotification(input: {
  chatId: string
  title: string
  preview: string
  threadUrl: string
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN || ""
  if (!token || !input.chatId) {
    return { sent: false, reason: "missing_config" as const }
  }

  const text = [
    `El Macaco del Abuelo`,
    input.title,
    "",
    input.preview,
    "",
    `Responder: ${input.threadUrl}`,
  ].join("\n")

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: input.chatId,
      text,
      disable_web_page_preview: true,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    return { sent: false, reason: "provider_error" as const, detail: await response.text() }
  }

  return { sent: true as const }
}

export async function sendClientEmailNotification(input: {
  email: string
  subject: string
  preview: string
  threadUrl: string
}) {
  const apiKey = process.env.RESEND_API_KEY || ""
  const from = process.env.RESEND_FROM_EMAIL || "El Macaco del Abuelo <onboarding@resend.dev>"

  if (!apiKey || !input.email) {
    return { sent: false, reason: "missing_config" as const }
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.email,
      subject: input.subject,
      html: `
        <div style="font-family: Georgia, serif; background:#fff7ea; color:#2f2114; padding:28px; border-radius:16px;">
          <p style="letter-spacing:.18em; text-transform:uppercase; color:#704624; font-size:12px;">El Macaco del Abuelo</p>
          <h1 style="font-size:28px; margin:8px 0 16px;">Tienes una nueva respuesta</h1>
          <p style="font-size:16px; line-height:1.6;">${input.preview.replace(/</g, "&lt;").slice(0, 500)}</p>
          <p style="margin-top:24px;">
            <a href="${input.threadUrl}" style="background:#704624; color:#fff7ea; padding:12px 18px; border-radius:999px; text-decoration:none; font-weight:bold;">Abrir conversación</a>
          </p>
        </div>
      `,
      text: `El Macaco del Abuelo\n\nTienes una nueva respuesta:\n${input.preview}\n\nAbrir conversación: ${input.threadUrl}`,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error("Resend email failed:", {
      status: response.status,
      from,
      toDomain: input.email.split("@")[1] || "",
      detail,
    })
    return { sent: false, reason: "provider_error" as const, detail }
  }

  return { sent: true as const }
}
