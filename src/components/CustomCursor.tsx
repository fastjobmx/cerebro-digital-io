import { useEffect, useRef, useState } from 'react'

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const IS_TOUCH =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (IS_TOUCH || REDUCED_MOTION) return
    setEnabled(true)

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: mouse.x, y: mouse.y }
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`
      }
      const target = e.target as HTMLElement | null
      const interactive = target?.closest(
        'a, button, [role="button"], [data-magnetic], input, textarea, select, label'
      ) as HTMLElement | null
      if (interactive) {
        const rect = interactive.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        mouse.x = mouse.x * 0.4 + cx * 0.6
        mouse.y = mouse.y * 0.4 + cy * 0.6
        if (ringRef.current) {
          ringRef.current.style.width = '64px'
          ringRef.current.style.height = '64px'
          ringRef.current.style.borderColor = 'rgba(0, 229, 255, 0.9)'
          ringRef.current.style.boxShadow = '0 0 22px rgba(0, 229, 255, 0.35)'
          ringRef.current.style.mixBlendMode = 'normal'
        }
      } else if (ringRef.current) {
        ringRef.current.style.width = '32px'
        ringRef.current.style.height = '32px'
        ringRef.current.style.borderColor = 'rgba(168, 85, 247, 0.85)'
        ringRef.current.style.boxShadow = '0 0 16px rgba(168, 85, 247, 0.25)'
        ringRef.current.style.mixBlendMode = 'difference'
      }
    }

    const onDown = () => {
      if (ringRef.current) {
        ringRef.current.style.transform += ' scale(0.85)'
      }
    }
    const onUp = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = ringRef.current.style.transform.replace(
          ' scale(0.85)',
          ''
        )
      }
    }

    const tick = () => {
      ring.x += (mouse.x - ring.x) * 0.18
      ring.y += (mouse.y - ring.y) * 0.18
      if (ringRef.current) {
        const base = ringRef.current.style.transform
          .split(' scale(')[0]
          .replace(/^translate3d[^)]+\)/, '')
        const scale = ringRef.current.style.transform.includes('scale')
          ? ' scale(0.85)'
          : ''
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)${scale}${base}`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block rounded-full border border-electric-purple/80"
        style={{
          width: 32,
          height: 32,
          willChange: 'transform, width, height',
          mixBlendMode: 'difference',
          transition: 'width 220ms ease, height 220ms ease, border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease',
        }}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block rounded-full"
        style={{
          width: 6,
          height: 6,
          background: '#ffffff',
          boxShadow:
            '0 0 6px rgba(255,255,255,0.9), 0 0 16px rgba(0, 229, 255, 0.8), 0 0 30px rgba(168, 85, 247, 0.5)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </>
  )
}
