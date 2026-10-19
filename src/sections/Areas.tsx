import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Megaphone, PenLine, Workflow, Globe2, Sparkles } from 'lucide-react'
import { AREAS, askCerebro } from '../config/site'
import { SplitText, Reveal, TiltCard } from '../components/fx'

const ICONS = [Megaphone, PenLine, Workflow, Globe2, Sparkles]

export function Areas() {
  const [sel, setSel] = useState(0)
  const a = AREAS[sel]
  const Icon = ICONS[sel]

  return (
    <section id="areas" data-scene="6" className="section">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Cinco áreas</p>
            <SplitText
              className="h-section mt-6 max-w-[760px]"
              lines={[{ text: 'Un cerebro con', className: 'text-chrome' }, { text: 'áreas especializadas.', className: 'text-grad' }]}
            />
          </div>
          <Reveal>
            <p data-r className="lead max-w-[380px]">Cada área trabaja con el contexto de su empresa y bajo las reglas que usted define.</p>
          </Reveal>
        </div>

        <Reveal className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12" stagger={0.1}>
          {/* Selector */}
          <div data-r role="tablist" aria-label="Áreas del Cerebro" className="flex gap-2 overflow-x-auto pb-2 lg:col-span-5 lg:flex-col lg:overflow-visible lg:pb-0 [scrollbar-width:none]">
            {AREAS.map((ar, j) => {
              const on = j === sel
              const I = ICONS[j]
              return (
                <button
                  key={ar.id}
                  role="tab"
                  aria-selected={on}
                  aria-controls="area-panel"
                  onClick={() => setSel(j)}
                  onMouseEnter={() => setSel(j)}
                  className={`group relative flex shrink-0 items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-500 ease-expo lg:py-5 ${
                    on ? 'border-white/20 bg-white/[0.07]' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15'
                  }`}
                >
                  {on && <motion.span layoutId="area-glow" className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-magenta via-violet to-cyan" />}
                  <span className="font-mono text-[11px] text-white/40">{ar.n}</span>
                  <I size={18} strokeWidth={1.6} className={on ? 'text-magenta' : 'text-white/40'} />
                  <span className={`font-display text-base font-semibold tracking-tight lg:text-lg ${on ? 'text-white' : 'text-white/60'}`}>{ar.title}</span>
                  <ArrowUpRight size={16} className={`ml-auto hidden transition-all duration-500 lg:block ${on ? 'text-white opacity-100' : 'opacity-0'}`} />
                </button>
              )
            })}
          </div>

          {/* Detalle */}
          <div data-r className="lg:col-span-7">
            <TiltCard max={6} className="panel ring-grad h-full overflow-hidden !rounded-[28px] p-7 sm:p-10" id="area-panel" role="tabpanel">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-magenta/20 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-electric/20 blur-[90px]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex h-full flex-col"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand shadow-glow-m">
                      <Icon size={24} className="text-white" strokeWidth={1.7} />
                    </span>
                    <span className="font-brand text-5xl text-white/[0.07] sm:text-7xl">{a.n}</span>
                  </div>
                  <h3 className="mt-8 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{a.title}</h3>
                  <p className="mt-3 max-w-[460px] text-base leading-relaxed text-white/70 sm:text-lg">{a.short}</p>
                  <ul className="mt-8 grid gap-3">
                    {a.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-[15px] text-white/85">
                        <span className="grid h-6 w-6 place-items-center rounded-full border border-cyan/40 bg-cyan/10">
                          <Check size={13} className="text-cyan" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
                    <button type="button" onClick={() => askCerebro(a.ask)} className="btn btn-primary">
                      Preguntar al Cerebro
                    </button>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Área seleccionada: {a.title}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </TiltCard>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
