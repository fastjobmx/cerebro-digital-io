import { useEffect, useRef, useState } from 'react'
import {
  MessageSquarePlus,
  BrainCircuit,
  Search,
  CircleDot,
  Cog,
  CheckCheck,
} from 'lucide-react'

const STEPS = [
  {
    t: 'USTED PIDE',
    sub: 'INPUT',
    desc: 'Expresa en lenguaje natural lo que necesita.',
    icon: MessageSquarePlus,
    color: '#00E5FF',
  },
  {
    t: 'EL CEREBRO ENTIENDE',
    sub: 'CONTEXT',
    desc: 'Interpreta su solicitud dentro del contexto de su negocio.',
    icon: BrainCircuit,
    color: '#7B2CFF',
  },
  {
    t: 'ANALIZA',
    sub: 'AI',
    desc: 'Revisa información disponible, cruza datos y evalúa opciones.',
    icon: Search,
    color: '#E600FF',
  },
  {
    t: 'DECIDE / PROPONE',
    sub: 'DECISION',
    desc: 'Elige un camino o le presenta opciones para su aprobación.',
    icon: CircleDot,
    color: '#A855F7',
  },
  {
    t: 'EJECUTA',
    sub: 'AUTOMATION',
    desc: 'Corre procesos, actualiza sistemas y dispara acciones.',
    icon: Cog,
    color: '#E600FF',
  },
  {
    t: 'ENTREGA',
    sub: 'OUTPUT',
    desc: 'Le devuelve resultados, archivos o confirmaciones.',
    icon: CheckCheck,
    color: '#00E5FF',
  },
]

export function Workflow() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const passed = vh - rect.top
      const p = Math.max(0, Math.min(1, passed / total))
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-3 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <span className="text-[10px] tracking-[0.2em] text-neon-magenta uppercase font-semibold">
              Flujo de trabajo
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            <span className="text-white/90">DE IDEA A </span>
            <span className="text-gradient">RESULTADO.</span>
          </h2>
        </div>

        <div ref={ref} className="relative w-full overflow-x-hidden">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[56px] left-0 right-0 h-[2px]">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/20 via-ultra-violet/40 to-neon-magenta/20" />
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-electric-cyan via-ultra-violet to-neon-magenta shadow-glow-brand"
              style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-5 md:gap-2 relative">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const reach = (i + 0.5) / STEPS.length
              const lit = progress >= reach - 0.08
              return (
                <div
                  key={s.t}
                  className="relative col-span-1 flex flex-col items-center text-center"
                  style={{
                    transition: 'all 0.5s ease',
                    transform: lit ? 'translateY(0)' : 'translateY(12px)',
                    opacity: lit ? 1 : 0.5,
                  }}
                >
                  {/* Node */}
                  <div
                    className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 ${
                      lit ? 'scale-100' : 'scale-90'
                    }`}
                    style={{
                      background: lit
                        ? `radial-gradient(circle, ${s.color}55 0%, ${s.color}11 55%, transparent 80%)`
                        : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${lit ? s.color : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: lit ? `0 0 50px ${s.color}66` : 'none',
                    }}
                  >
                    <div
                      className={`w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center transition-all duration-500`}
                      style={{
                        background: lit
                          ? `linear-gradient(135deg, ${s.color}, ${s.color}88)`
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: lit ? `0 0 24px ${s.color}aa` : 'none',
                      }}
                    >
                      <Icon size={26} className="text-white" strokeWidth={1.8} />
                    </div>
                    {lit && (
                      <>
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white shadow-glow-cyan animate-pulse" />
                        <div
                          className="absolute inset-0 rounded-full border"
                          style={{
                            borderColor: `${s.color}66`,
                            animation: `ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite`,
                          }}
                        />
                      </>
                    )}
                  </div>

                  <div className="mt-5 w-full max-w-[200px]">
                    <div
                      className="font-mono text-[10px] tracking-[0.25em] font-bold mb-1"
                      style={{ color: lit ? s.color : 'rgba(255,255,255,0.3)' }}
                    >
                      0{i + 1} · {s.sub}
                    </div>
                    <div
                      className="font-display font-bold text-sm md:text-base tracking-wide mb-2"
                      style={{ color: lit ? '#fff' : 'rgba(255,255,255,0.5)' }}
                    >
                      {s.t}
                    </div>
                    <p className="text-xs md:text-sm text-white/55 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Concept labels */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="glass-strong rounded-2xl p-4 md:p-6 border border-electric-purple/20 flex flex-wrap items-center justify-center gap-3 md:gap-2">
            {['INPUT', 'CONTEXT', 'AI', 'AUTOMATION', 'OUTPUT'].map((k, i, arr) => (
              <div key={k} className="flex items-center gap-3">
                <span
                  className="font-mono text-xs md:text-sm font-bold tracking-[0.2em] px-3 py-2 rounded-lg"
                  style={{
                    color: i % 2 ? '#E600FF' : '#00E5FF',
                    background: i % 2 ? 'rgba(230,0,255,0.12)' : 'rgba(0,229,255,0.12)',
                    border: `1px solid ${i % 2 ? 'rgba(230,0,255,0.3)' : 'rgba(0,229,255,0.3)'}`,
                  }}
                >
                  {k}
                </span>
                {i < arr.length - 1 && <span className="text-white/30 text-xl">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
