import { Logo } from './Logo'
import { MessageCircle } from 'lucide-react'
import {
  SiInstagram as Instagram,
  SiFacebook as Facebook,
  SiYoutube as Youtube,
  SiWhatsapp as Whatsapp,
} from 'react-icons/si'
import type { ComponentType, SVGProps } from 'react'

const Linkedin: ComponentType<SVGProps<SVGSVGElement> & { size?: number }> = ({ size = 18, className, style, ...rest }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    style={style}
    {...rest}
  >
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const FOOTER_LINKS = {
  Producto: [
    { label: 'Cerebro Digital', href: '#cerebro' },
    { label: 'Soluciones', href: '#soluciones' },
    { label: 'Casos de uso', href: '#casos' },
    { label: 'Cómo funciona', href: '#como-funciona' },
  ],
  Empresa: [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Sobre nosotros', href: '#cerebro' },
    { label: 'Contacto', href: '#contacto' },
    { label: 'Solicitar demo', href: '#contacto' },
  ],
}

export function Footer() {
  return (
    <footer id="footer" className="relative border-t border-electric-purple/20 mt-0 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-ultra-violet/20 blur-[120px] pointer-events-none" />

      <div className="container-x relative z-10 pt-20 pb-10">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Logo size="md" />
            <p className="mt-6 text-white/60 text-base max-w-md leading-relaxed">
              Conectamos inteligencia artificial, información, herramientas y automatizaciones
              para construir un sistema inteligente alrededor de su negocio.
            </p>
            <div className="mt-8 flex items-center gap-4">
              {[
                { Icon: Instagram, href: '#', color: '#E4405F' },
                { Icon: Facebook, href: '#', color: '#1877F2' },
                { Icon: Linkedin, href: '#', color: '#0A66C2' },
                { Icon: Youtube, href: '#', color: '#FF0000' },
                { Icon: Whatsapp, href: '#', color: '#25D366' },
              ].map(({ Icon, href, color }, i) => (
                <a
                  key={i}
                  href={href}
                  className="relative w-11 h-11 rounded-full glass-light flex items-center justify-center text-white/60 transition-all group hover:scale-110"
                  style={{
                    transitionProperty: 'transform, color, background, box-shadow, border-color',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.color = '#fff'
                    el.style.background = `${color}22`
                    el.style.borderColor = `${color}66`
                    el.style.boxShadow = `0 0 18px ${color}66`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.color = ''
                    el.style.background = ''
                    el.style.borderColor = ''
                    el.style.boxShadow = ''
                  }}
                >
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <h4 className="text-sm font-semibold text-white/90 mb-5 tracking-wide uppercase">
                  {section}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, li) => (
                    <li key={`${section}-${link.href}-${li}`}>
                      <a
                        href={link.href}
                        className="text-sm text-white/50 hover:text-white/90 transition-colors inline-flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-ultra-violet group-hover:w-3 transition-all duration-300" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-white/90 mb-5 tracking-wide uppercase">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-start gap-3">
                <MessageCircle size={16} className="mt-0.5 text-electric-cyan shrink-0" />
                <span>WhatsApp empresarial disponible</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-neon-magenta/60 shrink-0 mt-1" />
                <span>Proyectos personalizados</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-electric-cyan/60 shrink-0 mt-1" />
                <span>Acompañamiento continuo</span>
              </li>
            </ul>
            <a href="#contacto" className="btn-primary !py-3 !px-6 text-sm mt-8 w-full justify-center">
              <span>Solicitar demostración</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-electric-purple/30 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} CEREBRO DIGITAL IO. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">
              Términos y condiciones
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Política de privacidad
            </a>
            <span className="text-gradient font-medium tracking-wide">
              INTELIGENCIA QUE AUTOMATIZA.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
