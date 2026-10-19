import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, MessageCircle, Mail, Check, Loader2, Phone, AlertTriangle } from 'lucide-react'
import { SITE, NAV, LEGAL_LINKS, askCerebro } from '../config/site'
import { sendLead } from '../lib/leads'
import { SplitText, Reveal, Magnetic, REDUCED } from '../components/fx'

/* ------------------------------------------------------------------ */
/* CTA final: el manifiesto se ilumina palabra por palabra al scroll   */
/* ------------------------------------------------------------------ */
export function FinalCTA() {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-w]'),
        { opacity: 0.12 },
        { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  const words = 'No vendemos herramientas. Instalamos un cerebro digital.'.split(' ')
  return (
    <section data-scene="5" className="relative flex min-h-[120svh] items-center py-32">
      <div className="container-x text-center">
        <p className="eyebrow justify-center">Manifiesto</p>
        <p ref={ref} className="h-display mx-auto mt-8 max-w-[1100px] text-[clamp(2.4rem,7vw,6.4rem)]">
          {words.map((w, i) => (
            <span key={i} data-w className={`inline-block ${i >= 3 ? 'text-grad' : 'text-chrome'}`}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        <Reveal className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <span data-r>
            <Magnetic>
              <button type="button" onClick={() => askCerebro()} className="btn btn-primary">
                <MessageCircle size={18} /> Hablar con el Cerebro
              </button>
            </Magnetic>
          </span>
          <span data-r>
            <Magnetic>
              <a href="#contacto" className="btn btn-ghost">
                Solicitar una demostración <ArrowRight size={16} />
              </a>
            </Magnetic>
          </span>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Contacto                                                            */
/* ------------------------------------------------------------------ */
const PROCESSES = ['Atención a clientes', 'Ventas y seguimiento', 'Marketing y contenido', 'Reportes', 'Operaciones internas', 'Otro']

type Lead = { nombre: string; empresa: string; correo: string; whatsapp: string; sector: string; proceso: string; mensaje: string }
const EMPTY: Lead = { nombre: '', empresa: '', correo: '', whatsapp: '', sector: '', proceso: '', mensaje: '' }

function Field({
  label,
  name,
  value,
  onChange,
  error,
  required,
  type = 'text',
  autoComplete,
  textarea,
}: {
  label: string
  name: keyof Lead
  value: string
  onChange: (n: keyof Lead, v: string) => void
  error?: string
  required?: boolean
  type?: string
  autoComplete?: string
  textarea?: boolean
}) {
  const cls = `peer w-full rounded-2xl border bg-white/[0.03] px-4 pb-3 pt-6 text-[16px] text-white outline-none transition-colors duration-300 placeholder-transparent focus:bg-white/[0.06] ${
    error ? 'border-magenta/70' : 'border-white/10 focus:border-cyan/60'
  }`
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} value={value} onChange={(e) => onChange(name, e.target.value)} placeholder={label} rows={4} className={`${cls} resize-none`} />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={label}
          aria-invalid={!!error}
          aria-required={required}
          className={cls}
        />
      )}
      <span className="pointer-events-none absolute left-4 top-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45 transition-all duration-300 peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-[14px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-cyan">
        {label}
        {required && ' *'}
      </span>
      {error && <span className="mt-1.5 block text-xs text-magenta">{error}</span>}
    </label>
  )
}

export function Contact() {
  const [f, setF] = useState<Lead>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle')
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)

  const set = (n: keyof Lead, v: string) => {
    setF((p) => ({ ...p, [n]: v }))
    if (errors[n]) setErrors((e) => ({ ...e, [n]: undefined }))
  }

  const summary = () =>
    `Hola, soy ${f.nombre} de ${f.empresa}. Me interesa un Cerebro Digital.` +
    (f.sector ? `\nSector: ${f.sector}` : '') +
    (f.proceso ? `\nProceso a automatizar: ${f.proceso}` : '') +
    (f.mensaje ? `\nMensaje: ${f.mensaje}` : '') +
    `\nCorreo: ${f.correo}` +
    (f.whatsapp ? `\nWhatsApp: ${f.whatsapp}` : '')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (f.nombre.trim().length < 2) errs.nombre = 'Escriba su nombre.'
    if (f.empresa.trim().length < 2) errs.empresa = 'Escriba el nombre de su empresa.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.correo.trim())) errs.correo = 'Revise el formato del correo.'
    setErrors(errs)
    setConsentError(!consent)
    if (Object.keys(errs).length || !consent) return
    setStatus('sending')
    const ok = await sendLead({ ...f }, 'formulario')
    setStatus(ok ? 'done' : 'failed')
  }

  const wa = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(summary())}` : ''
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent(`Demostración Cerebro Digital — ${f.empresa}`)}&body=${encodeURIComponent(summary())}`

  return (
    <section id="contacto" data-scene="8" className="section">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Contacto</p>
          <SplitText className="h-section mt-6" lines={[{ text: 'Conozca su', className: 'text-chrome' }, { text: 'Cerebro Digital.', className: 'text-grad' }]} />
          <Reveal>
            <p data-r className="lead mt-7 max-w-[440px]">
              Cuéntenos sobre su empresa y el proceso que le gustaría hacer más inteligente. Revisaremos su solicitud y le contactaremos.
            </p>
            <div data-r className="mt-10 grid gap-3">
              <button type="button" onClick={() => askCerebro('Quiero una demostración')} className="glass group flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors hover:border-white/25">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand shadow-glow-m">
                  <MessageCircle size={19} />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">Hablar con el Cerebro</span>
                  <span className="block text-[13px] text-white/50">Respuesta inmediata, 24/7</span>
                </span>
                <ArrowRight size={16} className="ml-auto text-white/50 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
              </button>
              {SITE.whatsapp && (
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hola, quiero información sobre el Cerebro Digital.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors hover:border-white/25"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-400/30 bg-emerald-400/10">
                    <Phone size={19} className="text-emerald-400" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold">WhatsApp</span>
                    <span className="block text-[13px] text-white/50">{SITE.whatsappDisplay}</span>
                  </span>
                  <ArrowRight size={16} className="ml-auto text-white/50 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
                </a>
              )}
              <a href={`mailto:${SITE.email}`} className="glass group flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors hover:border-white/25">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5">
                  <Mail size={19} className="text-cyan" />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">Escríbanos</span>
                  <span className="block text-[13px] text-white/50">{SITE.email}</span>
                </span>
                <ArrowRight size={16} className="ml-auto text-white/50 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7">
          <div data-r className="panel ring-grad relative overflow-hidden !rounded-[28px] p-6 sm:p-10">
            {status === 'done' || status === 'failed' ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <span className={`grid h-16 w-16 place-items-center rounded-full ${status === 'done' ? 'bg-gradient-brand shadow-glow-m' : 'border border-magenta/50 bg-magenta/10'}`}>
                  {status === 'done' ? <Check size={28} /> : <AlertTriangle size={26} className="text-magenta" />}
                </span>
                <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">
                  {status === 'done' ? 'Solicitud recibida' : 'No pudimos enviarla'}
                </h3>
                <p className="mt-3 max-w-[400px] text-white/65">
                  {status === 'done'
                    ? `Gracias, ${f.nombre.split(' ')[0]}. Revisaremos su caso y le contactaremos. Si prefiere acelerar, continúe por un canal directo:`
                    : 'Hubo un problema de conexión. Sus datos no se perdieron: envíelos con un clic por uno de estos canales:'}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="btn bg-emerald-500 text-white hover:bg-emerald-400">
                      Continuar por WhatsApp
                    </a>
                  )}
                  <a href={mail} className="btn btn-ghost">
                    Enviar por correo
                  </a>
                </div>
                <button type="button" onClick={() => { setF(EMPTY); setConsent(false); setStatus('idle') }} className="mt-6 text-sm text-white/45 underline-offset-4 hover:underline">
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre" name="nombre" value={f.nombre} onChange={set} error={errors.nombre} required autoComplete="name" />
                  <Field label="Empresa" name="empresa" value={f.empresa} onChange={set} error={errors.empresa} required autoComplete="organization" />
                  <Field label="Correo" name="correo" type="email" value={f.correo} onChange={set} error={errors.correo} required autoComplete="email" />
                  <Field label="WhatsApp" name="whatsapp" type="tel" value={f.whatsapp} onChange={set} autoComplete="tel" />
                </div>
                <Field label="¿A qué se dedica su empresa?" name="sector" value={f.sector} onChange={set} />
                <fieldset>
                  <legend className="mb-3 text-[13px] text-white/55">Proceso que desea automatizar</legend>
                  <div className="flex flex-wrap gap-2">
                    {PROCESSES.map((p) => {
                      const on = f.proceso === p
                      return (
                        <button
                          key={p}
                          type="button"
                          aria-pressed={on}
                          onClick={() => set('proceso', on ? '' : p)}
                          className={`rounded-full border px-4 py-2 text-[13px] transition-all duration-300 ${
                            on ? 'border-transparent bg-gradient-brand text-white shadow-glow-v' : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
                <Field label="Mensaje" name="mensaje" value={f.mensaje} onChange={set} textarea />
                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-white/65">
                    <span className="relative mt-0.5 grid h-[18px] w-[18px] flex-none place-items-center">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked)
                          if (e.target.checked) setConsentError(false)
                        }}
                        aria-invalid={consentError}
                        className={`peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[6px] border bg-white/[0.04] transition-colors checked:border-transparent checked:bg-gradient-brand ${consentError ? 'border-magenta' : 'border-white/25'}`}
                      />
                      <Check size={12} strokeWidth={3} className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100" />
                    </span>
                    <span>
                      Autorizo el tratamiento de mis datos personales para ser contactado, conforme a la{' '}
                      <a href="/privacidad/" className="text-white underline underline-offset-2 hover:text-cyan">Política de privacidad</a> y los{' '}
                      <a href="/terminos/" className="text-white underline underline-offset-2 hover:text-cyan">Términos y condiciones</a>. *
                    </span>
                  </label>
                  {consentError && <span className="mt-1.5 block pl-[30px] text-xs text-magenta">Debe aceptar la autorización para enviar la solicitud.</span>}
                </div>
                <div className="mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <p className="text-xs text-white/40">Los campos con * son obligatorios.</p>
                  <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full sm:w-auto">
                    {status === 'sending' ? <Loader2 size={18} className="animate-spin" /> : null}
                    {status === 'sending' ? 'Enviando…' : 'Solicitar demostración'}
                    {status === 'idle' && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
export function Footer() {
  return (
    <footer data-scene="8" className="relative overflow-hidden border-t border-white/[0.07] pb-10 pt-20">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,.22),transparent_65%)]" />
      <div className="container-x relative">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <img src={SITE.logo.full} alt={SITE.name} loading="lazy" className="w-[min(78vw,340px)]" />
          <div className="md:justify-self-end">
            <nav aria-label="Pie de página" className="flex flex-wrap gap-x-7 gap-y-3">
              {NAV.map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
                  {l.label}
                </a>
              ))}
            </nav>
            <p className="mt-8 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Usted decide. <span className="text-grad">El Cerebro ejecuta.</span>
            </p>
          </div>
        </div>
        <div className="hairline mt-16" />
        <div className="mt-6 flex flex-col justify-between gap-4 text-[11px] text-white/40 lg:flex-row lg:items-center">
          <span className="font-mono uppercase tracking-[0.2em]">© {new Date().getFullYear()} {SITE.name}</span>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-[12.5px]">
            {LEGAL_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
            <button type="button" onClick={() => window.dispatchEvent(new Event('cerebro:cookie-settings'))} className="transition-colors hover:text-white">
              Preferencias de cookies
            </button>
          </nav>
          <span className="font-mono uppercase tracking-[0.2em]">{SITE.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
