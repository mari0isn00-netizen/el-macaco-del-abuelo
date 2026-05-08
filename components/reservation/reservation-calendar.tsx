"use client"

import { useMemo, useState } from "react"
import type { DateRange } from "@/lib/types"
import { calculateReservationPrice, nightsBetween } from "@/lib/reservation-pricing"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReservationCalendarProps {
  dateRange: DateRange
  onDateChange: (range: DateRange) => void
  blockedDates: { start: Date; end: Date }[]
}

const weekdays = ["L", "M", "X", "J", "V", "S", "D"]
const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" })
const dayKeyFormatter = new Intl.DateTimeFormat("sv-SE")

function keyOf(date: Date) {
  return dayKeyFormatter.format(date)
}

function sameDay(a?: Date, b?: Date) {
  return Boolean(a && b && keyOf(a) === keyOf(b))
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getMonthDays(month: Date) {
  const first = startOfMonth(month)
  const firstWeekday = (first.getDay() + 6) % 7
  const cursor = addDays(first, -firstWeekday)
  return Array.from({ length: 42 }, (_, index) => addDays(cursor, index))
}

function isBetween(date: Date, from?: Date, to?: Date) {
  if (!from || !to) return false
  const time = date.getTime()
  return time > from.getTime() && time < to.getTime()
}

export function ReservationCalendar({ dateRange, onDateChange, blockedDates }: ReservationCalendarProps) {
  const [baseMonth, setBaseMonth] = useState(() => startOfMonth(new Date()))
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  const today = useMemo(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  }, [])

  const blockedSet = useMemo(() => {
    const set = new Set<string>()
    blockedDates.forEach(({ start, end }) => {
      const current = new Date(start)
      current.setHours(0, 0, 0, 0)
      const last = new Date(end)
      last.setHours(0, 0, 0, 0)
      while (current <= last) {
        set.add(keyOf(current))
        current.setDate(current.getDate() + 1)
      }
    })
    return set
  }, [blockedDates])

  const isBlocked = (date: Date) => date < today || blockedSet.has(keyOf(date))
  const previewTo = dateRange.from && !dateRange.to && hoveredDate && hoveredDate > dateRange.from ? hoveredDate : dateRange.to
  const previewPrice = dateRange.from && previewTo ? calculateReservationPrice(dateRange.from, previewTo) : null

  const findLastAvailableBeforeBlock = (from: Date, candidate: Date) => {
    let last = from
    let current = addDays(from, 1)
    while (current <= candidate) {
      if (isBlocked(current)) return last
      last = current
      current = addDays(current, 1)
    }
    return last
  }

  const selectDay = (date: Date) => {
    if (isBlocked(date)) return

    if (!dateRange.from || dateRange.to || date < dateRange.from) {
      onDateChange({ from: date, to: undefined })
      return
    }

    const adjustedEnd = findLastAvailableBeforeBlock(dateRange.from, date)
    if (nightsBetween(dateRange.from, adjustedEnd) < 2) return
    onDateChange({ from: dateRange.from, to: adjustedEnd })
  }

  const months = [baseMonth, new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1)]

  return (
    <div className="relative overflow-hidden rounded-[18px] border border-[#ead9c4] bg-[#fff8ee] p-4 shadow-sm sm:p-5">
      <div className="mb-4 grid min-h-[68px] grid-cols-[44px_1fr_44px] items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={() => setBaseMonth(new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 text-center">
          <p className="font-serif text-2xl font-bold text-[#4f2f1f]">Disponibilidad</p>
          <p className="mt-1 h-5 text-sm font-medium text-primary transition-opacity duration-200">
            {previewPrice && previewPrice.nights >= 2 ? `${previewPrice.nights} noches · ${previewPrice.total}€` : ""}
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={() => setBaseMonth(new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {months.map((month) => (
          <section key={keyOf(month)} className="rounded-[14px] bg-white/55 p-3">
            <h3 className="mb-3 h-7 truncate text-center font-serif text-lg font-semibold capitalize text-[#4f2f1f]">{monthFormatter.format(month)}</h3>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground">
              {weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getMonthDays(month).map((day) => {
                const outside = day.getMonth() !== month.getMonth()
                const blocked = isBlocked(day)
                const selectedStart = sameDay(day, dateRange.from)
                const selectedEnd = sameDay(day, previewTo)
                const selectedMiddle = isBetween(day, dateRange.from, previewTo || undefined)
                const selectable = !blocked && !outside

                return (
                  <button
                    key={keyOf(day)}
                    type="button"
                    onClick={() => selectDay(day)}
                    onPointerEnter={() => selectable && setHoveredDate(day)}
                    onPointerLeave={() => setHoveredDate(null)}
                    disabled={blocked || outside}
                    className={cn(
                      "relative aspect-square rounded-[10px] text-sm transition-colors duration-200",
                      outside && "opacity-0",
                      selectable && "bg-[#f7ead7] text-[#4f2f1f] hover:bg-[#e8b36f]/35",
                      blocked && !outside && "cursor-not-allowed bg-transparent text-muted-foreground/45",
                      selectedMiddle && "bg-primary/20 text-primary",
                      (selectedStart || selectedEnd) && "bg-primary text-primary-foreground shadow-[inset_0_0_0_2px_rgba(255,255,255,0.55)]"
                    )}
                    aria-label={day.toLocaleDateString("es-ES")}
                  >
                    <span className="relative z-10">{day.getDate()}</span>
                    {blocked && !outside ? <span className="absolute left-2 right-2 top-1/2 h-px -rotate-12 bg-[#9f6f47]/60" /> : null}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
