import type { Reservation } from "@/lib/types"
import { formatContractDate, getCancellationDeadline } from "@/lib/contract"

interface ContractDocumentProps {
  reservation: Reservation
  previewSignature?: string
}

export function ContractDocument({ reservation, previewSignature }: ContractDocumentProps) {
  const signature = previewSignature || reservation.contract_signature
  const cancellationDeadline = formatContractDate(getCancellationDeadline(reservation))
  const total = reservation.agreed_price || reservation.total_price
  const priceText = total > 0 ? `${total} EUR` : "pendiente de fijar por la casa"

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-[#fffaf3] text-[#2f241d] shadow-sm print:border-0 print:shadow-none">
      <div className="border-b border-[#d8c6ae] bg-[#f4eadb] px-6 py-7 sm:px-10">
        <p className="text-xs uppercase tracking-[0.32em] text-[#8a5a33]">El Macaco del Abuelo</p>
        <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Contrato de estancia familiar</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d5a49]">
          Alojamiento independiente dentro de una parcela compartida con los dueños en Urbanización Las Monjas, parcela 121,
          Carmona, Sevilla. Este documento recoge las condiciones esenciales antes de formalizar la reserva.
        </p>
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-3 sm:p-10">
        <div className="rounded-xl border border-[#ddccb6] bg-white/55 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8a5a33]">Entrada</p>
          <p className="mt-2 font-medium">{formatContractDate(reservation.check_in)}</p>
        </div>
        <div className="rounded-xl border border-[#ddccb6] bg-white/55 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8a5a33]">Salida</p>
          <p className="mt-2 font-medium">{formatContractDate(reservation.check_out)}</p>
        </div>
        <div className="rounded-xl border border-[#ddccb6] bg-white/55 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8a5a33]">Importe estancia</p>
          <p className="mt-2 font-medium">{priceText}</p>
        </div>
      </div>

      <div className="space-y-6 px-6 pb-8 sm:px-10">
        <section>
          <h2 className="font-serif text-xl font-semibold">1. Partes e identificación</h2>
          <p className="mt-2 text-sm leading-7">
            La casa, El Macaco del Abuelo, ofrece una estancia en un apartamento independiente situado dentro de una
            parcela familiar compartida con los dueños. La persona huésped principal es{" "}
            <strong>{reservation.guest_name}</strong>
            {reservation.contract_acceptance_dni ? <> con DNI/NIE <strong>{reservation.contract_acceptance_dni}</strong></> : null}.
            La aceptación exige nombre completo, DNI/NIE y firma dibujada en esta misma página.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold">2. Estancia, ocupación y alcance</h2>
          <p className="mt-2 text-sm leading-7">
            La estancia comprende desde el <strong>{formatContractDate(reservation.check_in)}</strong> hasta el{" "}
            <strong>{formatContractDate(reservation.check_out)}</strong>, para <strong>{reservation.guests}</strong>{" "}
            {reservation.guests === 1 ? "huésped" : "huéspedes"}. Cualquier modificación de días, número de personas
            o condiciones de llegada deberá quedar escrita en el chat web de la reserva.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold">3. Precio e inclusiones</h2>
          <p className="mt-2 text-sm leading-7">
            El importe de esta estancia es <strong>{priceText}</strong>. La casa lo establece tras revisar la solicitud,
            la duración de la estancia, la disponibilidad y las condiciones concretas de uso.
          </p>
          <p className="mt-2 text-sm leading-7">
            El precio incluye el uso del apartamento independiente, piscina, jacuzzi, jardín, mobiliario disponible,
            menaje básico, zonas de descanso y comunicación directa con la casa por el chat web. La parcela es compartida
            con los propietarios, que viven en la casa principal. No incluye servicios no descritos expresamente ni
            actividades, visitas o eventos no autorizados.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold">4. Señal, reserva y comprobación del pago</h2>
          <p className="mt-2 text-sm leading-7">
            Una vez revisado este contrato y aceptado el precio fijado por la casa, la reserva se formaliza con una señal
            de <strong>100 EUR</strong> por Bizum al <strong>687416734</strong>, usando el concepto indicado en la página.
            Mientras se utilice Bizum personal, el pago queda pendiente de comprobación bancaria manual por parte de la
            casa. La reserva se considera confirmada cuando la casa marque la señal como recibida en la web.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold">5. Cancelación</h2>
          <p className="mt-2 text-sm leading-7">
            La cancelación es gratuita hasta una semana antes de la entrada, es decir, hasta el{" "}
            <strong>{cancellationDeadline}</strong>. Si se solicita después de ese plazo, la casa revisará el caso por
            el chat web y podrá retener total o parcialmente la señal de reserva.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold">6. Uso responsable y convivencia</h2>
          <p className="mt-2 text-sm leading-7">
            La estancia se destina a descanso, uso familiar y convivencia tranquila. No se permiten fiestas, eventos no
            autorizados, actividades molestas, exceso de ocupación ni usos que puedan dañar vivienda, piscina, jacuzzi,
            jardín, mobiliario, menaje o parcela. Cualquier incidencia o daño deberá comunicarse cuanto antes por el chat web.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold">7. Presencia de los propietarios y comunidad</h2>
          <p className="mt-2 text-sm leading-7">
            Los propietarios estarán en la casa principal de la parcela durante la estancia. Esa presencia forma parte del
            carácter cercano y comunitario del alojamiento: habrá convivencia tranquila, entradas y salidas normales de la
            casa principal, ayuda si se solicita y respeto por el descanso de los huéspedes. Solo intervendrán en la estancia
            si los huéspedes necesitan ayuda, piden algo o existe una incidencia que requiera atención.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold">8. Comunicación, llegada y salida</h2>
          <p className="mt-2 text-sm leading-7">
            Las instrucciones de llegada, salida, acceso, llaves, horarios y cualquier ajuste operativo se comunicarán
            por el chat web asociado a la reserva. Los acuerdos escritos en ese hilo forman parte del seguimiento de la
            estancia y sirven para evitar malentendidos.
          </p>
        </section>

        <section className="grid gap-4 border-t border-[#d8c6ae] pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a5a33]">Aceptación</p>
            <p className="mt-2 text-sm">
              {reservation.contract_accepted_at
                ? `Aceptado el ${formatContractDate(reservation.contract_accepted_at)}`
                : "Pendiente de aceptación"}
            </p>
            <p className="mt-1 text-sm">Nombre: {reservation.contract_acceptance_name || reservation.guest_name}</p>
            <p className="mt-1 text-sm">DNI/NIE: {reservation.contract_acceptance_dni || "pendiente"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a5a33]">Firma</p>
            {signature?.startsWith("data:image") ? (
              <img src={signature} alt="Firma dibujada" className="mt-2 h-24 max-w-full rounded-lg border border-[#ddccb6] bg-white object-contain" />
            ) : (
              <div className="mt-2 flex h-24 items-center rounded-lg border border-dashed border-[#ddccb6] px-4 text-sm text-[#8a5a33]">
                Firma pendiente
              </div>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}
