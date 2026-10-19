// Generadores de formas para el sistema de partículas.
// Cada función llena un Float32Array (x,y,z) de longitud count*3.

type Rng = () => number

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randDir(r: Rng): [number, number, number] {
  const u = r() * 2 - 1
  const th = r() * Math.PI * 2
  const s = Math.sqrt(1 - u * u)
  return [s * Math.cos(th), u, s * Math.sin(th)]
}

/** Pliegues corticales: suma de ondas que simulan giros y surcos. */
function folds(x: number, y: number, z: number) {
  return (
    0.055 * Math.sin(9.0 * y + 6.0 * z + 1.3 * Math.sin(5.0 * x)) * Math.cos(7.0 * z - 4.0 * x) +
    0.03 * Math.sin(17.0 * z + 11.0 * y) * Math.sin(13.0 * x + 3.0 * y) +
    0.018 * Math.sin(29.0 * y - 23.0 * z)
  )
}

/**
 * Cerebro: dos hemisferios con cisura longitudinal, lóbulos temporales,
 * cerebelo y tronco. Devuelve posiciones y brillo por partícula.
 */
export function brain(count: number, seed = 7) {
  const r = mulberry32(seed)
  const pos = new Float32Array(count * 3)
  const bright = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const pick = r()
    let x = 0
    let y = 0
    let z = 0
    let b = 1
    if (pick < 0.86) {
      // Hemisferios
      const s = r() < 0.5 ? -1 : 1
      const [dx, dy, dz] = randDir(r)
      const surface = r() < 0.9
      const rr = surface ? 0.985 + r() * 0.03 : Math.pow(r(), 0.6) * 0.92
      const rx = 0.6
      const ry = 0.82
      const rz = 1.26
      const fv = folds(dx * 1.1, dy, dz + s * 0.3) * 1.35
      const f = 1 + fv
      x = s * 0.54 + dx * rx * rr * f
      y = dy * ry * rr * f
      z = dz * rz * rr * f
      // Cara medial plana: cisura longitudinal estrecha
      if (x * s < 0.035) x = s * (0.035 + r() * 0.012)
      // Base aplanada
      if (y < -0.28) y = -0.28 + (y + 0.28) * 0.55
      // Lóbulo temporal
      if (dy < 0.05 && dz > -0.2 && dz < 0.75) {
        const k = Math.max(0, 0.05 - dy) * Math.max(0, 1 - Math.abs(dz - 0.25) / 0.5)
        x += s * k * 0.55
        y -= k * 0.35
      }
      // Frente un poco más estrecha
      if (z > 0.6) x *= 1 - (z - 0.6) * 0.18
      // Leve caída de la parte superior
      y += 0.06 * Math.cos(z * 1.4)
      // Giros (crestas) más brillantes que los surcos: revela la textura cortical
      const ridge = Math.min(1, Math.max(0, (fv + 0.05) / 0.13))
      b = surface ? 0.3 + ridge * 1.05 + r() * 0.15 : 0.22 + r() * 0.18
    } else if (pick < 0.96) {
      // Cerebelo
      const [dx, dy, dz] = randDir(r)
      const rr = 0.95 + r() * 0.06
      const stripes = 1 + 0.05 * Math.sin(dy * 34)
      x = dx * 0.78 * rr * stripes
      y = -0.6 + dy * 0.34 * rr
      z = -0.88 + dz * 0.48 * rr * stripes
      b = 0.7 + r() * 0.3
    } else {
      // Tronco encefálico
      const t = r()
      const a = r() * Math.PI * 2
      const rad = 0.16 * (1 - t * 0.3) * Math.sqrt(r())
      x = Math.cos(a) * rad
      y = -0.45 - t * 0.85
      z = -0.32 - t * 0.25 + Math.sin(a) * rad
      b = 0.55 + r() * 0.3
    }
    pos[i * 3] = x
    pos[i * 3 + 1] = y + 0.12
    pos[i * 3 + 2] = z
    bright[i] = b
  }
  return { pos, bright }
}

/** Caos: datos dispersos por todo el encuadre. */
export function chaos(count: number, seed = 11) {
  const r = mulberry32(seed)
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const cluster = r() < 0.35
    if (cluster) {
      // pequeñas islas de datos
      const cx = Math.floor(r() * 9)
      const rr = mulberry32(cx * 97 + 3)
      const ox = (rr() - 0.5) * 9
      const oy = (rr() - 0.5) * 4.6
      const oz = (rr() - 0.5) * 3
      const [dx, dy, dz] = randDir(r)
      const k = Math.pow(r(), 0.5) * 0.45
      pos[i * 3] = ox + dx * k
      pos[i * 3 + 1] = oy + dy * k
      pos[i * 3 + 2] = oz + dz * k
    } else {
      pos[i * 3] = (r() - 0.5) * 11
      pos[i * 3 + 1] = (r() - 0.5) * 6
      pos[i * 3 + 2] = (r() - 0.5) * 5
    }
  }
  return pos
}

/** Constelación: N herramientas en órbita conectadas a un núcleo. */
export function constellation(count: number, nodes = 8, seed = 23) {
  const r = mulberry32(seed)
  const pos = new Float32Array(count * 3)
  const R = 2.25
  for (let i = 0; i < count; i++) {
    const pick = r()
    const n = Math.floor(r() * nodes)
    const a = (n / nodes) * Math.PI * 2 + Math.PI / 2
    const nx = Math.cos(a) * R * 1.25
    const ny = Math.sin(a) * R * 0.78
    const nz = Math.sin(a * 2) * 0.35
    let x: number, y: number, z: number
    if (pick < 0.42) {
      const [dx, dy, dz] = randDir(r)
      const k = 0.2 + r() * 0.06
      x = nx + dx * k
      y = ny + dy * k
      z = nz + dz * k
    } else if (pick < 0.7) {
      const [dx, dy, dz] = randDir(r)
      const k = r() < 0.75 ? 0.62 + r() * 0.04 : Math.pow(r(), 0.5) * 0.6
      x = dx * k
      y = dy * k
      z = dz * k
    } else {
      // Flujo entre nodo y núcleo
      const t = r()
      const jitter = 0.035
      x = nx * (0.28 + t * 0.68) + (r() - 0.5) * jitter
      y = ny * (0.28 + t * 0.68) + (r() - 0.5) * jitter
      z = nz * t + (r() - 0.5) * jitter
    }
    pos[i * 3] = x
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = z
  }
  return pos
}

/** Esfera de Fibonacci con anillos de latitud. */
export function globe(count: number, seed = 31) {
  const r = mulberry32(seed)
  const pos = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  const shell = Math.floor(count * 0.72)
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number
    if (i < shell) {
      const yy = 1 - (i / (shell - 1)) * 2
      const rad = Math.sqrt(1 - yy * yy)
      const th = golden * i
      x = Math.cos(th) * rad
      y = yy
      z = Math.sin(th) * rad
      const R = 1.75
      x *= R
      y *= R
      z *= R
    } else {
      // Anillos orbitales
      const ring = Math.floor(r() * 3)
      const a = r() * Math.PI * 2
      const R = 2.25 + ring * 0.32
      const tilt = [0.35, -0.5, 1.1][ring]
      const cx = Math.cos(a) * R
      const cz = Math.sin(a) * R
      x = cx
      y = cz * Math.sin(tilt) + (r() - 0.5) * 0.02
      z = cz * Math.cos(tilt)
    }
    pos[i * 3] = x
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = z
  }
  return pos
}

/** Malla ondulada: terreno de datos para el proceso. */
export function wave(count: number) {
  const pos = new Float32Array(count * 3)
  const side = Math.ceil(Math.sqrt(count))
  for (let i = 0; i < count; i++) {
    const gx = i % side
    const gz = Math.floor(i / side)
    const x = (gx / (side - 1) - 0.5) * 12
    const z = (gz / (side - 1) - 0.5) * 9
    pos[i * 3] = x
    pos[i * 3 + 1] = -1.3
    pos[i * 3 + 2] = z - 1
  }
  return pos
}

/** Pares de partículas cercanas en el cerebro para dibujar sinapsis. */
export function synapses(pos: Float32Array, bright: Float32Array, maxPairs: number, seed = 5) {
  const r = mulberry32(seed)
  const count = pos.length / 3
  const sample: number[] = []
  for (let i = 0; i < count && sample.length < 1400; i += 1) {
    if (bright[i] > 0.9 && r() < 0.25) sample.push(i)
  }
  const out: number[] = []
  for (let a = 0; a < sample.length && out.length / 6 < maxPairs; a++) {
    const i = sample[a]
    let links = 0
    for (let b = a + 1; b < sample.length && links < 3; b++) {
      const j = sample[b]
      const dx = pos[i * 3] - pos[j * 3]
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
      const d = dx * dx + dy * dy + dz * dz
      if (d < 0.05 && d > 0.004) {
        out.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2])
        links++
      }
    }
  }
  return new Float32Array(out)
}
