"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { StoryTeaser } from "@/components/landing/story-teaser"
import { About } from "@/components/landing/about"
import { Amenities } from "@/components/landing/amenities"
import { Gallery } from "@/components/landing/gallery"
import { Location } from "@/components/landing/location"
import { Contact } from "@/components/landing/contact"
import { Footer } from "@/components/landing/footer"
import { IntroAnimation } from "@/components/landing/intro-animation"
import { MobileNav } from "@/components/landing/mobile-nav"
import { FloatingChat } from "@/components/chat/floating-chat"
import { Reveal } from "@/components/ui/reveal"

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if intro was already seen
    const hasSeen = localStorage.getItem("macaco-intro-seen")
    if (hasSeen) {
      setShowIntro(false)
    }
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />
  }

  return (
    <>
      <Header />
      <main className="pb-20 md:pb-0">
        <Hero />
        <Reveal>
          <StoryTeaser />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Amenities />
        </Reveal>
        <Reveal>
          <Gallery />
        </Reveal>
        <Reveal>
          <Location />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Footer />
      <MobileNav />
      <FloatingChat />
    </>
  )
}
