import {
  MessageCircle,
  Workflow,
  LayoutDashboard,
  AppWindow,
  BrainCircuit,
  ArrowRightLeft,
} from 'lucide-react'

const ROWS = [
  {
    title: 'CHATBOT',
    desc: 'Responde preguntas.',
    icon: MessageCircle,
    color: '#A855F7',
  },
  {
    title: 'AUTOMATIZACIÓN',
    desc: 'Ejecuta un flujo definido.',
    icon: Workflow,
    color: '#00E5FF',
  },
  {
    title: 'CRM',
    desc: 'Organiza información.',
    icon: LayoutDashboard,
    color: '#7B2CFF',
  },
  {
    title: 'APLICACIÓN',
    desc: 'Resuelve una función.',
    icon: AppWindow,
    color: '#E600FF',
  },
]

const BRAIN_ACTIONS = [
  'CONOCE',
  'CONECTA',
  'ANALIZA',
  'PROPONE',
  'COORDINA',
  'EJECUTA',
]

export function NotChatbot() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-electric-cyan/10 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <span className="text-[10px] tracking-[0.2em] text-electric-cyan uppercase font-semibold">
              Comparativa
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            <span className="text-white/90">NO ES OTRO </span>
            <span className="text-gradient">CHATBOT.</span>
          </h2>
          <p className="mt-6 text-white/60 text-lg max-w-2xl mx-auto">
            Cuatro categorías comunes. Un sistema que las conecta a todas.
          </p>
        </div>

        {/* Top scattered pieces */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {ROWS.map((r, i) => {
            const Icon = r.icon
            return (
              <div
                key={r.title}
                className="glass-strong rounded-3xl p-6 md:p-7 border border-white/10 relative group"
                style={{
                  animation: `float 6s ease-in-out ${i * 0.4}s infinite`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                  style={{
                    background: `linear-gradient(135deg, ${r.color}55, ${r.color}15)`,
                    border: `1px solid ${r.color}66`,
                    boxShadow: `0 0 30px ${r.color}33`,
                  }}
                >
                  <Icon size={26} style={{ color: r.color }} />
                </div>
                <div
                  className="font-display font-bold text-center text-sm md:text-base tracking-[0.15em] mb-3"
                  style={{ color: r.color }}
                >
                  {r.title}
                </div>
                <p className="text-center text-sm md:text-base text-white/70 leading-snug">
                  {r.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Central connector */}
        <div className="relative max-w-3xl mx-auto mb-10 flex items-center justify-center">
          <div className="hidden md:flex absolute top-0 left-0 right-0 -translate-y-1/2 items-end justify-around px-10 pointer-events-none">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-px h-12 bg-gradient-to-b from-electric-purple/10 to-neon-magenta/60" />
                <ArrowRightLeft size={14} className="text-neon-magenta rotate-90" />
              </div>
            ))}
          </div>
        </div>

        {/* CEREBRO DIGITAL - central element */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative glass-strong rounded-[36px] p-8 md:p-14 border border-gradient-brand overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-grid-fine opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-brand opacity-[0.12] blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              {/* Brain icon */}
              <div className="relative shrink-0">
                <div className="w-48 h-48 md:w-60 md:h-60 rounded-full halo-violet animate-pulse-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-44 h-44 md:w-56 md:h-56 rounded-full border border-electric-purple/30 animate-spin-slow" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-neon-magenta/30 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '14s' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-brand flex items-center justify-center halo-magenta">
                    <BrainCircuit size={36} className="text-white" strokeWidth={1.4} />
                  </div>
                </div>
                {/* Orbiting action chips */}
                {BRAIN_ACTIONS.slice(0, 4).map((act, i) => {
                  const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
                  const r = 140
                  const x = Math.cos(angle) * r
                  const y = Math.sin(angle) * r
                  return (
                    <div
                      key={act}
                      className="absolute left-1/2 top-1/2 px-3 py-1.5 rounded-full glass-strong text-[10px] md:text-xs font-bold tracking-wider"
                      style={{
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        border: '1px solid rgba(168,85,247,0.4)',
                        color: i % 2 ? '#00E5FF' : '#E600FF',
                        animation: `pulse 2.5s ease-in-out ${i * 0.3}s infinite`,
                        boxShadow: `0 0 16px ${i % 2 ? '#00E5FF' : '#E600FF'}33`,
                      }}
                    >
                      {act}
                    </div>
                  )
                })}
              </div>

              {/* Brain description */}
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs tracking-[0.3em] text-electric-cyan font-bold mb-4 uppercase">
                  Nueva categoría
                </div>
                <h3 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-6">
                  <span className="text-white/90">CEREBRO </span>
                  <span className="text-gradient">DIGITAL</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BRAIN_ACTIONS.map((act, i) => (
                    <div
                      key={act}
                      className="relative flex items-center gap-3 rounded-xl p-4 glass-light group"
                      style={{
                        border: `1px solid ${i % 2 ? 'rgba(0,229,255,0.25)' : 'rgba(230,0,255,0.25)'}`,
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-bold"
                        style={{
                          background: i % 2 ? 'rgba(0,229,255,0.2)' : 'rgba(230,0,255,0.2)',
                          color: i % 2 ? '#00E5FF' : '#E600FF',
                        }}
                      >
                        0{i + 1}
                      </div>
                      <span
                        className="font-display font-bold tracking-wide text-sm md:text-base"
                        style={{
                          color: i % 2 ? '#00E5FF' : '#E600FF',
                          textShadow: `0 0 8px ${i % 2 ? 'rgba(0,229,255,0.4)' : 'rgba(230,0,255,0.4)'}`,
                        }}
                      >
                        {act}.
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-white/70 leading-relaxed text-base md:text-lg">
                  Un chatbot responde. Una automatización ejecuta una tarea.
                  Un CRM organiza información. Una aplicación almacena datos.
                  <br />
                  <span className="text-white font-semibold">Un Cerebro Digital coordina.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
