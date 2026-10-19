import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cursor } from './components/fx'
import { Preloader } from './sections/Preloader'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Problem } from './sections/Problem'
import { Connect } from './sections/Connect'
import { Verbs } from './sections/Verbs'
import { Areas } from './sections/Areas'
import { Control } from './sections/Control'
import { Difference, Cases } from './sections/Difference'
import { Process, Results } from './sections/Process'
import { FinalCTA, Contact, Footer } from './sections/Closing'
import { ChatWidget } from './chat/ChatWidget'
import { CookieBanner, WhatsAppButton } from './components/Consent'

// La escena 3D (three.js) se carga en un chunk aparte para pintar el contenido antes
const NeuralScene = lazy(() => import('./three/NeuralScene').then((m) => ({ default: m.NeuralScene })))

function shouldPreload() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (sessionStorage.getItem('cdio-visited')) return false
    sessionStorage.setItem('cdio-visited', '1')
  } catch {
    /* almacenamiento no disponible */
  }
  return true
}

export default function App() {
  const [loading, setLoading] = useState(shouldPreload)
  const done = useCallback(() => setLoading(false), [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', loading)
    if (!loading) requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [loading])

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      {loading && <Preloader onDone={done} />}
      <Suspense fallback={null}>
        <NeuralScene />
      </Suspense>
      {/* Viñeta y atmósfera sobre la escena 3D */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_45%,transparent_40%,rgba(5,1,13,.75)_100%)]"
      />
      <div aria-hidden="true" className="grain" />
      <Cursor />
      <Header />

      <main className="relative z-10">
        <Hero ready={!loading} />
        <Problem />
        <Connect />
        <Verbs />
        <Areas />
        <Control />
        <Difference />
        <Cases />
        <Process />
        <Results />
        <FinalCTA />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>

      <WhatsAppButton />
      <ChatWidget />
      <CookieBanner />
    </>
  )
}
