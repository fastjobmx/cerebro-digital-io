/* =========================================================
   Plantilla maestra de landing page — Cerebro Digital IO
   Lee el objeto window.NEGOCIO (definido al inicio de cada
   demo) y arma la página completa dentro de <main id="app">.

   Para clonar una demo para un cliente real:
   1. Copie el HTML de la demo más parecida.
   2. Cambie el objeto NEGOCIO, las variables de :root y el
      <title> / <meta name="description">.
   3. Ponga esDemo: false (quita el banner de demo y publica
      el schema LocalBusiness con los datos del negocio).
   4. Cambie NEGOCIO.fotos por las fotos reales del cliente
      (hero, porQue y galeria.items; cada una con src y alt).
      Sin fotos, el hero usa la ilustración SVG.
   ========================================================= */
(function () {
  'use strict';
  var N = window.NEGOCIO;
  var app = document.getElementById('app');
  if (!N || !app) return;

  // WhatsApp de Cerebro Digital IO, usado por el banner "¿Quiere una así?".
  var CEREBRO_WA = '573506912734';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function wa(numero, mensaje) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje || '');
  }

  // Iconos de trazo (24×24). Agregue aquí los que necesite un nuevo nicho.
  var ICONOS = {
    check: '<path d="M5 12.5 10 17l9-10"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/><path d="M8.5 10.5h7M8.5 13.5h4"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>',
    diente: '<path d="M8 3C5.2 3 3.5 5 3.5 7.6c0 2.8 1.4 4.4 1.9 6.9.6 3.1 1 6.5 2.8 6.5 1.6 0 1.7-4.2 3.8-4.2s2.2 4.2 3.8 4.2c1.8 0 2.2-3.4 2.8-6.5.5-2.5 1.9-4.1 1.9-6.9C20.5 5 18.8 3 16 3c-1.8 0-2.6 1.2-4 1.2S9.8 3 8 3Z"/>',
    destello: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15v4M17 17h4"/>',
    gota: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
    hoja: '<path d="M5 19C5 10 11 5 20 5c0 9-5 15-14 15"/><path d="M5 19c3-4 6-6 9-7"/>',
    jeringa: '<path d="m18 2 4 4M16 4l4 4M19 7 9 17H7v-2L17 5M11 9l4 4M7 17l-4 4"/>',
    corazon: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    copo: '<path d="M12 2v20M4.9 7l14.2 10M4.9 17 19.1 7M9 3.5l3 2 3-2M9 20.5l3-2 3 2"/>',
    herramienta: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8Z"/>',
    termometro: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0Z"/>',
    rayo: '<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>',
    escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
    tarjeta: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    casa: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    llave: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M17 6l3 3M14 9l2 2"/>',
    documento: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    edificio: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>',
    lupa: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    huella: '<circle cx="5.5" cy="10" r="2"/><circle cx="9.5" cy="5.5" r="2"/><circle cx="14.5" cy="5.5" r="2"/><circle cx="18.5" cy="10" r="2"/><path d="M12 11c-3 0-5.5 4-5.5 6.5 0 2 1.5 3 3 3 1 0 1.7-.6 2.5-.6s1.5.6 2.5.6c1.5 0 3-1 3-3 0-2.5-2.5-6.5-5.5-6.5Z"/>',
    tijera: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    fuego: '<path d="M12 22c4 0 7-2.7 7-6.5 0-3-2-5.5-3.5-7-.3 2-1.5 3-2.5 3 .5-3-1-6.5-4-8.5.3 3-1.5 5-3 6.8C4.7 11.3 5 13 5 15.5 5 19.3 8 22 12 22Z"/>',
    cubiertos: '<path d="M7 2v20M4 2v6a3 3 0 0 0 6 0V2M17 22V2c-2.5 1.5-3.5 4-3.5 7.5V14H17"/>',
    copa: '<path d="M8 22h8M12 15v7M6 3h12l-1 6a5 5 0 0 1-10 0Z"/>',
    moto: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l-2-6h-3M13 11l2-4h3M18 17l-3-6"/>',
    musica: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    grupo: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.8 3.5 6"/>'
  };
  function icono(nombre, clase) {
    return '<svg class="' + (clase || 'ic') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
      (ICONOS[nombre] || ICONOS.check) + '</g></svg>';
  }

  // Ilustración del hero: forma con los colores del negocio + icono del nicho + dos etiquetas.
  // Cada pieza va en su propio <g> con clase para animarla (entrada, flotación, aro que gira).
  function ilustracion() {
    var e = (N.hero && N.hero.etiquetas) || [];
    var etiqueta = function (n, x, y, w, color, texto) {
      return '<g class="il-lbl il-l' + n + '"><g class="il-bob"><g transform="translate(' + x + ' ' + y + ')"><rect width="' + w + '" height="46" rx="23" style="fill:var(--superficie);stroke:var(--borde)"/>' +
        '<circle cx="24" cy="23" r="9" style="fill:var(' + color + ')"/><text x="42" y="28" font-size="15" font-weight="700" style="fill:var(--texto)" font-family="system-ui,sans-serif">' + esc(texto) + '</text></g></g></g>';
    };
    return '<div class="ilus-wrap"><div class="ilus-tilt">' +
      '<svg class="ilus" viewBox="0 0 420 380" width="420" height="380" role="img" aria-label="' + esc(N.hero.ilustracionAlt || ('Ilustración de ' + N.nombre)) + '">' +
      '<path class="il-blob" d="M60 70C120 10 260 0 340 60s90 180 30 240-210 80-290 30S0 130 60 70Z" style="fill:var(--acento)" opacity=".35"/>' +
      '<circle cx="210" cy="190" r="118" style="fill:var(--primario)"/>' +
      '<g class="il-ring"><circle cx="210" cy="190" r="118" fill="none" style="stroke:var(--superficie)" stroke-width="6" stroke-dasharray="2 14" opacity=".55"/></g>' +
      '<g class="il-ico"><g transform="translate(150 130) scale(5)" color="#fff">' +
      '<g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">' + (ICONOS[N.iconoHero] || ICONOS.check) + '</g></g></g>' +
      (e[0] ? etiqueta(1, 12, 52, 168, '--acento', e[0]) : '') +
      (e[1] ? etiqueta(2, 232, 300, 176, '--primario', e[1]) : '') +
      '</svg></div></div>';
  }

  // Mapa ilustrativo (no apunta a una dirección real). Para un cliente real puede
  // reemplazarse por el iframe de Google Maps de su ficha.
  function mapa() {
    return '<svg viewBox="0 0 400 200" width="400" height="200" aria-hidden="true" focusable="false">' +
      '<rect width="400" height="200" style="fill:color-mix(in srgb, var(--primario) 7%, var(--superficie))"/>' +
      '<g style="stroke:var(--borde)" stroke-width="14" fill="none"><path d="M-10 60h420M-10 140h420M90-10v220M250-10v220"/></g>' +
      '<g style="stroke:var(--superficie)" stroke-width="2" fill="none" stroke-dasharray="8 8"><path d="M-10 60h420M-10 140h420M90-10v220M250-10v220"/></g>' +
      '<path d="M300 20c40 10 70 40 90 80" style="stroke:color-mix(in srgb, var(--acento) 60%, transparent)" stroke-width="10" fill="none" stroke-linecap="round"/>' +
      '<ellipse class="map-onda" cx="188" cy="104" rx="16" ry="6" style="fill:none;stroke:var(--primario)" stroke-width="3"/>' +
      '<ellipse class="map-onda o2" cx="188" cy="104" rx="16" ry="6" style="fill:none;stroke:var(--primario)" stroke-width="3"/>' +
      '<g class="map-pin"><g transform="translate(170 52)"><path d="M18 52S36 36 36 20a18 18 0 1 0-36 0c0 16 18 32 18 32Z" style="fill:var(--primario)"/><circle cx="18" cy="20" r="7" fill="#fff"/></g></g>' +
      '</svg>';
  }

  // Fotos: si vienen de Unsplash se piden en varios tamaños (srcset) y en formato moderno (AVIF/WebP).
  // Para fotos propias del cliente basta poner src con la URL o la ruta del archivo.
  function urlFoto(src, w) {
    return src + (src.indexOf('?') < 0 ? '?' : '&') + 'auto=format&fit=crop&q=70&w=' + w;
  }
  function foto(f, anchos, sizes, carga) {
    var unsplash = /^https:\/\/images\.unsplash\.com\//.test(f.src);
    var attrs = unsplash
      ? ' src="' + esc(urlFoto(f.src, anchos[1] || anchos[0])) + '" srcset="' +
        esc(anchos.map(function (w) { return urlFoto(f.src, w) + ' ' + w + 'w'; }).join(', ')) + '" sizes="' + sizes + '"'
      : ' src="' + esc(f.src) + '"';
    return '<img' + attrs + ' alt="' + esc(f.alt || '') + '" width="1200" height="800" decoding="async"' +
      (carga === 'eager' ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
  }
  var F = N.fotos || {};

  var linkWA = wa(N.whatsapp, N.mensajeWhatsApp);
  var aWA = ' href="' + esc(linkWA) + '" target="_blank" rel="noopener"';
  var h = [];

  // Banner fijo de demo + encabezado
  h.push('<div class="fijo">');
  if (N.esDemo) {
    h.push('<a class="demo-banner" href="' + esc(wa(CEREBRO_WA, N.mensajeWhatsApp)) + '" target="_blank" rel="noopener">' +
      'Demo creada por <b>Cerebro Digital IO</b> · Negocio ficticio · <span>¿Quiere una así? →</span></a>');
  }
  h.push('<header class="cab"><div class="wrap">' +
    '<a class="marca" href="#inicio"><span class="marca-ic">' + icono(N.iconoMarca) + '</span>' + esc(N.nombreCorto || N.nombre) + '</a>' +
    '<nav aria-label="Secciones"><a href="#servicios">' + esc(N.servicios.menu || 'Servicios') + '</a><a href="#por-que">Por qué elegirnos</a><a href="#ubicacion">Ubicación</a><a href="#preguntas">Preguntas</a></nav>' +
    '<a class="btn btn-1"' + aWA + ' aria-label="WhatsApp de ' + esc(N.nombre) + '">' + icono('chat') + 'WhatsApp</a>' +
    '</div></header><div class="prog" aria-hidden="true"><i></i></div></div>');

  // Hero: foto a pantalla completa si hay fotos.hero; si no, la ilustración SVG
  var heroFoto = F.hero;
  h.push('<section class="hero' + (heroFoto ? ' hero-foto' : '') + '" id="inicio" aria-labelledby="t-hero"' +
    (heroFoto && heroFoto.posicion ? ' style="--foco-foto:' + esc(heroFoto.posicion) + '"' : '') + '>' +
    (heroFoto ? '<div class="hero-bg">' + foto(heroFoto, [640, 960, 1400, 1920], '100vw', 'eager') + '</div>' : '') +
    '<div class="wrap"><div class="hero-txt">' +
    '<span class="eyebrow">' + esc(N.hero.eyebrow) + '</span>' +
    // El titular se arma palabra por palabra para que cada una emerja escalonada
    '<h1 id="t-hero">' + N.hero.titulo.split(' ').map(function (w, i) {
      return '<span class="hw"><span style="--i:' + i + '">' + esc(w) + '</span></span>';
    }).join(' ') + '</h1>' +
    '<p class="sub">' + esc(N.hero.subtitulo) + '</p>' +
    '<div class="ctas"><a class="btn btn-1"' + aWA + '>' + icono('chat') + esc(N.hero.cta) + '</a>' +
    '<a class="btn btn-2" href="#servicios">' + esc(N.hero.cta2) + '</a></div>' +
    '<ul class="chips">' + N.hero.chips.map(function (c, i) { return '<li style="--i:' + i + '">' + icono('check') + esc(c) + '</li>'; }).join('') + '</ul>' +
    '</div>' + (heroFoto ? '' : ilustracion()) + '</div></section>');

  // Servicios
  h.push('<section class="sec sec-alt" id="servicios" aria-labelledby="t-serv"><div class="wrap">' +
    '<span class="eyebrow">' + esc(N.servicios.eyebrow || 'Servicios') + '</span>' +
    '<h2 class="h2" id="t-serv">' + esc(N.servicios.titulo) + '</h2>' +
    (N.servicios.intro ? '<p class="intro">' + esc(N.servicios.intro) + '</p>' : '') +
    '<ul class="grid-serv">' + N.servicios.items.map(function (s) {
      return '<li class="serv"><span class="serv-ic">' + icono(s.icono) + '</span><h3>' + esc(s.nombre) + '</h3><p>' + esc(s.desc) + '</p>' +
        (s.precio ? '<span class="precio">' + esc(s.precio) + '</span>' : '') + '</li>';
    }).join('') + '</ul>' +
    (N.servicios.nota ? '<p class="nota">' + esc(N.servicios.nota) + '</p>' : '') +
    '</div></section>');

  // Por qué elegirnos (con foto al lado si hay fotos.porQue)
  var pqFoto = F.porQue;
  h.push('<section class="sec" id="por-que" aria-labelledby="t-pq"><div class="wrap' + (pqFoto ? ' pq-split' : '') + '">' +
    (pqFoto ? '<figure class="pq-foto">' + foto(pqFoto, [480, 800, 1200], '(min-width: 900px) 45vw, 100vw') +
      '<figcaption class="pq-badge">' + icono('pin') + 'Atención en ' + esc(N.ciudad) + '</figcaption></figure>' : '') +
    '<div><span class="eyebrow">Por qué elegirnos</span><h2 class="h2" id="t-pq">' + esc(N.porQue.titulo) + '</h2>' +
    '<ul class="grid-pq">' + N.porQue.items.map(function (p) {
      return '<li class="pq"><span class="serv-ic">' + icono(p.icono) + '</span><div><h3>' + esc(p.titulo) + '</h3><p>' + esc(p.desc) + '</p></div></li>';
    }).join('') + '</ul></div></div></section>');

  // Galería (fotos.galeria): una foto grande y dos pequeñas, con pie de foto
  var gal = F.galeria;
  var hayGaleria = !!(gal && gal.items && gal.items.length);
  if (hayGaleria) {
    h.push('<section class="sec sec-alt" id="galeria" aria-labelledby="t-gal"><div class="wrap">' +
      '<span class="eyebrow">' + esc(gal.eyebrow || 'Nuestro espacio') + '</span><h2 class="h2" id="t-gal">' + esc(gal.titulo || 'Conózcanos') + '</h2>' +
      '<div class="galeria">' + gal.items.map(function (g, i) {
        return '<figure class="gal">' +
          foto(g, i === 0 ? [640, 960, 1400] : [480, 800], i === 0 ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 36vw, 50vw') +
          (g.texto ? '<figcaption>' + esc(g.texto) + '</figcaption>' : '') + '</figure>';
      }).join('') + '</div>' +
      (gal.nota || N.esDemo ? '<p class="nota">' + esc(gal.nota || 'Fotos ilustrativas de banco de imágenes (Unsplash): no corresponden a un negocio real.') + '</p>' : '') +
      '</div></section>');
  }

  // Ubicación y horarios (los fondos alternan; con galería, esta sección va sin fondo)
  h.push('<section class="sec' + (hayGaleria ? '' : ' sec-alt') + '" id="ubicacion" aria-labelledby="t-ubi"><div class="wrap">' +
    '<span class="eyebrow">Ubicación y horarios</span><h2 class="h2" id="t-ubi">Lo esperamos en ' + esc(N.ciudad) + '</h2>' +
    '<div class="ubi"><div class="caja"><h3>' + icono('pin') + 'Dirección</h3><p class="dir">' + esc(N.direccion) + '</p>' +
    '<div class="mapa">' + mapa() + '</div>' +
    '<a class="btn btn-2" href="' + esc(N.mapa) + '" target="_blank" rel="noopener">' + icono('pin') + 'Abrir en Google Maps</a></div>' +
    '<div class="caja"><h3>' + icono('reloj') + 'Horarios</h3><table class="horas"><caption class="sr-only">Horarios de atención</caption><tbody>' +
    N.horarios.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') +
    '</tbody></table>' +
    (N.telefono ? '<p class="dir">Teléfono: <a href="tel:' + esc(N.telefono.replace(/\s/g, '')) + '">' + esc(N.telefono) + '</a></p>' : '') +
    '<a class="btn btn-1"' + aWA + '>' + icono('chat') + 'Escribir por WhatsApp</a></div></div>' +
    '</div></section>');

  // Preguntas frecuentes
  h.push('<section class="sec' + (hayGaleria ? ' sec-alt' : '') + '" id="preguntas" aria-labelledby="t-faq"><div class="wrap">' +
    '<span class="eyebrow">Preguntas frecuentes</span><h2 class="h2" id="t-faq">Resolvemos sus dudas</h2>' +
    '<div class="faq">' + N.faq.map(function (f) {
      return '<details><summary>' + esc(f[0]) + '</summary><div class="resp">' + esc(f[1]) + '</div></details>';
    }).join('') + '</div></div></section>');

  // CTA final
  h.push('<section class="sec" style="padding-top:0" aria-labelledby="t-final"><div class="wrap"><div class="final">' +
    '<h2 id="t-final">' + esc(N.ctaFinal.titulo) + '</h2><p>' + esc(N.ctaFinal.texto) + '</p>' +
    '<a class="btn"' + aWA + '>' + icono('chat') + esc(N.ctaFinal.boton) + '</a></div></div></section>');

  app.innerHTML = h.join('');

  // Pie y botón flotante (fuera de <main>)
  var pie = document.createElement('footer');
  pie.className = 'pie';
  pie.innerHTML = '<div class="wrap"><p><strong>' + esc(N.nombre) + '</strong> · ' + esc(N.direccion) + '</p>' +
    (N.esDemo
      ? '<p>Negocio ficticio. Página de demostración creada por <a href="/landing-pages/">Cerebro Digital IO</a>. Los nombres, precios y datos son ilustrativos.</p>'
      : '<p>© ' + new Date().getFullYear() + ' ' + esc(N.nombre) + '. Página creada por <a href="https://cerebrodigital.qzz.io/landing-pages/">Cerebro Digital IO</a>.</p>') +
    (JSON.stringify(F).indexOf('images.unsplash.com') >= 0 ? '<p>Fotos: <a href="https://unsplash.com/" target="_blank" rel="noopener">Unsplash</a>.</p>' : '') +
    '</div>';
  document.body.appendChild(pie);

  var flot = document.createElement('a');
  flot.className = 'wa-flot';
  flot.href = linkWA;
  flot.target = '_blank';
  flot.rel = 'noopener';
  flot.setAttribute('aria-label', 'Escribir por WhatsApp a ' + N.nombre);
  flot.innerHTML = icono('chat') + '<span aria-hidden="true">WhatsApp</span>';
  document.body.appendChild(flot);

  // Schema LocalBusiness solo para negocios reales (nunca en demos ficticias).
  if (!N.esDemo && N.schema) {
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify(Object.assign({
      '@context': 'https://schema.org',
      name: N.nombre,
      address: { '@type': 'PostalAddress', streetAddress: N.direccion, addressLocality: N.ciudad, addressCountry: 'CO' },
      telephone: N.telefono || ('+' + N.whatsapp)
    }, N.schema));
    document.head.appendChild(ld);
  }

  /* ---------------- Animaciones ----------------
     Todo respeta "reducir movimiento" y nada queda oculto si el JS falla
     (los estados ocultos los pone este mismo código). Solo se anima transform y opacity. */
  var REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINO = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Encabezado: sombra al bajar y barra de progreso de lectura
  var fijo = app.querySelector('.fijo');
  var barra = app.querySelector('.prog i');
  var pendiente = false;
  function alScroll() {
    pendiente = false;
    fijo.classList.toggle('scrolled', window.scrollY > 10);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  }
  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); }
  }, { passive: true });
  alScroll();

  if (!REDUCIDO && 'IntersectionObserver' in window) {
    // Aparición escalonada al hacer scroll (40px, 1.1s, escalonado 0.08s, como la portada de Cerebro)
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        io.unobserve(t);
        if (t.classList.contains('mapa')) { t.classList.add('in'); return; }
        var d = (parseFloat(t.style.getPropertyValue('--rv-d')) || 0) * 1000;
        t.classList.add('rv-in');
        // Terminada la entrada, la tarjeta vuelve a su estado normal (así funciona el hover)
        setTimeout(function () {
          t.classList.remove('rv', 'rv-in');
          t.style.removeProperty('--rv-d');
        }, d + 1200);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    var objetivos = app.querySelectorAll('.sec .eyebrow, .sec .h2, .intro, .serv, .pq, .pq-foto, .gal, .caja, .faq details, .final, .nota');
    Array.prototype.forEach.call(objetivos, function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      var hermanos = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.tagName === el.tagName; });
      el.style.setProperty('--rv-d', (hermanos.indexOf(el) * 0.08) + 's');
      el.classList.add('rv');
      io.observe(el);
    });
    var mapaEl = app.querySelector('.mapa');
    if (mapaEl) io.observe(mapaEl);

    // La ilustración del hero se inclina siguiendo el puntero (solo con mouse)
    var tilt = app.querySelector('.ilus-tilt');
    var heroEl = app.querySelector('.hero');
    if (FINO && tilt && heroEl) {
      heroEl.addEventListener('pointermove', function (ev) {
        var r = tilt.getBoundingClientRect();
        var x = Math.max(-1, Math.min(1, (ev.clientX - (r.left + r.width / 2)) / r.width));
        var y = Math.max(-1, Math.min(1, (ev.clientY - (r.top + r.height / 2)) / r.height));
        tilt.style.transform = 'perspective(900px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg)';
      });
      heroEl.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
    }
  } else {
    var m0 = app.querySelector('.mapa');
    if (m0) m0.classList.add('in');
  }

  /* Botón flotante: en el hero aparece el chatbot; en el resto de la página, el de WhatsApp.
     Nunca los dos a la vez (lo resuelve el CSS con las clases con-chat / en-hero / chat-abierto). */
  var raiz = document.documentElement;
  var conChat = !(N.chatbot && N.chatbot.activo === false);
  var heroSec = app.querySelector('.hero');
  var limiteHero = function () { return heroSec.getBoundingClientRect().bottom > window.innerHeight * 0.35; };
  raiz.classList.toggle('en-hero', limiteHero());
  if ('IntersectionObserver' in window) {
    // "En el hero" = el hero todavía ocupa el 35 % superior de la pantalla
    new IntersectionObserver(function (es) {
      raiz.classList.toggle('en-hero', es[0].isIntersecting);
    }, { rootMargin: '0px 0px -65% 0px' }).observe(heroSec);
  }
  if (conChat) {
    raiz.classList.add('con-chat');
    // Si el chatbot no llega a cargar, vuelve el botón de WhatsApp también en el hero
    window.addEventListener('load', function () {
      setTimeout(function () { if (!window.__chatbotListo) raiz.classList.remove('con-chat'); }, 4000);
    });
  }

  // Chatbot básico: se carga después de la página para no retrasarla. Desactívelo con chatbot: { activo: false }.
  if (conChat) {
    var cargarChat = function () {
      var s = document.createElement('script');
      s.src = 'chatbot.js';
      document.body.appendChild(s);
    };
    if (document.readyState === 'complete') setTimeout(cargarChat, 300);
    else window.addEventListener('load', function () { setTimeout(cargarChat, 300); });
  }
})();
