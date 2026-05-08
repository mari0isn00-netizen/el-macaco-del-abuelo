import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "El Macaco del Abuelo | Refugio en Carmona",
  description:
    "Apartamento independiente en una parcela familiar compartida con los dueños en Urbanización Las Monjas, Carmona, con piscina, jacuzzi y jardín. Reserva, seguimiento y conversación real desde la propia web.",
  keywords: ["apartamento", "Carmona", "Sevilla", "reserva web", "piscina", "parcela familiar"],
  openGraph: {
    title: "El Macaco del Abuelo | Refugio en Carmona",
    description:
      "Apartamento independiente en una parcela familiar compartida con los dueños en Urbanización Las Monjas, Carmona, con piscina, jacuzzi y jardín. Reserva y seguimiento desde la propia web.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
