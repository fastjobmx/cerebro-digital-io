// Respaldo: oculta y elimina insignias flotantes de Netlify si el hosting las inyecta.
// Solo actúa sobre elementos flotantes fuera de #app, para no tocar contenido ni botones propios.
(function () {
  var TEXTO = /^\W*powered by netlify\W*$/i;
  var ENLACE = 'a[href*="netlify.com"]';
  // Marco de la insignia de Netlify; el id no está documentado y puede cambiar.
  var MARCO = '#nl-badge-frame';

  var estilo = document.createElement('style');
  estilo.textContent =
    MARCO + ', body > a[href*="netlify.com"], body > [id*="netlify" i], body > [class*="netlify" i], ' +
    'body > iframe[src*="netlify"] { display: none !important; }';
  document.head.appendChild(estilo);

  // Sube mientras el padre no aporte más texto: así se elimina la insignia, no el panel que la contiene.
  function contenedor(el) {
    var texto = el.textContent.trim();
    var padre = el.parentElement;
    while (padre && padre !== document.body && padre !== document.documentElement && padre.textContent.trim() === texto) {
      el = padre;
      padre = el.parentElement;
    }
    return el;
  }

  function esFlotante(desde, hasta) {
    if (hasta.parentElement === document.body) {
      var directo = getComputedStyle(hasta).position;
      if (directo === 'absolute') return true;
    }
    for (var n = desde; n; n = n === hasta ? null : n.parentElement) {
      var pos = getComputedStyle(n).position;
      if (pos === 'fixed' || pos === 'sticky') return true;
    }
    return false;
  }

  function eliminar(el) {
    var caja = contenedor(el);
    if (esFlotante(el, caja)) caja.remove();
  }

  function revisar(nodo) {
    var el = nodo.nodeType === 1 ? nodo : nodo.parentElement;
    if (!el || !el.isConnected || el === document.body || el === document.documentElement) return;
    if (el.closest('#app, head, script, style')) return;
    if (el.matches(MARCO)) return el.remove();
    if (TEXTO.test(el.textContent)) eliminar(el);
    if (!el.isConnected) return;
    if (el.matches(ENLACE)) eliminar(el);
    else el.querySelectorAll(ENLACE).forEach(eliminar);
  }

  new MutationObserver(function (cambios) {
    cambios.forEach(function (cambio) {
      cambio.addedNodes.forEach(revisar);
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Las hojas de estilo ya cargaron: repasa lo que se haya evaluado antes de tenerlas.
  window.addEventListener('load', function () {
    Array.prototype.forEach.call(document.body.children, revisar);
  });
})();
