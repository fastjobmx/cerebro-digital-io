import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { SITE } from '../config/site'

/**
 * Preloader cinematográfico: logo que se materializa desde la oscuridad
 * con efecto de energía neuronal, texto "Cargando..." con glitch sutil,
 * y red de sinapsis animada en canvas.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('')
  const fullText = 'Cargando...'

  // Efecto de typing para "Cargando..."
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setLoadingText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Canvas de sinapsis neuronales
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let w = 0
    let h = 0
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    const NODE_COUNT = 40
    const CONNECT_DIST = 120

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // Dibujar conexiones
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.3
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      // Dibujar nodos
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        ctx.fillStyle = 'rgba(167, 139, 250, 0.6)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Timeline principal GSAP
  useEffect(() => {
    const el = root.current
    if (!el) return
    const o = { v: 0 }
    const tl = gsap.timeline()

    // Fase 1: Logo aparece con efecto de energía (blur + glow + scale)
    tl.fromTo('[data-pl-logo]',
      { opacity: 0, scale: 0.7, filter: 'blur(24px) brightness(0.2) drop-shadow(0 0 0px rgba(139,92,246,0))' },
      { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1) drop-shadow(0 0 40px rgba(139,92,246,0.6))', duration: 2, ease: 'expo.out' }
    )
    // Pulso de energía en el logo
    .to('[data-pl-logo]',
      { scale: 1.05, filter: 'drop-shadow(0 0 60px rgba(139,92,246,0.9))', duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 1 },
      '-=0.4'
    )
    // Contador sube
    .to(o, { v: 100, duration: 2.2, ease: 'power2.inOut', onUpdate: () => setProgress(Math.round(o.v)) }, 0.3)
    // Barra de progreso
    .fromTo('[data-pl-bar]', { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0.3)
    // Glitch final del texto
    .to('[data-pl-text]', { opacity: 0, duration: 0.1, repeat: 3, yoyo: true }, '-=0.5')
    // Salida: logo se desvanece hacia arriba
    .to('[data-pl-logo]', { y: -30, opacity: 0, filter: 'blur(12px)', duration: 0.8, ease: 'expo.in' }, '+=0.2')
    .to('[data-pl-meta]', { opacity: 0, y: 20, duration: 0.5 }, '<')
    // Cortina final
    .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.3')
    .add(onDone)

    return () => { tl.kill() }
  }, [onDone])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] grid place-items-center bg-ink overflow-hidden"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      role="status"
      aria-label="Cargando"
    >
      {/* Fondo de sinapsis neuronales */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      {/* Gradiente radial pulsante */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18),transparent_65%)] animate-pulse" />

      {/* Logo con efecto de materialización */}
      <img
        data-pl-logo
        src={SITE.logo.full}
        alt={SITE.name}
        className="relative w-[min(72vw,380px)] opacity-0 will-change-transform"
        decoding="async"
        fetchPriority="high"
      />

      {/* Meta inferior: texto + contador */}
      <div data-pl-meta className="absolute inset-x-4 bottom-10 mx-auto flex max-w-[1320px] items-end justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 sm:inset-x-12 sm:bottom-14">
        <span data-pl-text className="inline-block min-w-[10ch]">{loadingText}</span>
        <span className="font-display text-5xl font-light tracking-tight text-white sm:text-7xl tabular">
          {String(progress).padStart(3, '0')}
        </span>
      </div>

      {/* Barra de progreso con gradiente */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/5">
        <div data-pl-bar className="h-full origin-left bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
      </div>
    </div>
  )
}