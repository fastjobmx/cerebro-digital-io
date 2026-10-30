import { ArrowRight, ArrowUpRight, Check, MessageCircle } from 'lucide-react'
import { Shell } from '../legal/LegalPage'
import { STEPS, askCerebro } from '../config/site'
import { SERVICE_BY_SLUG, servicePath } from './content'
import type { ServiceDoc } from './content'

export function ServicePage({ doc }: { doc: ServiceDoc }) {
  return (
    <Shell>
      <section className="container-x pb-16 pt-36 sm:pt-44">
        <nav aria-label="Miga de pan" className="text-sm text-white/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="transition-colors hover:text-white">
                Inicio
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white/80">
              {doc.label}
            </li>
          </ol>
        </nav>
        <p className="eyebrow mt-10 flex w-fit">{doc.eyebrow}</p>
        <h1 className="h-display mt-6 max-w-[980px] text-[clamp(2.3rem,5.6vw,4.8rem)] text-chrome">{doc.title}</h1>
        <p className="lead mt-6 max-w-[720px]">{doc.intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="/#contacto" className="btn btn-primary">
            Solicitar una demostración <ArrowRight size={16} />
          </a>
          <button type="button" onClick={() => askCerebro(doc.ask)} className="btn btn-ghost">
            <MessageCircle size={17} /> Preguntar al Cerebro
          </button>
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="panel max-w-[880px] p-7 sm:p-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{doc.defineTitle}</h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">{doc.define}</p>
        </div>
      </section>

      <section className="container-x pb-16">
        <h2 className="h-section !text-[clamp(1.8rem,3.6vw,3rem)] text-chrome">{doc.includesTitle}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {doc.includes.map((i) => (
            <li key={i.k} className="panel p-7">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan/40 bg-cyan/10">
                <Check size={15} className="text-cyan" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{i.k}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">{i.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pb-16">
        <h2 className="h-section !text-[clamp(1.8rem,3.6vw,3rem)] text-chrome">{doc.examplesTitle}</h2>
        <ul className="mt-8 grid max-w-[880px] gap-3">
          {doc.examples.map((e) => (
            <li key={e} className="glass rounded-2xl px-5 py-4 text-[15px] leading-relaxed text-white/80">
              {e}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pb-16">
        <h2 className="h-section !text-[clamp(1.8rem,3.6vw,3rem)] text-chrome">Cómo lo implementamos</h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="panel p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-brand text-xl text-grad">{s.n}</span>
                <h3 className="font-display text-lg font-semibold tracking-tight">{s.k}</h3>
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x pb-16">
        <h2 className="h-section !text-[clamp(1.8rem,3.6vw,3rem)] text-chrome">Preguntas frecuentes</h2>
        <div className="mt-8 grid max-w-[880px] gap-3">
          {doc.faqs.map((f) => (
            <div key={f.q} className="panel p-6">
              <h3 className="font-display text-lg font-semibold tracking-tight">{f.q}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-28">
        <div className="panel ring-grad flex flex-col items-start gap-6 !rounded-3xl p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Conozca cómo funcionaría en su empresa</h2>
            <p className="mt-2 text-[15px] text-white/65">En el diagnóstico definimos alcance, plazos e inversión en una propuesta clara.</p>
          </div>
          <a href="/#contacto" className="btn btn-primary shrink-0">
            Solicitar una demostración <ArrowRight size={16} />
          </a>
        </div>
        <nav aria-label="Otros servicios" className="mt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">También puede interesarle</p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {doc.related.map((slug) => {
              const r = SERVICE_BY_SLUG[slug]
              return (
                <li key={slug}>
                  <a href={servicePath(r)} className="chip glass transition-colors hover:border-cyan/40 hover:text-white">
                    {r.label} <ArrowUpRight size={14} />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </section>
    </Shell>
  )
}
