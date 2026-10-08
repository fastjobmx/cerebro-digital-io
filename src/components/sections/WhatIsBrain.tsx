import { useState } from 'react'
import {
  BrainCircuit,
  Database,
  Lightbulb,
  MousePointerClick,
  MonitorSmartphone,
  ShieldCheck,
  Zap,
} from 'lucide-react'

const NODES = [
  {
    key: 'memoria',
    title: 'MEMORIA',
    description:
      'Almacena y organiza información estructurada de su negocio, productos, clientes y procesos.',
    icon: Database,
    color: '#00E5FF',
    pos: { x: 15, y: 20 },
  },
  {
    key: 'contexto',
    title: 'CONTEXTO',
    description:
      'Entiende la situación actual, el historial relevante y el marco en el que opera cada decisión.',
    icon: BrainCircuit,
    color: '#7B2CFF',
    pos: { x: 85, y: 22 },
  },
  {
    key: 'inteligencia',
    title: 'INTELIGENCIA',
    description:
      'Analiza, interpreta, relaciona y propone caminos basados en la información y el contexto disponible.',
    icon: Lightbulb,
    color: '#E600FF',
    pos: { x: 50, y: 8 },
    central: true,
  },
  {
    key: 'acciones',
    title: 'ACCIONES',
    description:
      'Traduce decisiones en pasos concretos: comunicaciones, actualizaciones, tareas y operaciones.',
    icon: MousePointerClick,
    color: '#A855F7',
    pos: { x: 12, y: 72 },
  },
  {
    key: 'interfaz',
    title: 'INTERFAZ',
    description:
      'Conecta con usted por chat, voz, panel web o móvil: un punto de acceso natural a su sistema.',
    icon: MonitorSmartphone,
    color: '#00E5FF',
    pos: { x: 88, y: 74 },
  },
  {
    key: 'supervision',
    title: 'SUPERVISIÓN',
    description:
      'Mantiene reglas, límites y aprobaciones. Usted decide. El Cerebro ejecuta dentro de esos marcos.',
    icon: ShieldCheck,
    color: '#E600FF',
    pos: { x: 50, y: 90 },
  },
]

export function WhatIsBrain() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-3 to-deep-space" />
      <div className="absolute inset-0 bg-grid-fine opacity-50" />

      <div className="container-x relative z-10">
        {/* Headline block */}
        <div className="text-center max-w-5xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6">
            <Zap size={14} className="text-electric-cyan" />
            <span className="text-[10px] tracking-[0.2em] text-electric-cyan uppercase font-semibold">
              ¿Qué es?
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-6">
            <span className="block text-white/80">NO LE DAMOS OTRA HERRAMIENTA.</span>
            <span className="block text-gradient mt-3">LE CONSTRUIMOS UN CEREBRO.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
            Un <span className="text-white font-semibold">Cerebro Digital</span> es una capa inteligente
            configurada alrededor de su empresa. Conoce su información. Entiende sus procesos.
            Recibe contexto. Se conecta con sus herramientas. Analiza datos. Propone acciones.
            <span className="text-gradient font-semibold">
              {' '}Y puede ejecutar procesos autorizados.
            </span>
          </p>
        </div>

        {/* Brain node visualization */}
        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] max-w-7xl mx-auto glass-strong rounded-[32px] p-6 md:p-10 border border-electric-purple/20 overflow-hidden">
          {/* Decorative halos */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-ultra-violet/20 blur-[100px] pointer-events-none" />

          {/* Connection lines SVG - node to central node */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 560" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#E600FF" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="lineGrad2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E600FF" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#7B2CFF" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {NODES.map((n) => {
              if (n.central) return null
              const central = NODES.find((x) => x.central)!
              const x1 = (n.pos.x / 100) * 1000
              const y1 = (n.pos.y / 100) * 560
              const x2 = (central.pos.x / 100) * 1000
              const y2 = (central.pos.y / 100) * 560
              const mx = (x1 + x2) / 2
              const my = (y1 + y2) / 2 + (y2 < y1 ? -30 : 30)
              return (
                <g key={`line-${n.key}`}>
                  <path
                    d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                    stroke="url(#lineGrad1)"
                    strokeWidth={active === n.key ? 2 : 1}
                    fill="none"
                    opacity={active === n.key ? 0.9 : 0.35}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  {/* Animated pulse dot */}
                  <circle r="4" fill={n.color} opacity={active === n.key ? 1 : 0.8}>
                    <animateMotion
                      dur={`${3 + Math.random() * 2}s`}
                      repeatCount="indefinite"
                      path={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                    />
                  </circle>
                </g>
              )
            })}
          </svg>

          {/* Nodes */}
          {NODES.map((n) => {
            const Icon = n.icon
            const isActive = active === n.key || (n.central && active !== null)
            return (
              <button
                key={n.key}
                onMouseEnter={() => setActive(n.key)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(active === n.key ? null : n.key)}
                className={`absolute group transition-all duration-500 ease-out ${
                  n.central ? 'z-20' : 'z-10'
                }`}
                style={{
                  left: `${n.pos.x}%`,
                  top: `${n.pos.y}%`,
                  transform: `translate(-50%, -50%) ${isActive && !n.central ? 'scale(1.12)' : 'scale(1)'}`,
                }}
              >
                <div
                  className={`relative ${
                    n.central ? 'w-36 h-36 md:w-44 md:h-44' : 'w-24 h-24 md:w-28 md:h-28'
                  } rounded-full flex items-center justify-center`}
                  style={{
                    background: n.central
                      ? 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(230,0,255,0.25) 40%, rgba(123,44,255,0.05) 70%, transparent 100%)'
                      : `radial-gradient(circle, ${n.color}55 0%, ${n.color}11 60%, transparent 100%)`,
                    boxShadow: n.central
                      ? `0 0 80px ${n.color}66, inset 0 0 40px ${n.color}33`
                      : isActive
                        ? `0 0 50px ${n.color}88, inset 0 0 20px ${n.color}44`
                        : `0 0 20px ${n.color}44`,
                    border: `1px solid ${n.color}${isActive ? '99' : '66'}`,
                    transition: 'all 0.4s ease',
                  }}
                >
                  <div
                    className={`${
                      n.central ? 'w-24 h-24 md:w-32 md:h-32' : 'w-14 h-14 md:w-16 md:h-16'
                    } rounded-full flex items-center justify-center`}
                    style={{
                      background: n.central
                        ? 'linear-gradient(135deg, #7B2CFF 0%, #E600FF 50%, #00E5FF 100%)'
                        : `linear-gradient(135deg, ${n.color}, ${n.color}99)`,
                      boxShadow: n.central
                        ? `0 0 40px #fff inset, 0 0 40px #fff`
                        : isActive
                          ? `0 0 25px ${n.color}`
                          : 'none',
                    }}
                  >
                    <Icon
                      size={n.central ? 48 : 26}
                      className="text-white drop-shadow-lg"
                      strokeWidth={n.central ? 1.5 : 2}
                    />
                  </div>
                </div>
                <div
                  className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] md:text-xs font-bold tracking-wider ${
                    isActive ? 'opacity-100' : 'opacity-80'
                  }`}
                  style={{
                    color: n.color,
                    textShadow: `0 0 10px ${n.color}aa`,
                  }}
                >
                  {n.title}
                </div>
              </button>
            )
          })}

          {/* Active info panel */}
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] md:w-auto md:min-w-[480px] max-w-[680px] transition-all duration-500 ${
              active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="glass-strong rounded-2xl p-5 md:p-6 border border-electric-purple/30">
              {active && (() => {
                const n = NODES.find((x) => x.key === active) || NODES.find((x) => x.central)!
                const Icon = n.icon
                return (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${n.color}, ${n.color}55)`,
                        boxShadow: `0 0 20px ${n.color}66`,
                      }}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs tracking-widest font-bold mb-1" style={{ color: n.color }}>
                        {n.title}
                      </div>
                      <p className="text-sm md:text-base text-white/80 leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Concept flow below */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-2">
            {[
              { t: 'DATOS', c: '#00E5FF' },
              { t: 'CONTEXTO', c: '#7B2CFF' },
              { t: 'INTELIGENCIA', c: '#E600FF' },
              { t: 'DECISIÓN', c: '#A855F7' },
              { t: 'AUTOMATIZACIÓN', c: '#E600FF' },
              { t: 'RESULTADO', c: '#00E5FF' },
            ].map((step, i, arr) => (
              <div key={step.t} className="relative flex items-center justify-center col-span-1">
                <div
                  className="relative w-full glass-light rounded-xl py-4 px-3 text-center group hover:scale-105 transition-all duration-300"
                  style={{ borderColor: `${step.c}55` }}
                >
                  <div className="text-[10px] font-mono text-white/40 mb-1">0{i + 1}</div>
                  <div
                    className="text-xs md:text-sm font-bold tracking-wider"
                    style={{ color: step.c, textShadow: `0 0 8px ${step.c}88` }}
                  >
                    {step.t}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-2 h-2 rotate-45 border-t-2 border-r-2 border-electric-purple/70" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
