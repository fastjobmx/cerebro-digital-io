import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cookie } from 'lucide-react'
import { SITE } from '../config/site'

/* ------------------------------------------------------------------ */
/* Consentimiento de cookies                                           */
/* El sitio hoy solo usa almacenamiento técnico necesario. La elección */
/* queda guardada para habilitar analítica en el futuro sólo si el     */
/* visitante la acepta (consulte hasAnalyticsConsent()).               */
/* ------------------------------------------------------------------ */
const KEY = 'cerebro-cookies'
type Choice = 'all' | 'necessary'

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'all' || v === 'necessary' ? v : null
  } catch {
    return null
  }
}

export function hasAnalyticsConsent() {
  return readChoice() === 'all'
}

export function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Se muestra tras un breve retraso para no competir con el preloader.
    const t = window.setTimeout(() => setOpen(readChoice() === null), 2600)
    const reopen = () => setOpen(true)
    window.addEventListener('cerebro:cookie-settings', reopen)
    return () => {
      clearTimeout(t)
      window.removeEventListener('cerebro:cookie-settings', reopen)
    }
  }, [])

  const choose = (c: Choice) => {
    try {
      localStorage.setItem(KEY, c)
    } catch {
      /* almacenamiento no disponible */
    }
    setOpen(false)
    window.dispatchEvent(new CustomEvent('cerebro:cookies', { detail: c }))
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-3 bottom-3 z-[90] flex justify-center sm:bottom-6"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full sm:w-[600px]"
        >
          <div className="panel ring-grad flex flex-col gap-4 !rounded-2xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,.9)] sm:flex-row sm:items-center">
            <Cookie size={22} strokeWidth={1.6} className="hidden flex-none text-magenta sm:block" />
            <p className="text-[13px] leading-relaxed text-white/70">
              Usamos almacenamiento técnico necesario para que el sitio y el asistente funcionen. No usamos cookies publicitarias.{' '}
              <a href="/cookies/" className="text-white underline underline-offset-2 hover:text-cyan">
                Más información
              </a>
            </p>
            <div className="flex flex-none gap-2">
              <button type="button" onClick={() => choose('necessary')} className="btn btn-ghost !h-10 flex-1 !px-4 !text-[13px] sm:flex-none">
                Solo necesarias
              </button>
              <button type="button" onClick={() => choose('all')} className="btn btn-primary !h-10 flex-1 !px-5 !text-[13px] sm:flex-none">
                Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Botón flotante de WhatsApp (abajo a la izquierda)                   */
/* ------------------------------------------------------------------ */
export function WhatsAppButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!SITE.whatsapp) return
    // Aparece después del hero para no recargar la primera vista.
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!SITE.whatsapp) return null
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hola, quiero información sobre el Cerebro Digital.')}`

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Escribir por WhatsApp al ${SITE.whatsappDisplay}`}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.06, y: -2 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="group fixed z-[65] flex items-center gap-2 rounded-full bg-[#25D366] p-3 text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,.6)] sm:pr-4"
          style={{ left: 'calc(16px + env(safe-area-inset-left))', bottom: 'calc(16px + env(safe-area-inset-bottom))' }}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
          </svg>
          <span className="hidden text-[13.5px] font-semibold sm:inline">WhatsApp</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
