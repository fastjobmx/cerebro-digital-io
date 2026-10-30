import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VERBS } from '../config/site'
import { REDUCED } from '../components/fx'

/** Scroll fijo: los seis verbos del Cerebro se encienden uno a uno. */
export function Verbs() {
  const root = useRef<HTMLElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(REDUCED)
    const el = root.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => {
        setI(Math.min(VERBS.length - 1, Math.floor(s.progress * VERBS.length)))
        if (bar.current) bar.current.style.transform = `scaleY(${s.progress})`
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section id="como-funciona" ref={root} data-scene="3" className="relative" style={{ height: reduced ? 'auto' : `${VERBS.length * 70 + 40}svh` }}>
      <div className={`${reduced ? '' : 'sticky top-0 h-[100svh]'} flex items-center overflow-hidden pt-16 md:pt-0`}>
        <div className="container-x grid items-center gap-10 md:grid-cols-12">
          <div className="hidden md:col-span-5 md:block" />
          <div className="md:col-span-7">
            <h2 className="eyebrow">Cómo piensa el Cerebro Digital</h2>
            <div className="mt-6 flex gap-6 sm:mt-8 sm:gap-10">
              {/* Barra de progreso */}
              <div className="relative w-px shrink-0 bg-white/10">
                <div ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-magenta via-violet to-cyan" />
              </div>
              <ol className="flex flex-col">
                {VERBS.map((v, j) => {
                  const on = j === i
                  const past = j < i
                  return (
                    <li key={v.k} className="py-0.5">
                      <div
                        className={`flex items-baseline gap-4 font-display text-[clamp(1.85rem,5.4vw,4.4rem)] font-semibold leading-[1.08] tracking-[-0.04em] transition-all duration-700 ease-expo ${
                          on ? 'translate-x-2 text-white' : past ? 'text-white/25' : 'text-white/[0.12]'
                        }`}
                      >
                        <span className="w-8 font-mono text-[11px] font-normal tracking-normal text-white/60">0{j + 1}</span>
                        <span className={on ? 'text-grad' : ''}>{v.k}</span>
                      </div>
                      {/* La tarjeta inferior muestra un verbo a la vez: aquí queda el texto completo. */}
                      <span className="sr-only">: {v.d}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
            <div aria-hidden="true" className="glass mt-8 min-h-[92px] max-w-[520px] rounded-2xl p-5 sm:ml-[66px] sm:p-6">
              <p key={i} className="animate-[fadeUp_.7s_cubic-bezier(.16,1,.3,1)] text-[15px] leading-relaxed text-white/80 sm:text-base">
                <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">{VERBS[i].k}</span>
                {VERBS[i].d}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}`}</style>
    </section>
  )
}
