// Configuración central del sitio. Edite aquí los datos de contacto reales.
export const SITE = {
  name: 'CEREBRO DIGITAL IO',
  tagline: 'Inteligencia que automatiza.',
  motto: 'Usted decide. El Cerebro ejecuta.',
  // Número en formato internacional sin "+" ni espacios (ej. 573001234567).
  // Déjelo vacío para ocultar los botones de WhatsApp.
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER ?? '',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'hola@cerebrodigital.io',
  // Activa el modo IA del chatbot (requiere desplegar /api/chat con ANTHROPIC_API_KEY).
  aiEnabled: import.meta.env.VITE_AI_ENABLED === 'true',
  logo: {
    full: '/brand/logo-full.webp',
    mark: '/brand/logo-mark.webp',
    markSquare: '/brand/logo-mark-sq.webp',
    word: '/brand/logo-word.webp',
  },
}

export const NAV = [
  { label: 'El Cerebro', href: '#cerebro' },
  { label: 'Áreas', href: '#areas' },
  { label: 'Casos', href: '#casos' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Contacto', href: '#contacto' },
]

export const TOOLS = ['CRM', 'Correo', 'Agenda', 'Documentos', 'Mensajería', 'Reportes', 'Redes', 'Facturación']

export const VERBS = [
  { k: 'Conoce', d: 'Aprende su empresa: servicios, clientes, tono, reglas y procesos.' },
  { k: 'Conecta', d: 'Une CRM, correo, agenda, documentos y mensajería en un solo contexto.' },
  { k: 'Analiza', d: 'Lee datos dispersos y los convierte en lectura clara del negocio.' },
  { k: 'Propone', d: 'Prepara respuestas, campañas y decisiones listas para su revisión.' },
  { k: 'Coordina', d: 'Orquesta tareas entre personas, herramientas y tiempos.' },
  { k: 'Ejecuta', d: 'Realiza sólo lo que usted autoriza, con trazabilidad completa.' },
]

export const AREAS = [
  {
    id: 'marketing',
    n: '01',
    title: 'Marketing',
    short: 'Campañas, audiencias y reportes interpretados con contexto de negocio.',
    bullets: ['Lectura semanal de campañas', 'Segmentación de audiencias', 'Ajustes propuestos para aprobación'],
    ask: '¿Qué hace el Cerebro en el área de Marketing?',
  },
  {
    id: 'contenido',
    n: '02',
    title: 'Contenido',
    short: 'Publicaciones, correos y piezas preparadas para revisión humana.',
    bullets: ['Calendario editorial', 'Borradores con su tono de marca', 'Nada se publica sin su visto bueno'],
    ask: '¿Cómo ayuda el Cerebro con el contenido?',
  },
  {
    id: 'automatizacion',
    n: '03',
    title: 'Automatización',
    short: 'Flujos entre CRM, correo, agenda y documentos.',
    bullets: ['Clasificación de solicitudes', 'Recordatorios y seguimientos', 'Documentos generados al instante'],
    ask: '¿Qué procesos puede automatizar el Cerebro?',
  },
  {
    id: 'website',
    n: '04',
    title: 'Website',
    short: 'Un sitio que capta, responde y alimenta su operación.',
    bullets: ['Asistente conversacional 24/7', 'Captura y calificación de leads', 'Conectado a su CRM'],
    ask: '¿Qué incluye el área Website del Cerebro?',
  },
  {
    id: 'custom',
    n: '05',
    title: 'Su área',
    short: 'Diseñamos el área que su negocio realmente necesita.',
    bullets: ['Finanzas, RR. HH., soporte, logística…', 'Reglas y permisos a la medida', 'Escala cuando usted lo decide'],
    ask: '¿Pueden crear un área a la medida de mi empresa?',
  },
]

export const CASES = [
  { tag: 'Comercial', text: 'Clasificar solicitudes entrantes y preparar respuestas sugeridas.', ask: '¿Cómo clasificaría el Cerebro mis solicitudes comerciales?' },
  { tag: 'Operaciones', text: 'Coordinar agendas y recordatorios entre su equipo.', ask: '¿Cómo coordina el Cerebro agendas y recordatorios?' },
  { tag: 'Contenido', text: 'Proponer un calendario editorial a partir de sus objetivos.', ask: '¿Puede el Cerebro proponer un calendario editorial?' },
  { tag: 'Reportes', text: 'Resumir indicadores semanales en lenguaje claro.', ask: '¿Cómo serían los reportes semanales del Cerebro?' },
]

export const INDUSTRIES = ['Servicios profesionales', 'Comercio', 'Salud', 'Educación', 'Inmobiliario', 'Turismo', 'Manufactura']

export const STEPS = [
  { n: '01', k: 'Descubrir', d: 'Entendemos su empresa, procesos y herramientas actuales.' },
  { n: '02', k: 'Diseñar', d: 'Definimos qué piensa, qué propone y qué ejecuta el Cerebro.' },
  { n: '03', k: 'Conectar', d: 'Integramos las herramientas que usted ya utiliza.' },
  { n: '04', k: 'Configurar', d: 'Ajustamos reglas, tono, permisos y aprobaciones.' },
  { n: '05', k: 'Probar', d: 'Validamos cada proceso antes de ponerlo en marcha.' },
  { n: '06', k: 'Evolucionar', d: 'El Cerebro aprende de su operación y mejora con usted.' },
]

export const COMPARE = [
  { k: 'Agencia tradicional', d: 'Ejecuta por encargo, sin vivir dentro de su operación.' },
  { k: 'Chatbot', d: 'Responde preguntas, pero no coordina procesos.' },
  { k: 'CRM', d: 'Guarda información, pero no la interpreta.' },
  { k: 'Automatización suelta', d: 'Repite tareas sin entender el contexto.' },
]

/** Abre el chatbot y, opcionalmente, envía una pregunta. */
export function askCerebro(question?: string) {
  window.dispatchEvent(new CustomEvent('cerebro:open', { detail: { question } }))
}
