import {
  Users,
  Palette,
  Code2,
  UserCog,
  Bot,
  LayoutDashboard,
  Wrench,
  BrainCircuit,
  ArrowRight,
  Plus,
} from 'lucide-react'

const PIECES = [
  { label: 'AGENCIA', icon: Users, color: '#7B2CFF' },
  { label: 'DISEÑADOR', icon: Palette, color: '#E600FF' },
  { label: 'PROGRAMADOR', icon: Code2, color: '#00E5FF' },
  { label: 'ADMINISTRADOR', icon: UserCog, color: '#A855F7' },
  { label: 'CHATBOT', icon: Bot, color: '#7B2CFF' },
  { label: 'CRM', icon: LayoutDashboard, color: '#E600FF' },
  { label: 'HERRAMIENTAS', icon: Wrench, color: '#00E5FF' },
]

export function StopPieces() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-3 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-ultra-violet/15 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            <span className="block text-white/90">DEJE DE CONTRATAR</span>
            <span className="block text-gradient mt-1">PIEZAS.</span>
          </h2>
          <div className="mt-6">
            <span className="font-display text-3xl md:text-5xl font-bold tracking-[0.2em] text-white/80">
              CONSTRUYA UN{' '}
              <span className="text-gradient">SISTEMA.</span>
            </span>
          </div>
        </div>

        {/* Scattered pieces */}
        <div className="relative max-w-5xl mx-auto mb-16">
          <div className="glass-strong rounded-3xl p-8 md:p-12 border border-electric-purple/20">
            <div className="text-xs tracking-[0.3em] text-white/50 uppercase font-bold mb-8 flex items-center gap-3">
              <span className="w-6 h-px bg-neon-magenta/50" />
              La suma de muchas partes desconectadas
            </div>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3 items-center">
              {PIECES.map((p, i) => {
                const Icon = p.icon
                return (
                  <div key={p.label} className="relative col-span-1">
                    <div
                      className="rounded-2xl p-4 flex flex-col items-center gap-3 glass-light"
                      style={{
                        border: `1px solid ${p.color}44`,
                        animation: `float 7s ease-in-out ${i * 0.35}s infinite`,
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${p.color}77, ${p.color}22)`,
                          boxShadow: `0 0 20px ${p.color}55`,
                        }}
                      >
                        <Icon size={20} className="text-white" />
                      </div>
                      <span
                        className="text-[9px] md:text-[10px] font-bold tracking-[0.15em] text-center"
                        style={{ color: p.color }}
                      >
                        {p.label}
                      </span>
                    </div>
                    {i < PIECES.length - 1 && (
                      <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full glass-strong items-center justify-center border border-white/10">
                        <Plus size={12} className="text-white/50" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center gap-3 mb-16 text-neon-magenta">
          <div className="h-px w-20 md:w-40 bg-gradient-to-r from-transparent to-neon-magenta/60" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full glass-strong border border-neon-magenta/40 flex items-center justify-center animate-pulse">
              <ArrowRight size={18} />
            </div>
            <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-bold">
              En lugar de eso
            </span>
          </div>
          <div className="h-px w-20 md:w-40 bg-gradient-to-l from-transparent to-electric-cyan/60" />
        </div>

        {/* Cerebro as single system */}
        <div className="relative max-w-5xl mx-auto">
          <div
            className="rounded-[36px] p-8 md:p-14 border overflow-hidden relative"
            style={{
              background: 'linear-gradient(160deg, rgba(123,44,255,0.25), rgba(18,3,48,0.95) 55%, rgba(0,229,255,0.12))',
              borderColor: 'rgba(168,85,247,0.55)',
              boxShadow: '0 0 80px rgba(168,85,247,0.3), inset 0 0 80px rgba(168,85,247,0.08)',
            }}
          >
            <div className="absolute inset-0 bg-grid-fine opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-brand opacity-10 blur-[100px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              {/* Brain */}
              <div className="relative shrink-0">
                <div className="w-52 h-52 md:w-64 md:h-64 relative">
                  <div className="absolute inset-0 rounded-full halo-violet animate-pulse-slow" />
                  <div className="absolute inset-0 rounded-full border border-electric-purple/40 animate-spin-slow" />
                  <div className="absolute inset-6 rounded-full border border-neon-magenta/40 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
                  <div className="absolute inset-12 rounded-full border border-electric-cyan/40 animate-spin-slow" style={{ animationDuration: '20s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-brand flex items-center justify-center halo-magenta">
                      <BrainCircuit size={44} className="text-white" strokeWidth={1.2} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="font-mono text-xs tracking-[0.3em] text-electric-cyan uppercase font-bold mb-4">
                  Un sistema central
                </div>
                <h3 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-6">
                  <span className="text-white/90">CEREBRO </span>
                  <span className="text-gradient">DIGITAL IO</span>
                </h3>
                <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8">
                  En lugar de sumar herramientas desconectadas, construya una
                  <span className="text-white font-semibold"> infraestructura inteligente </span>
                  alrededor de su negocio. Coordinación, eficiencia y automatización
                  de procesos — manteniedo supervisión humana.
                </p>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {['Coordinación', 'Eficiencia', 'Automatización', 'Supervisión'].map((t, i) => (
                    <span
                      key={t}
                      className="px-4 py-2 rounded-full text-xs font-bold tracking-wide glass-light border-white/10"
                      style={{
                        color: i % 2 ? '#00E5FF' : '#E600FF',
                        border: `1px solid ${i % 2 ? 'rgba(0,229,255,0.3)' : 'rgba(230,0,255,0.3)'}`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
