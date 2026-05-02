"use client"

import { useEffect, useState } from "react"
import { calculatePrice } from "@/app/actions/reservations"
import type { DateRange } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface PriceCalculatorProps {
  dateRange: DateRange
  guests: number
}

export function PriceCalculator({ dateRange, guests }: PriceCalculatorProps) {
  const [priceInfo, setPriceInfo] = useState<{
    total: number
    nights: number
    pricePerNight: number
    needsOffer: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchPrice() {
      if (!dateRange.from || !dateRange.to) {
        setPriceInfo(null)
        return
      }

      setIsLoading(true)
      try {
        setPriceInfo(await calculatePrice(dateRange.from, dateRange.to))
      } catch (error) {
        console.error("Error calculating price:", error)
        setPriceInfo(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrice()
  }, [dateRange.from, dateRange.to])

  if (!dateRange.from || !dateRange.to) {
    return (
      <div className="rounded-xl bg-muted/50 p-6 text-center">
        <p className="text-muted-foreground">Selecciona fechas para solicitar revisión</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  if (!priceInfo) return null

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-foreground">Revisión de la estancia</h3>

      <div className="space-y-3">
        <div className="rounded-lg bg-primary/10 p-4 text-sm leading-6 text-foreground">
          El propietario revisará las fechas solicitadas y dejará por escrito el importe de la estancia en el chat web.
        </div>

        <div className="mt-3 border-t border-border pt-3">
          <div className="flex justify-between font-semibold">
            <span className="text-foreground">Importe</span>
            <span className="text-xl text-primary">Pendiente de revisión</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-secondary/10 p-3">
        <p className="text-xs text-muted-foreground">
          Para {guests} huéspedes · {priceInfo.nights} noches
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Del {dateRange.from.toLocaleDateString("es-ES")} al {dateRange.to.toLocaleDateString("es-ES")}
        </p>
      </div>
    </div>
  )
}
