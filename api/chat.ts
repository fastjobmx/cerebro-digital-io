// Vercel Edge Function: POST /api/chat
// Recibe { messages: [{ role: 'user' | 'assistant', content }] } y devuelve la respuesta
// de Claude como TEXTO PLANO en streaming (chunks), listo para el widget.
// Requiere la variable de entorno ANTHROPIC_API_KEY.
import { SYSTEM_PROMPT } from '../src/chat/systemPrompt'

export const config = { runtime: 'edge' }

declare const process: { env: Record<string, string | undefined> }

const MODEL = 'claude-haiku-5-5'
const MAX_TOKENS = 600
const MAX_MESSAGES = 12
const MAX_CHARS = 2000

type Role = 'user' | 'assistant'
interface ChatMessage {
  role: Role
  content: string
}

const json = (body: unknown, status: number, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  })

/** Valida y recorta el historial recibido del cliente. */
function sanitize(input: unknown): ChatMessage[] {
  if (!input || typeof input !== 'object') return []
  const raw = (input as { messages?: unknown }).messages
  if (!Array.isArray(raw)) return []
  const list: ChatMessage[] = []
  for (const m of raw) {
    if (!m || typeof m !== 'object') continue
    const { role, content } = m as { role?: unknown; content?: unknown }
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') continue
    const text = content.trim().slice(0, MAX_CHARS)
    if (text) list.push({ role, content: text })
  }
  const recent = list.slice(-MAX_MESSAGES)
  // La API exige que la conversación empiece por un mensaje del usuario.
  while (recent.length && recent[0].role !== 'user') recent.shift()
  return recent
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405, { Allow: 'POST' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return json({ error: 'ANTHROPIC_API_KEY no configurada' }, 500)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'JSON inválido' }, 400)
  }

  const messages = sanitize(body)
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return json({ error: 'Se requiere al menos un mensaje del usuario' }, 400)
  }

  let upstream: Response
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // Respuestas de chat cortas: sin razonamiento extendido y esfuerzo bajo
        // para minimizar latencia hasta el primer token.
        thinking: { type: 'disabled' },
        output_config: { effort: 'low' },
        system: SYSTEM_PROMPT,
        messages,
        stream: true,
      }),
      signal: req.signal,
    })
  } catch (err) {
    console.error('[api/chat] fallo de red', err)
    return json({ error: 'No se pudo contactar al modelo' }, 502)
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '')
    console.error('[api/chat] Anthropic respondió', upstream.status, detail.slice(0, 500))
    return json({ error: 'El modelo no está disponible' }, 502)
  }

  // Traduce el SSE de Anthropic (content_block_delta / text_delta) a texto plano.
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const reader = upstream.body.getReader()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = ''
      const handleEvent = (block: string): boolean => {
        for (const line of block.split('\n')) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (!data) continue
          try {
            const evt = JSON.parse(data) as {
              type?: string
              delta?: { type?: string; text?: string; stop_reason?: string }
              error?: { message?: string }
            }
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta' && evt.delta.text) {
              controller.enqueue(encoder.encode(evt.delta.text))
            } else if (evt.type === 'message_delta' && evt.delta?.stop_reason === 'refusal') {
              console.warn('[api/chat] respuesta rechazada por el modelo')
            } else if (evt.type === 'error') {
              console.error('[api/chat] error en el stream', evt.error?.message)
              return false
            } else if (evt.type === 'message_stop') {
              return false
            }
          } catch {
            /* línea incompleta o no JSON: se ignora */
          }
        }
        return true
      }

      try {
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')
          let idx: number
          let keepGoing = true
          while (keepGoing && (idx = buffer.indexOf('\n\n')) !== -1) {
            const block = buffer.slice(0, idx)
            buffer = buffer.slice(idx + 2)
            keepGoing = handleEvent(block)
          }
          if (!keepGoing) break
        }
        if (buffer.trim()) handleEvent(buffer)
      } catch (err) {
        console.error('[api/chat] stream interrumpido', err)
      } finally {
        controller.close()
        reader.cancel().catch(() => {})
      }
    },
    cancel() {
      reader.cancel().catch(() => {})
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
