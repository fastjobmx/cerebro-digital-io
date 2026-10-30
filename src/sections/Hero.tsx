import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { SplitText, Magnetic, REDUCED } from '../components/fx'
import { askCerebro } from '../config/site'

function LiveNumber() {
  const [n, setN] = useState(12480)
  useEffect(() => {
    if (REDUCED) return
    const id = setInterval(() => setN((v) => v + Math.floor(Math.random() * 37 - 12)), 900)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="tabular" suppressHydrationWarning>
      {n.toLocaleString('es-CO')}
    </span>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || !ready || REDUCED) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-h]',
        { y: 30, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', stagger: 0.09, delay: 0.55 },
      )
      gsap.fromTo('[data-hud]', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out', stagger: 0.15, delay: 1.1 })
      // El contenido se desvanece al hacer scroll
      gsap.to('[data-hero-content]', {
        yPercent: -18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom 20%', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [ready])

  return (
    <section ref={root} id="inicio" data-scene="0" className="relative flex min-h-[100svh] items-end overflow-hidden pb-28 pt-[44svh] sm:pb-32 md:items-center md:pb-20 md:pt-32">
      <div data-hero-content className="container-x relative z-10">
        <div className="max-w-[980px]">
          <h1 data-h className="eyebrow glass rounded-2xl px-4 py-2 opacity-0 sm:rounded-full">
            Cerebro digital para empresas: IA y automatización
          </h1>

          {ready && (
            <SplitText
              as="p"
              immediate
              delay={0.15}
              className="h-display mt-6 text-[clamp(2.7rem,6.3vw,6.1rem)] sm:mt-8"
              lines={[
                { text: 'Ideas que piensan,', className: 'text-chrome' },
                { text: 'soluciones que', className: 'text-grad' },
                { text: 'avanzan.', className: 'text-grad' },
              ]}
            />
          )}
          {!ready && <p className="h-display mt-6 text-[clamp(2.7rem,6.3vw,6.1rem)] opacity-0 sm:mt-8">Ideas que piensan, soluciones que avanzan.</p>}

          <p data-h className="lead mt-6 max-w-[540px] opacity-0 sm:mt-8">
            No vendemos herramientas. Instalamos un <strong className="font-semibold text-white">cerebro digital</strong>: una capa
            inteligente que conoce su empresa, conecta sus herramientas y ejecuta los procesos que usted autoriza.
          </p>

          <p data-h className="mt-5 font-mono text-[12px] uppercase tracking-[0.22em] text-white/70 opacity-0">
            Usted decide. <span className="text-magenta">El Cerebro ejecuta.</span>
          </p>

          <div data-h className="mt-8 flex flex-col gap-3 opacity-0 sm:mt-10 sm:flex-row sm:items-center">
            <Magnetic>
              <button type="button" onClick={() => askCerebro()} className="btn btn-primary w-full sm:w-auto">
                <MessageCircle size={18} />
                Hable con el Cerebro
              </button>
            </Magnetic>
            <Magnetic>
              <a href="#contacto" className="btn btn-ghost group w-full sm:w-auto">
                Solicitar una demostración
                <ArrowRight size={16} className="transition-transform duration-500 ease-expo group-hover:translate-x-1" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* HUD flotante junto al cerebro (escritorio) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] hidden lg:block">
        <div data-hud className="absolute right-[6%] top-[22%] opacity-0">
          <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan/70" />
              <span className="relative h-2 w-2 rounded-full bg-cyan" />
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/80">Cerebro activo</span>
          </div>
        </div>
        <div data-hud className="absolute bottom-[24%] right-[34%] opacity-0">
          <div className="glass rounded-2xl px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Sinapsis / s</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">
              <LiveNumber />
            </p>
          </div>
        </div>
        <div data-hud className="absolute bottom-[30%] right-[4%] opacity-0">
          <div className="glass rounded-2xl px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Acciones sensibles</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-magenta shadow-glow-m" /> Esperan su aprobación
            </p>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-x flex items-center justify-between pb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45 sm:pb-8">
          <span className="hidden sm:block">IA · Automatización · Soluciones digitales</span>
          <a href="#cerebro" className="flex items-center gap-3 text-white/60 transition-colors hover:text-white">
            Desplace
            <span className="relative h-9 w-[22px] rounded-full border border-white/25">
              <span className="absolute left-1/2 top-1.5 h-2 w-[3px] -translate-x-1/2 animate-bounce rounded-full bg-white/80" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
