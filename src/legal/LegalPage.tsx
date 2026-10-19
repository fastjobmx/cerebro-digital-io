import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, MessageCircle } from 'lucide-react'
import { Header } from '../sections/Header'
import { Footer } from '../sections/Closing'
import { ChatWidget } from '../chat/ChatWidget'
import { CookieBanner, WhatsAppButton } from '../components/Consent'
import { LEGAL, LEGAL_LINKS, SITE, askCerebro } from '../config/site'
import type { LegalDoc } from './content'

/** Fondo estático de marca (sin WebGL) para páginas internas. */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_-10%,rgba(240,60,255,.18),transparent_55%),radial-gradient(ellipse_at_0%_40%,rgba(59,130,246,.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-grid opacity-50 mask-radial" />
      <img src={SITE.logo.mark} alt="" className="absolute -right-24 top-16 w-[min(70vw,720px)] opacity-[0.07] blur-[2px]" />
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Backdrop />
      <div aria-hidden="true" className="grain" />
      <Header home={false} />
      <main className="relative z-10">{children}</main>
      <div className="relative z-10">
        <Footer />
      </div>
      <WhatsAppButton />
      <ChatWidget />
      <CookieBanner />
    </>
  )
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const [active, setActive] = useState(doc.sections[0]?.id)

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: '-25% 0px -65% 0px',
    })
    doc.sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [doc])

  return (
    <Shell>
      <section className="container-x pb-14 pt-36 sm:pt-44">
        <a href="/" className="flex w-fit items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
          <ArrowLeft size={15} /> Volver al inicio
        </a>
        <p className="eyebrow mt-10 flex w-fit">{doc.eyebrow}</p>
        <h1 className="h-display mt-6 max-w-[920px] text-[clamp(2.3rem,5.6vw,4.8rem)] text-chrome">{doc.title}</h1>
        <p className="lead mt-6 max-w-[720px]">{doc.intro}</p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">Última actualización: {LEGAL.updated}</p>
      </section>

      <div className="container-x grid gap-10 pb-28 lg:grid-cols-12 lg:gap-16">
        {/* Índice */}
        <aside className="lg:col-span-4">
          <nav aria-label="Contenido" className="glass rounded-3xl p-5 lg:sticky lg:top-28">
            <p className="px-2 font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/40">Contenido</p>
            <ol className="mt-3 flex flex-col">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block rounded-xl px-3 py-2 text-[13.5px] transition-colors ${
                      active === s.id ? 'bg-white/[0.07] text-white' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
            <div className="hairline my-4" />
            <ul className="flex flex-col gap-1 px-1">
              {LEGAL_LINKS.filter((l) => !l.href.includes(doc.slug)).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="flex items-center justify-between rounded-xl px-2 py-2 text-[13px] text-white/55 transition-colors hover:text-white">
                    {l.label} <ArrowUpRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Texto */}
        <article className="legal-prose lg:col-span-8">
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-white/[0.07] py-8 first:pt-0 last:border-0">
              <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">{s.title}</h2>
              <div className="mt-4">{s.body}</div>
            </section>
          ))}

          <div className="panel ring-grad mt-10 flex flex-col items-start gap-5 !rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-display text-lg font-semibold">¿Tiene dudas sobre este documento?</p>
              <p className="mt-1 text-sm text-white/55">Escríbanos a {LEGAL.email} o pregúntele al asistente.</p>
            </div>
            <button type="button" onClick={() => askCerebro('¿Cómo protegen mis datos?')} className="btn btn-primary shrink-0">
              <MessageCircle size={17} /> Preguntar
            </button>
          </div>
        </article>
      </div>
    </Shell>
  )
}

export function NotFound() {
  return (
    <Shell>
      <section className="container-x flex min-h-[100svh] flex-col items-center justify-center py-32 text-center">
        <img src={SITE.logo.mark} alt="" className="w-[min(60vw,300px)] opacity-90 drop-shadow-[0_0_40px_rgba(240,60,255,.45)]" />
        <p className="mt-6 font-brand text-[clamp(4rem,14vw,9rem)] leading-none text-grad">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Esta sinapsis no conecta con ninguna página.</h1>
        <p className="lead mt-4 max-w-[480px]">Puede que el enlace haya cambiado. Vuelva al inicio o pregúntele al Cerebro qué está buscando.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Volver al inicio
          </a>
          <button type="button" onClick={() => askCerebro()} className="btn btn-ghost">
            <MessageCircle size={16} /> Hablar con el Cerebro
          </button>
        </div>
      </section>
    </Shell>
  )
}
