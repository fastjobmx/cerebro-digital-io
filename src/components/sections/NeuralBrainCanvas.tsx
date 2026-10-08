import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  baseX: number
  baseY: number
  radius: number
  color: string
  pulse: number
}

interface Pulse {
  path: { x: number; y: number }[]
  progress: number
  speed: number
  color: string
}

export function NeuralBrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Build brain shape particles - 2 lobes + central stem
    const particles: Particle[] = []
    const COLORS = [
      'rgba(123, 44, 255, 0.95)',
      'rgba(230, 0, 255, 0.9)',
      'rgba(0, 229, 255, 0.95)',
      'rgba(168, 85, 247, 0.85)',
      'rgba(255, 255, 255, 0.8)',
    ]

    const totalParticles = window.innerWidth < 768 ? 90 : 180
    const cx = () => width / 2
    const cy = () => height / 2
    const scale = () => Math.min(width, height) * 0.32

    for (let i = 0; i < totalParticles; i++) {
      // Distribute: 40% left lobe, 40% right lobe, 20% central/core
      const r = Math.random()
      let lobeX = 0
      let lobeY = 0
      let lobeRadius = 1

      if (r < 0.4) {
        // Left lobe (shifted -x)
        const angle = Math.random() * Math.PI * 2
        const rad = Math.pow(Math.random(), 0.65)
        lobeX = -0.45 + Math.cos(angle) * rad * 0.55
        lobeY = Math.sin(angle) * rad * 0.48
        lobeRadius = 1 - rad * 0.4
      } else if (r < 0.8) {
        // Right lobe
        const angle = Math.random() * Math.PI * 2
        const rad = Math.pow(Math.random(), 0.65)
        lobeX = 0.45 + Math.cos(angle) * rad * 0.55
        lobeY = Math.sin(angle) * rad * 0.48
        lobeRadius = 1 - rad * 0.4
      } else {
        // Central core and connectors
        const angle = Math.random() * Math.PI * 2
        const rad = Math.random() * 0.35
        lobeX = Math.cos(angle) * rad * 0.6
        lobeY = Math.sin(angle) * rad * 0.9
        lobeRadius = 1.2
      }

      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      particles.push({
        x: lobeX,
        y: lobeY,
        z: Math.random() * 2 - 1,
        baseX: lobeX,
        baseY: lobeY,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: (Math.random() * 2 + 1.2) * lobeRadius,
        color,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    // Pulsing connection trails
    const pulses: Pulse[] = []
    const spawnPulse = () => {
      const a = particles[Math.floor(Math.random() * particles.length)]
      // find nearest neighbor
      let bestB = particles[0]
      let bestD = Infinity
      for (let i = 0; i < 10; i++) {
        const cand = particles[Math.floor(Math.random() * particles.length)]
        const dx = cand.baseX - a.baseX
        const dy = cand.baseY - a.baseY
        const d = dx * dx + dy * dy
        if (d < bestD && d > 0.001) {
          bestD = d
          bestB = cand
        }
      }
      const path: { x: number; y: number }[] = []
      const steps = 18
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const wob = Math.sin(t * Math.PI) * 0.04
        const midX = (a.baseX + bestB.baseX) / 2 + (Math.random() - 0.5) * 0.04
        const midY = (a.baseY + bestB.baseY) / 2 + (Math.random() - 0.5) * 0.04
        const x = (1 - t) * (1 - t) * a.baseX + 2 * (1 - t) * t * midX + t * t * bestB.baseX
        const y = (1 - t) * (1 - t) * a.baseY + 2 * (1 - t) * t * midY + t * t * bestB.baseY + wob
        path.push({ x, y })
      }
      pulses.push({
        path,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: [COLORS[0], COLORS[1], COLORS[2]][Math.floor(Math.random() * 3)],
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / width - 0.5) * 2
      mouseRef.current.y = (e.clientY / height - 0.5) * 2
      mouseRef.current.active = true
    }
    const onMouseLeave = () => {
      mouseRef.current.active = false
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.x = (e.touches[0].clientX / width - 0.5) * 2
        mouseRef.current.y = (e.touches[0].clientY / height - 0.5) * 2
        mouseRef.current.active = true
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', () => (mouseRef.current.active = false))

    let pulseSpawnTimer = 0

    const draw = (t: number) => {
      const time = t * 0.001
      ctx.clearRect(0, 0, width, height)

      const centerX = cx()
      const centerY = cy()
      const s = scale()
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Outer halo rings
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const r = s * (0.9 + i * 0.22) + Math.sin(time + i) * 6
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
        ctx.strokeStyle = i === 0
          ? 'rgba(168, 85, 247, 0.08)'
          : i === 1
            ? 'rgba(230, 0, 255, 0.06)'
            : 'rgba(0, 229, 255, 0.05)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Compute screen positions
      const positions: { x: number; y: number; z: number; r: number; c: string }[] = []
      const mousePush = mouseRef.current.active ? 1 : 0
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.pulse += 0.02 + Math.sin(time + i) * 0.001

        // gentle breathing
        const breath = 1 + Math.sin(time * 0.8 + i * 0.03) * 0.025

        // Mouse attraction (subtle)
        const mDistX = p.baseX - mx * 0.5
        const mDistY = p.baseY - my * 0.5
        const mDist = Math.sqrt(mDistX * mDistX + mDistY * mDistY)
        const mouseInfluence = Math.max(0, 1 - mDist * 1.8) * mousePush

        // Offset particles slightly toward mouse (pull)
        const ox = p.baseX * breath + mx * 0.08 * mouseInfluence * 0.5 - mDistX * mouseInfluence * 0.05
        const oy = p.baseY * breath + my * 0.08 * mouseInfluence * 0.5 - mDistY * mouseInfluence * 0.05

        // 3D rotation around center based on mouse
        const rotY = mx * 0.25
        const rotX = -my * 0.18
        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)

        let x3d = ox * cosY - p.z * sinY
        let z3d = ox * sinY + p.z * cosY
        let y3d = oy * cosX - z3d * sinX
        z3d = oy * sinX + z3d * cosX

        const persp = 2 / (2 - z3d * 0.6)
        const sx = centerX + x3d * s * persp
        const sy = centerY + y3d * s * persp
        const sr = p.radius * persp * (0.8 + 0.3 * Math.sin(p.pulse))
        positions.push({ x: sx, y: sy, z: z3d, r: sr, c: p.color })
      }

      // Draw connections between nearby particles
      ctx.lineWidth = 0.6
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i]
          const b = positions[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxD = s * 0.28
          if (dist < maxD) {
            const alpha = (1 - dist / maxD) * 0.35
            // color gradient between nodes
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, a.c.replace(/[\d.]+\)/, `${alpha})`))
            grad.addColorStop(1, b.c.replace(/[\d.]+\)/, `${alpha})`))
            ctx.strokeStyle = grad
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Draw particles with glow
      for (let i = 0; i < positions.length; i++) {
        const p = positions[i]
        // outer glow
        const glowR = p.r * 6
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        glowGrad.addColorStop(0, p.c.replace(/[\d.]+\)/, '0.4)'))
        glowGrad.addColorStop(1, p.c.replace(/[\d.]+\)/, '0)'))
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fill()

        // core
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Central bright core
      const coreR = s * 0.08 + Math.sin(time * 2) * 4
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreR * 3)
      coreGrad.addColorStop(0, 'rgba(255,255,255,0.95)')
      coreGrad.addColorStop(0.2, 'rgba(230, 0, 255, 0.7)')
      coreGrad.addColorStop(0.5, 'rgba(123, 44, 255, 0.25)')
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreR * 3, 0, Math.PI * 2)
      ctx.fill()

      // Manage and draw pulses along paths
      pulseSpawnTimer++
      const spawnEvery = window.innerWidth < 768 ? 60 : 35
      if (pulseSpawnTimer > spawnEvery) {
        pulseSpawnTimer = 0
        spawnPulse()
        if (Math.random() > 0.5) spawnPulse()
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i]
        pu.progress += pu.speed
        if (pu.progress >= 1) {
          pulses.splice(i, 1)
          continue
        }
        const idx = Math.floor(pu.progress * (pu.path.length - 1))
        const point = pu.path[idx]
        // project to screen
        const rotY = mx * 0.25
        const rotX = -my * 0.18
        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)
        let x3d = point.x * cosY
        let y3d = point.y * cosX
        const persp = 2 / 2
        const sx = centerX + x3d * s * persp
        const sy = centerY + y3d * s * persp

        // draw trailing pulse
        const trailLen = 4
        for (let k = 0; k < trailLen && idx - k >= 0; k++) {
          const tp = pu.path[idx - k]
          const tx = centerX + tp.x * cosY * s
          const ty = centerY + tp.y * cosX * s
          const a = (1 - k / trailLen) * 0.7 * (1 - Math.abs(0.5 - pu.progress) * 1.2)
          if (a <= 0) continue
          const pr = (trailLen - k) * 1.6
          const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, pr * 3)
          g.addColorStop(0, pu.color.replace(/[\d.]+\)/, `${a})`))
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(tx, ty, pr * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Orbiting lines (circuit-like)
      for (let i = 0; i < 2; i++) {
        const angle = time * 0.4 + i * Math.PI
        const orbitR = s * (0.7 + i * 0.15)
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, orbitR, orbitR * 0.4, mx * 0.2, angle, angle + Math.PI * 1.4)
        const og = ctx.createLinearGradient(centerX - orbitR, 0, centerX + orbitR, 0)
        og.addColorStop(0, 'rgba(123,44,255,0)')
        og.addColorStop(0.5, i === 0 ? 'rgba(230,0,255,0.35)' : 'rgba(0,229,255,0.35)')
        og.addColorStop(1, 'rgba(0,229,255,0)')
        ctx.strokeStyle = og
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
