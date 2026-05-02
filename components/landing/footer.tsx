import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground py-16 text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-4 font-serif text-2xl font-bold">El Macaco del Abuelo</h3>
            <p className="max-w-md leading-relaxed text-background/70">
              Un refugio familiar en Las Monjas, Carmona, con origen emocional en Arahal y una reserva gestionada
              desde su propia casa digital.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-background/90">Navegacion</h4>
            <ul className="space-y-2">
              <li><a href="#inicio" className="text-background/70 transition-colors hover:text-background">Inicio</a></li>
              <li><a href="#propiedad" className="text-background/70 transition-colors hover:text-background">La casa</a></li>
              <li><a href="#galeria" className="text-background/70 transition-colors hover:text-background">Galeria</a></li>
              <li><Link href="/reservar" className="text-background/70 transition-colors hover:text-background">Reservar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-background/90">Seguir por aqui</h4>
            <ul className="space-y-2 text-background/70">
              <li>Las Monjas, Carmona, Sevilla</li>
              <li><Link href="/contactar" className="transition-colors hover:text-background">Abrir chat web</Link></li>
              <li><Link href="/reservar" className="transition-colors hover:text-background">Pedir estancia</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/20 pt-8 md:flex-row">
          <p className="text-sm text-background/50">© {currentYear} El Macaco del Abuelo. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/contactar" className="text-background/50 transition-colors hover:text-background">Chat y seguimiento</Link>
            <Link href="/reservar" className="text-background/50 transition-colors hover:text-background">Solicitud de estancia</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

