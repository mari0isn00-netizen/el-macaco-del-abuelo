const WEEK_PRICE = 550

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function nightsBetween(checkIn: Date, checkOut: Date) {
  const start = Date.UTC(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate())
  const end = Date.UTC(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate())
  return Math.max(0, Math.round((end - start) / MS_PER_DAY))
}

export function calculateReservationPrice(checkIn: Date, checkOut: Date) {
  const nights = nightsBetween(checkIn, checkOut)
  const base = Math.round((WEEK_PRICE / 7) * nights)

  return {
    base,
    cleaningIncluded: false,
    nights,
    pricePerNight: nights > 0 ? Math.round(base / nights) : 0,
    total: base,
    weekPrice: WEEK_PRICE,
  }
}
