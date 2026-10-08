import {
  BarChart3,
  Target,
  Palette,
  TrendingUp,
  Brain,
  Cpu,
  ArrowRight,
} from 'lucide-react'

export function MarketingAI() {
  const pillars = [
    { label: 'DATOS', icon: BarChart3, color: '#00E5FF' },
    { label: 'ESTRATEGIA', icon: Target, color: '#7B2CFF' },
    { label: 'CREATIVIDAD', icon: Palette, color: '#E600FF' },
    { label: 'MEDICIÓN', icon: TrendingUp, color: '#A855F7' },
    { label: 'IA', icon: Brain, color: '#00E5FF' },
    { label: 'AUTOMATIZACIÓN', icon: Cpu, color: '#E600FF' },
  ]

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      {/* Animated horizontal gradient beams */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta/30 to-transparent" />
        <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-cyan/30 to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ultra-violet/30 to-transparent" />
      </div>
      <div className="absolute inset-0 bg-grid-fine opacity-30" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-magenta/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-electric-cyan/12 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6 border border-neon-magenta/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-magenta opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-magenta"></span>
            </span>
            <span className="text-[10px] tracking-[0.2em] text-neon-magenta uppercase font-bold">
              Sección especial · Marketing + IA
            </span>
          </div>

          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            <span className="text-white/90">LA PUBLICIDAD ESTÁ </span>
            <span className="text-gradient">CAMBIANDO.</span>
          </h2>

          <p className="mt-8 text-lg md:text-xl text-white/70 leading-relaxed max-w-4xl mx-auto">
            Las plataformas publicitarias están incorporando cada vez más inteligencia artificial
            en la <span className="text-white">creación, optimización, descubrimiento</span> y{' '}
            <span className="text-white">gestión</span> de campañas.
          </p>
        </div>

        {/* Core pillars animation */}
        <div className="relative max-w-5xl mx-auto mb-20">
          <div className="glass-strong rounded-[32px] p-8 md:p-14 border border-electric-purple/20 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-brand opacity-[0.1] blur-[120px] pointer-events-none" />

            <p className="text-base md:text-xl text-white/75 leading-relaxed mb-10 max-w-3xl mx-auto text-center relative z-10">
              Por eso ya no basta con simplemente publicar anuncios. Hay que trabajar con
              <span className="text-white font-semibold"> información correcta</span>,
              <span className="text-electric-cyan font-semibold"> oferta</span>,
              <span className="text-neon-magenta font-semibold"> creatividad</span>,
              <span className="text-white font-semibold"> audiencias</span>,
              <span className="text-electric-cyan font-semibold"> medición</span>,
              <span className="text-neon-magenta font-semibold"> estructura</span>,
              <span className="text-white font-semibold"> seguimiento</span> y{' '}
              <span className="text-gradient font-semibold">procesos conectados.</span>
            </p>

            {/* Pillar nodes */}
            <div className="relative z-10">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-2 mb-10">
                {pillars.map((p, i) => {
                  const Icon = p.icon
                  return (
                    <div
                      key={p.label}
                      className="relative group"
                      style={{ animation: `float 6s ease-in-out ${i * 0.25}s infinite` }}
                    >
                      <div
                        className="relative rounded-2xl p-4 md:p-5 flex flex-col items-center gap-3 transition-transform duration-500 hover:scale-105"
                        style={{
                          background: `linear-gradient(180deg, ${p.color}33, rgba(18,3,48,0.7))`,
                          border: `1px solid ${p.color}66`,
                          boxShadow: `0 0 30px ${p.color}33`,
                        }}
                      >
                        <div
                          className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${p.color}, ${p.color}77)`,
                            boxShadow: `0 0 20px ${p.color}aa`,
                          }}
                        >
                          <Icon size={22} className="text-white" strokeWidth={1.8} />
                        </div>
                        <span
                          className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] text-center"
                          style={{ color: p.color }}
                        >
                          {p.label}
                        </span>
                        <span className="font-mono text-[9px] md:text-[10px] text-white/40">+</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Down arrow */}
              <div className="flex items-center justify-center gap-3 mb-8 text-electric-cyan">
                <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-electric-cyan/60" />
                <ArrowRight size={20} className="rotate-90 animate-bounce" />
                <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-neon-magenta/60" />
              </div>

              {/* Result */}
              <div className="relative max-w-3xl mx-auto">
                <div
                  className="rounded-3xl p-8 md:p-10 text-center border overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(123,44,255,0.25), rgba(230,0,255,0.15), rgba(0,229,255,0.2))',
                    borderColor: 'rgba(168,85,247,0.6)',
                    boxShadow: '0 0 80px rgba(168,85,247,0.3), inset 0 0 60px rgba(168,85,247,0.1)',
                  }}
                >
                  <div className="text-xs tracking-[0.3em] text-white/60 uppercase font-bold mb-3">
                    Resultado del sistema
                  </div>
                  <div className="font-display font-bold text-2xl md:text-4xl lg:text-5xl leading-tight mb-3">
                    <span className="text-gradient">
                      UN SISTEMA DE MARKETING MÁS INTELIGENTE.
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto">
                    Información conectada + creatividad asistida + medición continua + automatización
                    alrededor de su negocio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center relative z-10">
          <a href="#contacto" className="btn-cyan !px-10 !py-4 text-base md:text-lg">
            <span className="flex items-center gap-3">
              QUIERO ANALIZAR MI NEGOCIO
              <ArrowRight size={18} />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
