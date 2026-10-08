import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'

const NAV_LINKS = [
  { label: 'EL CEREBRO', href: '#cerebro' },
  { label: 'SOLUCIONES', href: '#soluciones' },
  { label: 'CÓMO FUNCIONA', href: '#como-funciona' },
  { label: 'CASOS DE USO', href: '#casos' },
  { label: 'CONTACTO', href: '#contacto' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // GSAP mobile open/close animation
    const panel = panelRef.current
    if (!panel) return
    if (mobileOpen) {
      gsap.fromTo(
        panel.querySelectorAll('a, button'),
        { opacity: 0, y: 14, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.05, duration: 0.45, ease: 'power3.out' }
      )
    }
  }, [mobileOpen])

  const close = () => setMobileOpen(false)

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'py-3 glass-strong border-b border-electric-purple/20 shadow-[0_8px_40px_-10px_rgba(123,44,255,0.35)]'
          : 'py-5 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between">
        <a
          href="#inicio"
          className="flex items-center gap-3 group"
          aria-label="Inicio CEREBRO DIGITAL IO"
        >
          <Logo size="sm" />
        </a>

        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors group/nav"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-gradient-brand group-hover/nav:w-full transition-all duration-300" />
              <span className="absolute -bottom-1.5 left-0 h-px w-0 group-hover/nav:shadow-[0_0_12px_rgba(0,229,255,0.7)] group-hover/nav:w-full transition-all duration-300 pointer-events-none" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="#contacto"
            data-magnetic
            className="btn-primary !py-2.5 !px-6 text-[11px] tracking-[0.18em] uppercase font-bold hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
          >
            <span>QUIERO MI CEREBRO</span>
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden text-white p-2 rounded-xl transition-colors hover:bg-white/5"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X size={22} strokeWidth={1.6} /> : <Menu size={22} strokeWidth={1.6} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`lg:hidden overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-out ${
          mobileOpen ? 'max-h-[640px] opacity-100 translate-y-0 mt-3' : 'max-h-0 opacity-0 -translate-y-2'
        }`}
      >
        <div className="container-x">
          <div
            ref={panelRef}
            className="glass-strong rounded-2xl p-6 flex flex-col gap-1 border border-electric-purple/20 shadow-[0_18px_60px_-20px_rgba(123,44,255,0.55)]"
          >
            <div className="mb-2 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-electric-purple/40" />
              Navegación
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-electric-purple/40" />
            </div>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="group/nav relative text-sm sm:text-base font-medium text-white/85 hover:text-white transition-colors py-3.5 px-3 rounded-xl hover:bg-white/[0.04] border-b border-white/5 last:border-b-0"
              >
                <span className="flex items-center justify-between">
                  <span className="tracking-[0.18em] uppercase">{link.label}</span>
                  <span className="text-electric-cyan/70 group-hover/nav:translate-x-1 transition-transform text-xs">→</span>
                </span>
              </a>
            ))}
            <a
              href="#contacto"
              onClick={close}
              className="btn-primary justify-center mt-4 text-sm tracking-[0.18em] uppercase font-bold"
            >
              <span>QUIERO MI CEREBRO</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
