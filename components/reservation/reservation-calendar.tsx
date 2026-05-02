"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "@/lib/types"
import { es } from "date-fns/locale"

interface ReservationCalendarProps {
  dateRange: DateRange
  onDateChange: (range: DateRange) => void
  blockedDates: { start: Date; end: Date }[]
}

export function ReservationCalendar({
  dateRange,
  onDateChange,
  blockedDates,
}: ReservationCalendarProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  // Generate array of all blocked dates
  const disabledDays: Date[] = []
  blockedDates.forEach(({ start, end }) => {
    const current = new Date(start)
    while (current <= end) {
      disabledDays.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
  })

  // Also disable past dates
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-3 sm:p-4">
      <h3 className="font-semibold text-foreground mb-4">
        Selecciona tus fechas
      </h3>
      <Calendar
        mode="range"
        selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
        onSelect={(range) => {
          onDateChange({
            from: range?.from,
            to: range?.to,
          })
        }}
        disabled={[
          { before: today },
          ...disabledDays.map((date) => date),
        ]}
        numberOfMonths={isMobile ? 1 : 2}
        locale={es}
        className="mx-auto w-full max-w-full"
      />
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded" />
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded opacity-50" />
          <span>No disponible</span>
        </div>
      </div>
    </div>
  )
}
