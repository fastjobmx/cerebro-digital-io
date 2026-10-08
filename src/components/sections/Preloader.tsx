import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Node {
  x: number
  y: number
  tx: number // target position
  ty: number
  r: number
  c: string
  born: number
  connected: boolean
}

interface Edge {
  a: number
  b: number
  life: number // 0..1 animated progress
}

const BRAIN_PATH_POINTS = (w: number, h: number) => {
  const cx = w / 2
  const cy = h / 2
  const sx = Math.min(w, h) * 0.32
  const sy = Math.min(w, h) * 0.26
  const pts: [number, number][] = []
  // Left lobe outline
  for (let t = 0; t < Math.PI * 2; t += 0.22) {
    const r = 0.85 + 0.15 * Math.sin(t * 3)
    pts.push([cx - sx * 0.4 + Math.cos(t - 0.2) * sx * 0.55 * r, cy + Math.sin(t) * sy * 0.9 * r])
  }
  // Right lobe outline
  for (let t = 0; t < Math.PI * 2; t += 0.22) {
    const r = 0.85 + 0.15 * Math.cos(t * 3)
    pts.push([cx + sx * 0.4 + Math.cos(t + 0.2) * sx * 0.55 * r, cy + Math.sin(t) * sy * 0.9 * r])
  }
  // Central connectors
  for (let i = -3; i <= 3; i++) {
    pts.push([cx + i * sx * 0.06, cy + i * sy * 0.05])
  }
  // Scatter inner dots
  for (let i = 0; i < 28; i++) {
    const t = Math.random() * Math.PI * 2
    const r = Math.random()
    pts.push([cx + Math.cos(t) * sx * 0.5 * r, cy + Math.sin(t) * sy * 0.75 * r])
  }
  return pts
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const text1Ref = useRef<HTMLDivElement>(null)
  const text2Ref = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [skipped, setSkipped] = useState(false)
  const killedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    const reduced = REDUCED_MOTION
    const DURATION = reduced ? 900 : isMobile ? 2400 : 3400
    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Brain target points
    const targets = BRAIN_PATH_POINTS(width, height)

    const COLORS = [
      'rgba(123, 44, 255, 0.95)',
      'rgba(230, 0, 255, 0.9)',
      'rgba(0, 229, 255, 0.95)',
      'rgba(168, 85, 247, 0.9)',
      'rgba(255,255,255,0.9)',
    ]
    const nodeCount = isMobile ? 55 : 110
    const nodes: Node[] = []
    for (let i = 0; i < nodeCount; i++) {
      const t = targets[i % targets.length]
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        tx: t[0] + (Math.random() - 0.5) * 30,
        ty: t[1] + (Math.random() - 0.5) * 30,
        r: Math.random() * 1.8 + 1.2,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        born: Math.random(),
        connected: false,
      })
    }

    // Candidate edges (nearest neighbors per node)
    const edges: Edge[] = []
    const EDGES_PER = 2
    for (let i = 0; i < nodes.length; i++) {
      const dists: { i: number; d: number }[] = []
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue
        const dx = nodes[i].tx - nodes[j].tx
        const dy = nodes[i].ty - nodes[j].ty
        const d = dx * dx + dy * dy
        dists.push({ i: j, d })
      }
      dists.sort((a, b) => a.d - b.d)
      for (let k = 0; k < EDGES_PER; k++) {
        const b = dists[k].i
        if (!edges.find((e) => (e.a === i && e.b === b) || (e.a === b && e.b === i))) {
          edges.push({ a: i, b, life: 0 })
        }
      }
    }

    const start = performance.now()
    let raf = 0

    const draw = (now: number) => {
      if (killedRef.current) return
      const elapsed = now - start
      const phase = Math.min(1, elapsed / DURATION)
      // phase segments
      const p1 = Math.min(1, phase / 0.3) // nodes appear
      const p2 = Math.max(0, Math.min(1, (phase - 0.2) / 0.5)) // connect
      const p3 = Math.max(0, Math.min(1, (phase - 0.55) / 0.45)) // brain focus + glows

      ctx.clearRect(0, 0, width, height)

      // draw subtle radial background bloom
      const bg = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      )
      bg.addColorStop(0, `rgba(123, 44, 255, ${0.12 * p3})`)
      bg.addColorStop(0.4, `rgba(230, 0, 255, ${0.06 * p3})`)
      bg.addColorStop(1, 'rgba(7, 0, 20, 0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      // update & draw edges
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i]
        const startEdge = (i / edges.length) * 0.6 + 0.1
        e.life = Math.max(0, Math.min(1, (p2 - startEdge) / 0.6))
        if (e.life <= 0) continue
        const a = nodes[e.a]
        const b = nodes[e.b]
        const alpha = e.life * 0.6
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, a.c.replace(/[\d.]+\)/, `${alpha})`))
        grad.addColorStop(1, b.c.replace(/[\d.]+\)/, `${alpha})`))
        ctx.strokeStyle = grad
        ctx.lineWidth = 0.7 + e.life * 0.4
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()

        // pulse along edges once mature
        if (p3 > 0.3 && e.life > 0.8) {
          const pulse = (elapsed * 0.0006 + i * 0.3) % 1
          const px = a.x + (b.x - a.x) * pulse
          const py = a.y + (b.y - a.y) * pulse
          const pg = ctx.createRadialGradient(px, py, 0, px, py, 10)
          pg.addColorStop(0, 'rgba(0,229,255,0.9)')
          pg.addColorStop(1, 'rgba(0,229,255,0)')
          ctx.fillStyle = pg
          ctx.beginPath()
          ctx.arc(px, py, 10, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // update & draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const birth = Math.max(0, Math.min(1, p1 * 1.3 - n.born * 0.7))
        // chaotic movement -> target
        const chaosAmt = 1 - Math.min(1, phase * 1.4)
        const wander = Math.sin((elapsed + i * 137) * 0.0012) * 40 * chaosAmt
        const wander2 = Math.cos((elapsed + i * 241) * 0.0011) * 40 * chaosAmt
        const targetX = n.tx
        const targetY = n.ty
        // ease to target using eased phase
        const ease = 1 - Math.pow(1 - Math.min(1, phase * 1.1), 4)
        n.x = (n.x + (targetX + wander - n.x) * 0.12) * (1 - ease) + (targetX) * ease
        n.y = (n.y + (targetY + wander2 - n.y) * 0.12) * (1 - ease) + (targetY) * ease

        const show = birth * (n.connected ? 1 : 0.7 + 0.3 * p3)
        if (show <= 0.02) continue

        // glow
        const glowR = n.r * 9 * show
        const gg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        gg.addColorStop(0, n.c.replace(/[\d.]+\)/, `${0.55 * show})`))
        gg.addColorStop(1, n.c.replace(/[\d.]+\)/, `0)`))
        ctx.fillStyle = gg
        ctx.beginPath()
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = n.c.replace(/[\d.]+\)/, `${Math.min(1, 0.7 + show * 0.3)})`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * (0.8 + show * 0.6), 0, Math.PI * 2)
        ctx.fill()
      }

      // Central core glow
      if (p3 > 0.1) {
        const cr = (width + height) * 0.03 * p3
        const cg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, cr * 3)
        cg.addColorStop(0, `rgba(255,255,255,${0.9 * p3})`)
        cg.addColorStop(0.2, `rgba(230, 0, 255, ${0.5 * p3})`)
        cg.addColorStop(0.5, `rgba(123, 44, 255, ${0.25 * p3})`)
        cg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(width / 2, height / 2, cr * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      if (phase >= 1) {
        // Done animating in; wait a tiny bit then finish
        setTimeout(() => finish(), Math.max(200, 700 - elapsed + DURATION))
        return
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    // Text animations via GSAP
    const tl = gsap.timeline()
    const waitTitle = reduced ? 0.25 : isMobile ? 0.8 : 1.1
    tl.to(text1Ref.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: reduced ? 0.4 : 0.9,
      ease: 'power3.out',
      delay: waitTitle,
    })
      .to(text2Ref.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: reduced ? 0.3 : 0.7,
        ease: 'power3.out',
      })
      .to([text1Ref.current, text2Ref.current], {
        opacity: 0,
        y: -18,
        filter: 'blur(8px)',
        duration: reduced ? 0.3 : 0.6,
        ease: 'power2.in',
      }, `+=${reduced ? 0.2 : isMobile ? 0.4 : 0.7}`)

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      gsap.to(root, {
        opacity: 0,
        scale: 1.06,
        filter: 'blur(14px)',
        duration: reduced ? 0.35 : 0.7,
        ease: 'power3.inOut',
        onComplete: () => {
          if (!killedRef.current) onDone()
        },
      })
    }

    // Auto safety timeout in case of weirdness
    const safety = setTimeout(finish, DURATION + 3000)

    return () => {
      killedRef.current = true
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      window.removeEventListener('resize', resize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const skip = () => {
    setSkipped(true)
    onDone()
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center text-white"
      style={{ background: '#070014' }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando Cerebro Digital IO"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      {/* Gradient glow behind text */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-1/3 h-[40vh]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(123,44,255,0.25), transparent 60%)',
          filter: 'blur(10px)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col items-center text-center px-6 -mt-10 sm:mt-0">
        <div
          ref={text1Ref}
          className="opacity-0 translate-y-4 blur-sm font-display tracking-[0.25em] text-2xl sm:text-4xl md:text-5xl font-bold"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #FFFFFF 0%, #A855F7 45%, #00E5FF 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'blur(8px)',
          }}
        >
          CEREBRO DIGITAL IO
        </div>
        <div
          ref={text2Ref}
          className="opacity-0 translate-y-3 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/70 tracking-[0.35em] uppercase font-medium blur-sm"
          style={{ filter: 'blur(6px)' }}
        >
          Inteligencia que automatiza.
        </div>
      </div>

      {/* Skip link for accessibility + impatient users */}
      <button
        type="button"
        onClick={skip}
        className={`focus:outline-none fixed z-20 right-5 bottom-5 text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white border border-white/15 rounded-full px-4 py-2 backdrop-blur-sm transition-colors ${
          skipped ? 'opacity-0 pointer-events-none' : ''
        }`}
        aria-label="Omitir animación de carga"
      >
        Omitir →
      </button>
    </div>
  )
}
