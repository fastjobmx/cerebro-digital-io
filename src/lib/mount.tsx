import { StrictMode } from 'react'
import type { ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { initAnalytics } from './analytics'

/** Hidrata el HTML prerenderizado en el build; en desarrollo el contenedor llega vacío. */
export function mount(root: HTMLElement, node: ReactNode) {
  const tree = <StrictMode>{node}</StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, tree)
  else createRoot(root).render(tree)
  initAnalytics()
}
