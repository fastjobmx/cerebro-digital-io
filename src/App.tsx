import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CustomCursor } from './components/CustomCursor'
import { Preloader } from './components/sections/Preloader'
import { Reveal } from './components/Motion'

import { Hero } from './components/sections/Hero'
import { MicroMessage } from './components/sections/MicroMessage'
import { Problem } from './components/sections/Problem'
import { WhatIsBrain } from './components/sections/WhatIsBrain'
import { ScrollNarrative } from './components/sections/ScrollNarrative'
import { BrainModel } from './components/sections/BrainModel'
import { FiveAreas } from './components/sections/FiveAreas'
import { PhoneSection } from './components/sections/PhoneSection'
import { NotChatbot } from './components/sections/NotChatbot'
import { Ecosystem } from './components/sections/Ecosystem'
import { MarketingAI } from './components/sections/MarketingAI'
import { StopPieces } from './components/sections/StopPieces'
import { UseCases } from './components/sections/UseCases'
import { Workflow } from './components/sections/Workflow'
import { HumanControl } from './components/sections/HumanControl'
import { Results } from './components/sections/Results'
import { Timeline } from './components/sections/Timeline'
import { Receive } from './components/sections/Receive'
import { Audience } from './components/sections/Audience'
import { Demo } from './components/sections/Demo'
import { BrandStatement } from './components/sections/BrandStatement'
import { FinalCTA } from './components/sections/FinalCTA'

export default function App() {
  const [loading, setLoading] = useState<boolean>(() => {
    // Reduce preloader likelihood on revisit / reduced motion.
    if (typeof window === 'undefined') return true
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return false
    const revisited = sessionStorage.getItem('cdio-visited')
    if (revisited) return false
    sessionStorage.setItem('cdio-visited', '1')
    return true
  })

  useEffect(() => {
    if (loading) {
      document.documentElement.classList.add('is-loading')
    } else {
      document.documentElement.classList.remove('is-loading')
    }
  }, [loading])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-deep-space text-white">
      {loading && <Preloader onDone={() => setLoading(false)} />}

      {/* Global noise overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Subtle custom cursor (desktop only) */}
      <CustomCursor />

      <Header />

      <main className="relative">
        <Hero />

        <Reveal from="blur" duration={1.1}>
          <MicroMessage />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <Problem />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <WhatIsBrain />
        </Reveal>

        {/* Cinematic scroll story — Caos → Crecimiento */}
        <ScrollNarrative />

        <Reveal from="bottom" distance={60}>
          <BrainModel />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <FiveAreas />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <PhoneSection />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <NotChatbot />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <Ecosystem />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <MarketingAI />
        </Reveal>

        <Reveal from="blur" duration={1}>
          <StopPieces />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <UseCases />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <Workflow />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <HumanControl />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <Results />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <Timeline />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <Receive />
        </Reveal>

        <Reveal from="bottom" distance={60}>
          <Audience />
        </Reveal>

        <Reveal from="blur" duration={1}>
          <Demo />
        </Reveal>

        <Reveal from="blur" duration={1}>
          <BrandStatement />
        </Reveal>

        <Reveal from="scale" distance={0} duration={1}>
          <FinalCTA />
        </Reveal>
      </main>

      <Footer />
    </div>
  )
}
