import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { SITE } from '../config/site'

/** Pantalla de carga: el logo se "enciende" mientras sube el contador. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const o = { v: 0 }
    const tl = gsap.timeline()
    tl.fromTo('[data-pl-logo]', { opacity: 0, scale: 0.86, filter: 'blur(18px) brightness(0.3)' }, { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)', duration: 1.6, ease: 'expo.out' })
      .to(o, { v: 100, duration: 1.9, ease: 'power2.inOut', onUpdate: () => setN(Math.round(o.v)) }, 0.1)
      .to('[data-pl-bar]', { scaleX: 1, duration: 1.9, ease: 'power2.inOut' }, 0.1)
      .to('[data-pl-logo]', { scale: 1.08, opacity: 0, filter: 'blur(10px)', duration: 0.7, ease: 'expo.in' }, '+=0.15')
      .to('[data-pl-meta]', { opacity: 0, y: 10, duration: 0.4 }, '<')
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'expo.inOut' }, '-=0.25')
      .add(onDone)
    return () => {
      tl.kill()
    }
  }, [onDone])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] grid place-items-center bg-ink"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      role="status"
      aria-label="Cargando"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.22),transparent_60%)]" />
      <img
        data-pl-logo
        src={SITE.logo.full}
        alt={SITE.name}
        className="relative w-[min(68vw,340px)] opacity-0"
        decoding="async"
        fetchPriority="high"
      />
      <div data-pl-meta className="absolute inset-x-4 bottom-8 mx-auto flex max-w-[1320px] items-end justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-white/50 sm:inset-x-12 sm:bottom-12">
        <span>Iniciando sinapsis</span>
        <span className="font-display text-4xl font-light tracking-tight text-white sm:text-6xl tabular">{String(n).padStart(3, '0')}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5">
        <div data-pl-bar className="h-full origin-left scale-x-0 bg-gradient-brand" />
      </div>
    </div>
  )
}
