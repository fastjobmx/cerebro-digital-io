import {
  Zap,
  Gauge,
  ShieldCheck,
  Brain,
  Link2,
  TrendingUp,
} from 'lucide-react'

const BENEFITS = [
  {
    title: 'EFICIENCIA',
    desc: 'Automatice procesos repetitivos y reduzca la fricción manual.',
    icon: Zap,
    color: '#E600FF',
  },
  {
    title: 'VELOCIDAD',
    desc: 'Convierta tareas que tomaban horas en procesos mucho más ágiles.',
    icon: Gauge,
    color: '#00E5FF',
  },
  {
    title: 'CONTROL',
    desc: 'Consulte y gestione información desde donde esté, 24/7.',
    icon: ShieldCheck,
    color: '#7B2CFF',
  },
  {
    title: 'INTELIGENCIA',
    desc: 'Tome decisiones con información conectada y en contexto.',
    icon: Brain,
    color: '#A855F7',
  },
  {
    title: 'INTEGRACIÓN',
    desc: 'Conecte las herramientas que ya utiliza en un solo cerebro.',
    icon: Link2,
    color: '#00E5FF',
  },
  {
    title: 'EVOLUCIÓN',
    desc: 'Su Cerebro Digital puede crecer junto con su negocio.',
    icon: TrendingUp,
    color: '#E600FF',
  },
]

export function Results() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-neon-magenta/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-electric-cyan/10 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] tracking-tight">
            <span className="block text-white/90">MENOS TAREAS</span>
            <span className="block text-gradient mt-1">REPETITIVAS.</span>
            <span className="block text-white/90 mt-4">MÁS TIEMPO PARA </span>
            <span className="block text-gradient mt-1">DECIDIR.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon
            return (
              <div
                key={b.title}
                className="group relative rounded-3xl p-8 border border-white/10 glass-light overflow-hidden hover:-translate-y-1 transition-all duration-500"
                style={{
                  borderColor: `${b.color}33`,
                  background: `linear-gradient(160deg, ${b.color}14, rgba(18,3,48,0.6))`,
                  animation: `float 7s ease-in-out ${i * 0.4}s infinite`,
                }}
              >
                {/* Number badge */}
                <div className="absolute top-5 right-5 font-mono text-xs font-bold text-white/20 tracking-widest">
                  0{i + 1}
                </div>

                {/* Icon halo */}
                <div className="relative mb-6 w-16 h-16">
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                    style={{ background: b.color }}
                  />
                  <div
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${b.color}, ${b.color}77)`,
                      boxShadow: `0 0 30px ${b.color}66`,
                    }}
                  >
                    <Icon size={30} className="text-white" strokeWidth={1.6} />
                  </div>
                </div>

                <div
                  className="font-display font-bold text-xl md:text-2xl tracking-[0.12em] mb-3"
                  style={{ color: b.color, textShadow: `0 0 14px ${b.color}66` }}
                >
                  {b.title}
                </div>
                <p className="text-white/70 leading-relaxed">{b.desc}</p>

                {/* Bottom bar */}
                <div className="mt-6 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full w-1/2 group-hover:w-full transition-all duration-700 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${b.color}, transparent)` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
