// Medición opcional con Google Analytics 4. Sólo se activa si existe VITE_GA_ID
// y el visitante aceptó las cookies; sin esas dos condiciones no carga nada.
import { hasAnalyticsConsent } from '../components/Consent'

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

type Gtag = (...args: unknown[]) => void
type GaWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag }

let started = false

function start() {
  if (started || !GA_ID || !hasAnalyticsConsent()) return
  started = true
  const w = window as GaWindow
  w.dataLayer = w.dataLayer ?? []
  w.gtag = function gtag() {
    // gtag.js exige recibir el objeto arguments, no un arreglo.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments)
  }
  w.gtag('js', new Date())
  w.gtag('config', GA_ID)
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(s)
}

export function trackEvent(name: string, params?: Record<string, string>) {
  ;(window as GaWindow).gtag?.('event', name, params)
}

/** Mide los clics hacia WhatsApp, correo y demostración desde cualquier parte del sitio. */
function onClick(e: MouseEvent) {
  const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href]')
  if (!link) return
  const href = link.getAttribute('href') ?? ''
  if (href.includes('wa.me/')) trackEvent('click_whatsapp', { page: location.pathname })
  else if (href.startsWith('mailto:')) trackEvent('click_email', { page: location.pathname })
  else if (href.endsWith('#contacto')) trackEvent('click_demo', { page: location.pathname })
}

export function initAnalytics() {
  if (!GA_ID) return
  start()
  window.addEventListener('cerebro:cookies', start)
  document.addEventListener('click', onClick)
}
