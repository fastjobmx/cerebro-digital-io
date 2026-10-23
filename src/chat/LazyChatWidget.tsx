// Carga diferida del chatbot: el widget (motor, base de conocimiento y estilos) va en
// un chunk aparte que se descarga cuando el navegador queda libre, o antes si alguien
// pide abrirlo. Así no compite con el primer pintado de la página.
import { Suspense, lazy, useEffect, useState } from 'react'

const ChatWidget = lazy(() => import('./ChatWidget').then((m) => ({ default: m.ChatWidget })))

const IDLE_TIMEOUT = 3500

/** Último `cerebro:open` recibido antes de que el widget existiera. */
let pending: { question?: string } | null = null
let widgetMounted = false

/** Se monta después del widget: reenvía la petición pendiente cuando ya escucha. */
function ReplayPending() {
  useEffect(() => {
    widgetMounted = true
    if (!pending) return
    const detail = pending
    pending = null
    window.dispatchEvent(new CustomEvent('cerebro:open', { detail }))
  }, [])
  return null
}

export function LazyChatWidget() {
  const [ready, setReady] = useState(false)

  // Escucha hasta que el widget esté montado (incluye el tiempo de descarga del chunk).
  useEffect(() => {
    const onOpen = (e: Event) => {
      if (widgetMounted) return
      pending = (e as CustomEvent<{ question?: string } | undefined>).detail ?? {}
      setReady(true)
    }
    window.addEventListener('cerebro:open', onOpen)
    return () => window.removeEventListener('cerebro:open', onOpen)
  }, [])

  useEffect(() => {
    if (ready) return
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    const load = () => setReady(true)
    const idleId = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: IDLE_TIMEOUT }) : undefined
    const timer = idleId === undefined ? window.setTimeout(load, 1500) : undefined

    return () => {
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [ready])

  if (!ready) return null
  return (
    <Suspense fallback={null}>
      <ChatWidget />
      <ReplayPending />
    </Suspense>
  )
}
