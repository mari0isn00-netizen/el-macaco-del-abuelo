"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Check if already seen
    if (typeof window !== "undefined") {
      const hasSeen = localStorage.getItem("macaco-intro-seen")
      if (hasSeen) {
        onComplete()
        return
      }
    }

    // Animation phases
    const timers = [
      setTimeout(() => setPhase(1), 120),
      setTimeout(() => setPhase(2), 420),
      setTimeout(() => setPhase(3), 760),
      setTimeout(() => setPhase(4), 1100),
      setTimeout(() => setPhase(5), 1440),
      setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          localStorage.setItem("macaco-intro-seen", "true")
          onComplete()
        }, 220)
      }, 2300),
    ]

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const handleSkip = () => {
    localStorage.setItem("macaco-intro-seen", "true")
    setIsExiting(true)
    setTimeout(onComplete, 300)
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-200",
        isExiting && "opacity-0"
      )}
    >
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Saltar
      </button>

      {/* Esparto weave line */}
      <div className="relative mb-12">
        <svg
          viewBox="0 0 200 40"
          className={cn(
            "w-48 h-10 transition-opacity duration-200",
            phase >= 1 ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Esparto weave pattern */}
          <path
            d="M0,20 Q25,10 50,20 Q75,30 100,20 Q125,10 150,20 Q175,30 200,20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(
              "text-primary",
              phase >= 1 ? "stroke-dashoffset-0" : ""
            )}
            style={{
              strokeDasharray: 300,
              strokeDashoffset: phase >= 1 ? 0 : 300,
              transition: "stroke-dashoffset 260ms ease-out"
            }}
          />
          <path
            d="M0,25 Q25,35 50,25 Q75,15 100,25 Q125,35 150,25 Q175,15 200,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-secondary/60"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: phase >= 1 ? 0 : 300,
              transition: "stroke-dashoffset 280ms ease-out 80ms"
            }}
          />
        </svg>
      </div>

      {/* Text sequence */}
      <div className="text-center space-y-4 min-h-[180px] flex flex-col items-center justify-center">
        <p
          className={cn(
            "text-lg md:text-xl text-muted-foreground italic transition-opacity duration-200",
            phase >= 2 ? "opacity-100" : "opacity-0"
          )}
        >
          Antes fue una cesta.
        </p>
        <p
          className={cn(
            "text-lg md:text-xl text-muted-foreground italic transition-opacity duration-200",
            phase >= 3 ? "opacity-100" : "opacity-0"
          )}
        >
          Luego una parcela.
        </p>
        <p
          className={cn(
            "text-lg md:text-xl text-muted-foreground italic transition-opacity duration-200",
            phase >= 4 ? "opacity-100" : "opacity-0"
          )}
        >
          Ahora, un refugio.
        </p>
        
        {/* Title */}
        <h1
          className={cn(
            "text-3xl md:text-5xl font-serif font-bold text-foreground mt-8 transition-opacity duration-200",
            phase >= 5 ? "opacity-100" : "opacity-0"
          )}
        >
          El Macaco del Abuelo
        </h1>
      </div>

      {/* Decorative elements */}
      <div className={cn(
        "absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 transition-opacity duration-200",
        phase >= 5 ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-1 h-1 rounded-full bg-primary" />
        <div className="w-1 h-1 rounded-full bg-primary" />
        <div className="w-1 h-1 rounded-full bg-primary" />
      </div>
    </div>
  )
}
