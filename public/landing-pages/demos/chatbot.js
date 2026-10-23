/* =========================================================
   Chatbot básico de la plantilla — Cerebro Digital IO
   Sin IA ni servidores: responde con los datos de window.NEGOCIO
   (servicios, precios, horarios, dirección y preguntas frecuentes)
   y, cuando no sabe, ofrece seguir la conversación por WhatsApp.
   No guarda ni envía lo que escribe el visitante: todo ocurre en su navegador.

   Opciones (todas opcionales) dentro de NEGOCIO:
     chatbot: {
       activo: false,                       // lo apaga
       nombre: 'Asistente de Sonrisa Clara', // título del panel
       saludo: '¡Hola! ...',                 // primer mensaje
       teaser: '¿Tiene preguntas? ...',      // globito que aparece a los 6 s ('' lo quita)
       mensajeWhatsApp: 'Hola, vengo de su página web. ', // solo negocios reales (esDemo: false)
       respuestas: [                         // respuestas propias por palabras clave (inicio de palabra, sin tildes)
         { palabras: ['enfria', 'gotea'], respuesta: 'Puede ser falta de mantenimiento o de gas...' }
       ]
     }
   Sin configurar nada ya responde: servicios y precios (también uno por su nombre), horarios,
   ubicación, formas de pago, preguntas frecuentes, citas/reservas, saludo y despedida.
   Lo carga plantilla.js; necesita chatbot.css en la misma carpeta.
   ========================================================= */
(function () {
  'use strict';
  var N = window.NEGOCIO;
  if (!N || window.__chatbotCargado) return;
  window.__chatbotCargado = true;

  var C = N.chatbot || {};
  var REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINO = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var corto = N.nombreCorto || N.nombre;
  var titulo = C.nombre || 'Asistente de ' + corto;
  var catalogo = N.servicios && N.servicios.menu ? N.servicios.menu.toLowerCase() : 'servicios';

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'chatbot.css';
  css.onload = iniciar;
  document.head.appendChild(css);

  /* ---------------- Utilidades ---------------- */
  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }
  function svg(trazos) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + trazos + '</g></svg>';
  }
  var I_CHAT = '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/><path d="M8.5 10.5h7M8.5 13.5h4"/>';
  var I_ENVIAR = '<path d="M5 12h14M13 6l6 6-6 6"/>';
  var I_PIN = '<path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>';
  var I_BOT = '<rect x="4" y="7" width="16" height="12" rx="4"/><path d="M12 3v4M9 13h.01M15 13h.01M9.5 16.5h5"/>';

  // Texto sin tildes ni signos, en minúsculas
  function normalizar(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  var VACIAS = ' a al algo algun alguna alguno con como cual cuales de del el ella ellos en es esa ese eso esta estan este esto hay la las le les lo los me mas mi mis muy necesito no nos o para pero por puedo pueden que quiero quisiera se sea ser si sin sobre son su sus te tiene tienen tengo tu un una uno unos unas usted ustedes y ya yo hola buenas buenos dias tardes noches favor gracias donde cuando cuanto cuanta cuantos hace hacen hago hacer ofrecen dan ';
  // Palabras con significado, recortadas a 5 letras para que "reservas" y "reservar" coincidan
  function raices(s) {
    var vistas = {};
    return normalizar(s).split(' ').filter(function (t) {
      return t.length > 2 && VACIAS.indexOf(' ' + t + ' ') < 0;
    }).map(function (t) { return t.length > 5 ? t.slice(0, 5) : t; })
      .filter(function (t) { return vistas[t] ? false : (vistas[t] = true); });
  }
  function comunes(a, b) {
    var n = 0;
    a.forEach(function (t) { if (b.indexOf(t) >= 0) n++; });
    return n;
  }

  function enlaceWA(extra) {
    // En las demos el número es el de Cerebro Digital IO y el mensaje es el de la demo
    var texto = N.esDemo ? N.mensajeWhatsApp : (C.mensajeWhatsApp || 'Hola, vengo de su página web. ') + (extra || '');
    return 'https://wa.me/' + N.whatsapp + '?text=' + encodeURIComponent(texto);
  }

  /* ---------------- Piezas de las respuestas ---------------- */
  // partes: textos o { b: 'texto en negrita' }
  function llenar(nodo, partes) {
    [].concat(partes).forEach(function (x) {
      nodo.appendChild(typeof x === 'string' ? document.createTextNode(x) : el('strong', null, x.b));
    });
    return nodo;
  }
  function parrafo(partes, clase) { return llenar(el('p', clase), partes); }
  function lista(items) {
    var ul = el('ul');
    items.forEach(function (partes) { ul.appendChild(llenar(el('li'), partes)); });
    return ul;
  }
  function botonWA(texto, extra) {
    var a = el('a', 'cb-link');
    a.href = enlaceWA(extra);
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = svg(I_CHAT);
    a.appendChild(document.createTextNode(texto));
    return a;
  }
  function botonMapa() {
    var a = el('a', 'cb-link alt');
    a.href = N.mapa;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = svg(I_PIN);
    a.appendChild(document.createTextNode('Abrir en Google Maps'));
    return a;
  }
  function acciones(botones) {
    var d = el('div', 'cb-acciones');
    botones.forEach(function (b) { d.appendChild(b); });
    return d;
  }
  function notaServicios() {
    return N.servicios && N.servicios.nota ? [parrafo(N.servicios.nota, 'cb-muted')] : [];
  }

  /* ---------------- Respuestas ---------------- */
  function rSaludo() {
    return [parrafo(C.saludo || '¡Hola! Soy el asistente virtual de ' + corto + '. Puedo contarle precios, horarios ' +
      'y ubicación, y resolver las preguntas más frecuentes. ¿En qué le puedo ayudar?')];
  }
  function rServicios() {
    var items = N.servicios.items.map(function (s) {
      return s.precio ? [{ b: s.nombre }, ': ' + s.precio] : [{ b: s.nombre }];
    });
    return [parrafo('Esto es lo principal de lo que ofrecemos:'), lista(items)]
      .concat(notaServicios())
      .concat([acciones([botonWA('Consultar por WhatsApp', 'Quiero más información sobre precios.')])]);
  }
  function rServicio(s) {
    var out = [parrafo([{ b: s.nombre }, '. ' + s.desc])];
    if (s.precio) out.push(parrafo(['Precio de referencia: ', { b: s.precio }, '.']));
    return out.concat(notaServicios()).concat([acciones([botonWA('Preguntar por WhatsApp', 'Me interesa: ' + s.nombre + '.')])]);
  }
  function rHorarios() {
    return [
      parrafo('Estos son nuestros horarios:'),
      lista(N.horarios.map(function (h) { return [{ b: h[0] + ': ' }, h[1]]; })),
      acciones([botonWA('Confirmar por WhatsApp', 'Quiero confirmar un horario.')]),
    ];
  }
  function rUbicacion() {
    return [
      parrafo(['Nos encuentra en ', { b: N.direccion }, '.']),
      acciones([botonMapa(), botonWA('Pedir indicaciones', 'Necesito indicaciones para llegar.')]),
    ];
  }
  // dudosa: la pregunta se parece solo en parte, así que se ofrece WhatsApp por si no era eso
  function rFaq(f, dudosa) {
    var out = [parrafo(f[1])];
    if (dudosa) out.push(acciones([botonWA('¿No era esto? Pregunte por WhatsApp', '')]));
    return out;
  }
  function rPagos() {
    // 1) Algún texto del negocio que nombre los medios de pago (preguntas, "por qué elegirnos", notas)
    var medios = /nequi|daviplata|tarjeta|efectivo|transferencia|bre b/;
    var textos = (N.faq || []).map(function (f) { return f[1]; })
      .concat((N.porQue && N.porQue.items || []).map(function (p) { return p.desc; }));
    var t = textos.filter(function (x) { return medios.test(normalizar(x)); })[0];
    if (t) return [parrafo(t)];
    // 2) Una pregunta frecuente sobre pagos o cuotas
    var f = (N.faq || []).filter(function (x) { return /pag|medio|cuota/.test(normalizar(x[0])); })[0];
    if (f) return rFaq(f);
    return [parrafo('Las formas de pago se las confirma el equipo por WhatsApp.'),
      acciones([botonWA('Preguntar por WhatsApp', '¿Qué formas de pago reciben?')])];
  }
  function rContacto(motivo) {
    return [parrafo('¡Con gusto! Para ' + motivo + ', escríbanos por WhatsApp y el equipo le responde.'),
      acciones([botonWA('Abrir WhatsApp', '')])];
  }
  function rGracias() {
    return [parrafo('¡Con mucho gusto! Si necesita algo más, aquí estoy.')];
  }
  function rNoSe(pregunta) {
    return [parrafo('No tengo esa respuesta exacta, pero el equipo de ' + corto + ' le puede ayudar por WhatsApp.'),
      acciones([botonWA('Preguntar por WhatsApp', 'Mi pregunta: ' + pregunta)])];
  }

  /* ---------------- Entender la pregunta ---------------- */
  var faqs = (N.faq || []).map(function (f) { return { f: f, r: raices(f[0]) }; });
  var servicios = (N.servicios && N.servicios.items || []).map(function (s) { return { s: s, r: raices(s.nombre) }; });

  function responder(texto) {
    var t = ' ' + normalizar(texto) + ' ';
    var r = raices(texto);
    var hay = function (re) { return re.test(t); };

    // Respuestas propias del negocio (chatbot.respuestas): mandan sobre todo lo demás
    var propias = C.respuestas || [];
    for (var i = 0; i < propias.length; i++) {
      var p = propias[i];
      var toca = (p.palabras || []).some(function (w) { return t.indexOf(' ' + normalizar(w)) >= 0; });
      if (toca) return [parrafo(p.respuesta), acciones([botonWA('Preguntar por WhatsApp', texto.trim())])];
    }

    // Pregunta frecuente más parecida
    var faq = null, faqN = 0, faqRatio = 0;
    faqs.forEach(function (x) {
      var n = comunes(x.r, r);
      var ratio = x.r.length ? n / x.r.length : 0;
      if (n > 0 && (ratio > faqRatio || (ratio === faqRatio && n > faqN))) { faq = x.f; faqN = n; faqRatio = ratio; }
    });
    // Servicio nombrado en la pregunta
    var serv = null, servN = 0;
    servicios.forEach(function (x) {
      var n = comunes(x.r, r);
      if (n > servN) { serv = x.s; servN = n; }
    });

    if (faq && (faqN >= 2 || faqRatio === 1)) return rFaq(faq);
    if (serv) return rServicio(serv);
    if (faq && faqRatio >= 0.6) return rFaq(faq);
    if (hay(/ (pago|pagos|pagar|nequi|daviplata|tarjeta|tarjetas|efectivo|transferencia|cuotas|credito|debito|bre b|breb) /)) return rPagos();
    if (hay(/ (horario|horarios|hora|horas|abren|abre|abierto|abiertos|abierta|cierran|cierra|domingo|domingos|sabado|sabados|festivo|festivos|hoy|atienden|atencion) /)) return rHorarios();
    if (hay(/ (donde|direccion|ubicacion|ubicados|ubicada|ubicado|queda|quedan|llegar|mapa|maps|sede|barrio|local) /)) return rUbicacion();
    if (hay(/ (precio|precios|cuanto|cuesta|cuestan|vale|valen|valor|tarifa|tarifas|costo|costos|servicio|servicios|tratamiento|tratamientos|carta|menu|ofrecen|catalogo|lista|planes) /)) return rServicios();
    if (hay(/ (reservar|reserva|reservas) /)) return rContacto('hacer su reserva');
    if (hay(/ (domicilio|domicilios|pedido|pedir) /)) return rContacto('hacer su pedido');
    if (hay(/ (cotizar|cotizacion|visita|tecnico) /)) return rContacto('coordinar la visita');
    if (hay(/ (cita|citas|agendar|agenda|turno|consulta|valoracion) /)) return rContacto('agendar su cita');
    if (hay(/ (whatsapp|asesor|asesora|persona|humano|llamar|telefono|celular|numero|contacto|contactar|hablar) /)) return rContacto('hablar con alguien del equipo');
    if (hay(/ (hola|buenas|buenos|saludos|hey|ola) /) && r.length <= 2) return rSaludo();
    if (hay(/ (gracias|listo|perfecto|genial|ok|okay|chevere|bueno) /)) return rGracias();
    if (faq) return rFaq(faq, true);
    return rNoSe(texto.trim());
  }

  /* ---------------- Interfaz ---------------- */
  function iniciar() {
    var raiz = document.documentElement;
    // Avisa a la plantilla: el botón del chatbot reemplaza al de WhatsApp mientras se ve el hero
    window.__chatbotListo = true;
    raiz.classList.add('con-chat');

    var lanzar = el('button', 'cb-launch');
    lanzar.type = 'button';
    lanzar.setAttribute('aria-label', 'Abrir el asistente virtual de ' + corto);
    lanzar.setAttribute('aria-expanded', 'false');
    lanzar.setAttribute('aria-controls', 'cb-panel');
    lanzar.innerHTML = svg(I_CHAT) + '<span class="cb-on" aria-hidden="true"></span>';

    var panel = el('section', 'cb');
    panel.id = 'cb-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', titulo);

    var cab = el('div', 'cb-head');
    var av = el('span', 'cb-av');
    av.innerHTML = svg(I_BOT);
    var info = el('div');
    info.appendChild(el('b', null, titulo));
    info.appendChild(el('small', null, 'Respuestas automáticas al instante'));
    var cerrarBtn = el('button', 'cb-close', '×');
    cerrarBtn.type = 'button';
    cerrarBtn.setAttribute('aria-label', 'Cerrar el asistente');
    cab.appendChild(av);
    cab.appendChild(info);
    cab.appendChild(cerrarBtn);

    var log = el('div', 'cb-log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');
    log.tabIndex = -1;

    var sug = el('div', 'cb-sug');
    sug.setAttribute('role', 'group');
    sug.setAttribute('aria-label', 'Preguntas sugeridas');
    var sugerencias = [
      { t: 'Ver ' + catalogo + ' y precios', f: rServicios },
      { t: 'Horarios', f: rHorarios },
      { t: 'Ubicación', f: rUbicacion },
    ];
    (N.faq || []).slice(0, 2).forEach(function (f) { sugerencias.push({ t: f[0], f: function () { return rFaq(f); } }); });
    sugerencias.forEach(function (s) {
      var b = el('button', 'cb-chip', s.t);
      b.type = 'button';
      b.addEventListener('click', function () { preguntar(s.t, s.f()); });
      sug.appendChild(b);
    });
    var chipWA = el('a', 'cb-chip', 'Hablar por WhatsApp');
    chipWA.href = enlaceWA('');
    chipWA.target = '_blank';
    chipWA.rel = 'noopener';
    chipWA.style.display = 'inline-flex';
    chipWA.style.alignItems = 'center';
    chipWA.style.textDecoration = 'none';
    sug.appendChild(chipWA);

    var form = el('form', 'cb-form');
    var etiqueta = el('label', 'sr-only', 'Escriba su pregunta');
    etiqueta.htmlFor = 'cb-input';
    var input = el('input');
    input.id = 'cb-input';
    input.type = 'text';
    input.maxLength = 200;
    input.autocomplete = 'off';
    input.placeholder = 'Escriba su pregunta…';
    var enviar = el('button', 'cb-send');
    enviar.type = 'submit';
    enviar.setAttribute('aria-label', 'Enviar pregunta');
    enviar.innerHTML = svg(I_ENVIAR);
    form.appendChild(etiqueta);
    form.appendChild(input);
    form.appendChild(enviar);

    var nota = el('p', 'cb-nota', N.esDemo
      ? 'Demo con datos ficticios. Los botones de WhatsApp le escriben a Cerebro Digital IO.'
      : 'Respuestas automáticas con la información de esta página.');

    panel.appendChild(cab);
    panel.appendChild(log);
    panel.appendChild(sug);
    panel.appendChild(form);
    panel.appendChild(nota);
    document.body.appendChild(lanzar);
    document.body.appendChild(panel);

    /* Mensajes */
    function burbuja(clase, nodos) {
      var m = el('div', 'cb-msg ' + clase);
      nodos.forEach(function (n) { m.appendChild(typeof n === 'string' ? parrafo(n) : n); });
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
    }
    function decirBot(nodos, espera) {
      var escribiendo = el('div', 'cb-escribiendo');
      escribiendo.innerHTML = '<i></i><i></i><i></i><span class="sr-only">Escribiendo…</span>';
      log.appendChild(escribiendo);
      log.scrollTop = log.scrollHeight;
      setTimeout(function () {
        escribiendo.remove();
        burbuja('bot', nodos);
      }, REDUCIDO ? 0 : (espera == null ? 600 : espera));
    }
    function preguntar(texto, respuesta) {
      burbuja('yo', [texto]);
      decirBot(respuesta, 450 + Math.min(700, texto.length * 12));
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      input.value = '';
      preguntar(q, responder(q));
    });

    /* Abrir y cerrar */
    var abierto = false;
    var saludado = false;
    function abrir() {
      if (abierto) return;
      abierto = true;
      quitarTeaser(true);
      panel.hidden = false;
      lanzar.setAttribute('aria-expanded', 'true');
      raiz.classList.add('chat-abierto'); // con el panel abierto no se muestra ningún botón flotante
      void panel.offsetWidth; // fuerza el cálculo para que la transición de apertura arranque
      panel.classList.add('abierto');
      if (!saludado) {
        saludado = true;
        decirBot(rSaludo(), 350);
      }
      // En celular no se abre el teclado solo: el foco va al historial
      setTimeout(function () { (FINO ? input : log).focus(); }, 60);
    }
    function cerrar() {
      if (!abierto) return;
      abierto = false;
      panel.classList.remove('abierto');
      lanzar.setAttribute('aria-expanded', 'false');
      raiz.classList.remove('chat-abierto');
      setTimeout(function () { if (!abierto) panel.hidden = true; }, REDUCIDO ? 0 : 320);
      // Si al cerrar ya no está en el hero, el botón visible es el de WhatsApp
      (raiz.classList.contains('en-hero') ? lanzar : (document.querySelector('.wa-flot') || lanzar)).focus();
    }
    lanzar.addEventListener('click', abrir);
    cerrarBtn.addEventListener('click', cerrar);
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });

    /* Globito de invitación: una vez por sesión, a los 6 segundos */
    var teaser = null;
    var clave = 'cb-teaser-' + normalizar(corto);
    var textoTeaser = C.teaser != null ? C.teaser : '¿Tiene alguna pregunta? Le respondo al instante.';
    var yaVisto = false;
    try { yaVisto = sessionStorage.getItem(clave) === '1'; } catch (e) { /* sin almacenamiento */ }
    function quitarTeaser(recordar) {
      if (teaser) { teaser.remove(); teaser = null; }
      if (recordar) { try { sessionStorage.setItem(clave, '1'); } catch (e) { /* sin almacenamiento */ } }
    }
    if (textoTeaser && !yaVisto) {
      setTimeout(function () {
        if (abierto) return;
        teaser = el('div', 'cb-teaser');
        var abrirT = el('button', 'cb-t-abrir', textoTeaser);
        abrirT.type = 'button';
        abrirT.addEventListener('click', abrir);
        var cerrarT = el('button', 'cb-t-cerrar', '×');
        cerrarT.type = 'button';
        cerrarT.setAttribute('aria-label', 'Cerrar invitación del asistente');
        cerrarT.addEventListener('click', function () { quitarTeaser(true); });
        teaser.appendChild(abrirT);
        teaser.appendChild(cerrarT);
        document.body.appendChild(teaser);
      }, 6000);
    }
  }
})();
