import {
  ShieldCheck,
  BrainCircuit,
  UserCheck,
  Rocket,
  Megaphone,
  DatabaseZap,
  MailWarning,
  Settings2,
  Wallet,
  CheckCircle2,
} from 'lucide-react'

const EXAMPLES = [
  { t: 'Publicar campaña', icon: Megaphone, color: '#E600FF' },
  { t: 'Modificar información importante', icon: DatabaseZap, color: '#7B2CFF' },
  { t: 'Enviar comunicaciones sensibles', icon: MailWarning, color: '#A855F7' },
  { t: 'Realizar cambios críticos', icon: Settings2, color: '#00E5FF' },
  { t: 'Acciones que impliquen presupuesto', icon: Wallet, color: '#E600FF' },
]

export function HumanControl() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid-fine opacity-30" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-electric-cyan/10 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6 border border-electric-cyan/30">
            <ShieldCheck size={14} className="text-electric-cyan" />
            <span className="text-[10px] tracking-[0.2em] text-electric-cyan uppercase font-bold">
              Control humano
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-6">
            <span className="text-gradient">INTELIGENTE </span>
            <span className="text-white/90">NO SIGNIFICA</span>
            <br />
            <span className="text-white/90">SIN </span>
            <span className="text-gradient">CONTROL.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Su Cerebro Digital puede automatizar procesos, pero
            <span className="text-white font-semibold"> usted mantiene el control</span> sobre
            las decisiones importantes.
          </p>
        </div>

        {/* Central approval flow */}
        <div className="relative max-w-5xl mx-auto mb-20">
          <div className="glass-strong rounded-[36px] p-8 md:p-14 border border-electric-purple/20 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-electric-cyan/10 blur-[120px]" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* 1 Cerebro propone */}
              <div className="relative flex flex-col items-center text-center">
                <div className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-neon-magenta mb-4 uppercase">
                  Paso 01
                </div>
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full halo-magenta flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-neon-magenta/40 animate-spin-slow" />
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-neon-magenta to-ultra-violet flex items-center justify-center">
                    <BrainCircuit size={36} className="text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mt-6 font-display font-bold text-xl md:text-2xl text-white mb-2">
                  CEREBRO PROPONE
                </div>
                <p className="text-sm md:text-base text-white/60 max-w-xs">
                  Analiza, sugiere y prepara cursos de acción basados en su negocio.
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex flex-col items-center justify-center gap-4">
                <div className="relative w-full max-w-[100px] h-px bg-gradient-to-r from-neon-magenta/60 to-electric-cyan/60" />
                <div className="font-mono text-xs text-white/40">→</div>
                <div className="relative w-full max-w-[100px] h-px bg-gradient-to-r from-electric-cyan/60 to-neon-magenta/60" />
              </div>

              {/* 2 Usted aprueba */}
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-electric-cyan mb-4 uppercase">
                  Paso 02
                </div>
                <div className="relative">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full halo-cyan flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-electric-cyan/40 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-electric-cyan to-ultra-violet flex items-center justify-center">
                      <UserCheck size={36} className="text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  {/* APROBAR button badge */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    <div className="px-5 py-2 rounded-full bg-gradient-brand text-white text-xs font-bold tracking-widest shadow-glow-brand animate-pulse-slow">
                      APROBAR ✓
                    </div>
                  </div>
                </div>
                <div className="mt-10 font-display font-bold text-xl md:text-2xl text-white mb-2">
                  USTED APRUEBA
                </div>
                <p className="text-sm md:text-base text-white/60 max-w-xs">
                  Mantiene la última palabra sobre las acciones sensibles.
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex flex-col items-center justify-center gap-4">
                <div className="relative w-full max-w-[100px] h-px bg-gradient-to-r from-neon-magenta/60 to-electric-cyan/60" />
                <div className="font-mono text-xs text-white/40">→</div>
                <div className="relative w-full max-w-[100px] h-px bg-gradient-to-r from-electric-cyan/60 to-neon-magenta/60" />
              </div>

              {/* 3 Cerebro ejecuta */}
              <div className="relative flex flex-col items-center text-center">
                <div className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-ultra-violet mb-4 uppercase">
                  Paso 03
                </div>
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full halo-violet flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-ultra-violet/40 animate-spin-slow" />
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-ultra-violet to-neon-magenta flex items-center justify-center">
                    <Rocket size={36} className="text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mt-6 font-display font-bold text-xl md:text-2xl text-white mb-2">
                  CEREBRO EJECUTA
                </div>
                <p className="text-sm md:text-base text-white/60 max-w-xs">
                  Ejecuta acciones autorizadas y le entrega los resultados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Examples requiring approval */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-xs tracking-[0.3em] text-white/40 uppercase font-bold mb-8">
            Acciones que siempre requieren aprobación
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXAMPLES.map((e, i) => {
              const Icon = e.icon
              return (
                <div
                  key={e.t}
                  className="flex items-center gap-4 p-5 rounded-2xl glass-light border border-white/10 group hover:scale-[1.01] transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${e.color}44, ${e.color}11)`,
                      border: `1px solid ${e.color}66`,
                    }}
                  >
                    <Icon size={22} style={{ color: e.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] text-white/40 tracking-widest mb-0.5">
                      0{i + 1} · APROBACIÓN REQUERIDA
                    </div>
                    <div className="text-white/85 font-medium leading-tight">{e.t}</div>
                  </div>
                  <CheckCircle2 size={20} className="text-white/30 group-hover:text-electric-cyan transition-colors shrink-0" />
                </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm md:text-base text-white/60 italic">
              Tranquilidad para su equipo. Velocidad para su negocio.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
