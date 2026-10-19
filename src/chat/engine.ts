// Motor conversacional local: NLU ligera (sin dependencias) + captura de leads.
// Funciona 100 % en el navegador; el modo IA (ai.ts) lo usa como respaldo.
import { SITE } from '../config/site'
import { DEFAULT_REPLIES, FALLBACK_SUGGESTIONS, INTENTS, INTENT_BY_ID, type Intent } from './knowledge'

/* ───────────────────────────── Tipos ───────────────────────────── */

export type ChatActionKind = 'whatsapp' | 'email' | 'lead' | 'link'

export interface ChatAction {
  kind: ChatActionKind
  label: string
  href?: string
}

export interface BotReply {
  text: string
  quickReplies?: string[]
  actions?: ChatAction[]
  intentId?: string
  /** intent = respuesta de la base · fallback = no entendido · lead = flujo de captura */
  kind: 'intent' | 'fallback' | 'lead'
}

export type LeadField = 'nombre' | 'empresa' | 'correo' | 'whatsapp' | 'proceso'
export type LeadStep = LeadField | 'confirm' | 'edit'

export interface LeadData {
  nombre: string
  empresa: string
  correo: string
  whatsapp: string
  proceso: string
}

export interface LeadState {
  step: LeadStep
  data: Partial<LeadData>
  /** true cuando se corrige un dato desde el resumen */
  editing: boolean
}

export interface EngineState {
  lastIntent?: string
  lead?: LeadState
}

export interface EngineResult {
  reply: BotReply
  state: EngineState
}

/* ───────────────────────────── Normalización ───────────────────────────── */

const STOPWORDS = new Set(
  (
    'a al algo algun alguna algunas alguno algunos ante antes asi aun cada como con contra cual cuales cuando cuanto cuanta ' +
    'de del desde donde durante e el ella ellas ellos en entre era es esa esas ese eso esos esta estas este esto estos esta estan estoy ' +
    'fue ha han hay haber hace hacen hacer la las le les lo los me mi mis mucho muy mas ni nos nosotros o os otra otro para pero ' +
    'poco por porque puede pueden puedo pudiera que quien quiero quisiera se sea ser seria si sin sobre su sus tal tambien te tengo ' +
    'tiene tienen ti tu tus un una uno unos unas usted ustedes y ya yo favor porfa podria podrian saber decir cerebro digital io ' +
    'empresa empresas negocio negocios compania hola'
  ).split(' '),
)
// "hola" es stopword para el puntaje por tokens, pero sigue detectándose como frase/keyword
// gracias a que las keywords se comparan con la lista completa de tokens (ver scoreIntent).

/** minúsculas, sin tildes, sin puntuación, espacios colapsados. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9@+/\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenize(norm: string): string[] {
  return norm.split(' ').filter((t) => t.length >= 2)
}

/** Distancia Damerau-Levenshtein (variante OSA) con corte temprano. */
function damerau(a: string, b: string, max = 1): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const m = a.length
  const n = b.length
  let prev2: number[] = []
  let prev: number[] = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur: number[] = [i]
    let rowMin = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1)
      cur[j] = v
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return max + 1
    prev2 = prev
    prev = cur
  }
  return prev[n]
}

/** Similitud entre tokens: 1 exacto · 0.8 errata · 0.7 misma raíz. */
function tokenSim(a: string, b: string): number {
  if (a === b) return 1
  const min = Math.min(a.length, b.length)
  if (min >= 5 && damerau(a, b) <= 1) return 0.8
  if (min >= 6 && a.slice(0, 6) === b.slice(0, 6)) return 0.7
  // Palabras largas toleran dos errores ("intregaciones").
  if (min >= 9 && damerau(a, b, 2) <= 2) return 0.75
  if (min >= 5 && (a.startsWith(b) || b.startsWith(a))) return 0.7
  return 0
}

/* ───────────────────────────── Índice de intenciones ───────────────────────────── */

interface Phrase {
  text: string
  tokens: string[]
}
interface Compiled {
  intent: Intent
  keywords: string[]
  phrases: Phrase[]
}

const COMPILED: Compiled[] = INTENTS.map((intent) => {
  const keywords: string[] = []
  const phrases: Phrase[] = []
  for (const p of intent.patterns) {
    const n = normalize(p)
    if (!n) continue
    if (n.includes(' ')) phrases.push({ text: n, tokens: tokenize(n).filter((t) => !STOPWORDS.has(t)) })
    else keywords.push(n)
  }
  return { intent, keywords, phrases }
})

function scoreIntent(c: Compiled, padded: string, allTokens: string[], content: string[]): number {
  // Keywords: cada token del usuario aporta su mejor coincidencia.
  // Las keywords cortas o de cortesía ("hola", "ok") se comparan con todos los tokens.
  let kw = 0
  for (const t of allTokens) {
    const isContent = content.includes(t)
    let best = 0
    for (const k of c.keywords) {
      const s = isContent ? tokenSim(t, k) : t === k ? 1 : 0
      if (s > best) best = s
      if (best === 1) break
    }
    kw += best
  }
  // Frases: se toma la mejor (evita que intenciones con muchos patrones dominen).
  let ph = 0
  for (const p of c.phrases) {
    let s = 0
    if (padded.includes(` ${p.text} `)) s = 1.2 + 0.6 * p.text.split(' ').length
    else if (p.tokens.length >= 2 && p.tokens.every((pt) => content.some((t) => tokenSim(t, pt) >= 0.8))) s = 0.8 * p.tokens.length
    if (s > ph) ph = s
  }
  return kw + ph
}

const THRESHOLD = 0.75

interface Ranked {
  intent: Intent
  raw: number
  score: number
}

/** Ordena las intenciones para un texto normalizado, con un poco de contexto. */
export function rankIntents(norm: string, state: EngineState = {}): Ranked[] {
  const padded = ` ${norm} `
  const allTokens = tokenize(norm)
  const content = allTokens.filter((t) => !STOPWORDS.has(t))
  const lastGroup = state.lastIntent ? INTENT_BY_ID[state.lastIntent]?.group : undefined
  // Mensajes elípticos ("¿y en salud?", "¿y contenido?") heredan el tema anterior.
  const elliptic = content.length <= 3 && (norm.startsWith('y ') || allTokens.length <= 4)

  return COMPILED.map((c) => {
    const raw = scoreIntent(c, padded, allTokens, content)
    let score = raw * (c.intent.weight ?? 1)
    if (raw > 0 && elliptic && lastGroup && c.intent.group === lastGroup) score += 0.5
    return { intent: c.intent, raw, score }
  })
    .filter((r) => r.raw >= THRESHOLD)
    .sort((a, b) => b.score - a.score)
}

export function matchIntent(text: string, state: EngineState = {}): Ranked | undefined {
  return rankIntents(normalize(text), state)[0]
}

/* ───────────────────────────── Contacto ───────────────────────────── */

const waNumber = (): string => String(SITE.whatsapp ?? '').replace(/\D/g, '')
const contactEmail = (): string => String(SITE.email ?? '')

export function whatsappHref(message: string): string | undefined {
  const n = waNumber()
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(message)}` : undefined
}

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${contactEmail()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function contactActions(withLead = false): ChatAction[] {
  const actions: ChatAction[] = []
  const wa = whatsappHref('Hola, me gustaría recibir información sobre el Cerebro Digital.')
  if (wa) actions.push({ kind: 'whatsapp', label: 'Escribir por WhatsApp', href: wa })
  if (contactEmail()) {
    actions.push({
      kind: 'email',
      label: contactEmail(),
      href: mailtoHref('Información sobre el Cerebro Digital', 'Hola, me gustaría recibir información sobre el Cerebro Digital.\n\n'),
    })
  }
  if (withLead) actions.push({ kind: 'lead', label: 'Dejar mis datos' })
  return actions
}

/* ───────────────────────────── Captura de leads ───────────────────────────── */

const LEAD_ORDER: LeadField[] = ['nombre', 'empresa', 'correo', 'whatsapp', 'proceso']
const FIELD_LABEL: Record<LeadField, string> = {
  nombre: 'Nombre',
  empresa: 'Empresa',
  correo: 'Correo',
  whatsapp: 'WhatsApp',
  proceso: 'Proceso',
}
const PROCESS_SUGGESTIONS = ['Atención de clientes', 'Seguimiento comercial', 'Contenido y redes', 'Reportes']
const CONFIRM_REPLIES = ['Sí, enviar', 'Editar', 'Cancelar']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const CANCEL_RE = /^(cancel|salir\b|detener\b|parar\b|stop\b|terminar\b|olvidalo\b|olvidelo\b|ya no\b|no quiero\b)/
const SKIP_RE = /^(omitir|omito|saltar|salta|paso|skip|no|no tengo|ninguno|prefiero no|sin whatsapp|no gracias)$/
const AFFIRM = new Set([
  'si', 'sii', 'claro', 'dale', 'ok', 'okay', 'okey', 'vale', 'por supuesto', 'de acuerdo', 'adelante', 'me interesa', 'perfecto',
  'bueno', 'si claro', 'claro que si', 'si por favor', 'por favor', 'listo', 'hagamoslo', 'si quiero', 'si me interesa', 'si gracias',
  'si enviar', 'enviar', 'confirmar', 'confirmo', 'correcto', 'todo bien', 'esta bien', 'todo correcto', 'si esta bien', 'si correcto',
])
const NEGATIVE = new Set(['no', 'no gracias', 'ahora no', 'despues', 'mas tarde', 'todavia no', 'no por ahora', 'por ahora no', 'luego'])

/** Limpia valores escritos por el usuario antes de mostrarlos en markdown. */
const clean = (s: string): string => s.replace(/[*[\]`]/g, '').replace(/\s+/g, ' ').trim()

function titleCase(s: string): string {
  if (s !== s.toLowerCase()) return s
  return s.replace(/(^|\s)(\p{L})/gu, (_, sp: string, ch: string) => sp + ch.toUpperCase())
}

function question(field: LeadField, data: Partial<LeadData>, editing: boolean): { text: string; quickReplies?: string[] } {
  if (editing) {
    const map: Record<LeadField, string> = {
      nombre: 'Escriba su **nombre** correcto, por favor.',
      empresa: 'Escriba el nombre correcto de su **empresa**.',
      correo: 'Escriba su **correo electrónico** correcto.',
      whatsapp: 'Escriba su número de **WhatsApp** (o «omitir»).',
      proceso: 'Cuénteme de nuevo qué **proceso** le gustaría automatizar.',
    }
    return { text: map[field], quickReplies: field === 'whatsapp' ? ['Omitir'] : undefined }
  }
  switch (field) {
    case 'nombre':
      return { text: 'Para empezar, ¿cuál es su **nombre**?' }
    case 'empresa':
      return { text: `Mucho gusto, ${data.nombre ?? ''}. ¿Cuál es el nombre de su **empresa**?` }
    case 'correo':
      return { text: '¿A qué **correo electrónico** podemos escribirle?' }
    case 'whatsapp':
      return {
        text: '¿Tiene un número de **WhatsApp** de contacto? Es opcional; puede escribir «omitir».',
        quickReplies: ['Omitir'],
      }
    case 'proceso':
      return {
        text: 'Por último, ¿qué **proceso** le gustaría automatizar o mejorar primero?',
        quickReplies: PROCESS_SUGGESTIONS,
      }
  }
}

function summary(d: Partial<LeadData>): string {
  return [
    'Perfecto. Revise que todo esté correcto:',
    '',
    `- **Nombre:** ${clean(d.nombre ?? '')}`,
    `- **Empresa:** ${clean(d.empresa ?? '')}`,
    `- **Correo:** ${clean(d.correo ?? '')}`,
    `- **WhatsApp:** ${d.whatsapp ? clean(d.whatsapp) : 'No indicado'}`,
    `- **Proceso:** ${clean(d.proceso ?? '')}`,
    '',
    '¿Envío la solicitud?',
  ].join('\n')
}

function leadReply(text: string, lead: LeadState | undefined, prev: EngineState, quickReplies?: string[], actions?: ChatAction[]): EngineResult {
  return {
    reply: { text, quickReplies, actions, kind: 'lead', intentId: 'demo' },
    state: { ...prev, lastIntent: lead ? 'demo' : 'lead_done', lead },
  }
}

function askStep(lead: LeadState, prev: EngineState, prefix = ''): EngineResult {
  if (lead.step === 'confirm') return leadReply(prefix + summary(lead.data), lead, prev, CONFIRM_REPLIES)
  if (lead.step === 'edit') {
    return leadReply(prefix + '¿Qué dato desea corregir?', lead, prev, [...LEAD_ORDER.map((f) => FIELD_LABEL[f])])
  }
  const q = question(lead.step, lead.data, lead.editing)
  return leadReply(prefix + q.text, lead, prev, q.quickReplies)
}

/** Siguiente paso tras completar un campo. */
function advance(lead: LeadState, field: LeadField, value: string): LeadState {
  const data = { ...lead.data, [field]: value }
  if (lead.editing) return { step: 'confirm', data, editing: false }
  const next = LEAD_ORDER[LEAD_ORDER.indexOf(field) + 1]
  return { step: next ?? 'confirm', data, editing: false }
}

/** Guarda el lead localmente y lo envía a /api/lead (silencioso si falla). */
function submitLead(data: LeadData): void {
  const lead = {
    ...data,
    fecha: new Date().toISOString(),
    pagina: typeof location !== 'undefined' ? location.href : '',
  }
  try {
    const raw = localStorage.getItem('cerebro-leads')
    const parsed: unknown = raw ? JSON.parse(raw) : []
    const list = Array.isArray(parsed) ? parsed : []
    list.push(lead)
    localStorage.setItem('cerebro-leads', JSON.stringify(list))
  } catch {
    /* almacenamiento no disponible */
  }
  try {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      keepalive: true,
    })
      .then((r) => {
        if (!r.ok) console.debug('[cerebro] /api/lead respondió', r.status)
      })
      .catch((e: unknown) => console.debug('[cerebro] lead no enviado', e))
  } catch (e) {
    console.debug('[cerebro] lead no enviado', e)
  }
}

function completeLead(d: LeadData, prev: EngineState): EngineResult {
  submitLead(d)
  const firstName = clean(d.nombre).split(' ')[0]
  const msg = [
    `Hola, soy ${d.nombre}${d.empresa ? ` de ${d.empresa}` : ''}. Me interesa una demostración del Cerebro Digital.`,
    `Proceso a automatizar: ${d.proceso}`,
    `Correo: ${d.correo}`,
    d.whatsapp ? `WhatsApp: ${d.whatsapp}` : '',
  ]
    .filter(Boolean)
    .join('\n')
  const wa = whatsappHref(msg)
  const actions: ChatAction[] = wa
    ? [{ kind: 'whatsapp', label: 'Continuar por WhatsApp', href: wa }]
    : [{ kind: 'email', label: 'Enviar por correo', href: mailtoHref(`Demostración Cerebro Digital · ${d.empresa}`, msg) }]
  const text =
    `¡Gracias, ${firstName}! Recibimos su solicitud.\n\nUn especialista revisará su caso y le escribirá a **${clean(d.correo)}** para agendar su demostración.\n\n` +
    (wa ? 'Si lo prefiere, puede adelantar la conversación ahora mismo:' : 'Si lo prefiere, también puede escribirnos directamente:')
  return leadReply(text, undefined, prev, ['¿Cómo es la implementación?', '¿Qué necesito para empezar?'], actions)
}

function parseField(field: LeadField, raw: string, norm: string): { ok: true; value: string } | { ok: false; error: string } {
  switch (field) {
    case 'nombre': {
      const v = clean(raw.replace(/^(hola[\s,.!]*)?(me llamo|mi nombre es|yo soy|soy|nombre:?)\s+/i, '')).slice(0, 80)
      if (v.length < 2 || /[@\d]/.test(v)) return { ok: false, error: 'Disculpe, no logré identificar su nombre. ¿Cómo se llama?' }
      return { ok: true, value: titleCase(v) }
    }
    case 'empresa': {
      const v = clean(raw.replace(/^(mi empresa es|la empresa es|mi empresa se llama|se llama|trabajo en|empresa:?)\s+/i, '')).slice(0, 120)
      if (v.length < 2) return { ok: false, error: '¿Me indica el nombre de su empresa, por favor?' }
      return { ok: true, value: v }
    }
    case 'correo': {
      const found = raw.match(/[^\s@<>(),;:]+@[^\s@<>(),;:]+\.[a-z]{2,}/i)?.[0] ?? raw.trim()
      const v = found.toLowerCase().replace(/[.]+$/, '')
      if (!EMAIL_RE.test(v) || v.length > 160) {
        return { ok: false, error: 'Ese correo no parece válido. ¿Podría revisarlo? Por ejemplo: nombre@empresa.com' }
      }
      return { ok: true, value: v }
    }
    case 'whatsapp': {
      if (SKIP_RE.test(norm)) return { ok: true, value: '' }
      const digits = raw.replace(/\D/g, '')
      if (digits.length < 7 || digits.length > 15) {
        return {
          ok: false,
          error: 'No logré reconocer ese número. Escríbalo con el indicativo de su país (por ejemplo, +57 300 123 4567) o escriba «omitir».',
        }
      }
      return { ok: true, value: clean(raw).replace(/[^\d+\s()-]/g, '').trim().slice(0, 24) }
    }
    case 'proceso': {
      const v = clean(raw).slice(0, 600)
      if (v.length < 3) return { ok: false, error: '¿Podría contarme un poco más sobre el proceso que le gustaría automatizar?' }
      return { ok: true, value: v }
    }
  }
}

function handleLead(raw: string, norm: string, prev: EngineState, lead: LeadState): EngineResult {
  // Cancelar en cualquier momento.
  if (CANCEL_RE.test(norm)) {
    return {
      reply: {
        text: 'Listo, he cancelado la solicitud; no se guardó ningún dato. ¿En qué más puedo ayudarle?',
        quickReplies: DEFAULT_REPLIES,
        kind: 'lead',
      },
      state: { lastIntent: undefined, lead: undefined },
    }
  }

  if (lead.step === 'confirm') {
    if (/^(editar|corregir|cambiar|modificar)\b/.test(norm) || norm === 'no') {
      return askStep({ ...lead, step: 'edit' }, prev)
    }
    if (AFFIRM.has(norm) || /^(si|enviar|confirm)/.test(norm)) {
      return completeLead(lead.data as LeadData, prev)
    }
    return askStep(lead, prev, 'Para continuar, elija «Sí, enviar» o «Editar».\n\n')
  }

  if (lead.step === 'edit') {
    const field = LEAD_ORDER.find((f) => {
      const alias: Record<LeadField, RegExp> = {
        nombre: /\bnombre\b/,
        empresa: /\bempresa\b/,
        correo: /\b(correo|email|mail|e mail)\b/,
        whatsapp: /\b(whatsapp|telefono|numero|celular|movil)\b/,
        proceso: /\bproceso\b/,
      }
      return alias[f].test(norm)
    })
    if (!field) return askStep(lead, prev, 'No identifiqué el dato. ')
    return askStep({ ...lead, step: field, editing: true }, prev)
  }

  const field = lead.step

  // Si el usuario hace una pregunta clara en medio del registro, se responde y se retoma.
  if (field !== 'proceso' && raw.includes('?')) {
    const best = rankIntents(norm, prev)[0]
    if (best && best.raw >= 1.5 && best.intent.group !== 'cortesia' && !best.intent.action) {
      return askStep(lead, prev, `${best.intent.answer}\n\n**Retomemos:** `)
    }
  }

  const parsed = parseField(field, raw, norm)
  if (!parsed.ok) {
    const q = question(field, lead.data, lead.editing)
    return leadReply(parsed.error, lead, prev, q.quickReplies)
  }
  return askStep(advance(lead, field, parsed.value), prev)
}

/* ───────────────────────────── Respuestas ───────────────────────────── */

function startLead(intent: Intent | undefined, prev: EngineState): EngineResult {
  const lead: LeadState = { step: 'nombre', data: {}, editing: false }
  const intro = intent?.answer ?? 'Con gusto. Le haré **cinco preguntas breves** para que un especialista le contacte.'
  return askStep(lead, prev, `${intro}\n\n`)
}

function fromIntent(intent: Intent, prev: EngineState): EngineResult {
  if (intent.action === 'lead') return startLead(intent, prev)
  const actions =
    intent.action === 'whatsapp' ? contactActions(false) : intent.action === 'human' ? contactActions(true) : undefined
  return {
    reply: {
      text: intent.answer,
      quickReplies: intent.quickReplies ?? (intent.action ? undefined : DEFAULT_REPLIES),
      actions,
      intentId: intent.id,
      kind: 'intent',
    },
    state: { ...prev, lastIntent: intent.id },
  }
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function fallback(norm: string, prev: EngineState): EngineResult {
  const start = hash(norm) % FALLBACK_SUGGESTIONS.length
  const picks = [0, 1, 2].map((i) => FALLBACK_SUGGESTIONS[(start + i) % FALLBACK_SUGGESTIONS.length])
  return {
    reply: {
      text:
        'No estoy seguro de haber entendido su pregunta. Puedo ayudarle con temas como estos, o, si lo prefiere, un especialista puede responderle personalmente.',
      quickReplies: picks,
      actions: [{ kind: 'lead', label: 'Hablar con un especialista' }],
      kind: 'fallback',
    },
    state: { ...prev, lastIntent: undefined },
  }
}

/** Punto de entrada: procesa un mensaje del usuario y devuelve la respuesta + nuevo estado. */
export function respond(input: string, prev: EngineState = {}): EngineResult {
  const raw = input.trim().slice(0, 600)
  const norm = normalize(raw)

  if (prev.lead) return handleLead(raw, norm, prev, prev.lead)

  // "Sí" / "No" a la pregunta final de la respuesta anterior.
  const last = prev.lastIntent ? INTENT_BY_ID[prev.lastIntent] : undefined
  if (last?.onYes && AFFIRM.has(norm)) {
    const target = INTENT_BY_ID[last.onYes]
    if (target) return fromIntent(target, prev)
  }
  if (last?.onYes && NEGATIVE.has(norm)) {
    return {
      reply: { text: 'Sin problema. ¿Hay algo más en lo que pueda ayudarle?', quickReplies: DEFAULT_REPLIES, kind: 'intent' },
      state: { ...prev, lastIntent: undefined },
    }
  }

  const best = rankIntents(norm, prev)[0]
  if (!best) return fallback(norm, prev)
  return fromIntent(best.intent, prev)
}

/** Inicia directamente el flujo de captura (botón «Dejar mis datos»). */
export function beginLead(prev: EngineState = {}): EngineResult {
  return startLead(INTENT_BY_ID.demo, prev)
}
