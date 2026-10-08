import { useState } from 'react'
import {
  Megaphone,
  PenTool,
  Cpu,
  Globe,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'

const AREAS = [
  {
    n: '01',
    title: 'MARKETING',
    desc: 'Analice campañas, organice estrategias, interprete resultados y prepare acciones.',
    icon: Megaphone,
    color: '#E600FF',
    bullets: [
      'Análisis de campañas activas',
      'Ideas y estructura de estrategias',
      'Interpretación de métricas',
      'Siguientes acciones sugeridas',
    ],
  },
  {
    n: '02',
    title: 'CONTENIDO',
    desc: 'Genere textos, ideas, piezas, contenidos y materiales alineados con su negocio.',
    icon: PenTool,
    color: '#00E5FF',
    bullets: [
      'Copies alineados a su marca',
      'Ideas y guiones para piezas',
      'Calendarios y variantes A/B',
      'Resúmenes y transcripciones',
    ],
  },
  {
    n: '03',
    title: 'AUTOMATIZACIÓN',
    desc: 'Conecte procesos y reduzca tareas repetitivas mediante flujos inteligentes.',
    icon: Cpu,
    color: '#7B2CFF',
    bullets: [
      'Flujos entre herramientas',
      'Acciones condicionales',
      'Seguimiento automático',
      'Alertas y recordatorios',
    ],
  },
  {
    n: '04',
    title: 'WEBSITE',
    desc: 'Construya, actualice y gestione su presencia digital.',
    icon: Globe,
    color: '#A855F7',
    bullets: [
      'Presencia digital premium',
      'Actualizaciones de contenido',
      'Estructura SEO y conversión',
      'Integración con su Cerebro',
    ],
  },
  {
    n: '05',
    title: 'SU ÁREA',
    desc: 'Seleccione el área donde más necesita inteligencia y la configuramos alrededor de su operación.',
    icon: Sparkles,
    color: '#E600FF',
    bullets: [
      'Administración / Ventas',
      'Documentos / Bases de datos',
      'Operaciones / Diseño',
      'Contabilidad / Atención al cliente',
    ],
    isCustom: true,
  },
]

export function FiveAreas() {
  const [active, setActive] = useState(0)
  const current = AREAS[active]
  const Icon = current.icon

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />
      <div className="absolute inset-0 bg-grid-fine opacity-40" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-neon-magenta/15 blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <span className="text-[10px] tracking-[0.2em] text-electric-cyan uppercase font-semibold">
              CAPACIDADES
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            <span className="text-white/90">UN CEREBRO. </span>
            <span className="text-gradient">CINCO ÁREAS.</span>
          </h2>
          <p className="mt-6 text-white/60 text-lg max-w-2xl mx-auto">
            Diferentes capacidades dentro de un mismo sistema inteligente,
            conectado a su negocio y su información.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Area tabs selector */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {AREAS.map((a, i) => {
              const AI = a.icon
              const isActive = active === i
              return (
                <button
                  key={a.n}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group relative text-left rounded-2xl p-5 transition-all duration-400 ${
                    isActive ? 'scale-[1.01]' : ''
                  }`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${a.color}2E, rgba(18,3,48,0.85))`
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? a.color : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isActive ? `0 0 40px ${a.color}22` : 'none',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${a.color}, ${a.color}88)`,
                        boxShadow: isActive ? `0 0 24px ${a.color}aa` : `0 0 12px ${a.color}44`,
                      }}
                    >
                      <AI size={22} className="text-white" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-0.5">
                        <span className="font-mono text-xs font-bold opacity-70" style={{ color: a.color }}>
                          {a.n}
                        </span>
                        <span className="font-display font-bold tracking-wider text-white/90">
                          {a.title}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-white/55 line-clamp-2">
                        {a.desc}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className={`shrink-0 transition-all duration-300 ${
                        isActive ? 'text-white opacity-100' : 'text-white/30 opacity-60'
                      }`}
                      style={{ color: isActive ? a.color : undefined }}
                    />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Area detail */}
          <div className="lg:col-span-8">
            <div
              key={current.n}
              className="relative h-full rounded-3xl overflow-hidden p-8 md:p-12 border border-electric-purple/20 glass-strong"
              style={{
                boxShadow: `inset 0 0 80px ${current.color}11`,
              }}
            >
              {/* Decorative halo */}
              <div
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: current.color }}
              />

              <div className="flex items-start justify-between gap-6 mb-10 relative z-10">
                <div>
                  <div
                    className="font-mono text-xs tracking-[0.3em] mb-2"
                    style={{ color: current.color }}
                  >
                    CAPACIDAD {current.n}
                  </div>
                  <h3 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
                    <span className="text-white/90">{current.title.split(' ')[0]} </span>
                    <span style={{ color: current.color }}>
                      {current.title.split(' ').slice(1).join(' ')}
                    </span>
                  </h3>
                </div>
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shrink-0 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${current.color}, ${current.color}66)`,
                    boxShadow: `0 0 40px ${current.color}88`,
                  }}
                >
                  <Icon size={36} className="text-white" strokeWidth={1.5} />
                </div>
              </div>

              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 relative z-10">
                {current.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mb-10">
                {current.bullets.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl glass-light"
                    style={{ borderColor: `${current.color}33` }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${current.color}44, ${current.color}11)`,
                        border: `1px solid ${current.color}55`,
                      }}
                    >
                      <span className="font-mono text-sm font-bold" style={{ color: current.color }}>
                        0{i + 1}
                      </span>
                    </div>
                    <span className="text-sm md:text-base text-white/80 leading-tight">{b}</span>
                  </div>
                ))}
              </div>

              {/* Process flow mini */}
              <div className="relative z-10">
                <div className="text-xs tracking-[0.3em] text-white/40 uppercase font-bold mb-4">
                  Flujo de trabajo sugerido
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { t: 'Petición', c: '#00E5FF' },
                    { t: 'Contexto', c: '#7B2CFF' },
                    { t: 'Procesamiento', c: '#E600FF' },
                    { t: current.isCustom ? 'Configuración' : 'Ejecución', c: '#A855F7' },
                    { t: 'Resultado', c: '#00E5FF' },
                  ].map((step, i, arr) => (
                    <div key={step.t} className="flex items-center gap-3">
                      <div
                        className="px-4 py-2.5 rounded-full text-xs font-bold tracking-wide glass-light"
                        style={{
                          borderColor: `${step.c}66`,
                          color: step.c,
                          boxShadow: `0 0 20px ${step.c}22`,
                        }}
                      >
                        {step.t}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-4 h-px bg-gradient-to-r from-neon-magenta/70 to-electric-cyan/70" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
