// Renderizador de markdown ligero y seguro: construye elementos React
// (sin dangerouslySetInnerHTML). Soporta **negrita**, [enlaces](url),
// listas con "- " / "• " / "1. " y saltos de línea.
// Admite un "presupuesto" de caracteres para el efecto de máquina de escribir.
import { Fragment, type ReactNode } from 'react'

type Inline = { t: 'text'; v: string } | { t: 'bold'; v: string } | { t: 'link'; v: string; href: string }
type Line = Inline[]
type Block = { t: 'p'; lines: Line[] } | { t: 'ul'; items: Line[] } | { t: 'ol'; items: Line[] }

const INLINE_RE = /\*\*([^*\n]+?)\*\*|\[([^\]\n]+)\]\(([^)\s]+)\)/g

function safeHref(href: string): string | null {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href
  if (href.startsWith('#') || (href.startsWith('/') && !href.startsWith('//'))) return href
  return null
}

function parseInline(text: string): Line {
  const out: Line = []
  let last = 0
  for (const m of text.matchAll(INLINE_RE)) {
    const i = m.index ?? 0
    if (i > last) out.push({ t: 'text', v: text.slice(last, i) })
    if (m[1] !== undefined) out.push({ t: 'bold', v: m[1] })
    else {
      const href = safeHref(m[3])
      out.push(href ? { t: 'link', v: m[2], href } : { t: 'text', v: m[2] })
    }
    last = i + m[0].length
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) })
  return out
}

export function parseMarkdown(src: string): Block[] {
  const blocks: Block[] = []
  let cur: Block | null = null
  for (const rawLine of src.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trimEnd()
    const ul = /^\s*[-•*]\s+(.*)$/.exec(line)
    const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line)
    if (!line.trim()) {
      cur = null
    } else if (ul) {
      if (cur?.t !== 'ul') blocks.push((cur = { t: 'ul', items: [] }))
      cur.items.push(parseInline(ul[1]))
    } else if (ol) {
      if (cur?.t !== 'ol') blocks.push((cur = { t: 'ol', items: [] }))
      cur.items.push(parseInline(ol[1]))
    } else {
      if (cur?.t !== 'p') blocks.push((cur = { t: 'p', lines: [] }))
      cur.lines.push(parseInline(line.trim()))
    }
  }
  return blocks
}

/** Cantidad de caracteres visibles (para el efecto de escritura). */
export function visibleLength(blocks: Block[]): number {
  let n = 0
  const count = (l: Line) => l.forEach((s) => (n += s.v.length))
  for (const b of blocks) (b.t === 'p' ? b.lines : b.items).forEach(count)
  return n
}

interface Props {
  blocks: Block[]
  /** caracteres visibles; Infinity = todo */
  budget?: number
  caret?: ReactNode
}

export function RichText({ blocks, budget = Infinity, caret }: Props) {
  let left = budget
  let caretPlaced = false

  const renderLine = (line: Line, key: string): ReactNode[] => {
    const nodes: ReactNode[] = []
    line.forEach((seg, i) => {
      if (left <= 0) return
      const v = seg.v.length > left ? seg.v.slice(0, left) : seg.v
      left -= v.length
      const k = `${key}-${i}`
      if (seg.t === 'bold') nodes.push(<strong key={k} className="font-semibold text-white">{v}</strong>)
      else if (seg.t === 'link')
        nodes.push(
          <a
            key={k}
            href={seg.href}
            {...(seg.href.startsWith('#') || seg.href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="font-medium text-cyan underline decoration-cyan/40 underline-offset-[3px] transition-colors hover:decoration-cyan"
          >
            {v}
          </a>,
        )
      else nodes.push(<Fragment key={k}>{v}</Fragment>)
    })
    return nodes
  }

  const out: ReactNode[] = []
  blocks.forEach((b, bi) => {
    if (left <= 0 && bi > 0) return
    if (b.t === 'p') {
      const lines: ReactNode[] = []
      b.lines.forEach((l, li) => {
        if (left <= 0 && li > 0) return
        if (li > 0) lines.push(<br key={`br-${bi}-${li}`} />)
        lines.push(...renderLine(l, `p${bi}-${li}`))
      })
      const isLast = left <= 0 && !caretPlaced
      if (isLast) caretPlaced = true
      out.push(
        <p key={`b${bi}`} className="[&:not(:first-child)]:mt-2.5">
          {lines}
          {isLast && caret}
        </p>,
      )
    } else {
      const ListTag = b.t === 'ul' ? 'ul' : 'ol'
      const items: ReactNode[] = []
      b.items.forEach((it, ii) => {
        if (left <= 0 && ii > 0) return
        const nodes = renderLine(it, `l${bi}-${ii}`)
        const isLast = left <= 0 && !caretPlaced
        if (isLast) caretPlaced = true
        items.push(
          <li key={`li-${bi}-${ii}`} className={b.t === 'ol' ? 'relative pl-5' : 'relative pl-4'}>
            <span
              aria-hidden
              className={
                b.t === 'ul'
                  ? 'absolute left-0 top-[0.62em] h-[5px] w-[5px] rounded-full bg-gradient-to-br from-magenta to-cyan'
                  : 'absolute left-0 top-0 font-mono text-[11px] leading-[inherit] text-cyan/80'
              }
            >
              {b.t === 'ol' ? `${ii + 1}.` : null}
            </span>
            {nodes}
            {isLast && caret}
          </li>,
        )
      })
      out.push(
        <ListTag key={`b${bi}`} className="space-y-1.5 [&:not(:first-child)]:mt-2.5">
          {items}
        </ListTag>,
      )
    }
  })
  if (!caretPlaced && caret && budget !== Infinity) out.push(<Fragment key="caret">{caret}</Fragment>)
  return <>{out}</>
}
