import { CheckCircle2, FileSignature, HandCoins, Info, XCircle } from "lucide-react"

const urlPattern = /(https?:\/\/[^\s]+|\/pago\/[a-zA-Z0-9-]+)/g
const exactUrlPattern = /^(https?:\/\/[^\s]+|\/pago\/[a-zA-Z0-9-]+)$/

const actionStyles = [
  {
    marker: "PRECIO ESTABLECIDO POR EL PROPIETARIO",
    title: "Precio fijado por la casa",
    icon: HandCoins,
    className: "border-amber-200 bg-amber-50 text-amber-950",
  },
  {
    marker: "CONTRATO Y SEÑAL DISPONIBLES",
    title: "Contrato listo para revisar",
    icon: FileSignature,
    className: "border-primary/25 bg-primary/10 text-foreground",
  },
  {
    marker: "PRECIO ACEPTADO",
    title: "Precio aceptado",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
  {
    marker: "PRECIO RECHAZADO",
    title: "Precio rechazado",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-950",
  },
  {
    marker: "SOLICITUD CANCELADA",
    title: "Solicitud cancelada",
    icon: XCircle,
    className: "border-slate-200 bg-slate-50 text-slate-950",
  },
  {
    marker: "Contrato aceptado.",
    title: "Contrato firmado",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
]

function LinkedText({ text }: { text: string }) {
  const parts = text.split(urlPattern)

  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (!exactUrlPattern.test(part)) return <span key={index}>{part}</span>

        return (
          <a key={index} href={part} className="font-semibold underline underline-offset-2">
            {part}
          </a>
        )
      })}
    </span>
  )
}

export function MessageText({ text }: { text: string }) {
  const action = actionStyles.find((item) => text.startsWith(item.marker))

  if (!action) {
    return <LinkedText text={text} />
  }

  const Icon = action.icon || Info
  const lines = text.split("\n").filter(Boolean)
  const body = lines[0]?.startsWith(action.marker) ? lines.slice(1) : lines
  const amount = text.match(/(\d+(?:[.,]\d+)?)\s*EUR/)?.[0]
  const link = lines.find((line) => line.startsWith("Enlace:"))?.replace("Enlace:", "").trim()

  return (
    <span className={`block rounded-2xl border p-3 shadow-sm ${action.className}`}>
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4" />
        {action.title}
      </span>
      {amount ? <span className="mt-2 block font-serif text-2xl font-bold">{amount}</span> : null}
      <span className="mt-2 block space-y-1 text-sm leading-relaxed">
        {body.map((line, index) => {
          if (line.startsWith("Enlace:") && link) {
            return (
              <a
                key={index}
                href={link}
                className="mt-2 inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Abrir contrato y firma
              </a>
            )
          }

          return (
            <span key={index} className="block">
              <LinkedText text={line} />
            </span>
          )
        })}
      </span>
    </span>
  )
}
