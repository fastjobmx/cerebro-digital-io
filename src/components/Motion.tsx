import { createElement, useEffect, useRef } from 'react'
import type { ReactNode, CSSProperties, ElementType } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

type RevealFrom = 'bottom' | 'left' | 'right' | 'scale' | 'blur'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  style?: CSSProperties
  id?: string
  delay?: number
  from?: RevealFrom
  distance?: number
  duration?: number
  stagger?: number
  once?: boolean
  immediate?: boolean
  role?: React.AriaRole
  'aria-label'?: string
}

export function Reveal({
  children,
  as = 'div',
  className,
  style,
  id,
  delay = 0,
  from = 'bottom',
  distance = 40,
  duration = 0.9,
  stagger = 0.05,
  once = true,
  immediate = false,
  role,
  'aria-label': ariaLabel,
}: RevealProps) {
  const innerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    if (REDUCED_MOTION) {
      el.style.opacity = '1'
      return
    }

    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal-item]'))
    const targets: gsap.TweenTarget[] = items.length > 0 ? items : [el]

    const baseFrom: gsap.TweenVars = { opacity: 0 }
    if (from === 'bottom') baseFrom.y = distance
    else if (from === 'left') baseFrom.x = -distance
    else if (from === 'right') baseFrom.x = distance
    else if (from === 'scale') baseFrom.scale = 0.92
    else if (from === 'blur') baseFrom.filter = 'blur(14px)'

    const baseTo: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration,
      ease: 'power3.out',
      stagger: targets.length > 1 ? stagger : 0,
      delay,
    }

    if (immediate) {
      gsap.set(targets, baseFrom)
      gsap.to(targets, baseTo)
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, baseFrom)
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once,
        onEnter: () => gsap.to(targets, baseTo),
        onEnterBack: once ? undefined : () => gsap.to(targets, { ...baseTo, delay: 0 }),
      })
    }, el)

    return () => ctx.revert()
  }, [from, distance, duration, stagger, once, delay, immediate])

  return createElement(
    as,
    { ref: innerRef, className, style, id, role, 'aria-label': ariaLabel },
    children
  )
}

interface MagneticProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  href?: string
  strength?: number
  as?: ElementType
  onClick?: (e: React.MouseEvent) => void
  type?: 'button' | 'submit' | 'reset'
  id?: string
  'aria-label'?: string
}

export function Magnetic({
  children,
  className,
  style,
  href,
  strength = 10,
  as,
  onClick,
  type,
  id,
  'aria-label': ariaLabel,
}: MagneticProps) {
  const innerRef = useRef<HTMLElement | null>(null)
  const Tag: ElementType = as ?? (href ? 'a' : 'button')

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    if (REDUCED_MOTION || IS_TOUCH_SAFE()) return

    const onMove = (e: Event) => {
      const me = e as MouseEvent
      const r = el.getBoundingClientRect()
      const x = (me.clientX - r.left) / r.width - 0.5
      const y = (me.clientY - r.top) / r.height - 0.5
      const d = Math.hypot(x, y)
      if (d < 0.8) {
        gsap.to(el, {
          x: x * strength * 2,
          y: y * strength * 2,
          scale: 1.03,
          duration: 0.35,
          ease: 'power3.out',
        })
      } else {
        reset()
      }
    }
    const reset = () =>
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'elastic.out(1, 0.4)',
      })

    el.addEventListener('mousemove', onMove as EventListener)
    el.addEventListener('mouseleave', reset)
    return () => {
      el.removeEventListener('mousemove', onMove as EventListener)
      el.removeEventListener('mouseleave', reset)
    }
  }, [strength])

  return createElement(
    Tag,
    {
      ref: innerRef,
      className,
      style,
      href: Tag === 'a' ? href : undefined,
      onClick,
      type: Tag === 'button' ? type ?? 'button' : undefined,
      'data-magnetic': true,
      id,
      'aria-label': ariaLabel,
    },
    children
  )
}

function IS_TOUCH_SAFE() {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  )
}
