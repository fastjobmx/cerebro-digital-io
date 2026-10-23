/*
 * Animaciones de /landing-pages/ — réplica de las de la portada (src/components/fx.tsx y src/sections/*).
 * GSAP 3.15.0 + ScrollTrigger se cargan desde cdnjs antes de este archivo.
 * Regla: todo estado oculto se aplica desde JS; si GSAP o este archivo fallan, el contenido queda visible.
 * Sólo se animan transform y opacity.
 */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches
const gsap = window.gsap
const ScrollTrigger = window.ScrollTrigger

/* ---------- Navbar: píldora de vidrio al hacer scroll + barra de progreso ---------- */
;(() => {
  const top = document.querySelector('.top')
  const bar = document.querySelector('.top-progress i')
  if (!top) return
  let ticking = false
  const onScroll = () => {
    ticking = false
    top.classList.toggle('scrolled', window.scrollY > 40)
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
  }
  onScroll()
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(onScroll)
    }
  }, { passive: true })
})()

/* ---------- Botón flotante: aparece después del hero, como en la portada ---------- */
;(() => {
  const wa = document.querySelector('.wa-float')
  if (!wa) return
  const onScroll = () => wa.classList.toggle('show', window.scrollY > window.innerHeight * 0.6)
  wa.classList.add('js')
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})()

/* ---------- Fotos de las tarjetas de demos: se piden cuando la galería está por entrar en pantalla ----------
   (no compiten con la carga inicial; son decorativas, el texto de cada tarjeta no depende de ellas) */
;(() => {
  const fotos = document.querySelectorAll('img[data-src]')
  const cargar = () => fotos.forEach((img) => {
    img.onload = () => img.classList.add('ok') // aparece con un desvanecido al terminar de descargar
    img.src = img.dataset.src
    img.removeAttribute('data-src')
  })
  const galeria = document.querySelector('.gallery')
  if (!galeria || !('IntersectionObserver' in window)) return cargar()
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { io.disconnect(); cargar() }
  }, { rootMargin: '400px 0px' })
  io.observe(galeria)
})()

if (gsap && ScrollTrigger && !REDUCED) {
  gsap.registerPlugin(ScrollTrigger)
  const EXPO = 'expo.out'

  /* ---------- Escena del hero: Google → mapa → página → WhatsApp ---------- */
  const escena = document.querySelector('[data-escena]')
  if (escena) import('./escena-cliente.js').then(({ iniciarEscena }) => iniciarEscena(escena, gsap)).catch(() => {})

  /* ---------- SplitText: titulares que emergen palabra por palabra ---------- */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) nodes.push(walker.currentNode)
    nodes.forEach((node) => {
      const parent = node.parentElement
      const gradHost = parent.closest('.grad, .chrome')
      const cls = gradHost ? (gradHost.classList.contains('grad') ? 'grad' : 'chrome') : ''
      const frag = document.createDocumentFragment()
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part))
          return
        }
        const mask = document.createElement('span')
        mask.className = 'wm'
        const w = document.createElement('span')
        w.className = `w ${cls}`
        w.textContent = part
        mask.appendChild(w)
        frag.appendChild(mask)
      })
      node.replaceWith(frag)
      // El degradado pasa a cada palabra (las palabras se transforman por separado)
      if (gradHost && gradHost !== el) gradHost.classList.add('grad-host')
    })
    const words = el.querySelectorAll('.w')
    gsap.set(words, { yPercent: 115, rotate: 4, opacity: 0 })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.15, ease: EXPO, stagger: 0.045 }),
    })
  })

  /* ---------- Reveal: aparición escalonada de [data-r] ---------- */
  document.querySelectorAll('[data-reveal]').forEach((group) => {
    const items = group.querySelectorAll('[data-r]')
    const targets = items.length ? items : [group]
    const stagger = Number(group.dataset.reveal) || 0.08
    gsap.set(targets, { y: 40, opacity: 0 })
    ScrollTrigger.create({
      trigger: group,
      start: 'top 82%',
      once: true,
      onEnter: () => gsap.to(targets, { y: 0, opacity: 1, duration: 1.1, ease: EXPO, stagger }),
    })
  })

  /* ---------- Línea de tiempo de "Cómo funciona" (como Process de la portada) ---------- */
  const timeline = document.querySelector('[data-timeline]')
  if (timeline) {
    gsap.fromTo('[data-line]', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 60%', end: 'bottom 60%', scrub: true },
    })
    timeline.querySelectorAll('[data-step]').forEach((s) => {
      gsap.fromTo(s.querySelector('[data-dot]'), { scale: 0.4, opacity: 0.3 }, {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(3)',
        scrollTrigger: { trigger: s, start: 'top 60%', toggleActions: 'play none none reverse' },
      })
      const fromX = window.innerWidth >= 768 ? (s.dataset.side === 'l' ? -40 : 40) : 40
      gsap.fromTo(s.querySelector('[data-card]'), { opacity: 0, x: fromX }, {
        opacity: 1, x: 0, duration: 1, ease: EXPO,
        scrollTrigger: { trigger: s, start: 'top 75%' },
      })
    })
  }

  /* ---------- Contador del precio (Counter de la portada) ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count)
    const fmt = (v) => '$' + Math.round(v).toLocaleString('es-CO')
    const o = { v: 0 }
    el.textContent = fmt(0)
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 2.2, ease: EXPO, onUpdate: () => (el.textContent = fmt(o.v)) }),
    })
  })

  /* ---------- Cierre: las palabras se iluminan con el scroll (FinalCTA) ---------- */
  document.querySelectorAll('[data-manifest]').forEach((el) => {
    gsap.fromTo(el.querySelectorAll('[data-w]'), { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    })
  })

  /* ---------- Hero: el contenido se desvanece al hacer scroll (sólo escritorio) ---------- */
  gsap.matchMedia().add('(min-width: 1024px)', () => {
    gsap.to('[data-hero-content]', {
      yPercent: -18, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true },
    })
  })

  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  if (FINE_POINTER) {
    /* ---------- Magnetic: botones que siguen al puntero ---------- */
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35)
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35)
      })
      el.addEventListener('pointerleave', () => {
        xTo(0)
        yTo(0)
      })
    })

    /* ---------- TiltCard: inclinación 3D + reflejo que sigue al puntero ---------- */
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = Number(el.dataset.tilt) || 10
      const glare = document.createElement('span')
      glare.className = 'glare'
      glare.setAttribute('aria-hidden', 'true')
      el.appendChild(glare)
      gsap.set(el, { transformPerspective: 900 })
      const rx = gsap.quickTo(el, 'rotateX', { duration: 0.8, ease: EXPO })
      const ry = gsap.quickTo(el, 'rotateY', { duration: 0.8, ease: EXPO })
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        ry((px - 0.5) * max * 2)
        rx(-(py - 0.5) * max * 2)
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
      })
      el.addEventListener('pointerleave', () => {
        rx(0)
        ry(0)
      })
    })

    /* ---------- Cursor personalizado ---------- */
    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'cursor-dot'
    ring.className = 'cursor-ring'
    ring.appendChild(document.createElement('span')) // el aro interno escala con transform
    dot.setAttribute('aria-hidden', 'true')
    ring.setAttribute('aria-hidden', 'true')
    document.body.append(dot, ring)
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' })
    const cx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: EXPO })
    const cy = gsap.quickTo(ring, 'y', { duration: 0.5, ease: EXPO })
    window.addEventListener('pointermove', (e) => {
      dx(e.clientX)
      dy(e.clientY)
      cx(e.clientX)
      cy(e.clientY)
      ring.dataset.hot = e.target.closest?.('a,button,summary,[data-magnetic]') ? '1' : '0'
    }, { passive: true })
  }
}

document.getElementById('y').textContent = new Date().getFullYear()
