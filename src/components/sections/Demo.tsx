import { useEffect, useRef, useState } from 'react'
import {
  TerminalSquare,
  Sparkles,
  Send,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

const SUGGESTIONS = [
  'Analiza mis campañas.',
  'Prepara una propuesta comercial.',
  'Organiza estos documentos.',
  'Analiza a mi competencia.',
  'Actualiza el contenido de mi página.',
  'Encuentra procesos que podamos automatizar.',
]

export function Demo() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<
    { who: 'user' | 'brain'; msg: string; loading?: boolean; steps?: string[] }[]
  >([
    {
      who: 'brain',
      msg: 'Bienvenido. Soy una demostración visual de CEREBRO DIGITAL IO. Escriba una tarea o seleccione un ejemplo de la lista para ver cómo funcionaría.',
    },
  ])
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const runDemo = (command: string) => {
    if (!command.trim()) return
    const trimmed = command.trim()
    // Build steps from command type
    let steps = [
      'Entendiendo la solicitud…',
      'Recuperando contexto de negocio…',
      'Procesando información disponible…',
      'Estructurando respuesta…',
    ]
    let final = 'Listo. He preparado un resultado conceptual para que usted lo revise y apruebe.'
    if (/campaña/i.test(trimmed)) {
      steps = [
        'Cargando datos de campañas activas…',
        'Midiendo inversión vs. resultados…',
        'Detectando oportunidades y fugas…',
        'Estructurando plan de acción…',
      ]
      final = 'Identifiqué 3 oportunidades de mejora y preparé un plan con prioridades.'
    } else if (/propuesta|cotización|comercial/i.test(trimmed)) {
      steps = [
        'Revisando historial del cliente…',
        'Consultando precios y condiciones…',
        'Armando estructura de propuesta…',
        'Calculando márgenes y descuentos…',
      ]
      final = 'Propuesta comercial lista para revisar y enviar.'
    } else if (/documento|organiza/i.test(trimmed)) {
      steps = [
        'Clasificando documentos…',
        'Extrayendo datos y metadatos…',
        'Relacionando con proyectos y clientes…',
        'Generando resumen ejecutivo…',
      ]
      final = 'Documentos organizados. Resumen listo para revisar.'
    } else if (/competencia/i.test(trimmed)) {
      steps = [
        'Mapeando competidores directos…',
        'Analizando su presencia digital…',
        'Comparando ofertas y posicionamiento…',
        'Identificando diferenciadores…',
      ]
      final = 'Competencia mapeada con brechas y oportunidades.'
    } else if (/página|web|contenido|precios/i.test(trimmed)) {
      steps = [
        'Revisando estructura del sitio…',
        'Localizando entradas a actualizar…',
        'Aplicando cambios en modo borrador…',
        'Preparando vista previa…',
      ]
      final = 'Vista previa preparada. Esperando su aprobación para publicar.'
    } else if (/proces|automat/i.test(trimmed)) {
      steps = [
        'Mapeando procesos actuales…',
        'Detectando tareas manuales repetitivas…',
        'Evaluando costo / beneficio…',
        'Priorizando por impacto…',
      ]
      final = 'Identifiqué 5 procesos candidatos con ahorro potencial de horas por semana.'
    }

    // Append user message + initial loading brain message
    setHistory((h) => [
      ...h,
      { who: 'user', msg: trimmed },
      {
        who: 'brain',
        msg: '',
        loading: true,
        steps,
      },
    ])

    // Animate steps
    let idx = 0
    const tick = () => {
      idx++
      setHistory((h) => {
        const copy = [...h]
        const last = copy[copy.length - 1]
        if (last && last.steps) {
          last.steps = [...last.steps] // just trigger update
        }
        return copy
      })
      if (idx < steps.length) {
        setTimeout(tick, 700)
      } else {
        setTimeout(() => {
          setHistory((h) => {
            const copy = [...h]
            copy[copy.length - 1] = {
              who: 'brain',
              msg: final,
              loading: false,
            }
            return copy
          })
        }, 500)
      }
    }
    setTimeout(tick, 450)
    setInput('')
  }

  const getStepProgress = (msg: typeof history[number]) => {
    if (!msg.loading || !msg.steps) return 0
    // We approximate via time-based, using index of msg
    return Math.min(
      msg.steps.length,
      Math.max(1, Math.floor((Date.now() % (msg.steps.length * 700)) / 700) + 1),
    )
  }

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid-fine opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-neon-magenta/10 blur-[160px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6 border border-electric-cyan/30">
            <TerminalSquare size={14} className="text-electric-cyan" />
            <span className="text-[10px] tracking-[0.2em] text-electric-cyan uppercase font-bold">
              Demo interactiva
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
            <span className="text-white/90">PÍDALE AL </span>
            <span className="text-gradient">CEREBRO</span>
            <br />
            <span className="text-white/90">ALGO.</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Interfaz demostrativa del concepto. Simulación visual — no ejecuta acciones reales
            ni está conectada a datos de su negocio.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-[28px] border border-electric-purple/30 overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.15)]">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 font-mono text-xs text-white/50 tracking-wider">
                  cerebro-digital-io · demo
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-widest">
                <BrainCircuit size={12} className="text-neon-magenta" />
                CEREBRO · ONLINE
              </div>
            </div>

            {/* Chat area */}
            <div
              ref={scrollRef}
              className="px-4 md:px-6 py-6 h-[420px] md:h-[480px] overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-deep-space/40"
            >
              {history.map((m, i) => (
                <MessageBubble key={i} msg={m} stepProgress={getStepProgress(m)} />
              ))}
            </div>

            {/* Suggestions */}
            <div className="px-4 md:px-6 py-3 border-t border-white/10">
              <div className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-bold mb-2 flex items-center gap-2">
                <Sparkles size={11} className="text-electric-cyan" />
                Ejemplos rápidos
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => runDemo(s)}
                    className="px-3.5 py-2 rounded-full text-xs md:text-sm glass-light border border-white/10 text-white/75 hover:text-white hover:border-electric-cyan/50 hover:bg-electric-cyan/10 transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      {s}
                      <ArrowRight
                        size={12}
                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 md:p-5 border-t border-white/10 bg-deep-space/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  runDemo(input)
                }}
                className="flex items-center gap-3 rounded-2xl glass-light border border-white/10 focus-within:border-electric-cyan/50 transition-all px-3 py-2.5"
              >
                <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-brand flex items-center justify-center">
                  <BrainCircuit size={16} className="text-white" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escriba una tarea para su Cerebro Digital…"
                  className="flex-1 bg-transparent outline-none text-sm md:text-base text-white placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="w-10 h-10 shrink-0 rounded-xl bg-gradient-brand flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-glow-violet"
                >
                  <Send size={16} className="text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MessageBubble({
  msg,
  stepProgress,
}: {
  msg: { who: 'user' | 'brain'; msg: string; loading?: boolean; steps?: string[] }
  stepProgress: number
}) {
  const isUser = msg.who === 'user'
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-brand flex items-center justify-center halo-violet">
          <BrainCircuit size={16} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'rounded-br-sm bg-gradient-brand text-white text-sm md:text-base shadow-glow-violet'
            : 'rounded-bl-sm glass-light border border-white/10 text-white/85 text-sm md:text-base'
        }`}
      >
        {msg.loading && msg.steps ? (
          <LoadingSteps steps={msg.steps} progress={stepProgress} />
        ) : (
          <p className="leading-relaxed whitespace-pre-wrap">{msg.msg}</p>
        )}
      </div>
      {isUser && (
        <div className="w-9 h-9 shrink-0 rounded-xl glass-light border border-white/10 flex items-center justify-center">
          <span className="text-[11px] font-bold text-white/70">YO</span>
        </div>
      )}
    </div>
  )
}

function LoadingSteps({ steps, progress }: { steps: string[]; progress: number }) {
  const [n, setN] = useState(1)
  useEffect(() => {
    let i = 1
    setN(1)
    const itv = setInterval(() => {
      i++
      setN(i)
      if (i >= steps.length) clearInterval(itv)
    }, 650)
    return () => clearInterval(itv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.join('|')])
  void progress
  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => {
        const done = i < n - 1
        const active = i === n - 1
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              {done ? (
                <CheckCircle2 size={14} className="text-electric-cyan" />
              ) : active ? (
                <Loader2 size={14} className="text-neon-magenta animate-spin" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/25" />
              )}
            </div>
            <span
              className={`font-mono text-xs md:text-sm tracking-wide leading-tight ${
                done || active ? 'text-white/85' : 'text-white/30'
              }`}
            >
              {s}
            </span>
          </div>
        )
      })}
    </div>
  )
}
