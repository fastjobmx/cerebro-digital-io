import {
  Compass,
  PenTool,
  Link,
  Settings,
  FlaskConical,
  TrendingUp,
} from 'lucide-react'

const PHASES = [
  {
    n: '01',
    t: 'DESCUBRIR',
    d: 'Entendemos su empresa, productos, clientes y procesos.',
    icon: Compass,
    color: '#00E5FF',
  },
  {
    n: '02',
    t: 'DISEÑAR',
    d: 'Definimos qué debe conocer y qué debe poder hacer.',
    icon: PenTool,
    color: '#7B2CFF',
  },
  {
    n: '03',
    t: 'CONECTAR',
    d: 'Integramos herramientas, datos y sistemas disponibles.',
    icon: Link,
    color: '#E600FF',
  },
  {
    n: '04',
    t: 'CONFIGURAR',
    d: 'Construimos instrucciones, conocimiento, automatizaciones y flujos.',
    icon: Settings,
    color: '#A855F7',
  },
  {
    n: '05',
    t: 'PROBAR',
    d: 'Verificamos que todo funcione correctamente.',
    icon: FlaskConical,
    color: '#00E5FF',
  },
  {
    n: '06',
    t: 'EVOLUCIONAR',
    d: 'El sistema puede crecer a medida que su empresa cambia.',
    icon: TrendingUp,
    color: '#E600FF',
  },
]

export function Timeline() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-3 to-deep-space" />
      <div className="absolute inset-0 bg-grid-fine opacity-30" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <span className="text-[10px] tracking-[0.2em] text-ultra-violet uppercase font-bold">
              Proceso de construcción
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-6">
            <span className="text-white/90">SU CEREBRO NO VIENE EN </span>
            <span className="text-gradient">CAJA.</span>
          </h2>
          <p className="text-2xl md:text-4xl font-display text-white/70 tracking-tight">
            SE CONSTRUYE <span className="text-gradient font-bold">ALREDEDOR DE SU NEGOCIO.</span>
          </p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          {/* Timeline line */}
          <div className="absolute top-[72px] left-0 right-0 h-[2px]">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/40 via-ultra-violet/50 to-neon-magenta/40" />
          </div>

          <div className="grid grid-cols-6 gap-4 relative">
            {PHASES.map((p, i) => {
              const Icon = p.icon
              return (
                <div
                  key={p.n}
                  className="relative flex flex-col items-center text-center col-span-1 group"
                >
                  {/* Node */}
                  <div className="relative w-[140px] h-[140px] flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle, ${p.color}55 0%, transparent 70%)`,
                      }}
                    />
                    {/* Glow ring */}
                    <div
                      className="absolute inset-0 rounded-full border transition-all duration-500 group-hover:scale-110"
                      style={{
                        borderColor: `${p.color}55`,
                      }}
                    />
                    {/* Inner node */}
                    <div
                      className="relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6"
                      style={{
                        background: `linear-gradient(135deg, ${p.color}, ${p.color}77)`,
                        boxShadow: `0 0 40px ${p.color}88`,
                      }}
                    >
                      <Icon size={30} className="text-white" strokeWidth={1.6} />
                    </div>
                    {/* Pulse */}
                    <div
                      className="absolute inset-0 rounded-full border"
                      style={{
                        borderColor: `${p.color}66`,
                        animation: `ping 3s cubic-bezier(0,0,0.2,1) ${i * 0.4}s infinite`,
                      }}
                    />
                  </div>

                  {/* Number */}
                  <div
                    className="font-mono text-sm font-bold tracking-[0.2em] mt-4 mb-2"
                    style={{ color: p.color }}
                  >
                    {p.n}
                  </div>

                  {/* Title */}
                  <div
                    className="font-display font-bold text-lg tracking-[0.15em] mb-3"
                    style={{ color: '#fff', textShadow: `0 0 10px ${p.color}44` }}
                  >
                    {p.t}
                  </div>

                  {/* Desc */}
                  <p className="text-sm text-white/65 leading-relaxed px-1">{p.d}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-5 relative pl-10">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-electric-cyan/50 via-ultra-violet/50 to-neon-magenta/50" />
          {PHASES.map((p, i) => {
            const Icon = p.icon
            return (
              <div key={p.n} className="relative flex items-start gap-4">
                <div
                  className="absolute -left-6 top-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: p.color,
                    boxShadow: `0 0 12px ${p.color}aa`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="flex-1 glass-light rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${p.color}, ${p.color}77)`,
                      }}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest" style={{ color: p.color }}>{p.n}</div>
                      <div className="font-display font-bold text-base tracking-wider" style={{ color: '#fff' }}>
                        {p.t}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{p.d}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
