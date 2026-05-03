const WEEK_PRICE = 550
const CLEANING_FEE = 0

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function nightsBetween(checkIn: Date, checkOut: Date) {
  const start = Date.UTC(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate())
  const end = Date.UTC(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate())
  return Math.max(0, Math.round((end - start) / MS_PER_DAY))
}

export function calculateReservationPrice(checkIn: Date, checkOut: Date) {
  const nights = nightsBetween(checkIn, checkOut)
  const base = Math.round((WEEK_PRICE / 7) * nights)
  const cleaning = nights > 0 ? CLEANING_FEE : 0
  const total = base + cleaning

  return {
    base,
    cleaning,
    nights,
    pricePerNight: nights > 0 ? Math.round(base / nights) : 0,
    total,
    weekPrice: WEEK_PRICE,
  }
}
