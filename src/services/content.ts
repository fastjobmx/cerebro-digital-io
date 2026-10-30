// Páginas de servicio. Cada una responde a una intención de búsqueda distinta.
// Todo el texto sale de lo que la empresa ya afirma en el sitio y en la base de
// conocimiento del chatbot: no agregue cifras, clientes ni garantías sin confirmarlas.

export interface ServiceFaq {
  q: string
  a: string
}

export interface ServiceDoc {
  page: string
  slug: string
  /** Texto del enlace y de la miga de pan. */
  label: string
  seoTitle: string
  seoDescription: string
  eyebrow: string
  title: string
  intro: string
  defineTitle: string
  define: string
  includesTitle: string
  includes: { k: string; d: string }[]
  examplesTitle: string
  examples: string[]
  faqs: ServiceFaq[]
  ask: string
  /** Enlaces contextuales hacia otros servicios. */
  related: string[]
}

export const SERVICES: ServiceDoc[] = [
  {
    page: 'automatizacion',
    slug: 'automatizacion-de-procesos',
    label: 'Automatización de procesos',
    seoTitle: 'Automatización de procesos con IA para empresas | Cerebro Digital IO',
    seoDescription:
      'Conectamos CRM, correo, agenda y documentos para clasificar solicitudes, hacer seguimientos y generar documentos con IA, siempre bajo la aprobación de su equipo.',
    eyebrow: 'Automatización',
    title: 'Automatización de procesos con inteligencia artificial para empresas',
    intro:
      'Conectamos su CRM, correo, agenda y documentos para que las tareas repetitivas se resuelvan con contexto, y para que su equipo apruebe lo importante.',
    defineTitle: '¿Qué es la automatización de procesos con IA?',
    define:
      'Es un conjunto de flujos que leen el contexto de cada caso antes de actuar. Una automatización suelta repite tareas sin entender lo que hace; el Cerebro Digital entiende el contexto y escala a una persona cuando hace falta.',
    includesTitle: 'Qué automatiza el Cerebro Digital',
    includes: [
      { k: 'Clasificación de solicitudes', d: 'Ordena las solicitudes entrantes por tipo, urgencia o prioridad.' },
      { k: 'Recordatorios y seguimientos', d: 'Los seguimientos dejan de depender de la memoria de una persona.' },
      { k: 'Documentos al instante', d: 'Genera propuestas, resúmenes y fichas a partir de sus datos.' },
    ],
    examplesTitle: 'Ejemplos en el día a día',
    examples: [
      'Comercial: clasifica cada solicitud de correo, web o WhatsApp y prepara una respuesta sugerida para que su equipo la revise.',
      'Operaciones: propone horarios según la disponibilidad real, envía recordatorios y avisa a la persona correcta cuando una tarea se atrasa.',
      'Reportes: resume los indicadores de la semana en lenguaje claro, con qué cambió y qué se recomienda hacer.',
    ],
    faqs: [
      {
        q: '¿Con qué herramientas se integra?',
        a: 'Con las que su empresa ya utiliza: CRM como HubSpot, Salesforce, Zoho o Pipedrive; correo y agenda como Gmail, Outlook o Google Calendar; mensajería como WhatsApp Business, Slack o Teams; y documentos en Google Drive o Microsoft 365. Los ERP y comercios electrónicos dependen del sistema y de su API disponible.',
      },
      {
        q: '¿Necesito conocimientos técnicos para empezar?',
        a: 'No. Necesita claridad sobre qué proceso le quita más tiempo hoy, acceso a las herramientas que ya usa y una persona de su equipo que valide reglas y aprobaciones.',
      },
      {
        q: '¿Cuánto tiempo toma la implementación?',
        a: 'Depende del alcance. Como referencia, una primera área suele estar operando en pocas semanas, y el plazo concreto se confirma después del diagnóstico.',
      },
    ],
    ask: '¿Qué procesos puede automatizar el Cerebro?',
    related: ['sitio-web-con-asistente-ia', 'marketing-con-ia'],
  },
  {
    page: 'marketing',
    slug: 'marketing-con-ia',
    label: 'Marketing con IA',
    seoTitle: 'Marketing con IA para empresas | Cerebro Digital IO',
    seoDescription:
      'Lectura semanal de campañas, segmentación de audiencias y ajustes propuestos con IA. Usted aprueba cada cambio antes de que se aplique a sus campañas.',
    eyebrow: 'Marketing',
    title: 'Marketing con inteligencia artificial y aprobación humana',
    intro:
      'El Cerebro Digital interpreta sus campañas con el contexto de su negocio y le propone qué ajustar. Nada se modifica sin su visto bueno.',
    defineTitle: '¿Cómo se aplica la IA al marketing de una empresa?',
    define:
      'Se usa para leer campañas y datos que hoy están dispersos, y convertirlos en una lectura clara del negocio. El Cerebro Digital prepara el análisis y las propuestas; la decisión de presupuesto, mensajes o públicos sigue siendo suya.',
    includesTitle: 'Qué hace el Cerebro Digital en marketing',
    includes: [
      { k: 'Lectura semanal de campañas', d: 'Un resumen en lenguaje claro de lo que pasó en la semana.' },
      { k: 'Segmentación de audiencias', d: 'Audiencias definidas a partir de sus datos reales.' },
      { k: 'Ajustes propuestos', d: 'Cambios de presupuesto, mensajes o públicos listos para su aprobación.' },
    ],
    examplesTitle: 'Lo que recibe cada semana',
    examples: [
      'Un resumen de sus indicadores en lenguaje simple.',
      'Qué cambió, por qué importa y qué se recomienda hacer.',
      'Alertas cuando algo se sale de lo normal.',
    ],
    faqs: [
      {
        q: '¿El Cerebro modifica mis campañas sin permiso?',
        a: 'No. Las acciones sensibles pasan por su visto bueno. Usted define qué puede hacer solo, qué requiere aprobación y qué nunca hace, y cada acción queda registrada.',
      },
      {
        q: '¿Se conecta con Meta Ads y Google Ads?',
        a: 'Sí, ambas plataformas de publicidad están entre las herramientas con las que se conecta el Cerebro Digital.',
      },
      {
        q: '¿En qué se diferencia de una agencia tradicional?',
        a: 'Una agencia tradicional ejecuta por encargo, sin vivir dentro de su operación. El Cerebro Digital conoce su empresa, conecta sus herramientas y ejecuta con su aprobación.',
      },
    ],
    ask: '¿Qué hace el Cerebro en el área de Marketing?',
    related: ['contenido-con-ia', 'automatizacion-de-procesos'],
  },
  {
    page: 'contenido',
    slug: 'contenido-con-ia',
    label: 'Contenido con IA',
    seoTitle: 'Creación de contenido con IA para empresas | Cerebro Digital IO',
    seoDescription:
      'Calendario editorial y borradores de publicaciones y correos con el tono de su marca. Con IA, pero sin publicar nada hasta que su equipo lo apruebe.',
    eyebrow: 'Contenido',
    title: 'Creación de contenido con IA y con el tono de su marca',
    intro:
      'El Cerebro Digital prepara publicaciones, correos y piezas para revisión humana, de modo que su equipo deje de empezar desde una hoja en blanco.',
    defineTitle: '¿Qué significa crear contenido con IA y revisión humana?',
    define:
      'Significa que la IA propone y su equipo decide. El Cerebro Digital aprende los servicios, clientes, tono y reglas de su empresa, prepara los borradores y los deja listos para revisión. Nada se publica sin su visto bueno.',
    includesTitle: 'Qué prepara el Cerebro Digital',
    includes: [
      { k: 'Calendario editorial', d: 'Una propuesta construida a partir de sus objetivos.' },
      { k: 'Borradores con su tono', d: 'Publicaciones, correos y piezas escritas con el tono de su marca.' },
      { k: 'Flujo de revisión', d: 'Cada pieza espera la aprobación de su equipo antes de publicarse.' },
    ],
    examplesTitle: 'Cómo se ve el flujo de trabajo',
    examples: [
      'Usted define los objetivos del periodo y el Cerebro propone el calendario editorial.',
      'El Cerebro prepara los borradores de cada pieza con su tono de marca.',
      'Su equipo revisa, ajusta y aprueba antes de cualquier publicación.',
    ],
    faqs: [
      {
        q: '¿El contenido se publica de forma automática?',
        a: 'No. Las publicaciones son acciones sensibles: esperan siempre su aprobación.',
      },
      {
        q: '¿Reemplaza a mi equipo de contenido?',
        a: 'No. Se ocupa de lo repetitivo, como preparar borradores, para que su gente dedique el tiempo a lo que requiere criterio, relación y creatividad.',
      },
      {
        q: '¿Cómo aprende el tono de mi marca?',
        a: 'Durante la configuración se ajustan las reglas, el tono, los permisos y las aprobaciones, y el Cerebro sigue mejorando con su operación.',
      },
    ],
    ask: '¿Cómo ayuda el Cerebro con el contenido?',
    related: ['marketing-con-ia', 'sitio-web-con-asistente-ia'],
  },
  {
    page: 'website',
    slug: 'sitio-web-con-asistente-ia',
    label: 'Sitio web con asistente de IA',
    seoTitle: 'Sitio web con asistente de IA para empresas | Cerebro Digital IO',
    seoDescription:
      'Un sitio que capta, responde y alimenta su operación: asistente conversacional 24/7, captura y calificación de leads, y conexión con su CRM.',
    eyebrow: 'Website',
    title: 'Sitio web con asistente de IA para captar y calificar clientes',
    intro:
      'Su sitio deja de ser un folleto y se vuelve parte de la operación: capta, responde y entrega cada contacto a su equipo con contexto.',
    defineTitle: '¿Qué es un sitio web con asistente de IA?',
    define:
      'Es un sitio que incorpora un asistente conversacional entrenado con la información de su empresa. Atiende a los visitantes a cualquier hora, hace las preguntas correctas y registra cada contacto. El asistente de este sitio es un ejemplo de cómo funciona.',
    includesTitle: 'Qué incluye',
    includes: [
      { k: 'Asistente conversacional 24/7', d: 'Entrenado con la información de su empresa.' },
      { k: 'Captura y calificación de leads', d: 'Hace las preguntas correctas antes de pasar el contacto a su equipo.' },
      { k: 'Conexión con su CRM', d: 'Cada contacto llega con el contexto de la conversación.' },
    ],
    examplesTitle: 'Qué pasa cuando alguien visita su sitio',
    examples: [
      'El visitante pregunta por un servicio y el asistente responde con información aprobada por usted.',
      'Si hay interés, el asistente toma los datos necesarios para que su equipo prepare la respuesta.',
      'El contacto queda en su CRM para que nadie pierda el seguimiento.',
    ],
    faqs: [
      {
        q: '¿En qué se diferencia de un chatbot tradicional?',
        a: 'Un chatbot responde preguntas, pero no coordina procesos. El Cerebro Digital además conoce su empresa, conecta sus herramientas y ejecuta sólo lo que usted autoriza.',
      },
      {
        q: '¿Puede hablar el visitante con una persona?',
        a: 'Sí. Si alguien prefiere hablar con su equipo, el asistente le ofrece los canales de contacto.',
      },
      {
        q: '¿Y si solo necesito una página sencilla?',
        a: 'Para negocios que buscan una página de una sección con botón de WhatsApp, tenemos el servicio de landing pages, que es independiente del Cerebro Digital.',
      },
    ],
    ask: '¿Qué incluye el área Website del Cerebro?',
    related: ['automatizacion-de-procesos', 'contenido-con-ia'],
  },
]

export const servicePath = (s: Pick<ServiceDoc, 'slug'>) => `/servicios/${s.slug}/`
export const SERVICE_BY_PAGE = Object.fromEntries(SERVICES.map((s) => [s.page, s]))
export const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s]))
export const SERVICE_LINKS = SERVICES.map((s) => ({ label: s.label, href: servicePath(s) }))
