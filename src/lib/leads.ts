import { SITE } from '../config/site'
import { trackEvent } from './analytics'

/**
 * Envío de solicitudes (formulario y chatbot) al correo de la empresa vía FormSubmit.
 * - Sin servidor ni cuentas: https://formsubmit.co
 * - La PRIMERA vez que se envía, FormSubmit manda un correo de activación al buzón;
 *   hasta hacer clic en "Activate Form" los mensajes no se entregan.
 * Además se guarda una copia local (localStorage) como respaldo.
 */

export type LeadPayload = Record<string, string | undefined>

const LABELS: Record<string, string> = {
  nombre: 'Nombre',
  empresa: 'Empresa',
  correo: 'Correo',
  whatsapp: 'WhatsApp',
  sector: 'Sector',
  proceso: 'Proceso a automatizar',
  mensaje: 'Mensaje',
}

// Rate limiting: prevent spam flooding (max 1 lead per 30 seconds per session)
let lastLeadTime = 0
const MIN_LEAD_INTERVAL_MS = 30_000

export async function sendLead(data: LeadPayload, origen: 'formulario' | 'chatbot'): Promise<boolean> {
  const now = Date.now()
  if (now - lastLeadTime < MIN_LEAD_INTERVAL_MS) {
    console.debug('[cerebro] lead throttled; too soon since last submission')
    return false
  }
  lastLeadTime = now

  const fecha = new Date().toISOString()
  const record = { ...data, origen, fecha, pagina: location.href }

  try {
    const raw = localStorage.getItem('cerebro-leads')
    const parsed: unknown = raw ? JSON.parse(raw) : []
    const list = Array.isArray(parsed) ? parsed : []
    // Cap at 100 entries to prevent localStorage overflow (~5MB limit)
    const MAX_LEADS = 100
    const trimmed = list.length >= MAX_LEADS ? list.slice(list.length - MAX_LEADS + 1) : list
    localStorage.setItem('cerebro-leads', JSON.stringify([...trimmed, record]))
  } catch {
    /* almacenamiento no disponible */
  }

  const body: Record<string, string> = {
    _subject: `Nueva solicitud (${origen}) · ${data.empresa || data.nombre || 'Cerebro Digital'}`,
    _template: 'table',
    _captcha: 'false',
  }
  if (data.correo) body._replyto = data.correo
  for (const [k, v] of Object.entries(data)) {
    if (v) body[LABELS[k] ?? k] = v
  }
  body['Origen'] = origen === 'chatbot' ? 'Chatbot del sitio' : 'Formulario de contacto'
  body['Autorización de datos'] = 'Sí — aceptó la Política de privacidad'
  body['Fecha'] = new Date(fecha).toLocaleString('es-CO', { timeZone: 'America/Bogota' })

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SITE.leadInbox)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean }
    const ok = res.ok && String(json.success) !== 'false'
    if (ok) trackEvent('generate_lead', { origen })
    return ok
  } catch {
    return false
  }
}
