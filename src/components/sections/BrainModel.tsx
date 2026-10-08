import { useState } from 'react'
import {
  SiFacebook as Facebook,
  SiWhatsapp as WhatsappBrand,
} from 'react-icons/si'
import {
  MessageCircle,
  Globe,
  Mail,
  LayoutDashboard,
  FolderKanban,
  Calendar,
  FileText,
  Database,
  PlugZap,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react'

const INPUT_NODES = [
  {
    key: 'meta',
    label: 'META',
    icon: Facebook,
    color: '#1877F2',
    description:
      'Analice información y gestione procesos relacionados con sus campañas cuando las integraciones y permisos estén configurados.',
  },
  {
    key: 'whatsapp',
    label: 'WHATSAPP',
    icon: WhatsappBrand,
    color: '#25D366',
    description:
      'Conecte conversaciones y procesos comerciales. Automatice respuestas inteligentes y seguimiento.',
  },
  {
    key: 'crm',
    label: 'CRM',
    icon: LayoutDashboard,
    color: '#7B2CFF',
    description:
      'Centralice información de clientes y oportunidades. Detecte patrones y siguiente acción sugerida.',
  },
  {
    key: 'web',
    label: 'WEB',
    icon: Globe,
    color: '#00E5FF',
    description:
      'Actualice y gestione contenidos y procesos digitales. Información que fluye hacia adentro y afuera.',
  },
  {
    key: 'email',
    label: 'EMAIL',
    icon: Mail,
    color: '#A855F7',
    description:
      'Lea, clasifique, redacte y ejecute acciones a partir de comunicaciones entrantes y salientes.',
  },
  {
    key: 'documents',
    label: 'DOCUMENTS',
    icon: FileText,
    color: '#E600FF',
    description:
      'Extraiga información, resuma, compare y genere documentos nuevos alineados a su contexto.',
  },
  {
    key: 'calendar',
    label: 'CALENDAR',
    icon: Calendar,
    color: '#4285F4',
    description:
      'Coordine citas, recordatorios, agenda y disponibilidad. Proactive sugerencias de seguimiento.',
  },
  {
    key: 'database',
    label: 'DATABASE',
    icon: Database,
    color: '#0097A7',
    description:
      'Consulte, cruce y transforme información de sus bases de datos de manera segura y controlada.',
  },
  {
    key: 'api',
    label: 'API',
    icon: PlugZap,
    color: '#FF7043',
    description:
      'Conecte sistemas internos o de terceros mediante APIs, flujos y webhooks personalizados.',
  },
  {
    key: 'drive',
    label: 'DRIVE',
    icon: FolderKanban,
    color: '#FBBC04',
    description:
      'Gestione carpetas, archivos y conocimiento distribuido en sus herramientas de almacenamiento.',
  },
]

export function BrainModel() {
  const [active, setActive] = useState<string>('whatsapp')
  const activeNode = INPUT_NODES.find((n) => n.key === active) || INPUT_NODES[0]
  const Icon = activeNode.icon

  return (
    <section id="soluciones" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-electric-cyan/10 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <BrainCircuit size={14} className="text-neon-magenta" />
            <span className="text-[10px] tracking-[0.2em] text-neon-magenta uppercase font-semibold">
              Modelo del sistema
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            <span className="text-white/90">INPUT </span>
            <span className="text-electric-cyan">→</span>
            <span className="text-gradient"> INTELLIGENCE </span>
            <span className="text-neon-magenta">→</span>
            <span className="text-white/90"> OUTPUT</span>
          </h2>
          <p className="mt-6 text-white/60 text-lg">
            Pase el cursor sobre cada nodo para ver cómo el Cerebro procesa cada fuente.
          </p>
        </div>

        <div className="glass-strong rounded-[40px] p-8 md:p-16 border border-electric-purple/20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 items-center relative z-10">
            {/* INPUT NODES */}
            <div>
              <div className="text-xs tracking-[0.3em] text-electric-cyan uppercase font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-electric-cyan/50" />
                INPUT — FUENTES DE INFORMACIÓN
              </div>
              <div className="grid grid-cols-2 gap-3">
                {INPUT_NODES.map((n) => {
                  const NI = n.icon
                  const isActive = active === n.key
                  return (
                    <button
                      key={n.key}
                      onMouseEnter={() => setActive(n.key)}
                      onClick={() => setActive(n.key)}
                      className={`relative flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-300 ${
                        isActive ? 'scale-[1.04] z-10' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${n.color}33, rgba(18,3,48,0.8))`
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isActive ? n.color : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: isActive ? `0 0 30px ${n.color}33` : 'none',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${n.color}66, ${n.color}22)`,
                          border: `1px solid ${n.color}66`,
                        }}
                      >
                        <NI size={18} style={{ color: '#fff' }} />
                      </div>
                      <div className="min-w-0">
                        <div
                          className="text-xs font-bold tracking-wider truncate"
                          style={{ color: n.color }}
                        >
                          {n.label}
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-glow-cyan animate-pulse" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CENTRAL BRAIN */}
            <div className="relative flex flex-col items-center justify-center py-4">
              {/* Input → Intelligence arrow */}
              <div className="hidden lg:block absolute top-1/2 -left-10 -translate-y-1/2 flex items-center gap-2 text-electric-cyan">
                <div className="w-8 h-px bg-electric-cyan/50" />
                <ArrowRight size={16} className="animate-pulse" />
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-full halo-violet animate-pulse-slow" />
                <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full border border-electric-purple/30 animate-spin-slow">
                  <div className="absolute inset-4 rounded-full border border-neon-magenta/30 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '14s' }} />
                  <div className="absolute inset-8 rounded-full border border-electric-cyan/30 animate-spin-slow" style={{ animationDuration: '18s' }} />
                </div>

                {/* Core with active node streaming */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full halo-magenta">
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle, rgba(230,0,255,0.8) 0%, rgba(123,44,255,0.5) 40%, transparent 80%)`,
                      }}
                    >
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full glass-strong border-2 border-gradient-brand flex items-center justify-center">
                        <BrainCircuit size={48} className="text-gradient" strokeWidth={1.2} />
                      </div>
                    </div>
                    {/* Pulsing nodes around core */}
                    {Array.from({ length: 8 }).map((_, i) => {
                      const angle = (i / 8) * Math.PI * 2
                      return (
                        <div
                          key={i}
                          className="absolute w-2.5 h-2.5 rounded-full"
                          style={{
                            left: `calc(50% + ${Math.cos(angle) * 130}px)`,
                            top: `calc(50% + ${Math.sin(angle) * 130}px)`,
                            background: i % 2 ? '#00E5FF' : '#E600FF',
                            boxShadow: `0 0 12px ${i % 2 ? '#00E5FF' : '#E600FF'}`,
                            transform: 'translate(-50%, -50%)',
                            animation: `pulse 2s ease-in-out ${i * 0.25}s infinite`,
                          }}
                        />
                      )
                    })}
                  </div>
                </div>

                {/* Status bar */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="glass-strong rounded-full px-4 py-1.5 border border-electric-purple/30 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
                    <span className="text-[10px] font-mono tracking-wider text-white/70 uppercase">
                      {activeNode.label} → processing…
                    </span>
                  </div>
                </div>
              </div>

              {/* Intelligence → Output arrow */}
              <div className="hidden lg:block absolute top-1/2 -right-10 -translate-y-1/2 flex items-center gap-2 text-neon-magenta">
                <ArrowRight size={16} className="animate-pulse" />
                <div className="w-8 h-px bg-neon-magenta/50" />
              </div>
            </div>

            {/* OUTPUT PANEL */}
            <div>
              <div className="text-xs tracking-[0.3em] text-neon-magenta uppercase font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-neon-magenta/50" />
                OUTPUT — PROCESAMIENTO
              </div>
              <div
                className="relative rounded-2xl p-6 md:p-8 min-h-[360px] flex flex-col"
                style={{
                  background: `linear-gradient(160deg, ${activeNode.color}1A, rgba(18,3,48,0.85))`,
                  border: `1px solid ${activeNode.color}55`,
                  boxShadow: `0 0 60px ${activeNode.color}22`,
                  transition: 'all 0.5s ease',
                }}
              >
                <div className="absolute top-3 left-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: activeNode.color }} />
                  <span className="w-2 h-2 rounded-full bg-white/30" />
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                </div>

                <div className="mt-6 flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${activeNode.color}, ${activeNode.color}88)`,
                      boxShadow: `0 0 30px ${activeNode.color}66`,
                    }}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[11px] tracking-widest text-white/50">NODO ACTIVO</div>
                    <div className="font-display text-2xl font-bold" style={{ color: activeNode.color }}>
                      {activeNode.label}
                    </div>
                  </div>
                </div>

                {/* Animated processing steps */}
                <div className="space-y-3 flex-1">
                  {[
                    { t: 'Reconociendo fuente', d: 0 },
                    { t: 'Cruzando información disponible', d: 0.15 },
                    { t: 'Aplicando contexto de negocio', d: 0.3 },
                    { t: 'Evaluando reglas y permisos', d: 0.45 },
                    { t: 'Generando propuesta de acción', d: 0.6 },
                    { t: 'Acción disponible para aprobación', d: 0.75, final: true },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          background: step.final ? '#00E5FF' : activeNode.color,
                          boxShadow: `0 0 10px ${step.final ? '#00E5FF' : activeNode.color}`,
                          animation: `pulse 2s ease-in-out ${step.d * 2}s infinite`,
                        }}
                      />
                      <span className="text-sm text-white/75 leading-tight">{step.t}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm md:text-base text-white/80 leading-relaxed">
                    {activeNode.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
