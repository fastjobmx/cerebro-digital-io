import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Layers, Repeat, EyeOff } from 'lucide-react'
import { SplitText, Reveal, REDUCED } from '../components/fx'
import { TOOLS } from '../config/site'

function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED) return
    // Inclinación según la velocidad de scroll
    let last = window.scrollY
    let skew = 0
    let raf = 0
    const loop = () => {
      const v = window.scrollY - last
      last = window.scrollY
      skew += (Math.max(-12, Math.min(12, v * 0.35)) - skew) * 0.1
      el.style.transform = `skewX(${-skew}deg)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])
  const items = ['Inteligencia artificial', 'Automatización', 'Soluciones digitales', 'Innovación tecnológica']
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 font-display text-[clamp(2.4rem,7vw,6rem)] font-semibold tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(233,230,255,0.28)] sm:px-10">
            {t}
          </span>
          <span className="h-3 w-3 rotate-45 bg-gradient-brand shadow-glow-m" />
        </span>
      ))}
    </div>
  )
  return (
    <div className="relative overflow-hidden py-10 mask-fade-x sm:py-14" aria-hidden="true">
      <div ref={ref} className="will-change-transform">
        <div className="flex w-max animate-marquee">
          {row}
          {row}
        </div>
      </div>
    </div>
  )
}

const PAINS = [
  { icon: Layers, k: 'Información dispersa', d: 'Cada herramienta guarda una parte de la verdad y ninguna ve el panorama completo.' },
  { icon: Repeat, k: 'Tareas repetitivas', d: 'Su equipo copia, pega, responde y recuerda lo mismo una y otra vez.' },
  { icon: EyeOff, k: 'Decisiones a ciegas', d: 'Los datos existen, pero nadie tiene tiempo de leerlos y convertirlos en acción.' },
]

export function Problem() {
  const chips = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = chips.current
    if (!el || REDUCED) return
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('[data-speed]').forEach((c) => {
        const s = Number(c.dataset.speed)
        gsap.fromTo(c, { y: 120 * s }, { y: -120 * s, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  // Posiciones "caóticas" de las herramientas
  const spots = [
    'left-[4%] top-[8%]', 'right-[6%] top-[4%]', 'left-[16%] bottom-[14%]', 'right-[14%] bottom-[8%]',
    'left-[42%] top-[0%]', 'right-[30%] bottom-[30%]', 'left-[2%] top-[48%]', 'right-[2%] top-[46%]',
  ]

  return (
    <section id="cerebro" data-scene="1" className="section overflow-hidden">
      <Marquee />
      <div className="container-x relative mt-10 sm:mt-16">
        <div ref={chips} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          {TOOLS.map((t, i) => (
            <span key={t} data-speed={(i % 3) * 0.5 + 0.4} className={`chip absolute glass ${spots[i]}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              {t}
              <span className="ml-1 font-mono text-[10px] text-magenta/80">desconectado</span>
            </span>
          ))}
        </div>

        <div className="relative mx-auto max-w-[920px] py-10 text-center md:py-36">
          <p className="eyebrow justify-center">El problema</p>
          <SplitText
            className="h-section mt-6"
            lines={[{ text: 'Sus herramientas ya existen.', className: 'text-chrome' }, { text: 'Les falta un cerebro.', className: 'text-grad' }]}
          />
          <Reveal>
            <p data-r className="lead mx-auto mt-8 max-w-[620px]">
              CRM, correo, agenda, documentos, redes y reportes suelen funcionar por separado. El resultado: información fragmentada, tareas
              duplicadas y oportunidades que se enfrían.
            </p>
          </Reveal>
        </div>

        <Reveal className="relative grid gap-4 sm:grid-cols-3" stagger={0.12}>
          {PAINS.map(({ icon: Icon, k, d }, i) => (
            <div data-r key={k} className="panel p-7">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Icon size={20} className="text-magenta" strokeWidth={1.6} />
                </span>
                <span className="font-mono text-[11px] text-white/30">0{i + 1}</span>
              </div>
              <h3 className="mt-8 font-display text-xl font-semibold tracking-tight">{k}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">{d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
