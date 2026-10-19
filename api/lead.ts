// Vercel Edge Function: POST /api/lead
// Recibe los datos capturados por el chatbot, los valida y los registra.
// Para enviarlos a su CRM / correo / automatización, defina LEAD_WEBHOOK_URL
// (por ejemplo un webhook de Make, Zapier, n8n, HubSpot o Slack) o reemplace
// el bloque marcado con "DESTINO" por su integración.
export const config = { runtime: 'edge' }

declare const process: { env: Record<string, string | undefined> }

interface Lead {
  nombre: string
  empresa: string
  correo: string
  whatsapp: string
  proceso: string
  fecha: string
  pagina: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ ok: false, error: 'Método no permitido' }, 405)

  let body: Record<string, unknown>
  try {
    const parsed: unknown = await req.json()
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('payload')
    body = parsed as Record<string, unknown>
  } catch {
    return json({ ok: false, error: 'JSON inválido' }, 400)
  }

  const lead: Lead = {
    nombre: str(body.nombre, 80),
    empresa: str(body.empresa, 120),
    correo: str(body.correo, 160).toLowerCase(),
    whatsapp: str(body.whatsapp, 24),
    proceso: str(body.proceso, 600),
    fecha: str(body.fecha, 40) || new Date().toISOString(),
    pagina: str(body.pagina, 300),
  }

  if (lead.nombre.length < 2 || !EMAIL_RE.test(lead.correo)) {
    return json({ ok: false, error: 'Datos incompletos' }, 422)
  }

  // Registro visible en los logs de Vercel (Functions → Logs).
  console.log('[lead]', JSON.stringify(lead))

  // ── DESTINO ── Reenvío opcional a un webhook (CRM, correo, Slack, hoja de cálculo…).
  const webhook = process.env.LEAD_WEBHOOK_URL
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'cerebro-chat', ...lead }),
      })
      if (!res.ok) console.error('[lead] webhook respondió', res.status)
    } catch (err) {
      console.error('[lead] webhook falló', err)
    }
  }

  return json({ ok: true })
}
