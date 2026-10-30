# Informe SEO integral: CEREBRO DIGITAL IO

**Fecha:** 30 de octubre de 2026
**Rama:** `seo-integral` (local, sin push ni despliegue)
**Tecnología detectada:** Vite 8, React 19, Tailwind, GSAP, Three.js. Sitio multipágina sin rutas de cliente, publicado en Netlify.

## Resumen

Las mejoras de SEO técnico quedaron implementadas y verificadas en el build local, pero **no están en producción**. El cambio más importante es que el contenido ya llega en el HTML: la portada pasó de 0 a 1.127 palabras legibles sin JavaScript.

El objetivo de LCP no se cumple todavía: la portada móvil mejoró de 5,4 s a 4,7 s en laboratorio, y la meta es 2,5 s.

## 1. Informe SEO inicial

| Prioridad | Problema | Evidencia | Estado |
|---|---|---|---|
| Crítica | Las páginas de React llegaban vacías sin JavaScript | `<div id="app"></div>`, 0 palabras en la portada | Corregido |
| Crítica | Producción apunta a un dominio inexistente | Canónica, `og:image`, `robots.txt` y `sitemap.xml` usan `cerebrodigital.io` | Corregido en código, falta publicar |
| Crítica | Datos legales sin completar | `/terminos/` y `/privacidad/` muestran `[Razón social o nombre completo]` | **Pendiente: requiere sus datos** |
| Alta | H1 sin intención de búsqueda | "Ideas que piensan, soluciones que avanzan." | Corregido |
| Alta | Sin páginas por servicio | Todos los servicios vivían en pestañas de la portada | Corregido: 4 páginas nuevas |
| Alta | Sitemap incompleto | Sin `/landing-pages/` y con fechas manuales | Corregido: se genera en cada build |
| Alta | Dos números de WhatsApp | Portada: +57 302 232 3472. Landing: +57 350 691 2734 | **Pendiente: decisión suya** |
| Alta | Promoción por vencer | La landing y su schema terminan el 31 de octubre de 2026 | **Pendiente: decisión suya** |
| Media | Texto oculto para rastreadores | Solo un verbo y un área estaban en el DOM | Corregido para los verbos y con enlaces a cada servicio |
| Media | Enlaces rotos en el pie de páginas internas | `#areas` no existía fuera de la portada | Corregido |
| Media | URL duplicada | `cerebrodigitalio.netlify.app` responde 200 | Corregido en código, falta publicar |
| Media | Metadatos obsoletos o incorrectos | `meta keywords`, `es_LA`, propiedad inválida en Service | Corregido |
| Media | Portada invisible con movimiento reducido | Las animaciones que revelan el hero no corrían | Corregido |
| Media | Preloader largo en la primera visita | Unos 4,6 s de animación antes del contenido | **Pendiente: decisión suya** |
| Baja | Imágenes sobredimensionadas | Logo de 480 px mostrado a 58 px | Corregido |
| Baja | Falta `Cache-Control` para assets | Cabeceras solo en `vercel.json`, que Netlify no usa | Corregido en `netlify.toml` |

**Comprobado correcto antes de los cambios:** HTTP redirige a HTTPS con 301, una ruta inexistente devuelve 404 real, no hay `X-Robots-Tag` ni `noindex` accidentales, y las demos llevan `noindex`.

**No verificable sin Search Console:** el estado real de indexación en Google.

## 2. Cambios realizados

| Archivos | Cambio | Beneficio esperado |
|---|---|---|
| `src/entry-server.tsx`, `scripts/prerender.mjs`, `src/lib/mount.tsx`, `src/main.tsx`, `src/legal.tsx` | Prerender en el build con hidratación en el cliente | Contenido legible para buscadores y sistemas que no ejecutan JavaScript |
| `src/App.tsx`, `index.html` | Preloader compatible con prerender; si el JavaScript falla, la página no queda cubierta | Misma experiencia, sin parpadeo |
| `src/services/`, `servicios/*/index.html` | Cuatro páginas de servicio | Una intención de búsqueda por URL |
| `src/sections/Hero.tsx` | H1 descriptivo en la etiqueta superior; el eslogan se conserva como texto visual | Mejor relevancia sin cambiar el diseño |
| `src/sections/Faq.tsx`, `src/config/site.ts` | Preguntas frecuentes visibles, con respuestas de la base de conocimiento del chatbot | Respuestas directas para buscadores y usuarios |
| `src/sections/Verbs.tsx`, `Areas.tsx`, `Process.tsx`, `Closing.tsx`, `Header.tsx` | Jerarquía de encabezados, enlaces internos, pie corregido, accesibilidad | Mejor rastreo y navegación |
| `src/components/fx.tsx`, `src/sections/Control.tsx` | Render compatible con hidratación; contadores con su valor real en el HTML | Sin cifras "0" para rastreadores |
| `index.html`, páginas legales, `public/landing-pages/index.html` | Metadatos, schema con `@id` estables, `es-CO`, fuentes y scripts diferidos | Señales coherentes |
| `netlify.toml` | Redirección del subdominio, caché y cabeceras de seguridad | Una sola URL y carga repetida más rápida |
| `public/brand/logo-mark-116.webp`, `logo-full-400.webp` | Variantes livianas del logo | Menos peso: 738 a 692 KiB en la portada |
| `src/lib/analytics.ts`, `src/lib/leads.ts`, `.env.example` | GA4 opcional sujeto a consentimiento y eventos de conversión | Medición lista, inactiva sin ID |
| `scripts/seo-check.mjs`, `package.json` | Verificador automático con `npm run seo:check` | Evita regresiones |
| `public/sitemap.xml` | Eliminado: ahora se genera con fechas reales de Git | Sitemap siempre actualizado |

## 3. Matriz de keywords

No se usaron herramientas externas. La prioridad es una **estimación cualitativa**: no hay volúmenes ni dificultad medidos.

| Keyword | Tipo | Intención | URL de destino | Prioridad |
|---|---|---|---|---|
| inteligencia artificial para empresas en Colombia | Transaccional | Contratar | `/` | Alta |
| cerebro digital para empresas | Marca / comercial | Entender la oferta | `/` | Alta |
| qué es un cerebro digital para empresas | Informativa | Definición | `/#preguntas` | Media |
| automatización de procesos con IA | Transaccional | Contratar | `/servicios/automatizacion-de-procesos/` | Alta |
| automatizar seguimiento de clientes y CRM | Long-tail | Resolver un problema | `/servicios/automatizacion-de-procesos/` | Alta |
| cómo clasificar solicitudes de clientes con IA | Lenguaje natural | Aprender | `/servicios/automatizacion-de-procesos/` | Media |
| marketing con inteligencia artificial para empresas | Comercial | Comparar | `/servicios/marketing-con-ia/` | Alta |
| reporte semanal de campañas con IA | Long-tail | Resolver un problema | `/servicios/marketing-con-ia/` | Media |
| creación de contenido con IA para empresas | Comercial | Comparar | `/servicios/contenido-con-ia/` | Media |
| calendario editorial con inteligencia artificial | Long-tail | Resolver un problema | `/servicios/contenido-con-ia/` | Media |
| sitio web con asistente de IA | Transaccional | Contratar | `/servicios/sitio-web-con-asistente-ia/` | Alta |
| chatbot para captar clientes en la web | Comercial | Comparar | `/servicios/sitio-web-con-asistente-ia/` | Media |
| landing page en Neiva | Transaccional local | Comprar | `/landing-pages/` | Alta |
| página web para pymes en Neiva | Transaccional local | Comprar | `/landing-pages/` | Alta |
| diferencia entre chatbot y agente de IA | Informativa | Aprender | Blog futuro | Media |
| cuánto cuesta automatizar una empresa con IA | Lenguaje natural | Evaluar | `/#preguntas` | Media |

**Público objetivo:** pymes y empresas medianas de habla hispana, con atención remota. La landing apunta en especial a negocios locales de Neiva.

**Clústeres:** automatización, marketing, contenido, sitio web con IA, landing pages locales y marca. La portada cubre la intención general; cada servicio tiene una intención propia para evitar canibalización. `sitio-web-con-asistente-ia` y `landing-pages` se separan por necesidad: asistente conectado frente a página sencilla de pago único.

## 4. Metadatos finales

| URL | Title | H1 |
|---|---|---|
| `/` | IA y automatización para empresas en Colombia \| Cerebro Digital IO | Cerebro digital para empresas: IA y automatización |
| `/servicios/automatizacion-de-procesos/` | Automatización de procesos con IA para empresas \| Cerebro Digital IO | Automatización de procesos con inteligencia artificial para empresas |
| `/servicios/marketing-con-ia/` | Marketing con IA para empresas \| Cerebro Digital IO | Marketing con inteligencia artificial y aprobación humana |
| `/servicios/contenido-con-ia/` | Creación de contenido con IA para empresas \| Cerebro Digital IO | Creación de contenido con IA y con el tono de su marca |
| `/servicios/sitio-web-con-asistente-ia/` | Sitio web con asistente de IA para empresas \| Cerebro Digital IO | Sitio web con asistente de IA para captar y calificar clientes |
| `/landing-pages/` | Landing Page para su negocio en Neiva y Colombia \| CEREBRO DIGITAL IO | Su negocio en Google con una página que convierte visitas en mensajes de WhatsApp. |
| `/terminos/` | Términos y condiciones \| CEREBRO DIGITAL IO | Términos y condiciones |
| `/privacidad/` | Política de privacidad y tratamiento de datos \| CEREBRO DIGITAL IO | Política de privacidad y tratamiento de datos personales |
| `/cookies/` | Política de cookies \| CEREBRO DIGITAL IO | Política de cookies |

**Canonical:** cada página usa `https://cerebrodigitalio.qd.je` más su ruta exacta.

**Meta description:** todas son únicas. `npm run seo:check` exige entre 70 y 170 caracteres; los textos están en `index.html`, `src/services/content.ts` y las cabeceras de cada página.

## 5. Indexabilidad

| Elemento | En el build local | En producción hoy |
|---|---|---|
| `robots.txt` | Permite todo y declara el sitemap correcto | Declara el dominio inexistente |
| `sitemap.xml` | 9 URL canónicas; `lastmod` solo con fecha real de Git | 4 URL del dominio inexistente |
| Canonical | Correcta en las 9 páginas indexables | Dominio inexistente |
| HTTP a HTTPS | No aplica en local | Correcto: 301 |
| Variante `www` | No aplica: no existe | No resuelve, intencional |
| Subdominio Netlify | Regla 301 lista, sin probar en Netlify | Responde 200 |
| 404 | Con `noindex` | Devuelve 404 |
| Demos | `noindex` | `noindex` |

Las URL de servicio obtienen `lastmod` desde su primer commit. Si Netlify clona con historial limitado, la fecha puede ser menos precisa.

## 6. Schema markup

| Página | Tipos |
|---|---|
| Portada | Organization, WebSite, WebPage, Service |
| Servicios | WebPage, Service, BreadcrumbList |
| Landing pages | Service con Offer, enlazado a la organización por `@id` |

**Schema Markup Validator:** 0 errores y 0 avisos en las 6 páginas con schema probadas. La prueba se hizo con el HTML del build.

**Rich Results Test de Google:** no se ejecutó; necesita la URL publicada.

**No se agregó:** LocalBusiness, porque no hay dirección confirmada; FAQPage, porque Google restringe ese resultado a sitios de salud y gobierno; ni reseñas o calificaciones. Ningún schema garantiza resultados enriquecidos.

## 7. Rendimiento

Mediana de 3 ejecuciones de Lighthouse 12 en móvil, portada, build local servido con gzip. Son **datos de laboratorio**: no hay datos reales de usuarios (CrUX) ni se midió INP.

| Métrica | Antes | Después | Meta |
|---|---|---|---|
| Rendimiento | 67 | 76 | - |
| FCP | 2,6 s | 2,3 s | - |
| LCP | 5,4 s | 4,7 s | ≤ 2,5 s: **no cumplida** |
| TBT | 410 ms | 216 ms | - |
| CLS | 0 | 0 | ≤ 0,1: cumplida |

| Otras mediciones | Antes | Después |
|---|---|---|
| SEO portada (móvil) | 92 | 100 |
| Accesibilidad portada | 97 | 97 |
| Buenas prácticas portada | 100 | 100 |
| Peso de la portada | 738 KiB | 692 KiB |
| Portada escritorio: LCP / CLS (1 ejecución) | 1,4 s / 0,02 | 1,5 s / 0,02 |
| Portada escritorio: rendimiento (1 ejecución) | 76 | 76 |
| Servicio de automatización (1 ejecución móvil) | - | Rendimiento 94, accesibilidad 100, SEO 100, LCP 2,6 s |

**Línea base en el sitio publicado:** móvil 45 con LCP 5,8 s y TBT 880 ms; escritorio 64 con LCP 1,6 s. No es comparable con las mediciones locales. Hay que volver a medir tras publicar.

**Por qué el LCP sigue alto:** el navegador necesita descargar y ejecutar 163 KB de JavaScript comprimido antes de terminar el trabajo principal, y la escena 3D añade otros 137 KB. Además, Lighthouse mide en esta portada el logo del preloader, no el contenido real, que aparece unos 4,6 s después en la primera visita. Reducir eso exige acortar el preloader o dividir el JavaScript.

**Contraste:** quedan 5 avisos en móvil y 10 en escritorio. Incluyen los verbos atenuados a propósito por la animación y elementos medidos mientras se animan; los conservé para no alterar el diseño.

## 8. Pruebas

| Comando o prueba | Resultado |
|---|---|
| `npm run build` | Correcto: 9 páginas prerenderizadas y sitemap con 9 URL |
| `npm run seo:check` | Correcto: 16 HTML, 9 URL, sin problemas |
| `npm audit --omit=dev` | 0 vulnerabilidades en dependencias de producción |
| Tests automatizados | El proyecto no tiene suite de tests |
| Navegador local, portada y servicio | Sin errores en consola |
| Primera visita | El preloader corre y termina |
| Interacciones | Pestañas, preguntas frecuentes y apertura del chat funcionan |
| Móvil 375 px | Sin desplazamiento horizontal en la portada |
| Rutas locales | 200 en páginas, 404 en una ruta inexistente |

**Sin probar:** envío real de formularios, GA4 con un ID real, y `netlify.toml` en Netlify (redirección y cabeceras). No se agregaron dependencias de producción.

## 9. Pendientes manuales

1. **Definir cómo publicar.** En Netlify, pestaña Deploys, revise de dónde salió el despliegue Published. Producción no coincide con `main`.
2. **Completar los datos legales** en `LEGAL` de `src/config/site.ts`: razón social, identificación, dirección y ciudad. Hoy se muestran corchetes al público.
3. **Confirmar el número de WhatsApp oficial:** 302 232 3472 o 350 691 2734.
4. **Actualizar la promoción** antes del 31 de octubre: texto de la landing, `priceValidUntil` y precio del schema.
5. **Decidir sobre el preloader.** Acortarlo es la mejora de LCP con mayor impacto; lo mantuve porque pidió conservar la experiencia.
6. **Revisar los textos de servicio**, en especial integraciones y plazos: salen del sitio y del chatbot, pero usted debe confirmarlos.
7. **Hacer una solicitud de prueba** desde el dominio publicado y revisar que llegue al correo.
8. **Configurar Search Console:**
   - Cree una propiedad de prefijo de URL con `https://cerebrodigitalio.qd.je/`.
   - Elija el método "Etiqueta HTML" y copie solo el valor de `content`.
   - Agréguelo en Netlify como variable `VITE_GOOGLE_SITE_VERIFICATION` y publique de nuevo.
   - Pulse Verificar y envíe `sitemap.xml` en la sección Sitemaps.
9. **Activar GA4, si lo desea:** agregue `VITE_GA_ID` en Netlify y actualice el aviso y la política de cookies, que hoy dicen que no hay analítica.
10. **Ejecutar Rich Results Test** y volver a medir PageSpeed Insights tras publicar.
11. **Activar el modo IA del chat, si lo necesita:** `/api/chat` da 404 en Netlify porque es una función de Vercel.
12. **Evaluar un dominio propio.** `qd.je` es gratuito y su proveedor puede cambiar las reglas.

## 10. Plan SEO de 90 días

Fechas de publicación sugeridas según la disponibilidad del equipo.

| Periodo | Acciones |
|---|---|
| **Días 1 a 15** | Publicar esta rama, resolver los pendientes 1 a 8, verificar Search Console, enviar el sitemap y solicitar indexación de portada y servicios. |
| **Días 16 a 30** | Revisar cobertura e impresiones. Crear o actualizar el perfil de Google Business solo si hay datos verificables. Conseguir los primeros casos reales con autorización. Acortar el preloader si se aprueba. |
| **Días 31 a 60** | Publicar 4 artículos: qué es un cerebro digital, chatbot frente a agente de IA, cómo elegir el primer proceso para automatizar, y qué necesita una pyme para empezar. Enlazar cada uno a su servicio. |
| **Días 61 a 90** | Crear una página por industria solo con casos reales. Ajustar títulos según las consultas de Search Console. Dividir el JavaScript si el LCP real sigue alto. Buscar menciones en directorios y gremios de Neiva y Colombia. |

**Indicadores:** páginas indexadas, impresiones y clics por clúster, posición media de marca, solicitudes del formulario y clics a WhatsApp.

`llms.txt` no se implementó: es experimental y no garantiza presencia en sistemas de IA.
