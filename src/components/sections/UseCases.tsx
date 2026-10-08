import { useState } from 'react'
import {
  Megaphone,
  PenTool,
  Handshake,
  Swords,
  Globe,
  FolderTree,
  UsersRound,
  GitBranch,
  BrainCircuit,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

const CASES = [
  {
    cat: 'MARKETING',
    text: 'Analiza mis campañas y encuentra oportunidades.',
    icon: Megaphone,
    color: '#E600FF',
    steps: ['Cargando datos de campañas', 'Midiendo métricas clave', 'Detectando anomalías', 'Identificando oportunidades'],
    result: '3 oportunidades de mejora detectadas.',
  },
  {
    cat: 'CONTENIDO',
    text: 'Prepara el contenido de esta semana.',
    icon: PenTool,
    color: '#00E5FF',
    steps: ['Revisando línea editorial', 'Analizando tendencias', 'Generando copies', 'Estructurando calendario'],
    result: '5 temas + 15 copies listos para aprobación.',
  },
  {
    cat: 'VENTAS',
    text: 'Prepara una cotización para este cliente.',
    icon: Handshake,
    color: '#7B2CFF',
    steps: ['Consultando historial del cliente', 'Calculando precios y márgenes', 'Aplicando condiciones comerciales', 'Generando documento'],
    result: 'Cotización lista en PDF para revisar.',
  },
  {
    cat: 'COMPETENCIA',
    text: 'Analiza a mis competidores.',
    icon: Swords,
    color: '#A855F7',
    steps: ['Mapeando marcas competidoras', 'Revisando presencia digital', 'Comparando ofertas y precios', 'Identificando diferenciadores'],
    result: 'Competencia mapeada con puntos débiles y fuertes.',
  },
  {
    cat: 'WEB',
    text: 'Actualiza los precios de la página.',
    icon: Globe,
    color: '#00E5FF',
    steps: ['Revisando catálogo vigente', 'Localizando entradas a actualizar', 'Aplicando nuevos precios', 'Validando vista previa'],
    result: 'Actualización pendiente de aprobación.',
  },
  {
    cat: 'ADMINISTRACIÓN',
    text: 'Organiza estos documentos y prepara un resumen.',
    icon: FolderTree,
    color: '#E600FF',
    steps: ['Clasificando documentos', 'Extrayendo datos clave', 'Cruzando información', 'Generando resumen ejecutivo'],
    result: 'Documentos ordenados. Resumen listo para revisar.',
  },
  {
    cat: 'CLIENTES',
    text: 'Muéstrame los clientes que requieren seguimiento.',
    icon: UsersRound,
    color: '#7B2CFF',
    steps: ['Revisando estado de clientes', 'Verificando última interacción', 'Identificando follow-ups pendientes', 'Ordenando por prioridad'],
    result: '7 clientes requieren seguimiento esta semana.',
  },
  {
    cat: 'OPERACIONES',
    text: 'Identifica las tareas repetitivas que podemos automatizar.',
    icon: GitBranch,
    color: '#A855F7',
    steps: ['Mapeando procesos actuales', 'Revisando actividades manuales', 'Evaluando costo / beneficio', 'Priorizando por impacto'],
    result: '5 procesos candidatos a automatizar mapeados.',
  },
]

export function UseCases() {
  const [active, setActive] = useState<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'processing' | 'done'>('idle')
  const [stepIdx, setStepIdx] = useState(0)

  const activate = (i: number) => {
    if (active === i && phase === 'done') {
      setActive(null)
      setPhase('idle')
      setStepIdx(0)
      return
    }
    setActive(i)
    setPhase('processing')
    setStepIdx(0)
    const c = CASES[i]
    let s = 0
    const tick = () => {
      s++
      setStepIdx(s)
      if (s >= c.steps.length) {
        setTimeout(() => setPhase('done'), 350)
      } else {
        setTimeout(tick, 550)
      }
    }
    setTimeout(tick, 400)
  }

  return (
    <section id="casos" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid-fine opacity-30" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-neon-magenta/10 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <Sparkles size={14} className="text-electric-cyan" />
            <span className="text-[10px] tracking-[0.2em] text-electric-cyan uppercase font-semibold">
              Casos de uso
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-6">
            <span className="text-white/90">¿QUÉ PUEDE </span>
            <span className="text-gradient">HACER?</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Algunos ejemplos de comandos que su Cerebro Digital puede entender y procesar
            cuando cuenta con la información, integraciones y permisos correspondientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CASES.map((c, i) => {
            const Icon = c.icon
            const isActive = active === i
            return (
              <button
                key={c.cat}
                onClick={() => activate(i)}
                className={`group relative text-left rounded-3xl p-6 glass-light border transition-all duration-500 ${
                  isActive ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]'
                }`}
                style={{
                  borderColor: isActive ? c.color : 'rgba(255,255,255,0.08)',
                  background: isActive
                    ? `linear-gradient(160deg, ${c.color}22, rgba(18,3,48,0.95))`
                    : 'rgba(255,255,255,0.03)',
                  boxShadow: isActive ? `0 0 50px ${c.color}33` : 'none',
                }}
              >
                {/* Category chip */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`,
                      boxShadow: isActive ? `0 0 24px ${c.color}aa` : `0 0 14px ${c.color}55`,
                    }}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] text-white/40 tracking-widest mb-0.5">
                      CASO 0{i + 1}
                    </div>
                    <div className="font-display font-bold text-sm tracking-[0.18em]" style={{ color: c.color }}>
                      {c.cat}
                    </div>
                  </div>
                </div>

                {/* Command */}
                <p className="text-white/90 text-base leading-snug mb-4 font-medium">
                  "{c.text}"
                </p>

                {/* Animated processing */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isActive ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />
                  <div className="space-y-2.5">
                    {c.steps.map((s, si) => {
                      const state =
                        phase === 'processing'
                          ? si < stepIdx
                            ? 'done'
                            : si === stepIdx
                              ? 'active'
                              : 'pending'
                          : phase === 'done'
                            ? 'done'
                            : 'pending'
                      return (
                        <div
                          key={si}
                          className="flex items-center gap-3 text-[13px]"
                          style={{
                            opacity: state === 'pending' ? 0.3 : 1,
                            transition: 'all 0.4s ease',
                          }}
                        >
                          <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                            {state === 'done' ? (
                              <CheckCircle2 size={14} style={{ color: c.color }} />
                            ) : state === 'active' ? (
                              <Loader2 size={14} className="animate-spin" style={{ color: c.color }} />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                            )}
                          </div>
                          <span className="text-white/75 leading-tight">{s}</span>
                        </div>
                      )
                    })}

                    {phase === 'done' && (
                      <div
                        className="mt-4 p-3 rounded-2xl flex items-start gap-3"
                        style={{
                          background: `linear-gradient(135deg, ${c.color}33, ${c.color}11)`,
                          border: `1px solid ${c.color}55`,
                          animation: 'msgIn 0.4s ease-out',
                        }}
                      >
                        <BrainCircuit size={18} className="shrink-0 mt-0.5" style={{ color: c.color }} />
                        <span className="text-sm font-semibold text-white/90 leading-snug">
                          {c.result}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover hint */}
                {!isActive && (
                  <div className="mt-3 flex items-center gap-2 text-[10px] tracking-widest text-white/30 uppercase font-bold group-hover:text-white/60 transition-colors">
                    <BrainCircuit size={12} />
                    Click para simular
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
