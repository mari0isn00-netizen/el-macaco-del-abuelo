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
    "CONTRATO DE ESTANCIA FAMILIAR - EL MACACO DEL ABUELO",
    "",
    "1. Partes e identificación",
    "La casa: El Macaco del Abuelo, apartamento independiente dentro de una parcela familiar compartida con los dueños en Urbanización Las Monjas, Carmona, Sevilla. La dirección exacta se comunica por privado en el seguimiento de la reserva.",
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
    "El precio lo establece la casa tras revisar la solicitud, duración, disponibilidad y condiciones de uso. El importe final debe quedar escrito en el chat web antes de formalizar la reserva.",
    "El precio incluye el uso del apartamento independiente, piscina, jacuzzi, jardín, mobiliario disponible, menaje básico y comunicación directa por el chat web. La parcela es compartida con los propietarios, que viven en la casa principal.",
    "La limpieza no está incluida en el importe de la estancia salvo que la casa lo confirme expresamente por escrito en el chat web o en una condición particular de la reserva.",
    "No incluye servicios no descritos expresamente ni actividades, visitas o eventos no autorizados.",
    "",
    "4. Señal y formalización",
    "Una vez revisado el contrato y aceptado el precio fijado por la casa, la reserva se formaliza con una señal de 100 EUR por Bizum al 687416734.",
    "Mientras se use Bizum personal, el pago queda pendiente de comprobación bancaria manual por parte de la casa. La reserva se considera confirmada cuando la casa marque la señal como recibida en la web.",
    "",
    "5. Cancelación",
    `La cancelación es gratuita hasta 7 días antes de la entrada, es decir, hasta el ${formatDate(getCancellationDeadline(reservation))}.`,
    "Si la cancelación se solicita después de ese plazo, la casa revisará el caso por el chat web y podrá retener total o parcialmente la señal de reserva.",
    "",
    "6. Uso responsable y convivencia",
    "La estancia se destina a descanso, uso familiar y convivencia tranquila. No se permiten fiestas, eventos no autorizados, exceso de ocupación ni actividades molestas.",
    "El huésped se compromete a cuidar vivienda, piscina, jacuzzi, jardín, mobiliario, menaje y parcela. Cualquier daño o incidencia debe comunicarse por el chat web cuanto antes.",
    "",
    "7. Propietarios y comunidad",
    "Los propietarios estarán en la casa principal de la parcela durante la estancia. Esa presencia forma parte del carácter cercano del alojamiento: convivencia tranquila, entradas y salidas normales de la casa principal, ayuda si se solicita y respeto por el descanso de los huéspedes.",
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
