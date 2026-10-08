import {
  SiFacebook as Facebook,
  SiWhatsapp as WhatsappBrand,
} from 'react-icons/si'
import {
  Globe,
  Mail,
  LayoutDashboard,
  FolderKanban,
  Calendar,
  FileText,
  Database,
  Server,
  PlugZap,
  BrainCircuit,
  MessageCircle,
} from 'lucide-react'

const ECO_NODES = [
  { label: 'META', icon: Facebook, angle: -90, color: '#1877F2' },
  { label: 'WHATSAPP', icon: WhatsappBrand, angle: -60, color: '#25D366' },
  { label: 'WEB', icon: Globe, angle: -30, color: '#00E5FF' },
  { label: 'EMAIL', icon: Mail, angle: 0, color: '#A855F7' },
  { label: 'CRM', icon: LayoutDashboard, angle: 30, color: '#7B2CFF' },
  { label: 'DRIVE', icon: FolderKanban, angle: 60, color: '#FBBC04' },
  { label: 'CALENDAR', icon: Calendar, angle: 90, color: '#4285F4' },
  { label: 'DATABASE', icon: Database, angle: 120, color: '#0097A7' },
  { label: 'ERP', icon: Server, angle: 150, color: '#5E35B1' },
  { label: 'API', icon: PlugZap, angle: 180, color: '#FF7043' },
  { label: 'DOCUMENTS', icon: FileText, angle: 210, color: '#E600FF' },
]

export function Ecosystem() {
  const size = 640 // visual radius for SVG math

  return (
    <section id="como-funciona" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-3 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full bg-ultra-violet/15 blur-[160px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <span className="text-[10px] tracking-[0.2em] text-electric-cyan uppercase font-semibold">
              Ecosistema conectado
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-6">
            <span className="text-white/90">SU NEGOCIO YA TIENE DATOS. </span>
            <br />
            <span className="text-gradient">AHORA HAGÁMOSLOS TRABAJAR.</span>
          </h2>
        </div>

        <div className="relative w-full max-w-5xl mx-auto aspect-square glass-strong rounded-[40px] p-4 md:p-10 border border-electric-purple/20 overflow-hidden">
          {/* Concentric halos */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[1, 0.82, 0.65, 0.48].map((s, i) => (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${s * 100}%`,
                  paddingBottom: `${s * 100}%`,
                  borderColor:
                    i === 0
                      ? 'rgba(168,85,247,0.14)'
                      : i === 1
                        ? 'rgba(230,0,255,0.15)'
                        : i === 2
                          ? 'rgba(0,229,255,0.18)'
                          : 'rgba(168,85,247,0.25)',
                  animation: i === 0 ? 'none' : `spin ${20 + i * 6}s linear infinite`,
                }}
              />
            ))}
          </div>

          {/* SVG connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${size} ${size}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="ecoLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#E600FF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#7B2CFF" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Lines from center to each node */}
            {ECO_NODES.map((n, i) => {
              const rad = (n.angle * Math.PI) / 180
              const r = size * 0.42
              const cx = size / 2 + Math.cos(rad) * r
              const cy = size / 2 + Math.sin(rad) * r
              return (
                <g key={i}>
                  <line
                    x1={size / 2}
                    y1={size / 2}
                    x2={cx}
                    y2={cy}
                    stroke="url(#ecoLine)"
                    strokeWidth="1"
                    opacity="0.5"
                    strokeDasharray="5 8"
                  />
                  {/* Pulse along line */}
                  <circle r="3" fill={n.color}>
                    <animateMotion
                      dur={`${4 + (i % 4)}s`}
                      repeatCount="indefinite"
                      path={`M ${size / 2} ${size / 2} L ${cx} ${cy}`}
                      begin={`${i * 0.25}s`}
                    />
                  </circle>
                </g>
              )
            })}
          </svg>

          {/* Central brain */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative w-40 h-40 md:w-56 md:h-56">
              <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-50 blur-2xl animate-pulse-slow" />
              <div className="absolute inset-0 rounded-full border border-electric-purple/30 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-neon-magenta/30 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-brand flex items-center justify-center halo-violet">
                  <BrainCircuit size={36} className="text-white md:w-10 md:h-10" strokeWidth={1.4} />
                </div>
              </div>
              {/* Flow labels */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-electric-cyan/15 border border-electric-cyan/40 text-[10px] font-bold tracking-widest text-electric-cyan font-mono">
                INPUT →
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-neon-magenta/15 border border-neon-magenta/40 text-[10px] font-bold tracking-widest text-neon-magenta font-mono">
                → ACTION / RESULT
              </div>
            </div>
          </div>

          {/* Ecosystem nodes */}
          {ECO_NODES.map((n, i) => {
            const rad = (n.angle * Math.PI) / 180
            const pctX = 50 + Math.cos(rad) * 42
            const pctY = 50 + Math.sin(rad) * 42
            const Icon = n.icon
            return (
              <div
                key={n.label}
                className="absolute z-10"
                style={{
                  left: `${pctX}%`,
                  top: `${pctY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="group relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${n.color}55, rgba(18,3,48,0.9))`,
                    border: `1px solid ${n.color}77`,
                    boxShadow: `0 0 24px ${n.color}55`,
                    animation: `pulse 3s ease-in-out ${i * 0.15}s infinite`,
                  }}
                >
                  <Icon size={22} style={{ color: n.color }} />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] md:text-[11px] font-bold tracking-[0.1em] text-white/70 group-hover:text-white transition-colors" style={{ textShadow: `0 0 8px ${n.color}aa` }}>
                    {n.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Flow labels */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {[
            { t: 'INPUT', c: '#00E5FF' },
            { t: 'PROCESSING', c: '#7B2CFF' },
            { t: 'INTELLIGENCE', c: '#E600FF' },
            { t: 'ACTION', c: '#A855F7' },
            { t: 'RESULT', c: '#00E5FF' },
          ].map((step, i, arr) => (
            <div key={step.t} className="flex items-center gap-2 col-span-1">
              <div
                className="flex-1 rounded-xl py-3 px-3 text-center glass-light text-xs font-bold tracking-[0.15em]"
                style={{
                  color: step.c,
                  border: `1px solid ${step.c}44`,
                  boxShadow: `0 0 24px ${step.c}22`,
                }}
              >
                {step.t}
              </div>
              {i < arr.length - 1 && (
                <div className="hidden md:block w-2 h-px bg-gradient-to-r from-neon-magenta/60 to-electric-cyan/60 -mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
