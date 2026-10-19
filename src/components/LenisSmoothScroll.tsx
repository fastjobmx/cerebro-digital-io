import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LenisSmoothScrollProps {
  children: ReactNode
}

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const IS_TOUCH =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export function LenisSmoothScroll({ children }: LenisSmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const smooth = !REDUCED_MOTION
    const smoothWheel = smooth && !IS_TOUCH

    const lenis = new Lenis({
      duration: smooth ? 1.25 : 0.001,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel,
      // @ts-expect-error Lenis v1 type variants differ between releases; touch is disabled.
      touch: { smooth: false },
    })

    lenisRef.current = lenis
    if (import.meta.env.DEV) (window as unknown as { __lenis: Lenis }).__lenis = lenis

    // Connect Lenis → GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update as unknown as (e: unknown) => void)

    const onRaf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    // Smooth anchor scroll
    const handleAnchor = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#' || href.length < 2) return
      const el = document.querySelector(href) as HTMLElement | null
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, {
        offset: -70,
        duration: 1.3,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        immediate: !smooth,
      })
    }
    document.addEventListener('click', handleAnchor)

    return () => {
      gsap.ticker.remove(onRaf)
      lenis.off('scroll', ScrollTrigger.update as unknown as (e: unknown) => void)
      lenis.destroy()
      document.removeEventListener('click', handleAnchor)
    }
  }, [])

  return <>{children}</>
}
