import { createElement, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const REDUCED =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const FINE_POINTER = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* ------------------------------------------------------------------ */
/* SplitText: titulares que emergen palabra por palabra                */
/* ------------------------------------------------------------------ */
interface SplitProps {
  /** Cada string es una línea; use {grad:'texto'} para gradiente. */
  lines: (string | { text: string; className?: string })[]
  as?: ElementType
  className?: string
  delay?: number
  immediate?: boolean
}

export function SplitText({ lines, as = 'h2', className, delay = 0, immediate = false }: SplitProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED) return
    const words = el.querySelectorAll<HTMLElement>('.split-word')
    gsap.set(words, { yPercent: 115, rotate: 4, opacity: 0 })
    const anim = () =>
      gsap.to(words, {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.045,
        delay,
      })
    if (immediate) {
      const tw = anim()
      return () => {
        tw.kill()
      }
    }
    const st = ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => anim() })
    return () => st.kill()
  }, [delay, immediate])

  return createElement(
    as,
    { ref, className },
    lines.map((line, i) => {
      const text = typeof line === 'string' ? line : line.text
      const cls = typeof line === 'string' ? '' : line.className ?? ''
      return (
        <span key={i} className="split-line">
          {text.split(' ').map((w, j, arr) => (
            <span key={j} className={`split-word ${cls}`}>
              {w}
              {j < arr.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      )
    }),
  )
}

/* ------------------------------------------------------------------ */
/* Reveal: aparición de hijos marcados con data-r al entrar en vista   */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  as = 'div',
  stagger = 0.08,
  y = 40,
  style,
  id,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  stagger?: number
  y?: number
  style?: CSSProperties
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED) return
    const items = el.querySelectorAll<HTMLElement>('[data-r]')
    const targets = items.length ? items : [el]
    gsap.set(targets, { y, opacity: 0, filter: 'blur(8px)' })
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () =>
        gsap.to(targets, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out', stagger }),
    })
    return () => st.kill()
  }, [stagger, y])
  return createElement(as, { ref, className, style, id }, children)
}

/* ------------------------------------------------------------------ */
/* Magnetic: botones que siguen sutilmente al puntero                  */
/* ------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED || !FINE_POINTER) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <span ref={ref} className="inline-block will-change-transform" data-cursor="hover">
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* TiltCard: tarjeta con inclinación 3D y reflejo que sigue al puntero */
/* ------------------------------------------------------------------ */
export function TiltCard({
  children,
  className = '',
  max = 10,
  onClick,
  as = 'div',
  ...rest
}: {
  children: ReactNode
  className?: string
  max?: number
  onClick?: () => void
  as?: ElementType
  [key: string]: unknown
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED || !FINE_POINTER) return
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.8, ease: 'expo.out' })
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.8, ease: 'expo.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      ry((px - 0.5) * max * 2)
      rx(-(py - 0.5) * max * 2)
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    gsap.set(el, { transformPerspective: 900 })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [max])
  return createElement(
    as,
    { ref, className: `group/tilt relative preserve-3d ${className}`, onClick, ...rest },
    <>
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(240,60,255,.16), rgba(61,217,255,.08) 35%, transparent 60%)',
        }}
      />
    </>,
  )
}

/* ------------------------------------------------------------------ */
/* Counter: número que cuenta al entrar en vista                       */
/* ------------------------------------------------------------------ */
export function Counter({ to, suffix = '', prefix = '', decimals = 0 }: { to: number; suffix?: string; prefix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(REDUCED ? to : 0)
  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED) return
    const o = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 2.2, ease: 'expo.out', onUpdate: () => setVal(o.v) }),
    })
    return () => st.kill()
  }, [to])
  return (
    <span ref={ref} className="tabular">
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Cursor personalizado (sólo puntero fino)                            */
/* ------------------------------------------------------------------ */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (REDUCED || !FINE_POINTER || !dot.current || !ring.current) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'expo.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'expo.out' })
    const r = ring.current
    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      const t = e.target as HTMLElement | null
      const hot = !!t?.closest('a,button,[data-cursor="hover"],input,textarea,select,label')
      r.dataset.hot = hot ? '1' : '0'
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])
  if (REDUCED || !FINE_POINTER) return null
  return (
    <>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
      <div
        ref={ring}
        aria-hidden="true"
        data-hot="0"
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 h-10 w-10 rounded-full border border-white/40 transition-[width,height,margin,background-color,border-color] duration-500 ease-expo data-[hot='1']:-ml-8 data-[hot='1']:-mt-8 data-[hot='1']:h-16 data-[hot='1']:w-16 data-[hot='1']:border-cyan/70 data-[hot='1']:bg-cyan/10"
      />
    </>
  )
}
