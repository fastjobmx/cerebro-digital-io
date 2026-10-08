import { useEffect, useState } from 'react'
import { Smartphone, Send, CheckCircle2, Loader2 } from 'lucide-react'

const SCENARIO_1 = {
  user: 'Analiza mis campañas de esta semana y dime dónde estamos perdiendo oportunidades.',
  brainSteps: [
    'Analizando campañas...',
    'Analizando datos...',
    'Comparando resultados...',
    'Identificando oportunidades...',
  ],
  final: 'Encontré 3 oportunidades de mejora listas para revisar.',
}

const SCENARIO_2 = {
  user: 'Prepara una campaña de Navidad con estos productos y déjala lista para mi aprobación.',
  brainSteps: [
    'Analizando productos',
    'Analizando clientes',
    'Analizando campañas históricas',
    'Creando estrategia',
    'Preparando contenido',
    'Preparando campaña',
  ],
  final: 'CAMPAÑA LISTA. Esperando su aprobación.',
}

export function PhoneSection() {
  const [scenario, setScenario] = useState(0)
  const scenarios = [SCENARIO_1, SCENARIO_2]
  const current = scenarios[scenario]

  // Type the user message
  const [typedUser, setTypedUser] = useState('')
  // step index for the processing steps
  const [stepIdx, setStepIdx] = useState(0)
  // show final response
  const [showFinal, setShowFinal] = useState(false)

  useEffect(() => {
    setTypedUser('')
    setStepIdx(0)
    setShowFinal(false)

    let i = 0
    const typeInterval = setInterval(() => {
      i++
      setTypedUser(current.user.slice(0, i))
      if (i >= current.user.length) {
        clearInterval(typeInterval)
        // Start processing steps
        setTimeout(() => {
          let s = 0
          const stepInterval = setInterval(() => {
            s++
            setStepIdx(s)
            if (s >= current.brainSteps.length) {
              clearInterval(stepInterval)
              setTimeout(() => setShowFinal(true), 500)
            }
          }, 900)
        }, 600)
      }
    }, 25)

    return () => clearInterval(typeInterval)
  }, [scenario])

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-3 to-deep-space" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full bg-ultra-violet/20 blur-[140px] pointer-events-none animate-pulse-slow" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <Smartphone size={14} className="text-neon-magenta" />
            <span className="text-[10px] tracking-[0.2em] text-neon-magenta uppercase font-semibold">
              Interfaz móvil
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            <span className="text-white/90">SU NEGOCIO. </span>
            <span className="text-gradient">EN SU CELULAR.</span>
          </h2>
          <p className="mt-6 text-white/60 text-lg max-w-2xl mx-auto">
            Usted habla. El Cerebro entiende, analiza, propone y — cuando tiene permiso — ejecuta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text side */}
          <div className="lg:col-span-6 space-y-8">
            {/* Scenario switcher */}
            <div className="flex flex-wrap gap-2 mb-4">
              {scenarios.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setScenario(i)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    scenario === i
                      ? 'bg-gradient-brand text-white shadow-glow-brand'
                      : 'glass-light text-white/60 hover:text-white/90'
                  }`}
                >
                  Escenario {i + 1}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              <div className="glass-strong rounded-3xl p-8 border border-electric-purple/20">
                <div className="text-xs tracking-widest text-electric-cyan uppercase font-bold mb-3">
                  Usted pide
                </div>
                <p className="text-xl md:text-2xl font-display text-white leading-snug">
                  "{current.user}"
                </p>
              </div>

              <div className="glass-strong rounded-3xl p-8 border border-neon-magenta/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-neon-magenta/20 blur-[80px]" />
                <div className="text-xs tracking-widest text-neon-magenta uppercase font-bold mb-3">
                  El cerebro ejecuta
                </div>
                <div className="space-y-3 relative z-10">
                  {current.brainSteps.map((s, i) => (
                    <div
                      key={s}
                      className={`flex items-center gap-3 transition-all duration-500 ${
                        i < stepIdx
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-20 translate-x-4'
                      }`}
                    >
                      <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                        {i < stepIdx ? (
                          <CheckCircle2 size={18} className="text-electric-cyan" />
                        ) : i === stepIdx ? (
                          <Loader2 size={18} className="text-neon-magenta animate-spin" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        )}
                      </div>
                      <span className={`text-sm font-mono tracking-wide ${
                        i < stepIdx ? 'text-white/85' : 'text-white/40'
                      }`}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
                {showFinal && (
                  <div
                    className="mt-6 p-4 rounded-2xl border border-electric-cyan/50 bg-electric-cyan/10 flex items-start gap-3"
                    style={{
                      animation: 'finalPopIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                      opacity: 0,
                    }}
                  >
                    <CheckCircle2 size={22} className="text-electric-cyan shrink-0 mt-0.5" />
                    <p className="font-display text-lg text-white leading-snug">
                      {current.final}
                    </p>
                  </div>
                )}
              </div>

              {/* Concept */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-light rounded-2xl p-5 text-center">
                  <div className="text-xs tracking-widest text-electric-cyan font-bold uppercase mb-2">
                    El Cerebro
                  </div>
                  <div className="font-display text-2xl font-bold text-white">PROPONE</div>
                </div>
                <div className="glass-light rounded-2xl p-5 text-center border border-neon-magenta/30">
                  <div className="text-xs tracking-widest text-neon-magenta font-bold uppercase mb-2">
                    Usted
                  </div>
                  <div className="font-display text-2xl font-bold text-white">DECIDE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone visual */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative" style={{ animation: 'float 7s ease-in-out infinite' }}>
              {/* Glow behind phone */}
              <div className="absolute -inset-8 rounded-[60px] bg-gradient-brand opacity-20 blur-3xl" />
              <div className="absolute -inset-4 rounded-[60px] bg-gradient-to-t from-ultra-violet/20 to-neon-magenta/20 blur-2xl" />

              {/* Phone frame */}
              <div className="relative w-[320px] h-[640px] md:w-[360px] md:h-[720px] rounded-[54px] p-[3px] bg-gradient-to-br from-white/20 via-electric-purple/40 to-electric-cyan/30 shadow-[0_30px_80px_-10px_rgba(123,44,255,0.5)]">
                <div className="relative w-full h-full rounded-[52px] bg-[#0a0320] overflow-hidden border border-white/10">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full bg-black z-30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan/80" />
                  </div>

                  {/* Chat UI */}
                  <div className="w-full h-full flex flex-col pt-10 pb-6 px-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 py-3 px-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center halo-magenta shrink-0">
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-deep-space/40">
                          <Smartphone size={16} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-sm text-white">Cerebro Digital</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-electric-cyan">
                          <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
                          En línea · Procesando
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-electric-purple/40 to-transparent mb-3" />

                    {/* Messages area */}
                    <div className="flex-1 overflow-hidden space-y-3 pr-1">
                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-sm px-4 py-3 bg-gradient-brand text-white text-[13px] leading-relaxed shadow-glow-violet">
                          {typedUser}
                          {typedUser.length < current.user.length && (
                            <span className="inline-block w-1 h-4 align-middle ml-1 bg-white/80 animate-pulse" />
                          )}
                        </div>
                      </div>

                      {/* Brain steps */}
                      {stepIdx > 0 && typedUser.length >= current.user.length && (
                        <div className="flex justify-start">
                          <div className="max-w-[90%] space-y-2">
                            {current.brainSteps.slice(0, stepIdx).map((s, i) => (
                              <div
                                key={s + i}
                                className="rounded-2xl rounded-bl-sm px-4 py-2.5 glass-strong border border-electric-purple/25 text-[12px] text-white/85 font-mono flex items-center gap-2"
                                style={{
                                  animation: 'msgIn 0.4s ease-out forwards',
                                  opacity: 0,
                                  animationDelay: `${i * 0.03}s`,
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta animate-pulse shrink-0" />
                                <span className="tracking-wide">{s}</span>
                              </div>
                            ))}
                            {stepIdx < current.brainSteps.length && (
                              <div className="rounded-2xl rounded-bl-sm px-4 py-2.5 glass-light text-[12px] text-white/50 font-mono inline-flex items-center gap-2">
                                <Loader2 size={12} className="animate-spin text-electric-cyan" />
                                trabajando…
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Final */}
                      {showFinal && (
                        <div
                          className="flex justify-start"
                          style={{
                            animation: 'msgIn 0.5s ease-out forwards',
                            opacity: 0,
                          }}
                        >
                          <div className="max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-3 border border-electric-cyan/50 bg-electric-cyan/10 text-[13px] text-white/95 leading-relaxed">
                            <div className="text-[10px] font-bold tracking-widest text-electric-cyan mb-1">
                              RESULTADO
                            </div>
                            {current.final}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input bar */}
                    <div className="mt-3 flex items-center gap-2 p-2 rounded-full glass-strong border border-electric-purple/25">
                      <div className="flex-1 px-4 py-2 text-[12px] text-white/40 font-mono">
                        Escriba una orden…
                      </div>
                      <button className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center">
                        <Send size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side buttons */}
              <div className="absolute left-[-3px] top-32 w-[3px] h-16 rounded-l bg-white/20" />
              <div className="absolute left-[-3px] top-52 w-[3px] h-10 rounded-l bg-white/15" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes msgIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes finalPopIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  )
}
