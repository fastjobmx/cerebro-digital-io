// Chatbot "Cerebro Digital": launcher con orbe animado + panel conversacional.
// Motor local (engine.ts) con modo IA opcional (ai.ts → /api/chat).
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Mail, MessageCircle, RotateCcw, Sparkles, X } from 'lucide-react'
import { SITE } from '../config/site'
import { DEFAULT_REPLIES, WELCOME_MESSAGE } from './knowledge'
import { respond, type BotReply, type ChatAction, type EngineState, type LeadStep } from './engine'
import { askAI, shouldUseAI, type AIMessage } from './ai'
import { parseMarkdown, RichText, visibleLength } from './Markdown'
import { CHAT_CSS } from './styles'

/* ───────────────────────────── Tipos y constantes ───────────────────────────── */

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
  quickReplies?: string[]
  actions?: ChatAction[]
  /** efecto máquina de escribir pendiente */
  animate?: boolean
  /** recibiendo texto de la IA */
  streaming?: boolean
}

interface Persisted {
  v: 1
  messages: ChatMessage[]
  engine: EngineState
}

const STORAGE_KEY = 'cerebro-chat'
const GREETED_KEY = 'cerebro-chat-greeted'
const MAX_CHARS = 600
const GREETING_DELAY = 6000
const LOGO = SITE.logo?.markSquare ?? '/brand/logo-mark-sq.webp'

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))
const plain = (md: string) => md.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
const timeFmt = (ts: number) => {
  try {
    return new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

/* ───────────────────────────── Persistencia ───────────────────────────── */

function loadSession(): Persisted | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<Persisted>
    if (data.v !== 1 || !Array.isArray(data.messages)) return null
    const messages = data.messages.filter(
      (m): m is ChatMessage =>
        !!m && typeof m.id === 'string' && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string',
    )
    return { v: 1, messages, engine: data.engine && typeof data.engine === 'object' ? data.engine : {} }
  } catch {
    return null
  }
}

function saveSession(messages: ChatMessage[], engine: EngineState) {
  try {
    const clean = messages.map(({ animate: _a, streaming: _s, ...m }) => m)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, messages: clean, engine } satisfies Persisted))
  } catch {
    /* almacenamiento no disponible */
  }
}

function sessionFlag(key: string, set = false): boolean {
  try {
    if (set) sessionStorage.setItem(key, '1')
    return sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

/* ───────────────────────────── Hooks utilitarios ───────────────────────────── */

function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const on = () => setMatch(mql.matches)
    on()
    mql.addEventListener('change', on)
    return () => mql.removeEventListener('change', on)
  }, [query])
  return match
}

/** Alto y desplazamiento del viewport visual (teclado virtual en móvil). */
function useVisualViewport(active: boolean) {
  const [vv, setVv] = useState<{ height: number; top: number } | null>(null)
  useEffect(() => {
    const view = window.visualViewport
    if (!active || !view) {
      setVv(null)
      return
    }
    const update = () => setVv({ height: Math.round(view.height), top: Math.round(view.offsetTop) })
    update()
    view.addEventListener('resize', update)
    view.addEventListener('scroll', update)
    return () => {
      view.removeEventListener('resize', update)
      view.removeEventListener('scroll', update)
    }
  }, [active])
  return vv
}

/* ───────────────────────────── Piezas visuales ───────────────────────────── */

function Orb({ size = 44 }: { size?: number }) {
  return (
    <span className="cb-orb" style={{ width: size, height: size }} aria-hidden>
      <span className="cb-orb__glow" />
      <span className="cb-orb__ring" />
      <span className="cb-orb__core">
        <img src={LOGO} alt="" width={size} height={size} draggable={false} decoding="async" />
      </span>
    </span>
  )
}

function Avatar({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative grid flex-none place-items-center rounded-full p-[1.5px] shadow-[0_0_18px_-4px_rgba(240,60,255,0.6)]"
      style={{ width: size, height: size, background: 'conic-gradient(from 200deg, #F03CFF, #8B5CF6, #3B82F6, #3DD9FF, #F03CFF)' }}
    >
      <span className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_25%,#2b1860,#0a0418_70%)]">
        <img src={LOGO} alt="" className="h-[76%] w-[76%] object-contain" draggable={false} />
      </span>
    </span>
  )
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 flex-none place-items-center rounded-full text-[color:var(--text-2)] transition-[background,color,transform] duration-300 hover:bg-white/[0.08] hover:text-white active:scale-90"
    >
      {children}
    </button>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5" role="status" aria-label="El Cerebro está pensando">
      <Avatar />
      <div className="rounded-2xl rounded-tl-md border border-white/[0.07] bg-white/[0.045] px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="cb-dot h-[7px] w-[7px] rounded-full"
              style={{
                animationDelay: `${i * 0.16}s`,
                background: ['#F03CFF', '#8B5CF6', '#3DD9FF'][i],
                boxShadow: `0 0 10px ${['#F03CFF', '#8B5CF6', '#3DD9FF'][i]}`,
              }}
            />
          ))}
        </div>
        <p className="mt-1.5 text-[11.5px] text-[color:var(--text-3)]">El Cerebro está pensando…</p>
      </div>
    </div>
  )
}

/** Texto del asistente con revelado progresivo (saltable con un clic). */
function TypedText({
  text,
  animate,
  streaming,
  onDone,
  onTick,
}: {
  text: string
  animate: boolean
  streaming: boolean
  onDone: () => void
  onTick: () => void
}) {
  const blocks = useMemo(() => parseMarkdown(text), [text])
  const total = visibleLength(blocks)
  const [shown, setShown] = useState(0)
  const totalRef = useRef(total)
  totalRef.current = total
  const tickRef = useRef(onTick)
  tickRef.current = onTick

  useEffect(() => {
    if (!animate) return
    let raf = 0
    let last = performance.now()
    let acc = 0
    const loop = (now: number) => {
      // ~12 ms por carácter, acelerando en textos largos (máx. ~2.4 s por mensaje).
      const perMs = Math.max(1 / 12, totalRef.current / 2400)
      acc += (now - last) * perMs
      last = now
      const step = Math.floor(acc)
      if (step > 0) {
        acc -= step
        setShown((s) => Math.min(s + step, totalRef.current))
        tickRef.current()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [animate])

  useEffect(() => {
    if (animate && !streaming && shown >= total && total > 0) onDone()
  }, [animate, streaming, shown, total, onDone])

  return (
    <RichText
      blocks={blocks}
      budget={animate ? shown : Infinity}
      caret={animate || streaming ? <span className="cb-caret" aria-hidden /> : undefined}
    />
  )
}

function ActionButton({ action, onLead }: { action: ChatAction; onLead: () => void }) {
  const base =
    'group inline-flex max-w-full items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold tracking-[-0.005em] transition-[transform,background,border-color,box-shadow] duration-300 active:scale-[0.97]'
  if (action.kind === 'lead') {
    return (
      <button
        type="button"
        onClick={onLead}
        className={`${base} border-violet/40 bg-violet/15 text-white hover:border-magenta/60 hover:bg-violet/25 hover:shadow-[0_8px_28px_-10px_rgba(240,60,255,0.7)]`}
      >
        <Sparkles size={14} className="text-magenta" aria-hidden />
        <span className="truncate">{action.label}</span>
      </button>
    )
  }
  const isWa = action.kind === 'whatsapp'
  const isExternal = isWa || action.kind === 'link'
  const Icon = isWa ? MessageCircle : action.kind === 'email' ? Mail : ArrowUpRight
  return (
    <a
      href={action.href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={
        isWa
          ? `${base} border-[#25D366]/45 bg-[#25D366]/[0.12] text-white hover:border-[#25D366]/80 hover:bg-[#25D366]/20 hover:shadow-[0_8px_28px_-10px_rgba(37,211,102,0.7)]`
          : `${base} border-white/15 bg-white/[0.05] text-white hover:border-cyan/50 hover:bg-white/[0.09]`
      }
    >
      <Icon size={14} className={isWa ? 'text-[#25D366]' : 'text-cyan'} aria-hidden />
      <span className="truncate">{action.label}</span>
      {isExternal && <ArrowUpRight size={13} className="-ml-0.5 opacity-50 transition-opacity group-hover:opacity-90" aria-hidden />}
    </a>
  )
}

/* ───────────────────────────── Widget ───────────────────────────── */

export function ChatWidget() {
  const [initial] = useState(loadSession)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => initial?.messages ?? [])
  const [engine, setEngine] = useState<EngineState>(() => initial?.engine ?? {})
  const [thinking, setThinking] = useState(false)
  const [input, setInput] = useState('')
  const [greeting, setGreeting] = useState(false)
  const [unread, setUnread] = useState(false)

  const isMobile = useMediaQuery('(max-width: 639px)')
  const coarse = useMediaQuery('(pointer: coarse)')
  const reduced = useReducedMotion() ?? false
  const vv = useVisualViewport(open && isMobile)

  const launcherRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const stickRef = useRef(true)
  const busyRef = useRef(false)
  const engineRef = useRef(engine)
  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const wasOpen = useRef(false)

  const streaming = messages.some((m) => m.streaming)
  const busy = thinking || streaming
  const leadStep: LeadStep | undefined = engine.lead?.step

  const commitEngine = useCallback((s: EngineState) => {
    engineRef.current = s
    setEngine(s)
  }, [])

  /* Persistencia (no se guarda mientras llega texto de la IA). */
  useEffect(() => {
    if (!streaming) saveSession(messages, engine)
  }, [messages, engine, streaming])

  /* Saludo emergente: una vez por sesión, a los ~6 s. */
  useEffect(() => {
    if (open || messages.length > 0 || sessionFlag(GREETED_KEY)) return
    const t = window.setTimeout(() => {
      sessionFlag(GREETED_KEY, true)
      setGreeting(true)
      setUnread(true)
    }, GREETING_DELAY)
    return () => window.clearTimeout(t)
    // Sólo al montar.
  }, [])

  /* Scroll al final. */
  const scrollToBottom = useCallback(
    (smooth: boolean) => {
      const el = scrollRef.current
      if (!el) return
      el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduced ? 'smooth' : 'auto' })
    },
    [reduced],
  )

  const lastForScroll = messages[messages.length - 1]
  const scrollKey = `${open}-${messages.length}-${thinking}-${lastForScroll?.animate ?? ''}-${lastForScroll?.streaming ?? ''}`
  useEffect(() => {
    if (!open) return
    const last = messagesRef.current[messagesRef.current.length - 1]
    if (stickRef.current || last?.role === 'user') {
      stickRef.current = true
      requestAnimationFrame(() => scrollToBottom(true))
    }
  }, [scrollKey, open, scrollToBottom])

  const onTypeTick = useCallback(() => {
    if (stickRef.current) scrollToBottom(false)
  }, [scrollToBottom])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  /* Mensaje de bienvenida al abrir por primera vez (o tras reiniciar). */
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { id: uid(), role: 'assistant', text: WELCOME_MESSAGE, ts: Date.now(), quickReplies: DEFAULT_REPLIES, animate: !reduced },
      ])
    }
  }, [open, messages.length, reduced])

  /* Foco: al abrir → textarea (o el diálogo en táctil, para no abrir el teclado); al cerrar → launcher. */
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => {
        if (coarse) panelRef.current?.focus({ preventScroll: true })
        else inputRef.current?.focus({ preventScroll: true })
      }, 80)
      wasOpen.current = true
      return () => window.clearTimeout(t)
    }
    if (wasOpen.current) {
      wasOpen.current = false
      requestAnimationFrame(() => launcherRef.current?.focus({ preventScroll: true }))
    }
  }, [open, coarse])

  /* Bloqueo del scroll de la página en móvil (hoja a pantalla completa). */
  useEffect(() => {
    if (!open || !isMobile) return
    const html = document.documentElement
    const prevHtml = html.style.overflow
    const prevBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [open, isMobile])

  /* Auto-crecimiento del textarea (máx. 4 líneas). */
  useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 4 * 24 + 16)}px`
  }, [input, open])

  const openChat = useCallback(() => {
    setOpen(true)
    setGreeting(false)
    setUnread(false)
  }, [])
  const closeChat = useCallback(() => setOpen(false), [])

  /* Esc cierra. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeChat()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeChat])

  const finishTyping = useCallback((id: string) => {
    setMessages((ms) => ms.map((m) => (m.id === id && m.animate ? { ...m, animate: false } : m)))
  }, [])

  const toAssistant = useCallback(
    (reply: BotReply, id = uid()): ChatMessage => ({
      id,
      role: 'assistant',
      text: reply.text,
      ts: Date.now(),
      quickReplies: reply.quickReplies,
      actions: reply.actions,
      animate: !reduced,
    }),
    [reduced],
  )

  /** Envía un mensaje del usuario y genera la respuesta (local o IA). */
  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_CHARS)
      if (!text || busyRef.current) return
      busyRef.current = true
      stickRef.current = true

      const history: AIMessage[] = messagesRef.current
        .filter((m) => m.text.trim())
        .map((m) => ({ role: m.role, content: m.text }))
      history.push({ role: 'user', content: text })

      // Completa cualquier revelado en curso y agrega el mensaje del usuario.
      setMessages((ms) => [
        ...ms.map((m) => (m.animate ? { ...m, animate: false } : m)),
        { id: uid(), role: 'user', text, ts: Date.now() },
      ])
      setInput('')

      const prev = engineRef.current
      const { reply, state } = respond(text, prev)
      commitEngine(state)
      setThinking(true)

      try {
        if (shouldUseAI(reply, state, prev)) {
          const id = uid()
          let started = false
          try {
            await askAI(history, (_chunk, full) => {
              if (!started) {
                started = true
                setThinking(false)
                setMessages((ms) => [
                  ...ms,
                  { id, role: 'assistant', text: full, ts: Date.now(), streaming: true, animate: !reduced },
                ])
              } else {
                setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, text: full } : m)))
              }
            })
            const chips = reply.kind === 'intent' && reply.quickReplies ? reply.quickReplies : ['Quiero una demostración', 'Ver casos de uso']
            setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, streaming: false, quickReplies: chips } : m)))
            return
          } catch (err) {
            console.debug('[cerebro] IA no disponible; se usa el motor local.', err)
            if (started) {
              setMessages((ms) => ms.map((m) => (m.id === id ? toAssistant(reply, id) : m)))
              return
            }
          }
        }
        // Pequeña pausa natural antes de responder localmente.
        await wait(reduced ? 120 : 420 + Math.min(reply.text.length * 0.9, 650))
        setMessages((ms) => [...ms, toAssistant(reply)])
      } finally {
        setThinking(false)
        busyRef.current = false
      }
    },
    [commitEngine, reduced, toAssistant],
  )

  const sendRef = useRef(send)
  sendRef.current = send

  /* API pública: window.dispatchEvent(new CustomEvent('cerebro:open', { detail: { question } })) */
  useEffect(() => {
    const onOpen = (e: Event) => {
      const q = (e as CustomEvent<{ question?: string } | undefined>).detail?.question
      openChat()
      if (q) window.setTimeout(() => void sendRef.current(q), 420)
    }
    window.addEventListener('cerebro:open', onOpen)
    return () => window.removeEventListener('cerebro:open', onOpen)
  }, [openChat])

  const reset = () => {
    if (busyRef.current) return
    commitEngine({})
    stickRef.current = true
    setMessages([])
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
    inputRef.current?.focus({ preventScroll: true })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void send(input)
  }

  const onInputKey = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      void send(input)
    }
  }

  /* Trampa de foco en móvil (diálogo modal). */
  const onPanelKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !isMobile || !panelRef.current) return
    const items = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const lastMsg = messages[messages.length - 1]
  const chips =
    !busy && lastMsg?.role === 'assistant' && !lastMsg.animate && !lastMsg.streaming ? lastMsg.quickReplies ?? [] : []
  const canSend = input.trim().length > 0 && !busy

  const placeholder =
    leadStep === 'correo'
      ? 'nombre@empresa.com'
      : leadStep === 'whatsapp'
        ? '+57 300 123 4567 u «omitir»'
        : leadStep === 'nombre'
          ? 'Su nombre'
          : leadStep === 'empresa'
            ? 'Nombre de su empresa'
            : 'Escriba su pregunta…'
  const inputMode = leadStep === 'correo' ? 'email' : leadStep === 'whatsapp' ? 'tel' : 'text'

  const gutter = isMobile ? 16 : 24
  const panelStyle = isMobile
    ? { left: 0, right: 0, top: vv?.top ?? 0, height: vv ? vv.height : '100dvh', transformOrigin: '50% 100%' }
    : {
        right: `calc(${gutter}px + env(safe-area-inset-right))`,
        bottom: `calc(${gutter}px + env(safe-area-inset-bottom))`,
        width: 'min(400px, calc(100vw - 32px))',
        height: 'min(640px, calc(100dvh - 48px))',
        transformOrigin: '100% 100%',
      }

  return (
    <>
      <style>{CHAT_CSS}</style>

      {/* ───────── Launcher ───────── */}
      <div
        className="fixed z-[70]"
        style={{ right: `calc(${gutter}px + env(safe-area-inset-right))`, bottom: `calc(${gutter}px + env(safe-area-inset-bottom))` }}
      >
        <AnimatePresence>
          {greeting && !open && (
            <motion.div
              key="greeting"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className="absolute bottom-[calc(100%+12px)] right-0 w-[min(272px,calc(100vw-32px))] origin-bottom-right"
            >
              <button
                type="button"
                onClick={() => {
                  openChat()
                  window.setTimeout(() => void sendRef.current('¿Qué podría automatizar en mi empresa?'), 420)
                }}
                className="panel ring-grad block w-full rounded-2xl rounded-br-md px-4 py-3 pr-9 text-left text-[13.5px] leading-snug text-white shadow-[0_20px_60px_-20px_rgba(139,92,246,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-cyan/80">Cerebro Digital</span>
                ¿Le muestro qué podría automatizar en su empresa?
              </button>
              <button
                type="button"
                aria-label="Descartar mensaje"
                onClick={() => setGreeting(false)}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full text-[color:var(--text-3)] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={13} aria-hidden />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={launcherRef}
          type="button"
          onClick={openChat}
          aria-label="Abrir chat: Hable con el Cerebro"
          aria-expanded={open}
          aria-controls="cerebro-chat-panel"
          aria-hidden={open || undefined}
          tabIndex={open ? -1 : 0}
          initial={false}
          animate={open ? { opacity: 0, scale: 0.6, y: 16 } : { opacity: 1, scale: 1, y: 0 }}
          whileHover={reduced || open ? undefined : { scale: 1.035, y: -2 }}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className={`cb-launcher glass ring-grad relative flex items-center gap-3 rounded-full p-1.5 sm:pr-5 ${open ? 'pointer-events-none' : ''}`}
        >
          <Orb size={isMobile ? 48 : 44} />
          <span className="hidden whitespace-nowrap font-display text-[14px] font-semibold tracking-[-0.01em] text-white sm:inline">
            Hable con el Cerebro
          </span>
          {unread && (
            <span className="absolute right-0 top-0 flex h-3.5 w-3.5" aria-hidden>
              <span className="cb-ping absolute inset-0 rounded-full bg-magenta" />
              <span className="relative h-3.5 w-3.5 rounded-full border-2 border-ink bg-magenta" />
            </span>
          )}
        </motion.button>
      </div>

      {/* ───────── Panel ───────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            id="cerebro-chat-panel"
            ref={panelRef}
            role="dialog"
            aria-modal={isMobile || undefined}
            aria-label="Chat con el Cerebro Digital"
            tabIndex={-1}
            data-lenis-prevent
            onKeyDown={onPanelKey}
            initial={
              reduced
                ? { opacity: 0 }
                : isMobile
                  ? { opacity: 0, y: 48, scale: 0.98, filter: 'blur(10px)' }
                  : { opacity: 0, y: 28, scale: 0.6, filter: 'blur(14px)' }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            exit={
              reduced
                ? { opacity: 0 }
                : isMobile
                  ? { opacity: 0, y: 40, scale: 0.98, filter: 'blur(8px)', transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }
                  : { opacity: 0, y: 20, scale: 0.7, filter: 'blur(12px)', transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }
            }
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 30,
              mass: 0.9,
              opacity: { duration: 0.25 },
              filter: { duration: 0.35 },
            }}
            className="fixed z-[80] outline-none"
            style={panelStyle}
          >
            <div
              className={`cb-panel ring-grad relative flex h-full w-full flex-col overflow-hidden ${
                isMobile ? 'rounded-none' : 'rounded-[28px] shadow-[0_40px_120px_-30px_rgba(139,92,246,0.55),0_20px_50px_-20px_rgba(0,0,0,0.9)]'
              }`}
            >
              {/* Cabecera */}
              <header
                className="relative flex flex-none items-center gap-3 px-4 pb-3.5 pt-4 sm:px-5"
                style={isMobile ? { paddingTop: 'calc(14px + env(safe-area-inset-top))' } : undefined}
              >
                <span className="relative flex-none">
                  <Orb size={42} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-[15.5px] font-semibold tracking-[-0.015em] text-white">Cerebro Digital</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[color:var(--text-2)]">
                    <span className="relative flex h-2 w-2" aria-hidden>
                      <span className="cb-ping absolute inset-0 rounded-full bg-[#3DF5C0]" />
                      <span className="relative h-2 w-2 rounded-full bg-[#3DF5C0] shadow-[0_0_10px_#3DF5C0]" />
                    </span>
                    En línea · responde al instante
                  </p>
                </div>
                <IconButton label="Reiniciar conversación" onClick={reset}>
                  <RotateCcw size={16} aria-hidden />
                </IconButton>
                <IconButton label="Cerrar chat" onClick={closeChat}>
                  <X size={18} aria-hidden />
                </IconButton>
              </header>

              {/* Franja aurora */}
              <div className="relative h-[2px] flex-none" aria-hidden>
                <div className="cb-aurora absolute inset-0 opacity-80" />
                <div className="cb-aurora absolute inset-x-8 top-0 h-4 opacity-40 blur-lg" />
              </div>

              {/* Mensajes */}
              <div
                ref={scrollRef}
                onScroll={onScroll}
                data-lenis-prevent
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label="Conversación"
                className="cb-scroll cb-fade-top relative flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-5 sm:px-5"
              >
                <div className="flex flex-col gap-4">
                  {messages.map((m) =>
                    m.role === 'user' ? (
                      <motion.div
                        key={m.id}
                        initial={reduced ? false : { opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                        className="flex flex-col items-end"
                      >
                        <div className="max-w-[84%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-md bg-[linear-gradient(120deg,#F03CFF_0%,#8B5CF6_52%,#3B82F6_100%)] px-4 py-2.5 text-[14.5px] leading-[1.55] text-white shadow-[0_10px_30px_-12px_rgba(240,60,255,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]">
                          {m.text}
                        </div>
                        <time className="mr-1 mt-1 font-mono text-[10px] tracking-wide text-[color:var(--text-3)]">{timeFmt(m.ts)}</time>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={m.id}
                        initial={reduced ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-start gap-2.5"
                      >
                        <Avatar />
                        <div className="min-w-0 max-w-[86%]">
                          <div
                            onClick={m.animate ? () => finishTyping(m.id) : undefined}
                            className={`break-words rounded-2xl rounded-tl-md border border-white/[0.07] bg-white/[0.045] px-4 py-3 text-[14.5px] leading-[1.6] text-[rgba(244,242,255,0.92)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${
                              m.animate ? 'cursor-pointer' : ''
                            }`}
                          >
                            {m.animate && <span className="sr-only">{plain(m.text)}</span>}
                            <div aria-hidden={m.animate || undefined}>
                              <TypedText
                                text={m.text}
                                animate={!!m.animate}
                                streaming={!!m.streaming}
                                onDone={() => finishTyping(m.id)}
                                onTick={onTypeTick}
                              />
                            </div>
                          </div>
                          {!!m.actions?.length && !m.animate && (
                            <motion.div
                              initial={reduced ? false : { opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2.5 flex flex-wrap gap-2"
                            >
                              {m.actions.map((a, i) => (
                                <ActionButton key={i} action={a} onLead={() => void send('Quiero dejar mis datos')} />
                              ))}
                            </motion.div>
                          )}
                          <time className="ml-1 mt-1 block font-mono text-[10px] tracking-wide text-[color:var(--text-3)]">
                            {timeFmt(m.ts)}
                          </time>
                        </div>
                      </motion.div>
                    ),
                  )}

                  {thinking && (
                    <motion.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <TypingIndicator />
                    </motion.div>
                  )}

                  {chips.length > 0 && (
                    <div className="-mt-1 flex flex-wrap gap-2 pl-[38px]" aria-label="Respuestas sugeridas">
                      {chips.map((c, i) => (
                        <motion.button
                          key={`${lastMsg?.id}-${c}`}
                          type="button"
                          initial={reduced ? false : { opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: reduced ? 0 : 0.05 * i, type: 'spring', stiffness: 460, damping: 30 }}
                          onClick={() => void send(c)}
                          className="rounded-full border border-white/[0.12] bg-white/[0.035] px-3.5 py-1.5 text-left text-[12.5px] font-medium text-[color:var(--text)] transition-[background,border-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:border-magenta/50 hover:bg-[linear-gradient(100deg,rgba(240,60,255,0.14),rgba(59,130,246,0.14))] hover:shadow-[0_8px_24px_-12px_rgba(240,60,255,0.8)] active:scale-[0.97]"
                        >
                          {c}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Composer */}
              <form
                onSubmit={onSubmit}
                className="relative flex-none border-t border-white/[0.06] bg-[rgba(8,3,20,0.55)] px-3 pt-3 sm:px-4"
                style={{ paddingBottom: isMobile ? 'calc(10px + env(safe-area-inset-bottom))' : '12px' }}
              >
                <div className="flex items-end gap-2 rounded-[22px] border border-white/[0.1] bg-white/[0.04] p-1.5 pl-4 transition-[border-color,box-shadow] duration-300 focus-within:border-violet/60 focus-within:shadow-[0_0_0_4px_rgba(139,92,246,0.14)]">
                  <label htmlFor="cerebro-chat-input" className="sr-only">
                    Escriba su mensaje
                  </label>
                  <textarea
                    id="cerebro-chat-input"
                    ref={inputRef}
                    rows={1}
                    value={input}
                    maxLength={MAX_CHARS}
                    onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                    onKeyDown={onInputKey}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    enterKeyHint="send"
                    autoComplete={leadStep === 'correo' ? 'email' : leadStep === 'nombre' ? 'name' : 'off'}
                    data-lenis-prevent
                    className="cb-textarea min-h-[40px] flex-1 resize-none bg-transparent py-2 text-[16px] leading-6 text-white outline-none focus-visible:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!canSend}
                    aria-label="Enviar mensaje"
                    className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[linear-gradient(135deg,#F03CFF_0%,#8B5CF6_50%,#3B82F6_100%)] text-white shadow-[0_8px_24px_-8px_rgba(240,60,255,0.8),inset_0_1px_0_rgba(255,255,255,0.35)] transition-[opacity,transform,filter] duration-300 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30 disabled:saturate-50"
                  >
                    <ArrowUp size={18} strokeWidth={2.4} aria-hidden />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 px-1.5 text-[10.5px] leading-tight text-[color:var(--text-3)]">
                  <span>IA de demostración · Sus datos se usan solo para contactarle</span>
                  {input.length > MAX_CHARS - 120 && (
                    <span className={`flex-none font-mono tabular-nums ${input.length >= MAX_CHARS ? 'text-magenta' : ''}`}>
                      {input.length}/{MAX_CHARS}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
