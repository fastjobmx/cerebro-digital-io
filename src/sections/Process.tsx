import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { STEPS } from '../config/site'
import { SplitText, Reveal, Counter, REDUCED } from '../components/fx'

export function Process() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || REDUCED) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-line]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 60%', scrub: true } })
      el.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => {
        gsap.fromTo(
          s.querySelector('[data-dot]'),
          { scale: 0.4, opacity: 0.3 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(3)', scrollTrigger: { trigger: s, start: 'top 60%', toggleActions: 'play none none reverse' } },
        )
        gsap.fromTo(
          s.querySelector('[data-card]'),
          { opacity: 0, x: s.dataset.side === 'l' ? -40 : 40, filter: 'blur(8px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 75%' } },
        )
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="proceso" data-scene="4" className="section">
      <div className="container-x">
        <div className="text-center">
          <p className="eyebrow justify-center">Implementación</p>
          <SplitText
            className="h-section mt-6"
            lines={[{ text: 'Cómo instalamos', className: 'text-chrome' }, { text: 'su Cerebro.', className: 'text-grad' }]}
          />
        </div>

        <div ref={root} className="relative mx-auto mt-20 max-w-[1040px]">
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10 md:left-1/2">
            <div data-line className="absolute inset-0 origin-top bg-gradient-to-b from-magenta via-violet to-cyan shadow-[0_0_14px_rgba(139,92,246,.8)]" />
          </div>
          <ol className="flex flex-col gap-10 md:gap-4">
            {STEPS.map((s, i) => {
              const left = i % 2 === 0
              return (
                <li key={s.n} data-step data-side={left ? 'l' : 'r'} className="relative grid items-center md:grid-cols-2">
                  <span data-dot className="absolute left-[19px] top-6 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full bg-ink ring-2 ring-violet md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
                  </span>
                  <div data-card className={`ml-12 md:ml-0 ${left ? 'md:pr-16' : 'md:col-start-2 md:pl-16'}`}>
                    <div className="panel p-6 sm:p-7">
                      <div className="flex items-baseline gap-4">
                        <span className="font-brand text-2xl text-grad sm:text-3xl">{s.n}</span>
                        <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{s.k}</h3>
                      </div>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/65">{s.d}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

const STATS = [
  { to: 5, suffix: '', label: 'Áreas especializadas', d: 'Marketing, contenido, automatización, website y la suya.' },
  { to: 24, suffix: '/7', label: 'Disponibilidad', d: 'Su Cerebro atiende, organiza y prepara mientras su equipo descansa.' },
  { to: 100, suffix: '%', label: 'Acciones sensibles aprobadas', d: 'Nada crítico se ejecuta sin su autorización.' },
  { to: 6, suffix: '', label: 'Pasos de implementación', d: 'Un método claro, de la exploración a la evolución.' },
]

export function Results() {
  return (
    <section data-scene="4" className="relative py-20 sm:py-28">
      <div className="container-x">
        <h2 className="sr-only">El Cerebro Digital en números</h2>
        <Reveal className="grid overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {STATS.map((s, i) => (
            <div
              data-r
              key={s.label}
              className={`relative p-7 sm:p-9 ${i > 0 ? 'border-t border-white/10 sm:border-t-0' : ''} ${i % 2 === 1 ? 'sm:border-l sm:border-white/10' : ''} ${i === 2 ? 'sm:border-t sm:border-white/10 lg:border-l lg:border-t-0' : ''} ${i === 3 ? 'sm:border-t lg:border-t-0' : ''}`}
            >
              <p className="font-display text-[clamp(3rem,6vw,4.6rem)] font-semibold leading-none tracking-[-0.05em] text-chrome">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">{s.label}</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/55">{s.d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
