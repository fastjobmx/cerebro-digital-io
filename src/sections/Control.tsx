import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, KeyRound, ScrollText, Users, Check, Loader2 } from 'lucide-react'
import { SplitText, Reveal, REDUCED } from '../components/fx'
import { SITE } from '../config/site'

const POINTS = [
  { icon: KeyRound, t: 'Permisos definidos por usted' },
  { icon: ShieldCheck, t: 'Aprobación para acciones sensibles' },
  { icon: ScrollText, t: 'Trazabilidad de lo que se propone y ejecuta' },
  { icon: Users, t: 'Pensado para potenciar a su equipo, no para reemplazarlo' },
]

const SCRIPT = [
  { who: 'user', text: 'Prepara el resumen semanal de solicitudes y propón la respuesta para los clientes pendientes.' },
  { who: 'bot', text: 'Listo. Analicé 47 solicitudes: 12 requieren respuesta. Preparé 3 propuestas con su tono de marca.' },
] as const

/** Consola demostrativa: el Cerebro propone, el humano aprueba. */
function Console() {
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (REDUCED) {
      setStep(3)
      return
    }
    const timers: number[] = []
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        timers.push(window.setTimeout(() => setStep(1), 300))
        timers.push(window.setTimeout(() => setStep(2), 1500))
        timers.push(window.setTimeout(() => setStep(3), 3300))
      },
    })
    return () => {
      st.kill()
      timers.forEach(clearTimeout)
    }
  }, [])

  const approve = () => {
    if (state !== 'idle') return
    setState('sending')
    window.setTimeout(() => setState('done'), 1400)
  }

  return (
    <div ref={ref} className="panel ring-grad overflow-hidden !rounded-[28px]">
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
        <img src={SITE.logo.markSquare} alt="" width={36} height={36} loading="lazy" className="h-9 w-9 rounded-full bg-ink-3 object-cover ring-1 ring-white/15" />
        <div className="leading-tight">
          <p className="text-sm font-semibold">Su Cerebro Digital</p>
          <p className="flex items-center gap-1.5 text-[11px] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Contexto: Ventas · Correo · CRM
          </p>
        </div>
        <div className="ml-auto flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="flex min-h-[380px] flex-col gap-4 p-5 sm:p-6">
        <AnimatePresence>
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-r from-magenta/90 via-violet to-electric px-4 py-3 text-[14px] leading-relaxed">
              {SCRIPT[0].text}
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-fit gap-1.5 rounded-2xl bg-white/[0.06] px-4 py-3.5">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-violet" style={{ animationDelay: `${d * 0.18}s` }} />
              ))}
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div key="bot" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-[88%] rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-[14px] leading-relaxed text-white/90">
              {SCRIPT[1].text}
              <span className="mt-1 block text-[11px] text-white/40">Ejemplo demostrativo.</span>
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div key="approval" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.7 }} className="mt-auto rounded-2xl border border-magenta/30 bg-magenta/[0.06] p-4">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-magenta">
                {state === 'done' ? '› Aprobado y enviado' : '› Esperando su aprobación'}
              </p>
              <p className="mt-2 text-[13px] text-white/60">Las acciones sensibles nunca se ejecutan sin autorización humana.</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={approve}
                  className={`btn !h-10 !px-5 !text-[13px] ${state === 'done' ? 'bg-emerald-500/90 text-white' : 'btn-primary'}`}
                >
                  {state === 'idle' && 'Aprobar envío'}
                  {state === 'sending' && (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Ejecutando…
                    </>
                  )}
                  {state === 'done' && (
                    <>
                      <Check size={15} /> 12 respuestas enviadas
                    </>
                  )}
                </button>
                {state === 'idle' && (
                  <button type="button" className="btn btn-ghost !h-10 !px-5 !text-[13px]">
                    Revisar
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Control() {
  return (
    <section data-scene="7" className="section">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">Control humano</p>
          <SplitText
            className="h-section mt-6"
            lines={[{ text: 'Usted decide.', className: 'text-chrome' }, { text: 'El Cerebro ejecuta.', className: 'text-grad' }]}
          />
          <Reveal>
            <p data-r className="lead mt-7 max-w-[520px]">
              El Cerebro propone y prepara. Publicaciones, presupuestos, cambios críticos y envíos importantes esperan siempre su aprobación.
            </p>
            <ul className="mt-10 grid gap-3">
              {POINTS.map(({ icon: I, t }) => (
                <li data-r key={t} className="glass flex items-center gap-4 rounded-2xl px-5 py-4">
                  <I size={19} strokeWidth={1.6} className="shrink-0 text-cyan" />
                  <span className="text-[15px] text-white/85">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal>
          <div data-r>
            <Console />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
