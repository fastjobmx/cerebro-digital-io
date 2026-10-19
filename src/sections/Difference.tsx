import { X, ArrowUpRight } from 'lucide-react'
import { COMPARE, CASES, INDUSTRIES, askCerebro } from '../config/site'
import { SplitText, Reveal, TiltCard } from '../components/fx'

export function Difference() {
  return (
    <section data-scene="4" className="section">
      <div className="container-x">
        <div className="text-center">
          <p className="eyebrow justify-center">La diferencia</p>
          <SplitText
            className="h-section mx-auto mt-6 max-w-[980px]"
            lines={[{ text: 'No es otra agencia.', className: 'text-chrome' }, { text: 'No es solo un chatbot.', className: 'text-grad' }]}
          />
        </div>

        <Reveal className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {COMPARE.map((c) => (
            <div data-r key={c.k} className="panel p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold tracking-tight text-white/80">{c.k}</h3>
                <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
                  <X size={14} className="text-white/40" />
                </span>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-white/50">{c.d}</p>
            </div>
          ))}
        </Reveal>

        <Reveal>
          <div data-r className="ring-grad relative mt-3 overflow-hidden rounded-[28px] bg-[linear-gradient(110deg,rgba(240,60,255,.16),rgba(139,92,246,.12)_40%,rgba(59,130,246,.14)_70%,rgba(61,217,255,.14))] p-8 sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 mask-radial" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <p className="max-w-[760px] font-display text-[clamp(1.4rem,2.8vw,2.3rem)] font-semibold leading-[1.2] tracking-[-0.02em]">
                El Cerebro Digital une <span className="text-grad">contexto, herramientas y ejecución autorizada</span> en una sola capa inteligente.
              </p>
              <span className="font-brand shrink-0 text-xs tracking-[0.3em] text-white/70">CEREBRO · DIGITAL · IO</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Cases() {
  return (
    <section id="casos" data-scene="4" className="section">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Ejemplos</p>
            <SplitText
              className="h-section mt-6"
              lines={[{ text: 'Lo que su Cerebro', className: 'text-chrome' }, { text: 'podría hacer.', className: 'text-grad' }]}
            />
          </div>
          <Reveal>
            <p data-r className="lead max-w-[380px]">Ejemplos demostrativos. Haga clic en cualquiera para explorarlo con el asistente.</p>
          </Reveal>
        </div>

        <Reveal className="mt-14 grid gap-4 sm:grid-cols-2" stagger={0.1}>
          {CASES.map((c, i) => (
            <div data-r key={c.tag}>
              <TiltCard
                as="button"
                type="button"
                onClick={() => askCerebro(c.ask)}
                aria-label={`Explorar caso: ${c.text}`}
                className="panel group flex min-h-[230px] w-full flex-col overflow-hidden p-7 text-left transition-colors duration-500 hover:border-white/25 sm:min-h-[260px] sm:p-9"
              >
                <span className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet/0 blur-[70px] transition-colors duration-700 group-hover:bg-violet/30" />
                <div className="relative flex items-center justify-between" style={{ transform: 'translateZ(24px)' }}>
                  <span className="chip !text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
                    {c.tag}
                  </span>
                  <span className="font-mono text-[11px] text-white/30">0{i + 1}</span>
                </div>
                <p className="relative mt-auto pt-10 font-display text-[1.45rem] font-semibold leading-snug tracking-tight sm:text-[1.7rem]" style={{ transform: 'translateZ(36px)' }}>
                  {c.text}
                </p>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm text-cyan" style={{ transform: 'translateZ(20px)' }}>
                  Explorar con el asistente
                  <ArrowUpRight size={16} className="transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </TiltCard>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-14">
          <p data-r className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Industrias que ya pueden tener un cerebro</p>
          <div data-r className="mt-6 flex flex-wrap justify-center gap-2.5">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => askCerebro(`¿Cómo ayudaría el Cerebro a una empresa de ${ind.toLowerCase()}?`)}
                className="chip glass transition-all duration-500 ease-expo hover:-translate-y-0.5 hover:border-cyan/40 hover:text-white"
              >
                {ind}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
