import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { brain, chaos, constellation, globe, wave, synapses } from './shapes'

/**
 * Escena WebGL persistente detrás de toda la página.
 * Un único sistema de partículas que se transforma según la sección visible
 * (atributo data-scene en cada sección):
 *   0 cerebro · 1 caos · 2 constelación · 3 globo · 4 onda · 5 cerebro final
 */

interface SceneState {
  morph: number
  /** desplazamiento como fracción del semiancho/semialto visible */
  x: number
  y: number
  scale: number
  dim: number
  spin: number
  /** orientar de frente a la cámara */
  face?: boolean
  tilt?: number
  /** semiancho de la forma (unidades de mundo) para que quepa en pantalla */
  fit?: number
}

const DESKTOP: SceneState[] = [
  { morph: 0, x: 0.38, y: 0.02, scale: 1.3, dim: 1, spin: 0.16, tilt: 0.28 },
  { morph: 1, x: 0, y: 0, scale: 1, dim: 0.55, spin: 0.03 },
  { morph: 2, x: 0, y: -0.02, scale: 1.05, dim: 0.9, spin: 0, face: true, fit: 3.3 },
  { morph: 3, x: -0.42, y: 0, scale: 1.05, dim: 0.75, spin: 0.12 },
  { morph: 4, x: 0, y: -0.05, scale: 1, dim: 0.7, spin: 0, face: true, tilt: 0.42 },
  { morph: 5, x: 0, y: 0.08, scale: 1.4, dim: 0.9, spin: 0.14 },
  // 6 áreas: globo centrado y tenue detrás de las tarjetas
  { morph: 3, x: 0, y: 0, scale: 1.55, dim: 0.42, spin: 0.08 },
  // 7 control humano: cerebro grande y tenue
  { morph: 5, x: 0, y: 0, scale: 1.9, dim: 0.45, spin: 0.1 },
  // 8 contacto / pie
  { morph: 5, x: 0.38, y: -0.1, scale: 1.3, dim: 0.35, spin: 0.08 },
]

const MOBILE: SceneState[] = [
  { morph: 0, x: 0, y: 0.42, scale: 0.98, dim: 0.85, spin: 0.16, tilt: 0.28, fit: 1.5 },
  { morph: 1, x: 0, y: 0, scale: 0.75, dim: 0.5, spin: 0.03 },
  { morph: 2, x: 0, y: 0.05, scale: 0.62, dim: 0.75, spin: 0, face: true, fit: 3.3 },
  { morph: 3, x: 0, y: 0.35, scale: 0.75, dim: 0.5, spin: 0.12 },
  { morph: 4, x: 0, y: -0.05, scale: 0.7, dim: 0.6, spin: 0, face: true, tilt: 0.42 },
  { morph: 5, x: 0, y: 0.3, scale: 0.95, dim: 0.75, spin: 0.14 },
  { morph: 3, x: 0, y: 0, scale: 1, dim: 0.35, spin: 0.08 },
  { morph: 5, x: 0, y: 0.1, scale: 1.15, dim: 0.35, spin: 0.1 },
  { morph: 5, x: 0, y: 0, scale: 1, dim: 0.3, spin: 0.08 },
]

/** Posición local de cada nodo de la constelación (debe coincidir con shapes.constellation). */
const NODE_COUNT = 8
const nodeLocal = (n: number) => {
  const a = (n / NODE_COUNT) * Math.PI * 2 + Math.PI / 2
  const R = 2.25
  return new THREE.Vector3(Math.cos(a) * R * 1.25, Math.sin(a) * R * 0.78, Math.sin(a * 2) * 0.35)
}

const COLORS = /* glsl */ `
  const vec3 cM = vec3(0.941, 0.235, 1.0);
  const vec3 cV = vec3(0.545, 0.361, 0.965);
  const vec3 cB = vec3(0.231, 0.510, 0.965);
  const vec3 cC = vec3(0.239, 0.851, 1.0);
  vec3 brand(float g) {
    vec3 c = mix(cM, cV, smoothstep(0.0, 0.42, g));
    c = mix(c, cB, smoothstep(0.38, 0.74, g));
    return mix(c, cC, smoothstep(0.72, 1.0, g));
  }
`

const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPR;
  uniform vec3 uMouse;
  uniform float uMouseStr;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute float aRand;
  attribute float aBright;
  varying vec3 vColor;
  varying float vAlpha;
  ${COLORS}

  float seg(float m, float i) {
    float s = clamp((m - i) * 1.7 - aRand * 0.7, 0.0, 1.0);
    return s * s * (3.0 - 2.0 * s);
  }

  void main() {
    float m = uMorph;
    float s1 = seg(m, 0.0);
    float s2 = seg(m, 1.0);
    float s3 = seg(m, 2.0);
    float s4 = seg(m, 3.0);
    float s5 = seg(m, 4.0);

    vec3 w = aP4;
    w.y += sin(w.x * 0.85 + uTime * 0.7) * 0.32 + cos(w.z * 1.05 + uTime * 0.55) * 0.28;

    vec3 p = position;
    p = mix(p, aP1, s1);
    p = mix(p, aP2, s2);
    p = mix(p, aP3, s3);
    p = mix(p, w, s4);
    p = mix(p, position, s5);

    // turbulencia orgánica durante cada transición
    float tr = sin(s1 * 3.1416) + sin(s2 * 3.1416) + sin(s3 * 3.1416) + sin(s4 * 3.1416) + sin(s5 * 3.1416);
    vec3 n = vec3(
      sin(p.y * 2.3 + uTime * 0.9 + aRand * 6.28),
      cos(p.z * 2.1 + uTime * 0.7 + aRand * 3.1),
      sin(p.x * 2.5 - uTime * 0.6)
    );
    p += n * tr * 0.32;

    // deriva sutil permanente
    p += 0.012 * vec3(sin(uTime * 0.9 + aRand * 40.0), cos(uTime * 0.8 + aRand * 30.0), sin(uTime * 0.7 + aRand * 20.0));

    // repulsión del puntero
    vec3 d = p - uMouse;
    float dl = length(d);
    p += (d / max(dl, 0.001)) * uMouseStr * smoothstep(0.85, 0.0, dl) * 0.32;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // pulsos sinápticos que recorren la forma
    float pulse = pow(0.5 + 0.5 * sin(dot(p, vec3(0.9, 0.55, 0.35)) * 3.6 - uTime * 2.1), 12.0);
    float spark = smoothstep(0.996, 1.0, sin(uTime * (0.6 + aRand) + aRand * 300.0));

    float g = clamp(p.x * 0.3 + 0.5 + p.y * 0.08, 0.0, 1.0);
    vColor = brand(g) * (1.0 + pulse * 0.9 + spark * 1.5);
    vAlpha = aBright * (0.62 + pulse * 0.6 + spark);
    gl_PointSize = uSize * (0.55 + aRand * 0.95) * uPR / -mv.z * (1.0 + pulse * 0.7 + spark * 1.5);
  }
`

const particleFrag = /* glsl */ `
  uniform float uDim;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 1.7);
    float core = smoothstep(0.16, 0.0, d);
    gl_FragColor = vec4(vColor * (0.7 + core * 0.8), a * vAlpha * uDim * 0.55);
  }
`

const lineVert = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vPulse;
  ${COLORS}
  void main() {
    vec3 p = position;
    vPulse = pow(0.5 + 0.5 * sin(dot(p, vec3(1.2, 0.7, 0.4)) * 3.0 - uTime * 2.6), 6.0);
    vColor = brand(clamp(p.x * 0.3 + 0.5, 0.0, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const lineFrag = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vPulse;
  void main() {
    gl_FragColor = vec4(vColor * (1.0 + vPulse), uOpacity * (0.05 + vPulse * 0.45));
  }
`

const ringVert = /* glsl */ `
  uniform float uTime;
  uniform float uPR;
  attribute float aAngle;
  attribute float aRand;
  varying float vA;
  varying vec3 vColor;
  ${COLORS}
  void main() {
    float head = fract(uTime * 0.07);
    float t = fract(aAngle / 6.28318 - head);
    float trail = pow(t, 7.0);
    vA = 0.14 + trail * 0.75;
    vColor = brand(0.5 + 0.5 * sin(aAngle));
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + trail * 7.0 + aRand * 2.0) * uPR * 7.0 / -mv.z;
  }
`

const ringFrag = /* glsl */ `
  uniform float uOpacity;
  varying float vA;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 2.0);
    gl_FragColor = vec4(vColor * 1.2, a * vA * uOpacity);
  }
`

export function NeuralScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = () => window.innerWidth < 768
    const lowPower = isMobile() || (navigator.hardwareConcurrency ?? 8) <= 4
    const COUNT = lowPower ? 7000 : 16000

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
    } catch {
      mount.classList.add('no-webgl')
      return
    }
    const pr = Math.min(window.devicePixelRatio, lowPower ? 1.5 : 1.75)
    renderer.setPixelRatio(pr)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x05010d, 1)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 7.5)

    const group = new THREE.Group()
    scene.add(group)

    // ---- Partículas principales
    const b = brain(COUNT)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(b.pos, 3))
    geo.setAttribute('aP1', new THREE.BufferAttribute(chaos(COUNT), 3))
    geo.setAttribute('aP2', new THREE.BufferAttribute(constellation(COUNT), 3))
    geo.setAttribute('aP3', new THREE.BufferAttribute(globe(COUNT), 3))
    geo.setAttribute('aP4', new THREE.BufferAttribute(wave(COUNT), 3))
    const rand = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) rand[i] = Math.random()
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
    geo.setAttribute('aBright', new THREE.BufferAttribute(b.bright, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12)

    const uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: lowPower ? 15 : 12 },
      uPR: { value: pr },
      uDim: { value: 1 },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uMouseStr: { value: 0 },
    }
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, mat)
    group.add(points)

    // ---- Sinapsis (sólo visibles en estado cerebro)
    const linePos = synapses(b.pos, b.bright, lowPower ? 700 : 1600)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    const lineUniforms = { uTime: uniforms.uTime, uOpacity: { value: 1 } }
    const lineMat = new THREE.ShaderMaterial({
      uniforms: lineUniforms,
      vertexShader: lineVert,
      fragmentShader: lineFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    group.add(lines)

    // ---- Anillos orbitales (como en el logo)
    const ringUniforms = { uTime: uniforms.uTime, uPR: uniforms.uPR, uOpacity: { value: 1 } }
    const ringMat = new THREE.ShaderMaterial({
      uniforms: ringUniforms,
      vertexShader: ringVert,
      fragmentShader: ringFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const rings = new THREE.Group()
    const makeRing = (R: number, n: number, rx: number, rz: number, phase: number) => {
      const p = new Float32Array(n * 3)
      const ang = new Float32Array(n)
      const rr = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        p[i * 3] = Math.cos(a) * R * 1.12
        p[i * 3 + 1] = (Math.random() - 0.5) * 0.015
        p[i * 3 + 2] = Math.sin(a) * R
        ang[i] = (a + phase) % (Math.PI * 2)
        rr[i] = Math.random()
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(p, 3))
      g.setAttribute('aAngle', new THREE.BufferAttribute(ang, 1))
      g.setAttribute('aRand', new THREE.BufferAttribute(rr, 1))
      const pts = new THREE.Points(g, ringMat)
      pts.rotation.set(rx, 0, rz)
      rings.add(pts)
      return g
    }
    const ringGeos = [makeRing(1.42, lowPower ? 500 : 900, 0.32, -0.26, 0), makeRing(1.58, lowPower ? 350 : 600, 0.44, 0.3, Math.PI)]
    group.add(rings)

    // ---- Polvo de fondo (no se transforma)
    const DUST = lowPower ? 600 : 1400
    const dustPos = new Float32Array(DUST * 3)
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 30
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 18
      dustPos[i * 3 + 2] = -4 - Math.random() * 14
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dustMat = new THREE.PointsMaterial({
      size: 0.035,
      color: new THREE.Color('#9a8cff'),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(dust)

    // ---- Postprocesado (bloom sólo en equipos capaces)
    let composer: EffectComposer | null = null
    let bloom: UnrealBloomPass | null = null
    if (!lowPower) {
      composer = new EffectComposer(renderer)
      composer.setPixelRatio(Math.min(pr, 1.25))
      composer.addPass(new RenderPass(scene, camera))
      bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2), 0.7, 0.6, 0.28)
      composer.addPass(bloom)
      composer.addPass(new OutputPass())
    }

    // ---- Estado y animación
    const states = () => (isMobile() ? MOBILE : DESKTOP)
    let targetIndex = 0
    const cur = { ...states()[0], rotY: 0.5, scrollY: 0 }
    const visible = () => {
      const h = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      return { hw: h * camera.aspect, hh: h }
    }

    // Seguimiento de secciones con IntersectionObserver
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    const io = new IntersectionObserver(
      (entries) => {
        // tomar la sección que cruza la línea media de la pantalla
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.scene)
            if (!Number.isNaN(idx)) targetIndex = idx
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))

    // Puntero
    const pointer = new THREE.Vector2(0, 0)
    const pointerSmooth = new THREE.Vector2(0, 0)
    let lastMove = 0
    const onMove = (e: PointerEvent) => {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      lastMove = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const hit = new THREE.Vector3()

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer?.setSize(w, h)
      bloom?.resolution.set(w / 2, h / 2)
    }
    window.addEventListener('resize', onResize)

    const labels = Array.from(document.querySelectorAll<HTMLElement>('[data-node]')).map((el) => ({
      el,
      local: el.dataset.node === 'core' ? new THREE.Vector3(0, 0, 0) : nodeLocal(Number(el.dataset.node)),
    }))
    const tmp = new THREE.Vector3()
    let labelsShown = true

    let raf = 0
    let running = true
    let last = performance.now()
    let elapsed = 0
    const TAU = Math.PI * 2

    const tick = () => {
      if (!running) return
      raf = requestAnimationFrame(tick)
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      elapsed += dt
      const t = elapsed
      const s = states()[targetIndex] ?? states()[0]
      const k = 1 - Math.pow(0.0009, dt) // suavizado independiente de FPS
      const kSlow = 1 - Math.pow(0.02, dt)

      cur.morph += (s.morph - cur.morph) * kSlow * 0.9
      cur.x += (s.x - cur.x) * k * 0.5
      cur.y += (s.y - cur.y) * k * 0.5
      const { hw, hh } = visible()
      const targetScale = s.fit ? Math.min(s.scale, (hw * 0.92) / s.fit) : s.scale
      cur.scale += (targetScale - cur.scale) * k * 0.5
      cur.dim += (s.dim - cur.dim) * k * 0.5
      cur.spin += (s.spin - cur.spin) * k * 0.5
      cur.tilt = (cur.tilt ?? 0) + ((s.tilt ?? 0) - (cur.tilt ?? 0)) * k * 0.5

      if (s.face) {
        const target = Math.round(cur.rotY / TAU) * TAU
        cur.rotY += (target - cur.rotY) * k * 0.6
      } else if (!reduced) {
        cur.rotY += cur.spin * dt
      }

      pointerSmooth.lerp(pointer, k * 0.5)
      group.position.set(cur.x * hw, cur.y * hh, 0)
      group.scale.setScalar(cur.scale)
      group.rotation.y = cur.rotY + pointerSmooth.x * 0.28
      group.rotation.x = cur.tilt! - pointerSmooth.y * 0.16 + 0.1

      // Brillo del cerebro (estados 0 y 5)
      const m = cur.morph
      const brainW = Math.max(0, 1 - m * 1.4) + Math.max(0, Math.min(1, (m - 4.35) * 1.6))
      lineUniforms.uOpacity.value = brainW
      ringUniforms.uOpacity.value = Math.max(brainW, Math.max(0, 1 - Math.abs(m - 3) * 1.5) * 0.7)
      lines.visible = brainW > 0.01
      rings.rotation.y = t * 0.05

      // Puntero en espacio local del grupo
      const active = performance.now() - lastMove < 2500 && !reduced
      uniforms.uMouseStr.value += ((active ? 1 : 0) - uniforms.uMouseStr.value) * k * 0.3
      raycaster.setFromCamera(pointer, camera)
      if (raycaster.ray.intersectPlane(plane, hit)) {
        group.updateMatrixWorld()
        uniforms.uMouse.value.copy(group.worldToLocal(hit.clone()))
      }

      // Etiquetas HTML ancladas a los nodos de la constelación
      const near = Math.max(0, 1 - Math.abs(m - 2) * 2.2)
      if (near > 0.01 || labelsShown) {
        labelsShown = near > 0.01
        const w = window.innerWidth
        const h = window.innerHeight
        group.updateMatrixWorld()
        labels.forEach(({ el, local }) => {
          tmp.copy(local)
          group.localToWorld(tmp)
          tmp.project(camera)
          const sx = (tmp.x * 0.5 + 0.5) * w
          const sy = (-tmp.y * 0.5 + 0.5) * h
          el.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(${0.85 + near * 0.15})`
          el.style.opacity = String(near)
        })
      }

      uniforms.uTime.value = reduced ? 0 : t
      uniforms.uMorph.value = m
      uniforms.uDim.value = cur.dim
      dust.rotation.y = t * 0.01
      dust.position.y = (window.scrollY / window.innerHeight) * 0.25

      if (composer) composer.render()
      else renderer.render(scene, camera)
    }
    tick()

    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        last = performance.now()
        tick()
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      // Guard against race conditions with visibility change handler
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      // Dispose all GPU resources to prevent memory leaks
      geo.dispose()
      mat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      ringGeos.forEach((g) => g.dispose())
      ringMat.dispose()
      dustGeo.dispose()
      dustMat.dispose()
      composer?.dispose()
      // Force context loss before removing canvas to free WebGL resources
      const gl = renderer.getContext()
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  )
}
