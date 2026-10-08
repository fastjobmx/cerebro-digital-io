import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Reveal } from '../Motion'

gsap.registerPlugin(ScrollTrigger)

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Stage = {
  key: string
  title: string
  subtitle: string
  tag: string
}

const STAGES: Stage[] = [
  { key: 'caos', title: 'CAOS', subtitle: 'Su negocio tiene información, pero está dispersa.', tag: '01' },
  { key: 'datos', title: 'DATOS', subtitle: 'Conectamos cada fuente en un solo sistema.', tag: '02' },
  { key: 'conexion', title: 'CONEXIÓN', subtitle: 'Las piezas comienzan a hablar entre sí.', tag: '03' },
  { key: 'inteligencia', title: 'INTELIGENCIA', subtitle: 'El Cerebro entiende el contexto de su empresa.', tag: '04' },
  { key: 'automatizacion', title: 'AUTOMATIZACIÓN', subtitle: 'Ejecuta acciones autorizadas sin intervención.', tag: '05' },
  { key: 'resultado', title: 'RESULTADO', subtitle: 'Procesos ordenados. Decisiones más rápidas.', tag: '06' },
  { key: 'crecimiento', title: 'CRECIMIENTO', subtitle: 'Su negocio evoluciona en un solo sistema vivo.', tag: '07' },
]

export function ScrollNarrative() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    const NODE_COUNT = isMobile ? 120 : 260
    const CONNECT_TARGET = Math.floor(NODE_COUNT * 2.4)
    const WIDTH = () => canvas.clientWidth
    const HEIGHT = () => canvas.clientHeight
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const w = WIDTH()
      const h = HEIGHT()
      canvas.width = w * DPR
      canvas.height = h * DPR
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      // regenerate base positions after resize to keep a coherent brain center
      const cx = w / 2
      const cy = h / 2
      const s = Math.min(w, h) * (isMobile ? 0.38 : 0.34)
      nodes.forEach((n, i) => {
        const t = targets[i % targets.length]
        n.tx = cx + t[0] * s
        n.ty = cy + t[1] * s * 0.9
        n.startX = n.startX // keep start random (already set)
      })
    }

    // Target points forming a brain silhouette + inner field
    const targets: [number, number][] = []
    const addLobe = (offset: number, dir: number) => {
      for (let i = 0; i < 70; i++) {
        const t = (i / 70) * Math.PI * 2
        const wobble = 0.88 + 0.12 * Math.sin(t * 3 + offset)
        targets.push([
          dir * 0.42 + Math.cos(t + (dir < 0 ? -0.2 : 0.2)) * 0.56 * wobble,
          Math.sin(t) * 0.92 * wobble,
        ])
      }
    }
    addLobe(0, -1)
    addLobe(1.2, 1)
    for (let i = -4; i <= 4; i++) targets.push([i * 0.06, i * 0.05])
    for (let i = 0; i < 70; i++) {
      const t = Math.random() * Math.PI * 2
      const r = Math.random()
      targets.push([Math.cos(t) * 0.5 * r, Math.sin(t) * 0.75 * r])
    }

    type N = {
      x: number
      y: number
      startX: number
      startY: number
      tx: number
      ty: number
      r: number
      c: string
      phase: number
    }

    const COLORS = [
      'rgba(123,44,255,0.95)',
      'rgba(168,85,247,0.9)',
      'rgba(230,0,255,0.9)',
      'rgba(0,229,255,0.95)',
      'rgba(255,255,255,0.85)',
    ]

    const nodes: N[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const w0 = window.innerWidth
      const h0 = window.innerHeight
      return {
        x: Math.random() * w0,
        y: Math.random() * h0,
        startX: Math.random() * w0,
        startY: Math.random() * h0,
        tx: 0,
        ty: 0,
        r: 1 + Math.random() * 1.8,
        c: COLORS[i % COLORS.length],
        phase: Math.random() * Math.PI * 2,
      }
    })

    // Pre-compute edge candidates (closest 2 per node)
    const edgeCandidates: [number, number][] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      const dists: { i: number; d: number }[] = []
      for (let j = 0; j < NODE_COUNT; j++) {
        if (i === j) continue
        const a = targets[i % targets.length]
        const b = targets[j % targets.length]
        const dx = a[0] - b[0]
        const dy = a[1] - b[1]
        dists.push({ i: j, d: dx * dx + dy * dy })
      }
      dists.sort((a, b) => a.d - b.d)
      for (let k = 0; k < 2; k++) {
        const pair: [number, number] = [i, dists[k].i]
        pair.sort((a, b) => a - b)
        if (!edgeCandidates.find((c) => c[0] === pair[0] && c[1] === pair[1])) {
          edgeCandidates.push(pair)
        }
      }
    }

    resize()
    window.addEventListener('resize', resize)

    // Pulses along edges (representan INFORMACIÓN)
    type Pulse = { edgeIdx: number; t: number; speed: number; color: string }
    const pulses: Pulse[] = []

    let progress = 0 // 0..1 driven by ScrollTrigger
    let raf = 0
    const DRAW_EVERY = isMobile ? 16 : 10 // throttle on mobile
    let lastFrame = performance.now()

    const easeCubic = (t: number) => t * t * (3 - 2 * t)

    const draw = (now: number) => {
      const delta = now - lastFrame
      if (delta < DRAW_EVERY) {
        raf = requestAnimationFrame(draw)
        return
      }
      lastFrame = now

      const w = WIDTH()
      const h = HEIGHT()
      ctx.clearRect(0, 0, w, h)

      // Background gradients based on stage
      const p = progress
      const stageIdx = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length))
      const stage = STAGES[stageIdx]
      // Stage-based accent mix
      const stageHue = {
        caos: [90, 0, 0],
        datos: [260, 280, 190],
        conexion: [280, 190, 200],
        inteligencia: [260, 200, 230],
        automatizacion: [280, 300, 190],
        resultado: [200, 190, 260],
        crecimiento: [180, 280, 200],
      }[stage.key] as [number, number, number]
      const bg1 = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.8)
      bg1.addColorStop(0, `hsla(${stageHue[0]}, 100%, 60%, ${0.08 + p * 0.08})`)
      bg1.addColorStop(0.5, `hsla(${stageHue[1]}, 100%, 50%, ${0.04 + p * 0.05})`)
      bg1.addColorStop(1, 'rgba(7, 0, 20, 0)')
      ctx.fillStyle = bg1
      ctx.fillRect(0, 0, w, h)

      // Thin grid overlay appears progressively
      if (p > 0.2) {
        const a = (p - 0.2) * 0.8
        ctx.strokeStyle = `rgba(168,85,247,${0.03 * a})`
        ctx.lineWidth = 1
        const step = 60
        for (let x = 0; x < w; x += step) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, h)
          ctx.stroke()
        }
        for (let y = 0; y < h; y += step) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
          ctx.stroke()
        }
      }

      // 0..1 sub-progress per logical stage
      const s0 = Math.min(1, p * (STAGES.length / 1)) // caos→datos (first 1/7th approx)
      const connect = easeCubic(Math.max(0, Math.min(1, (p - 0.10) / 0.22))) // conexion
      const shapeForm = easeCubic(Math.max(0, Math.min(1, (p - 0.25) / 0.28))) // inteligencia - brain shape
      const receiveInfo = Math.max(0, Math.min(1, (p - 0.5) / 0.18)) // automatizacion
      const automate = Math.max(0, Math.min(1, (p - 0.65) / 0.2)) // pulsing
      const resultOrder = Math.max(0, Math.min(1, (p - 0.82) / 0.18)) // resultado/crecimiento - clean structured

      // Update positions: start random → brain shape
      const wnow = WIDTH()
      const hnow = HEIGHT()
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        // Chaos jitter (prevents static feel on very reduced motion)
        const jitterAmt = (1 - shapeForm) * 0.9 + 0.15
        const tt = now * 0.0007 + n.phase
        const jx = Math.sin(tt * 1.7 + i * 0.3) * jitterAmt * (isMobile ? 14 : 28)
        const jy = Math.cos(tt * 1.3 + i * 0.2) * jitterAmt * (isMobile ? 12 : 22)

        // Start random → progressively brain shape, then slight breathing
        const shape = easeCubic(shapeForm)
        const toX = n.tx + Math.sin(now * 0.0006 + i) * (shape * 6)
        const toY = n.ty + Math.cos(now * 0.0006 + i) * (shape * 6)
        const fromX = (n.startX % wnow + wnow) % wnow
        const fromY = (n.startY % hnow + hnow) % hnow
        n.x = fromX + (toX - fromX) * shape + jx
        n.y = fromY + (toY - fromY) * shape + jy
      }

      // Data streams flying into center (representa INPUT → inteligencia)
      if (receiveInfo > 0.02) {
        const streams = isMobile ? 6 : 14
        for (let s = 0; s < streams; s++) {
          const t = ((now * 0.0005 + s / streams) % 1) * (1 + receiveInfo * 0.5)
          const angle = s * ((Math.PI * 2) / streams) + now * 0.0001
          const outer = Math.max(wnow, hnow) * 0.55
          const inner = Math.min(wnow, hnow) * 0.08
          const r = outer * (1 - t) + inner * t
          const x = w / 2 + Math.cos(angle) * r
          const y = h / 2 + Math.sin(angle) * r
          const alpha = receiveInfo * (1 - Math.abs(0.5 - t) * 1.7)
          if (alpha <= 0) continue
          const g = ctx.createRadialGradient(x, y, 0, x, y, 22)
          g.addColorStop(0, `rgba(0,229,255,${alpha * 0.9})`)
          g.addColorStop(1, `rgba(0,229,255,0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, 22, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = `rgba(255,255,255,${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw edges progressively based on connect
      const totalEdges = edgeCandidates.length
      const edgesToShow = Math.min(totalEdges, Math.floor(connect * totalEdges))
      const orderedCount = Math.floor(resultOrder * totalEdges)
      const linesPulse = automate

      // Draw output pulses to corners (OUTPUT) — automatización
      if (automate > 0.02) {
        const outs = isMobile ? 4 : 8
        const corners = [
          [w * 0.1, h * 0.15],
          [w * 0.9, h * 0.15],
          [w * 0.08, h * 0.85],
          [w * 0.92, h * 0.85],
          [w * 0.5, h * 0.05],
          [w * 0.5, h * 0.95],
          [w * 0.15, h * 0.5],
          [w * 0.85, h * 0.5],
        ]
        for (let s = 0; s < outs; s++) {
          const corner = corners[s % corners.length]
          const t = ((now * 0.0004 + s / outs) % 1)
          const cx = w / 2 + (corner[0] - w / 2) * t
          const cy = h / 2 + (corner[1] - h / 2) * t
          const alpha = automate * (t > 0.05 && t < 0.95 ? 1 : 0) * (1 - Math.abs(0.5 - t) * 1.2)
          if (alpha <= 0) continue
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18)
          g.addColorStop(0, `rgba(230,0,255,${alpha * 0.9})`)
          g.addColorStop(1, `rgba(230,0,255,0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(cx, cy, 18, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Spawn pulses on edges when mature enough
      if (connect > 0.5 && !REDUCED_MOTION) {
        const spawnRate = isMobile ? 0.02 : 0.06
        if (Math.random() < spawnRate * (0.6 + linesPulse * 1.4) && pulses.length < (isMobile ? 30 : 90)) {
          const maxIdx = Math.max(2, edgesToShow)
          const eIdx = Math.floor(Math.random() * maxIdx)
          pulses.push({
            edgeIdx: eIdx,
            t: 0,
            speed: 0.004 + Math.random() * 0.01,
            color: ['rgba(0,229,255,0.9)', 'rgba(230,0,255,0.85)', 'rgba(255,255,255,0.9)'][
              Math.floor(Math.random() * 3)
            ],
          })
        }
      }

      // Draw line edges
      for (let i = 0; i < edgesToShow; i++) {
        const [ai, bi] = edgeCandidates[i]
        const a = nodes[ai]
        const b = nodes[bi]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxD = Math.min(w, h) * (isMobile ? 0.38 : 0.32)
        if (dist > maxD && resultOrder < 0.2) continue
        const mature = i < orderedCount
        const baseAlpha =
          mature
            ? 0.55 + linesPulse * 0.15
            : 0.22 + 0.25 * (1 - dist / maxD)
        const alpha = baseAlpha * (REDUCED_MOTION ? 0.9 : 1)
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, a.c.replace(/[\d.]+\)/, `${alpha})`))
        grad.addColorStop(1, b.c.replace(/[\d.]+\)/, `${alpha})`))
        ctx.strokeStyle = grad
        ctx.lineWidth = 0.5 + (mature ? 0.35 : 0) + (linesPulse ? 0.15 : 0)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // Draw pulses on edges
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i]
        if (pu.edgeIdx >= edgesToShow) {
          pulses.splice(i, 1)
          continue
        }
        pu.t += pu.speed
        if (pu.t > 1) {
          pulses.splice(i, 1)
          continue
        }
        const [ai, bi] = edgeCandidates[pu.edgeIdx]
        const a = nodes[ai]
        const b = nodes[bi]
        const x = a.x + (b.x - a.x) * pu.t
        const y = a.y + (b.y - a.y) * pu.t
        const pr = (1 - Math.abs(0.5 - pu.t) * 1.3) * 5
        if (pr <= 0) continue
        const g = ctx.createRadialGradient(x, y, 0, x, y, pr * 3)
        g.addColorStop(0, pu.color)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, pr * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw nodes with glow
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const appear = Math.min(1, s0 * 1.8 + 0.2)
        // pulsing node size with automate
        const life = 0.85 + Math.sin(now * 0.003 + n.phase) * 0.15 + automate * 0.2
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 9 * life)
        glow.addColorStop(0, n.c.replace(/[\d.]+\)/, `${0.6 * appear})`))
        glow.addColorStop(1, n.c.replace(/[\d.]+\)/, `0)`))
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 9 * life, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = n.c.replace(/[\d.]+\)/, `${Math.min(1, 0.7 + appear * 0.3)})`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * life, 0, Math.PI * 2)
        ctx.fill()
      }

      // Central core halo grows with inteligencia+
      const coreAmt = Math.max(receiveInfo, automate, resultOrder)
      if (coreAmt > 0.05) {
        const cr = Math.min(w, h) * (0.05 + coreAmt * 0.05)
        const cg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, cr * 3.2)
        cg.addColorStop(0, `rgba(255,255,255,${0.9 * coreAmt})`)
        cg.addColorStop(0.15, `rgba(0,229,255,${0.5 * coreAmt})`)
        cg.addColorStop(0.5, `rgba(123,44,255,${0.25 * coreAmt})`)
        cg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, cr * 3.2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Outer order rings (resultado / crecimiento)
      if (resultOrder > 0.1) {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          const rr = Math.min(w, h) * (0.42 + i * 0.1) * (0.9 + resultOrder * 0.1)
          ctx.ellipse(w / 2, h / 2, rr, rr * 0.55, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(168,85,247,${0.18 * resultOrder})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    // Pin + progress driver
    const ctxG = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobile ? 1 : 0.6,
        anticipatePin: 1,
        pin: true,
        onUpdate: (self) => {
          progress = self.progress
        },
      })
    }, root)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ctxG.revert()
    }
  }, [])

  return (
    <section id="cerebro" className="relative w-full" aria-label="Cómo nace el Cerebro Digital">
      <div
        ref={rootRef}
        className="relative w-full"
        style={{ height: `${STAGES.length * 110}svh` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-deep-space-2 to-deep-space" />

        {/* Canvas pinneado */}
        <div className="sticky top-0 h-[100svh] w-full">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

          {/* Vignette para legibilidad */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-space/50 via-transparent to-deep-space/60" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep-space/60 via-transparent to-deep-space/60" />

          {/* Stages text panels */}
          <div
            ref={panelsRef}
            className="relative h-full w-full container-x flex flex-col justify-between py-28 sm:py-32 md:py-24"
          >
            {/* Header fijo narrativo */}
            <div className="relative z-10 max-w-3xl">
              <Reveal immediate>
                <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-white/50 mb-5">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-electric-purple/60" />
                  La experiencia de un sistema vivo
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
                  <span className="block text-white/90">CÓMO NACE UN</span>
                  <span className="block text-gradient mt-1">CEREBRO DIGITAL.</span>
                </h2>
                <p className="mt-5 text-white/65 text-base sm:text-lg max-w-2xl">
                  Recorra la historia: de la información dispersa a un sistema inteligente que ejecuta lo que usted decide.
                </p>
              </Reveal>
            </div>

            {/* Stage labels center-right (they appear/disappear via scroll) */}
            <div className="relative z-10 flex flex-col gap-2 sm:gap-3 self-end w-full sm:w-2/3 md:w-1/2">
              {STAGES.map((st, i) => (
                <StagePanel key={st.key} stage={st} index={i} total={STAGES.length} />
              ))}
            </div>

            {/* Progress indicator left */}
            <div className="pointer-events-none absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 text-[10px] font-mono tracking-[0.25em] text-white/35">
              {STAGES.map((s, i) => (
                <div
                  key={s.key}
                  className="stage-indicator group/ind flex items-center gap-3"
                  data-stage={i}
                >
                  <span className="opacity-70">{s.tag}</span>
                  <span className="h-px w-5 bg-white/20" />
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
              ))}
            </div>

            {/* Scroll hint bottom */}
            <div className="pointer-events-none relative z-10 mt-6 flex items-center justify-center gap-3 text-white/40 text-[10px] tracking-[0.35em] uppercase">
              <span className="h-px w-10 bg-white/20" />
              Continúe desplazándose
              <span className="h-px w-10 bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StagePanel({
  stage,
  index,
  total,
}: {
  stage: Stage
  index: number
  total: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (REDUCED_MOTION) {
      el.style.opacity = (index === 0 ? 1 : 0.5).toString()
      return
    }
    const start = `${(index / total) * 100 - 8}%`
    const end = `${(index / total) * 100 + 20}%`
    const endOut = `${(index / total) * 100 + 40}%`

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.getElementById('cerebro') || el,
        start: `top top+=${start}`,
        end: `top top+=${endOut}`,
        scrub: 0.4,
        onUpdate: (self) => {
          const local = Math.max(0, Math.min(1, (self.progress - (index / total)) * total))
          const show = Math.max(0, Math.min(1, 1 - Math.abs(local - 0.18) * 1.6))
          gsap.set(el, {
            opacity: 0.15 + show * 0.85,
            y: 16 * (1 - show),
            filter: `blur(${(1 - show) * 10}px)`,
            scale: 0.98 + show * 0.04,
          })
        },
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total])

  return (
    <div
      ref={ref}
      className="glass-light border border-white/5 rounded-2xl p-5 sm:p-6 md:p-7 backdrop-blur-md shadow-[0_10px_50px_-20px_rgba(123,44,255,0.5)]"
      data-reveal-item
    >
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-electric-cyan/80 mt-1">
          {stage.tag}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-gradient">
              {stage.title}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-electric-purple/40 via-neon-magenta/20 to-transparent" />
          </div>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed">
            {stage.subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
