import type { Reservation } from "@/lib/types"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

export function getCancellationDeadline(reservation: Reservation): string {
  const deadline = new Date(reservation.check_in)
  deadline.setDate(deadline.getDate() - 7)
  return deadline.toISOString().split("T")[0]
}

export function formatContractDate(dateString: string): string {
  return formatDate(dateString)
}

export function getContractTitle(reservation: Reservation | null): string {
  return reservation ? `Contrato de estancia ${reservation.id.slice(0, 8)}` : "Contrato de estancia"
}

export function buildContractText(reservation: Reservation): string {
  const total = reservation.agreed_price || reservation.total_price
  const priceText = total > 0 ? `${total} EUR` : "pendiente de fijar por la casa"

  return [
    "CONTRATO DE ESTANCIA PRIVADA - EL MACACO DEL ABUELO",
    "",
    "1. Partes e identificación",
    "La casa: El Macaco del Abuelo, alojamiento independiente en Las Monjas, parcela 121, Carmona, Sevilla.",
    `Huésped principal: ${reservation.guest_name}.`,
    reservation.contract_acceptance_dni ? `DNI/NIE registrado: ${reservation.contract_acceptance_dni}.` : "DNI/NIE: pendiente de registro en la firma.",
    "",
    "2. Estancia solicitada",
    `Entrada: ${formatDate(reservation.check_in)}.`,
    `Salida: ${formatDate(reservation.check_out)}.`,
    `Número de huéspedes: ${reservation.guests}.`,
    `Importe de la estancia: ${priceText}.`,
    `Estado actual: ${reservation.status}.`,
    "",
    "3. Precio e inclusiones",
    "El precio lo establece la casa tras revisar fechas, duración, disponibilidad y condiciones de uso. El importe final debe quedar escrito en el chat web antes de formalizar la reserva.",
    "El precio incluye el uso privado del apartamento independiente, piscina, jacuzzi, jardín, parcela exterior, mobiliario disponible, menaje básico y comunicación directa por el chat web.",
    "No incluye servicios no descritos expresamente ni actividades, visitas o eventos no autorizados.",
    "",
    "4. Señal y formalización",
    "Una vez revisado el contrato y aceptado el precio fijado por la casa, la reserva se formaliza con una señal de 100 EUR.",
    "Mientras se use Bizum personal al 687416734, el pago queda pendiente de confirmación bancaria por parte de la casa.",
    "Si se activa Bizum comercio o una pasarela certificada, la confirmación podrá quedar registrada automáticamente en la web.",
    "",
    "5. Cancelación",
    `La cancelación es gratuita hasta 7 días antes de la entrada, es decir, hasta el ${formatDate(getCancellationDeadline(reservation))}.`,
    "Si la cancelación se solicita después de ese plazo, la casa revisará el caso por el chat web y podrá retener total o parcialmente la señal de reserva.",
    "",
    "6. Uso responsable",
    "La estancia se destina a descanso privado y uso familiar. No se permiten fiestas, eventos no autorizados, exceso de ocupación ni actividades molestas.",
    "El huésped se compromete a cuidar vivienda, piscina, jacuzzi, jardín, mobiliario, menaje y parcela. Cualquier daño o incidencia debe comunicarse por el chat web cuanto antes.",
    "",
    "7. Privacidad y propietarios",
    "Los propietarios estarán en la casa principal de la parcela durante la estancia. No saldrán ni intervendrán salvo que los huéspedes necesiten ayuda, pidan algo o exista una incidencia.",
    "",
    "8. Comunicación, llegada y salida",
    "Las instrucciones de llegada, salida, acceso, llaves, horarios y cualquier ajuste operativo se comunicarán por el chat web asociado a la reserva.",
    "Los acuerdos escritos en ese hilo forman parte del seguimiento de la estancia.",
    "",
    "9. Aceptación",
    "La aceptación queda registrada cuando el huésped marca la casilla de contrato, introduce nombre y DNI/NIE, dibuja su firma e indica que ha enviado la señal de reserva.",
    reservation.contract_signature ? "Firma registrada como imagen dibujada en la página." : "Firma: pendiente.",
  ].join("\n")
}
