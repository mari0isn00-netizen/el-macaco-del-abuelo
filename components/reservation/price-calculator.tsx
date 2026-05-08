"use client"

import { useEffect, useMemo, useState } from "react"
import type { DateRange } from "@/lib/types"
import { calculateReservationPrice } from "@/lib/reservation-pricing"

interface PriceCalculatorProps {
  dateRange: DateRange
  guests: number
}

export function PriceCalculator({ dateRange, guests }: PriceCalculatorProps) {
  const price = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return null
    return calculateReservationPrice(dateRange.from, dateRange.to)
  }, [dateRange.from, dateRange.to])
  const [displayTotal, setDisplayTotal] = useState(0)

  useEffect(() => {
    if (!price) {
      setDisplayTotal(0)
      return
    }

    const start = performance.now()
    const from = displayTotal
    const to = price.total
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 800)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayTotal(Math.round(from + (to - from) * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [price?.total])

  return (
    <div className="rounded-[18px] border border-[#ead9c4] bg-[#fff8ee] p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">Precio vivo</p>
      {price && dateRange.from && dateRange.to ? (
        <>
          <p className="mt-3 font-serif text-4xl font-bold text-[#4f2f1f]">{displayTotal}€</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {price.nights} noches · {guests} huéspedes · semana base {price.weekPrice}€
          </p>
          <div className="mt-4 space-y-2 border-t border-[#ead9c4] pt-4 text-sm">
            <Line label="Precio base" value={`${price.base}€`} />
            <Line label="Limpieza" value={price.cleaning > 0 ? `${price.cleaning}€` : "Incluida"} />
            <Line label="Total estimado" value={`${price.total}€`} />
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Selecciona fechas libres para ver el importe de la estancia.</p>
      )}
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
