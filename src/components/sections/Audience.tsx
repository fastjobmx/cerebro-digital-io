import {
  Briefcase,
  ShoppingBag,
  ShoppingCart,
  User,
  Building2,
  MapPin,
  Rocket,
  Users,
} from 'lucide-react'

const PROFILES = [
  { t: 'EMPRESAS DE SERVICIOS', icon: Briefcase, color: '#00E5FF' },
  { t: 'COMERCIOS', icon: ShoppingBag, color: '#E600FF' },
  { t: 'E-COMMERCE', icon: ShoppingCart, color: '#7B2CFF' },
  { t: 'PROFESIONALES', icon: User, color: '#A855F7' },
  { t: 'EMPRESAS B2B', icon: Building2, color: '#00E5FF' },
  { t: 'NEGOCIOS LOCALES', icon: MapPin, color: '#E600FF' },
  { t: 'EMPRESAS EN CRECIMIENTO', icon: Rocket, color: '#7B2CFF' },
  { t: 'EQUIPOS COMERCIALES', icon: Users, color: '#A855F7' },
]

export function Audience() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-3 to-deep-space" />
      <div className="absolute inset-0 bg-grid-fine opacity-30" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-6">
            <span className="text-white/90">¿SU EMPRESA ESTÁ LISTA</span>
            <br />
            <span className="text-gradient">PARA TENER UN CEREBRO?</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {PROFILES.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={p.t}
                className="group relative col-span-1 rounded-3xl p-6 md:p-8 border glass-light overflow-hidden hover:scale-[1.03] transition-all duration-500 text-center"
                style={{
                  borderColor: `${p.color}33`,
                  background: `linear-gradient(180deg, ${p.color}18, rgba(18,3,48,0.85))`,
                  animation: `float 7s ease-in-out ${i * 0.3}s infinite`,
                }}
              >
                {/* Glow */}
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                  style={{ background: p.color }}
                />

                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6"
                    style={{
                      background: `linear-gradient(135deg, ${p.color}, ${p.color}77)`,
                      boxShadow: `0 0 30px ${p.color}66`,
                    }}
                  >
                    <Icon size={30} className="text-white" strokeWidth={1.6} />
                  </div>
                  <div
                    className="font-display font-bold text-sm md:text-base tracking-[0.15em] text-center leading-snug"
                    style={{ color: p.color }}
                  >
                    {p.t}
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-white/30">
                    ✓ CONFIGURABLE
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
            No limita el producto a una sola industria. Si su empresa tiene procesos,
            información y herramientas, podemos construirle su Cerebro Digital.
          </p>
        </div>
      </div>
    </section>
  )
}
