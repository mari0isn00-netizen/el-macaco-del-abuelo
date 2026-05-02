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
      setTimeout(() => setPhase(1), 300),   // Show esparto line
      setTimeout(() => setPhase(2), 1000),  // Show first text
      setTimeout(() => setPhase(3), 1800),  // Show second text
      setTimeout(() => setPhase(4), 2600),  // Show third text
      setTimeout(() => setPhase(5), 3400),  // Show title
      setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          localStorage.setItem("macaco-intro-seen", "true")
          onComplete()
        }, 600)
      }, 4500),
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
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500",
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
            "w-48 h-10 transition-all duration-1000",
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
              "text-primary transition-all duration-1000",
              phase >= 1 ? "stroke-dashoffset-0" : ""
            )}
            style={{
              strokeDasharray: 300,
              strokeDashoffset: phase >= 1 ? 0 : 300,
              transition: "stroke-dashoffset 1s ease-out"
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
              transition: "stroke-dashoffset 1.2s ease-out 0.2s"
            }}
          />
        </svg>
      </div>

      {/* Text sequence */}
      <div className="text-center space-y-4 min-h-[180px] flex flex-col items-center justify-center">
        <p
          className={cn(
            "text-lg md:text-xl text-muted-foreground italic transition-all duration-700",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          Antes fue una cesta.
        </p>
        <p
          className={cn(
            "text-lg md:text-xl text-muted-foreground italic transition-all duration-700",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          Luego una parcela.
        </p>
        <p
          className={cn(
            "text-lg md:text-xl text-muted-foreground italic transition-all duration-700",
            phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          Ahora, un refugio.
        </p>
        
        {/* Title */}
        <h1
          className={cn(
            "text-3xl md:text-5xl font-serif font-bold text-foreground mt-8 transition-all duration-700",
            phase >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          El Macaco del Abuelo
        </h1>
      </div>

      {/* Decorative elements */}
      <div className={cn(
        "absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 transition-opacity duration-500",
        phase >= 5 ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse delay-75" />
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse delay-150" />
      </div>
    </div>
  )
}
