/*
 * Escena del hero de /landing-pages/: así llega un cliente desde Google.
 *   1. Lo buscan  →  2. Lo encuentran en el mapa  →  3. Entran a su página  →  4. Le escriben por WhatsApp
 * Recorre en bucle los 6 negocios de las demos. Usa el GSAP de la página y anima solo transform y opacity.
 * El HTML ya muestra la escena completa y quieta: si este archivo no carga, no se pierde nada.
 */

// Mismos negocios ficticios y colores que las demos de /landing-pages/demos/
const NEGOCIOS = [
  { q: 'dentista en Neiva', name: 'Sonrisa Clara Odontología', cat: 'Odontólogo · Neiva', short: 'Sonrisa Clara', title: 'Su sonrisa en buenas manos', btn: 'Agendar cita', msg: 'Hola, vi su página. ¿Tienen cita para el jueves?', p: '#0e7490', a: '#22d3ee', b: '#f0fdff', t: '#0b2530' },
  { q: 'reparación aire acondicionado', name: 'FríoExpress Neiva', cat: 'Técnico de A/C · 24 horas', short: 'FríoExpress', title: '¿Se dañó el aire? Vamos hoy', btn: 'Pedir técnico', msg: 'Hola, mi aire no enfría. ¿Pueden venir hoy?', p: '#1d4ed8', a: '#f59e0b', b: '#f5f8ff', t: '#0f1b3d' },
  { q: 'veterinaria cerca de mí', name: 'Patitas Felices', cat: 'Clínica veterinaria · Neiva', short: 'Patitas Felices', title: 'Cuidamos a quien lo acompaña', btn: 'Agendar consulta', msg: 'Hola, ¿atienden gatos hoy en la tarde?', p: '#c2410c', a: '#fbbf24', b: '#fff8f1', t: '#3b1f0e' },
  { q: 'apartamento en arriendo Neiva', name: 'Habitat Sur Inmobiliaria', cat: 'Inmobiliaria · Neiva', short: 'Habitat Sur', title: 'Arriende o venda sin enredos', btn: 'Ver inmuebles', msg: 'Hola, vi el apartamento en su página. ¿Sigue disponible?', p: '#14532d', a: '#c9a227', b: '#f7f6f0', t: '#1a2a1f' },
  { q: 'limpieza facial en Neiva', name: 'Aura Estética & Piel', cat: 'Medicina estética · Neiva', short: 'Aura Estética', title: 'Piel cuidada, resultados naturales', btn: 'Reservar valoración', msg: 'Hola, quiero una valoración. ¿Qué días tienen?', p: '#9d4e6a', a: '#e8b4a0', b: '#fdf6f3', t: '#3a1f2a' },
  { q: 'asado huilense cerca de mí', name: 'Fogón Opita Gastrobar', cat: 'Restaurante · Neiva', short: 'Fogón Opita', title: 'Sabor huilense a la brasa', btn: 'Reservar mesa', msg: 'Hola, ¿tienen mesa para 6 el sábado?', p: '#c2410c', a: '#f2b705', b: '#1a120d', t: '#fbefe3' },
]

export function iniciarEscena(stage, gsap) {
  const $ = (k) => stage.querySelector(`[data-s="${k}"]`)
  const el = {
    search: $('search'), q: $('q'), scan: $('scan'), pin: $('pin'), beam: $('beam'),
    c1: $('c1'), you: $('you'), web: $('web'), ico: $('ico'), name: $('name'), cat: $('cat'),
    phone: $('phone'), scroll: $('scroll'), phwa: $('phwa'), sname: $('sname'), stitle: $('stitle'), sbtn: $('sbtn'),
    bubble: $('bubble'), msg: $('msg'), plus: $('plus'), tap: $('tap'),
  }
  const ring = el.tap.querySelector('i')
  const steps = [...stage.parentElement.querySelectorAll('.story li')]
  const EXPO = 'expo.out'

  // A partir de aquí manda GSAP: se retira la entrada CSS para que no pise los estilos en línea
  stage.querySelectorAll('.st-in').forEach((n) => n.classList.remove('st-in'))

  const setStep = (n) => steps.forEach((s, i) => s.classList.toggle('on', i === n - 1))

  const apply = (d) => {
    stage.style.setProperty('--p', d.p)
    stage.style.setProperty('--a', d.a)
    stage.style.setProperty('--b', d.b)
    stage.style.setProperty('--t', d.t)
    el.ico.textContent = d.name[0]
    el.name.textContent = d.name
    el.cat.textContent = d.cat
    el.sname.textContent = d.short
    el.stitle.textContent = d.title
    el.sbtn.textContent = d.btn
    el.msg.textContent = d.msg
  }

  // Centro de un elemento en coordenadas de la escena (ya proyectado en 3D por el navegador)
  const pt = (node) => {
    const r = node.getBoundingClientRect()
    const s = stage.getBoundingClientRect()
    return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top }
  }

  const typed = { n: 0 }
  let query = ''
  const writeQuery = () => (el.q.textContent = query.slice(0, Math.round(typed.n)))

  // El dedo baja sobre un elemento y lo toca
  const tapOn = (tl, target, at) => {
    tl.set(el.tap, { x: () => pt(target).x, y: () => pt(target).y + 46, opacity: 0, scale: 1 }, at)
      .to(el.tap, { y: () => pt(target).y, opacity: 1, duration: 0.6, ease: EXPO })
      .to(el.tap, { scale: 0.82, duration: 0.12, ease: 'power2.in' })
      .fromTo(ring, { scale: 0.6, opacity: 0.9 }, { scale: 2, opacity: 0, duration: 0.6, ease: EXPO }, '<')
      .to(target, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '<')
      .to(el.tap, { scale: 1, duration: 0.2 })
  }

  let actual = null
  let enPantalla = true

  const ciclo = (i) => {
    const d = NEGOCIOS[i]
    const tl = gsap.timeline({ paused: !enPantalla, onComplete: () => ciclo((i + 1) % NEGOCIOS.length) })
    actual = tl

    // 0 · Escena vacía, lista para la búsqueda
    tl.call(() => {
      apply(d)
      query = d.q
      typed.n = 0
      writeQuery()
      setStep(1)
    })
      .set([el.c1, el.you], { opacity: 0, y: 24 })
      .set(el.pin, { opacity: 0, y: -60, scale: 0.4 })
      .set(el.beam, { scaleY: 0, opacity: 1 })
      .set(el.phone, { opacity: 0, scale: 0.6, rotationY: -35, y: 30 })
      .set(el.scroll, { yPercent: 0 })
      .set(el.bubble, { opacity: 0, scale: 0.6, y: 20 })
      .set(el.plus, { opacity: 0, y: 12, scale: 0.8 })

    // 1 · Lo buscan
      .to(typed, { n: d.q.length, duration: d.q.length * 0.055, ease: 'none', onUpdate: writeQuery }, '+=0.3')
      .to(el.search, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '+=0.25')
      .fromTo(el.scan, { xPercent: -100, opacity: 0 }, { xPercent: 340, opacity: 1, duration: 1, ease: 'power2.inOut' })
      .to(el.scan, { opacity: 0, duration: 0.25 }, '-=0.25')

    // 2 · Lo encuentran: su pin cae en el mapa y su ficha tiene "Sitio web"
      .call(() => setStep(2), null, '-=0.6')
      .to(el.pin, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(2.2)' }, '-=0.5')
      .to(el.beam, { scaleY: 1, duration: 0.9, ease: EXPO }, '-=0.5')
      .to(el.c1, { opacity: 0.55, y: 0, duration: 0.9, ease: EXPO }, '-=0.9')
      .to(el.you, { opacity: 1, y: 0, duration: 1, ease: EXPO }, '-=0.8')

    // 3 · Tocan "Sitio web" y su página se abre en el celular
    tapOn(tl, el.web, '+=0.5')
    tl.call(() => setStep(3))
      .to(el.tap, { opacity: 0, duration: 0.3 })
      .to(el.phone, { opacity: 1, scale: 1, rotationY: 0, y: 0, duration: 1.2, ease: EXPO }, '<')
      .to(el.scroll, { yPercent: -30, duration: 1.5, ease: 'power2.inOut' }, '+=0.3')
      .to(el.scroll, { yPercent: 0, duration: 0.8, ease: 'power2.inOut' })

    // 4 · Tocan WhatsApp y le escriben
    tapOn(tl, el.phwa, '+=0.1')
    tl.call(() => setStep(4))
      .to(el.tap, { opacity: 0, duration: 0.3 })
      .to(el.bubble, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.8)' }, '<')
      .to(el.plus, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(2.4)' }, '-=0.45')

    // Pausa para leer y salida hacia el siguiente negocio
      .to({}, { duration: 2.4 })
      .to([el.bubble, el.plus, el.phone, el.you, el.c1, el.pin], { opacity: 0, y: 12, duration: 0.5, ease: 'power2.in', stagger: 0.04 })
      .to(typed, { n: 0, duration: 0.4, ease: 'none', onUpdate: writeQuery }, '<')
  }

  // Primera vista: la escena completa (entrada CSS); luego arranca la historia con el siguiente negocio
  query = NEGOCIOS[0].q
  typed.n = query.length
  const intro = gsap.timeline({ delay: 3, onComplete: () => ciclo(1) })
  actual = intro
  intro
    .to([el.bubble, el.plus, el.phone, el.you, el.c1, el.pin], { opacity: 0, y: 12, duration: 0.5, ease: 'power2.in', stagger: 0.04 })
    .to(typed, { n: 0, duration: 0.4, ease: 'none', onUpdate: writeQuery }, '<')

  // Inclinación con el puntero (como las tarjetas 3D de la portada)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tilt = stage.querySelector('.stage-tilt')
    const base = { x: 8, y: -14 }
    gsap.set(tilt, { rotationX: base.x, rotationY: base.y, transformPerspective: 0 })
    const rx = gsap.quickTo(tilt, 'rotationX', { duration: 1.2, ease: EXPO })
    const ry = gsap.quickTo(tilt, 'rotationY', { duration: 1.2, ease: EXPO })
    const hero = stage.closest('.hero') || stage
    hero.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect()
      const px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
      const py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
      ry(base.y + px * 16)
      rx(base.x - py * 10)
    })
    hero.addEventListener('pointerleave', () => {
      rx(base.x)
      ry(base.y)
    })
  }

  // Sólo corre mientras se ve
  new IntersectionObserver((entries) => {
    enPantalla = entries[0].isIntersecting
    if (!actual) return
    if (enPantalla) actual.resume()
    else actual.pause()
  }).observe(stage)
}
