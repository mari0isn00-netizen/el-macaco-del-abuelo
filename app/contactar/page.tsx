import { Header } from "@/components/landing/header"
import { MobileNav } from "@/components/landing/mobile-nav"
import { GrandpaFaqChat } from "@/components/chat/grandpa-faq-chat"
import { WebContactChat } from "@/components/chat/web-contact-chat"

export default function ContactarPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-primary">Contacto web</p>
            <h1 className="text-3xl font-serif font-bold text-foreground md:text-5xl">
              Hablad con nosotros sin salir de la página
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Primero podéis consultar dudas rápidas con el abuelo. Si no está vuestra pregunta, escribid en el chat real y llegará a la bandeja de administración.
            </p>
          </div>
          <div className="space-y-6">
            <GrandpaFaqChat />
            <WebContactChat />
          </div>
        </section>
      </main>
      <MobileNav />
    </>
  )
}
