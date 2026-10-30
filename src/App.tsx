import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cursor } from './components/fx'
import { ErrorBoundary } from './components/ErrorBoundary'
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
import { Faq } from './sections/Faq'
import { FinalCTA, Contact, Footer } from './sections/Closing'
import { LazyChatWidget } from './chat/LazyChatWidget'
import { CookieBanner, WhatsAppButton } from './components/Consent'

// La escena 3D (three.js) se carga en un chunk aparte para pintar el contenido antes
const NeuralScene = lazy(() => import('./three/NeuralScene').then((m) => ({ default: m.NeuralScene })))

// La decisión se toma una sola vez: StrictMode repite los efectos en desarrollo.
let preloadDecision: boolean | undefined

function shouldPreload() {
  if (preloadDecision !== undefined) return preloadDecision
  preloadDecision = true
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) preloadDecision = false
    else if (sessionStorage.getItem('cdio-visited')) preloadDecision = false
    else sessionStorage.setItem('cdio-visited', '1')
  } catch {
    /* almacenamiento no disponible */
  }
  return preloadDecision
}

export default function App() {
  // El HTML prerenderizado equivale a "cargando, sin preloader": el navegador lo hidrata igual
  // y después se decide si corre el preloader. El script del <head> cubre ese instante.
  const [loading, setLoading] = useState(true)
  const [preload, setPreload] = useState(false)
  const [mounted, setMounted] = useState(false)
  const done = useCallback(() => setLoading(false), [])

  useLayoutEffect(() => {
    setMounted(true)
    if (shouldPreload()) setPreload(true)
    else setLoading(false)
  }, [])

  useEffect(() => {
    if (preload) document.documentElement.classList.remove('is-preload')
  }, [preload])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', loading)
    if (!loading) {
      document.documentElement.classList.remove('is-preload')
      // Delay refresh to ensure layout is stable after preloader hides
      const timer = setTimeout(() => ScrollTrigger.refresh(), 150)
      return () => clearTimeout(timer)
    }
  }, [loading])

  useEffect(() => {
    document.fonts?.ready.then(() => {
      // Double-check after fonts load; some layouts shift on font swap
      setTimeout(() => ScrollTrigger.refresh(), 100)
    })
  }, [])

  return (
    <>
      {preload && loading && <Preloader onDone={done} />}
      {mounted && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <NeuralScene />
          </Suspense>
        </ErrorBoundary>
      )}
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
        <Faq />
        <FinalCTA />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>

      <WhatsAppButton />
      <ErrorBoundary>
        <LazyChatWidget />
      </ErrorBoundary>
      <CookieBanner />
    </>
  )
}
