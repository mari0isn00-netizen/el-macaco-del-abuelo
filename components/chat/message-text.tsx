const urlPattern = /(https?:\/\/[^\s]+|\/pago\/[a-zA-Z0-9-]+)/g
const exactUrlPattern = /^(https?:\/\/[^\s]+|\/pago\/[a-zA-Z0-9-]+)$/

export function MessageText({ text }: { text: string }) {
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
