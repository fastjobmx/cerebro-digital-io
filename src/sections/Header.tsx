import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { NAV, askCerebro } from '../config/site'
import { BrandLockup } from '../components/Brand'
import { Magnetic } from '../components/fx'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const progress = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sección activa en la navegación
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1))
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open && menu.current) {
      gsap.fromTo(
        menu.current.querySelectorAll('[data-m]'),
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.15 },
      )
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="absolute inset-x-0 top-0 h-px bg-white/5">
          <div ref={progress} className="h-full origin-left scale-x-0 bg-gradient-brand" />
        </div>
        <div
          className={`container-x flex items-center justify-between transition-all duration-700 ease-expo ${
            scrolled ? 'pt-3' : 'pt-5 sm:pt-7'
          }`}
        >
          <div
            className={`flex w-full items-center justify-between rounded-full transition-all duration-700 ease-expo ${
              scrolled ? 'glass py-2 pl-3 pr-2 shadow-[0_20px_60px_-30px_rgba(139,92,246,.6)] sm:pl-4' : 'py-1 pl-0 pr-0'
            }`}
          >
            <a href="#inicio" aria-label="Ir al inicio" className="shrink-0">
              <BrandLockup />
            </a>

            <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
              {NAV.map((l) => {
                const on = active === l.href.slice(1)
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                      on ? 'text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {on && <span className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-white/10" />}
                    <span className="relative">{l.label}</span>
                  </a>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block">
                <Magnetic>
                  <a href="#contacto" className="btn btn-primary !h-10 !px-5 !text-[13px]">
                    Solicitar demo
                    <ArrowUpRight size={16} />
                  </a>
                </Magnetic>
              </span>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-movil"
                aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur lg:hidden"
              >
                <span className={`absolute h-px w-4 bg-white transition-transform duration-500 ease-expo ${open ? 'rotate-45' : '-translate-y-[3px]'}`} />
                <span className={`absolute h-px w-4 bg-white transition-transform duration-500 ease-expo ${open ? '-rotate-45' : 'translate-y-[3px]'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil a pantalla completa */}
      <div
        id="menu-movil"
        ref={menu}
        className={`fixed inset-0 z-40 flex flex-col bg-ink/95 backdrop-blur-2xl transition-[clip-path] duration-700 ease-expo lg:hidden ${
          open ? '[clip-path:circle(150%_at_calc(100%-40px)_40px)]' : 'pointer-events-none [clip-path:circle(0%_at_calc(100%-40px)_40px)]'
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(240,60,255,.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(61,217,255,.12),transparent_55%)]" />
        <nav className="container-x relative mt-28 flex flex-col" aria-label="Menú móvil">
          {NAV.map((l, i) => (
            <span key={l.href} className="overflow-hidden border-b border-white/10">
              <a
                data-m
                href={l.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="flex items-baseline justify-between py-5 font-display text-[2.1rem] font-semibold tracking-tight text-white"
              >
                {l.label}
                <span className="font-mono text-xs text-white/40">0{i + 1}</span>
              </a>
            </span>
          ))}
        </nav>
        <div className="container-x relative mt-auto flex flex-col gap-3 pb-10">
          <span className="overflow-hidden">
            <button
              data-m
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setOpen(false)
                askCerebro()
              }}
              className="btn btn-primary w-full"
            >
              Hable con el Cerebro
            </button>
          </span>
          <span className="overflow-hidden">
            <a data-m href="#contacto" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="btn btn-ghost w-full">
              Solicitar una demostración
            </a>
          </span>
        </div>
      </div>
    </>
  )
}
