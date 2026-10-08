import { Check, Boxes, Globe, Database, Cpu, Mail, Calendar, Smartphone, TestTube, GraduationCap, RefreshCw } from 'lucide-react'

const ITEMS = [
  { t: 'Cerebro configurado para su negocio', icon: Boxes, color: '#7B2CFF' },
  { t: 'Información y contexto empresarial estructurados', icon: Database, color: '#E600FF' },
  { t: 'Integraciones disponibles para sus herramientas', icon: Cpu, color: '#00E5FF' },
  { t: 'Automatizaciones personalizadas', icon: RefreshCw, color: '#A855F7' },
  { t: 'Website y presencia digital cuando formen parte del proyecto', icon: Globe, color: '#00E5FF' },
  { t: 'CRM o herramienta de gestión cuando sea necesario', icon: Database, color: '#7B2CFF' },
  { t: 'Conexiones con email, documentos y calendario', icon: Mail, color: '#E600FF' },
  { t: 'Interfaz de interacción desde computador o celular', icon: Smartphone, color: '#00E5FF' },
  { t: 'Flujos probados y verificados', icon: TestTube, color: '#A855F7' },
  { t: 'Capacitación inicial', icon: GraduationCap, color: '#7B2CFF' },
  { t: 'Acompañamiento para evolución', icon: Calendar, color: '#E600FF' },
]

export function Receive() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-ultra-violet/15 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6 border border-neon-magenta/30">
            <Check size={14} className="text-neon-magenta" />
            <span className="text-[10px] tracking-[0.2em] text-neon-magenta uppercase font-bold">
              Entregable real
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] tracking-tight">
            <span className="block text-white/90">NO ENTREGAMOS UNA</span>
            <span className="block text-gradient mt-1">PROMESA.</span>
            <span className="block text-white/90 mt-4">ENTREGAMOS UN</span>
            <span className="block text-gradient mt-1">SISTEMA.</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="glass-strong rounded-[32px] p-6 md:p-10 border border-electric-purple/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ITEMS.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.t}
                    className="group flex items-start gap-4 p-4 md:p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.02]"
                  >
                    {/* Check badge */}
                    <div
                      className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}77)`,
                        boxShadow: `0 0 18px ${item.color}66`,
                      }}
                    >
                      <Check size={16} className="text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1 min-w-0 flex items-start gap-2">
                      <Icon
                        size={16}
                        className="shrink-0 mt-0.5 text-white/25 group-hover:text-white/50 transition-colors"
                        style={{ color: item.color + '88' }}
                      />
                      <span className="text-sm md:text-base text-white/80 leading-snug group-hover:text-white transition-colors">
                        {item.t}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
