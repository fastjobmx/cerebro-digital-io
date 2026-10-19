// Modo híbrido: si SITE.aiEnabled, las respuestas abiertas se generan con IA
// vía /api/chat (texto plano en streaming). Ante cualquier error, el widget
// recurre al motor local. El flujo de captura de leads siempre es local.
import { SITE } from '../config/site'
import type { BotReply, EngineState } from './engine'

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export const AI_ENABLED: boolean = SITE.aiEnabled === true

/** Tiempo máximo de espera hasta el primer fragmento de texto. */
const FIRST_TOKEN_TIMEOUT = 15000
const MAX_HISTORY = 12

/**
 * Decide si un mensaje debe ir a la IA: sólo cuando no hay flujo de leads activo
 * y la respuesta local no incluye acciones (contacto, demo, etc.).
 */
export function shouldUseAI(reply: BotReply, nextState: EngineState, prevState: EngineState): boolean {
  if (!AI_ENABLED) return false
  if (prevState.lead || nextState.lead || reply.kind === 'lead') return false
  if (reply.actions?.some((a) => a.kind !== 'lead')) return false
  return true
}

/**
 * Generador asíncrono que entrega fragmentos de texto a medida que llegan.
 * Lanza un error si la respuesta no es válida (el llamador debe hacer fallback).
 */
export async function* streamChat(messages: AIMessage[], signal?: AbortSignal): AsyncGenerator<string, void, void> {
  const ctrl = new AbortController()
  const onAbort = () => ctrl.abort()
  signal?.addEventListener('abort', onAbort)
  const timer = window.setTimeout(() => ctrl.abort(), FIRST_TOKEN_TIMEOUT)

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages
          .filter((m) => m.content.trim())
          .slice(-MAX_HISTORY)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) })),
      }),
      signal: ctrl.signal,
    })
    if (!res.ok || !res.body) throw new Error(`/api/chat ${res.status}`)
    const type = res.headers.get('content-type') ?? ''
    // En desarrollo sin /api, Vite puede devolver index.html con 200.
    if (type.includes('text/html')) throw new Error('/api/chat no disponible')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let received = false
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      if (!chunk) continue
      if (!received) {
        received = true
        window.clearTimeout(timer)
      }
      yield chunk
    }
    const tail = decoder.decode()
    if (tail) yield tail
    if (!received) throw new Error('Respuesta vacía')
  } finally {
    window.clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}

/** Variante con callback: devuelve el texto completo y llama a onToken por fragmento. */
export async function askAI(
  messages: AIMessage[],
  onToken: (chunk: string, full: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  let full = ''
  for await (const chunk of streamChat(messages, signal)) {
    full += chunk
    onToken(chunk, full)
  }
  if (!full.trim()) throw new Error('Respuesta vacía')
  return full
}
