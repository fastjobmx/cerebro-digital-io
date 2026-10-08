import { useState } from 'react'
import {
  ArrowRight,
  Send,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  User,
  Building2,
  MessageCircle,
  Mail,
  BriefcaseBusiness,
  Workflow,
  FileText,
} from 'lucide-react'

export function FinalCTA() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    role: '',
    process: '',
    message: '',
  })

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contacto" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-3 to-deep-space" />
      <div className="absolute inset-0 bg-grid-fine opacity-30" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-ultra-violet/20 blur-[150px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-neon-magenta/15 blur-[150px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="container-x relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Headline */}
          <div className="text-center max-w-5xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-6 border border-gradient-brand">
              <Sparkles size={14} className="text-neon-magenta" />
              <span className="text-[10px] tracking-[0.2em] text-neon-magenta uppercase font-bold">
                Hablemos de su negocio
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
              <span className="text-white/90">¿QUÉ PODRÍAMOS </span>
              <br />
              <span className="text-gradient">AUTOMATIZAR EN SU NEGOCIO?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Cuéntenos cómo funciona hoy su empresa. Descubramos
              <span className="text-white font-semibold"> qué podría hacer un Cerebro Digital </span>
              por usted.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-14">
            <a href="#contact-form" className="btn-primary !px-10 text-base md:text-lg w-full md:w-auto justify-center">
              <span className="flex items-center gap-3">
                QUIERO MI CEREBRO DIGITAL
                <ArrowRight size={18} />
              </span>
            </a>
            <a href="#contact-form" className="btn-secondary !px-10 text-base md:text-lg w-full md:w-auto justify-center">
              <span className="flex items-center gap-3">
                SOLICITAR DEMOSTRACIÓN
              </span>
            </a>
          </div>

          {/* Form */}
          <div id="contact-form" className="relative max-w-4xl mx-auto">
            <div className="glass-strong rounded-[32px] p-6 md:p-10 border border-electric-purple/25 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-neon-magenta/30 blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-electric-cyan/20 blur-[80px] pointer-events-none" />

              {submitted ? (
                <SuccessState />
              ) : (
                <form onSubmit={onSubmit} className="relative z-10 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Nombre" icon={User}>
                      <input
                        required
                        value={form.name}
                        onChange={update('name')}
                        className="field-input"
                        placeholder="Su nombre y apellido"
                      />
                    </Field>
                    <Field label="Empresa" icon={Building2}>
                      <input
                        required
                        value={form.company}
                        onChange={update('company')}
                        className="field-input"
                        placeholder="Nombre de su empresa"
                      />
                    </Field>
                    <Field label="WhatsApp" icon={MessageCircle}>
                      <input
                        required
                        value={form.whatsapp}
                        onChange={update('whatsapp')}
                        className="field-input"
                        placeholder="+XX XXX XXX XXXX"
                      />
                    </Field>
                    <Field label="Email" icon={Mail}>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={update('email')}
                        className="field-input"
                        placeholder="ud@empresa.com"
                      />
                    </Field>
                    <Field label="¿Qué hace su empresa?" icon={BriefcaseBusiness}>
                      <select
                        required
                        value={form.role}
                        onChange={update('role')}
                        className="field-input appearance-none cursor-pointer"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="servicios">Empresa de servicios</option>
                        <option value="comercio">Comercio / tienda</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="profesional">Profesional independiente</option>
                        <option value="b2b">Empresa B2B</option>
                        <option value="local">Negocio local</option>
                        <option value="crecimiento">Empresa en crecimiento</option>
                        <option value="otro">Otro</option>
                      </select>
                    </Field>
                    <Field label="¿Qué proceso le gustaría automatizar?" icon={Workflow}>
                      <select
                        required
                        value={form.process}
                        onChange={update('process')}
                        className="field-input appearance-none cursor-pointer"
                      >
                        <option value="">Seleccione una prioridad</option>
                        <option value="marketing">Marketing y campañas</option>
                        <option value="contenido">Contenido y creatividad</option>
                        <option value="ventas">Ventas y CRM</option>
                        <option value="atencion">Atención al cliente</option>
                        <option value="admin">Administración y documentos</option>
                        <option value="web">Website y presencia digital</option>
                        <option value="operaciones">Operaciones y procesos internos</option>
                        <option value="varios">Aún no estoy seguro</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Mensaje" icon={FileText}>
                    <textarea
                      required
                      value={form.message}
                      onChange={update('message')}
                      rows={4}
                      className="field-input resize-none"
                      placeholder="Cuéntenos más sobre su operación hoy y qué le gustaría optimizar…"
                    />
                  </Field>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                    <p className="text-xs text-white/40 max-w-md leading-relaxed">
                      Al enviar este formulario acepta que CEREBRO DIGITAL IO
                      se contacte para presentar una propuesta personalizada.
                    </p>
                    <button type="submit" className="btn-primary !px-10 w-full sm:w-auto justify-center">
                      <span className="flex items-center gap-3">
                        ENVIAR SOLICITUD
                        <Send size={16} />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Field styling */}
      <style>{`
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          padding: 0.9rem 1rem;
          border-radius: 0.9rem;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .field-input:focus {
          border-color: rgba(168,85,247,0.6);
          box-shadow: 0 0 0 3px rgba(168,85,247,0.15);
          background: rgba(168,85,247,0.05);
        }
        .field-input::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </section>
  )
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 mb-2 text-xs tracking-[0.15em] text-white/60 uppercase font-semibold">
        <Icon size={13} className="text-neon-magenta" />
        {label}
      </div>
      {children}
    </label>
  )
}

function SuccessState() {
  return (
    <div className="relative z-10 py-10 px-4 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-brand flex items-center justify-center halo-violet">
        <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center">
          <CheckCircle2 size={40} className="text-white" />
        </div>
      </div>
      <h3 className="font-display font-bold text-3xl md:text-5xl mb-4">
        <span className="text-white/90">RECI</span>
        <span className="text-gradient">BIDO.</span>
      </h3>
      <p className="text-lg md:text-2xl text-white/80 mb-3 font-display">
        Ahora vamos a entender su negocio.
      </p>
      <p className="text-sm md:text-base text-white/55 max-w-xl mx-auto mb-8">
        Un miembro del equipo revisará su información y se contactará para agendar
        una conversación personalizada y diseñar la propuesta de Cerebro Digital adecuada.
      </p>
      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-light border border-electric-cyan/40">
        <BrainCircuit size={18} className="text-electric-cyan" />
        <span className="text-sm font-semibold tracking-wide text-white/85">
          En proceso: diseño de su Cerebro Digital
        </span>
      </div>
    </div>
  )
}
