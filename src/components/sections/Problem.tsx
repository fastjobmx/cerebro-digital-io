import {
  SiWhatsapp as WhatsappBrand,
  SiFacebook as FacebookBrand,
  SiInstagram as InstagramBrand,
} from 'react-icons/si'
import {
  MessageCircle,
  Globe,
  Mail,
  LayoutDashboard,
  Sheet,
  FolderKanban,
  Calendar,
  FileText,
  Database,
  Server,
  PlugZap,
} from 'lucide-react'

const SYSTEMS = [
  { name: 'WhatsApp', icon: WhatsappBrand, color: '#25D366' },
  { name: 'Meta', icon: FacebookBrand, color: '#1877F2' },
  { name: 'Instagram', icon: InstagramBrand, color: '#E4405F' },
  { name: 'Página Web', icon: Globe, color: '#00E5FF' },
  { name: 'Email', icon: Mail, color: '#A855F7' },
  { name: 'CRM', icon: LayoutDashboard, color: '#7B2CFF' },
  { name: 'Excel', icon: Sheet, color: '#21A366' },
  { name: 'Google Drive', icon: FolderKanban, color: '#FBBC04' },
  { name: 'Calendario', icon: Calendar, color: '#4285F4' },
  { name: 'Documentos', icon: FileText, color: '#E600FF' },
  { name: 'Base de Datos', icon: Database, color: '#0097A7' },
  { name: 'ERP', icon: Server, color: '#5E35B1' },
  { name: 'APIs', icon: PlugZap, color: '#FF7043' },
]

export function Problem() {
  return (
    <section id="cerebro" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-neon-magenta/10 blur-[150px] pointer-events-none" />

      <div className="container-x relative z-10">
        {/* Heading */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <span className="text-[10px] tracking-[0.2em] text-neon-magenta uppercase font-semibold">
              El problema
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-tight max-w-5xl mx-auto">
            <span className="text-white/90">SU NEGOCIO YA TIENE TODO. </span>
            <span className="block mt-2 text-gradient">
              EL PROBLEMA ES QUE ESTÁ SEPARADO.
            </span>
          </h2>
        </div>

        {/* Disconnected systems visualization */}
        <div className="relative mb-20">
          {/* Phase 1: Disconnected */}
          <div className="relative glass-strong rounded-3xl p-8 md:p-14 border border-electric-purple/20">
            <div className="absolute top-4 left-6 flex items-center gap-2 text-xs text-white/40 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-3">sistemas_desconectados.exe</span>
            </div>

            {/* Grid of systems */}
            <div className="mt-10 grid grid-cols-3 md:grid-cols-7 gap-4 md:gap-6 relative">
              {/* Animated "attempted connections" background lines - purely decorative SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 600 300" preserveAspectRatio="none">
                {SYSTEMS.slice(0, 8).map((_, i) =>
                  SYSTEMS.slice(i + 1, 8).map((__, j) => (
                    <line
                      key={`${i}-${j}`}
                      x1={`${(i % 3) * 33 + 16}%`}
                      y1={`${Math.floor(i / 3) * 50 + 25}%`}
                      x2={`${((i + 1 + j) % 3) * 33 + 16}%`}
                      y2={`${Math.floor((i + 1 + j) / 3) * 50 + 25}%`}
                      stroke="#A855F7"
                      strokeWidth="0.5"
                      strokeDasharray="4 6"
                      opacity="0.3"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-40"
                        dur={`${2 + (i + j) * 0.2}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.4;0"
                        dur={`${3 + (i + j) * 0.3}s`}
                        repeatCount="indefinite"
                      />
                    </line>
                  ))
                )}
              </svg>

              {SYSTEMS.map((s, i) => (
                <div
                  key={s.name}
                  className="relative aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl glass-light p-3 group hover:scale-105 transition-transform duration-500"
                  style={{
                    animation: `float 6s ease-in-out ${i * 0.15}s infinite`,
                  }}
                >
                  <div
                    className="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`,
                      border: `1px solid ${s.color}55`,
                      boxShadow: `0 0 30px ${s.color}22`,
                    }}
                  >
                    <s.icon size={22} style={{ color: s.color }} />
                  </div>
                  <span className="text-[10px] md:text-xs text-white/70 text-center leading-tight font-medium">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Arrow to "CONNECTED" + Brain */}
            <div className="mt-14">
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="w-px h-16 bg-gradient-to-b from-neon-magenta/40 via-ultra-violet/60 to-electric-cyan/80 relative">
                    <div className="absolute inset-0 w-full h-full animate-pulse" />
                  </div>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-electric-cyan shadow-glow-cyan" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neon-magenta shadow-glow-magenta" />
                </div>

                {/* Statement + Brain core visualization */}
                <div className="relative w-full max-w-4xl">
                  <div className="glass-strong rounded-3xl p-8 md:p-12 border border-gradient-brand border-gradient overflow-hidden">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
                      {/* Brain core SVG */}
                      <div className="relative shrink-0">
                        <div className="w-52 h-52 md:w-64 md:h-64 relative">
                          {/* Outer rings */}
                          <div className="absolute inset-0 rounded-full border border-electric-purple/30 animate-spin-slow" />
                          <div className="absolute inset-4 rounded-full border border-neon-magenta/30 animate-spin-slow" style={{ animationDuration: '14s', animationDirection: 'reverse' }} />
                          <div className="absolute inset-8 rounded-full border border-electric-cyan/30 animate-spin-slow" style={{ animationDuration: '18s' }} />
                          {/* Core */}
                          <div className="absolute inset-12 rounded-full halo-violet bg-gradient-brand opacity-90 flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-deep-space/20 to-deep-space/60 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-white/90 shadow-glow-brand animate-pulse" />
                                <span className="text-[10px] tracking-[0.15em] text-white uppercase font-semibold">
                                  CORE
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Connection dots */}
                          {Array.from({ length: 10 }).map((_, i) => {
                            const angle = (i / 10) * Math.PI * 2
                            const r = 45 // %
                            return (
                              <div
                                key={i}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                  left: `calc(50% + ${Math.cos(angle) * r}% - 6px)`,
                                  top: `calc(50% + ${Math.sin(angle) * r}% - 6px)`,
                                  background: i % 3 === 0 ? '#00E5FF' : i % 3 === 1 ? '#E600FF' : '#7B2CFF',
                                  boxShadow: `0 0 12px currentColor`,
                                  color: i % 3 === 0 ? '#00E5FF' : i % 3 === 1 ? '#E600FF' : '#7B2CFF',
                                  animation: `pulse 2s ease-in-out ${i * 0.2}s infinite`,
                                }}
                              />
                            )
                          })}
                        </div>
                      </div>

                      {/* Statement */}
                      <div className="text-center lg:text-left">
                        <div className="text-xs tracking-[0.25em] text-electric-cyan uppercase font-semibold mb-4">
                          ↓ CONEXIÓN ESTABLECIDA ↓
                        </div>
                        <h3 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-6">
                          <span className="text-white/80">CEREBRO DIGITAL IO</span>
                          <br />
                          <span className="text-gradient">CONECTA LAS PIEZAS.</span>
                        </h3>
                        <div className="space-y-3 text-white/70 max-w-md">
                          <p className="leading-relaxed">
                            <span className="text-electric-cyan">•</span> Su información está en un lugar.
                          </p>
                          <p className="leading-relaxed">
                            <span className="text-neon-magenta">•</span> Sus clientes en otro.
                          </p>
                          <p className="leading-relaxed">
                            <span className="text-ultra-violet">•</span> Las campañas en otro.
                          </p>
                          <p className="leading-relaxed">
                            <span className="text-electric-cyan">•</span> Los documentos en otro.
                          </p>
                          <p className="leading-relaxed">
                            <span className="text-neon-magenta">•</span> Los procesos dependen de personas.
                          </p>
                          <p className="leading-relaxed text-white/80 font-medium">
                            Y muchas decisiones todavía requieren revisar todo manualmente.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
