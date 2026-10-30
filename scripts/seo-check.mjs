// Comprueba el SEO técnico de dist/ sin dependencias: npm run build && npm run seo:check
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

const DIST = resolve('dist')
const SITE = 'https://cerebrodigitalio.qd.je'
const problems = []
const fail = (page, msg) => problems.push(`${page}: ${msg}`)

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : []
  })

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]
const meta = (html, key) => {
  const tag = html.match(new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]*>`))?.[0]
  return tag ? attr(tag, 'content') : undefined
}
const text = (html) =>
  html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const pages = walk(DIST).map((file) => ({ file, name: relative(DIST, file).split(sep).join('/'), html: readFileSync(file, 'utf8') }))
const exists = (path) => {
  const clean = decodeURIComponent(path.split(/[?#]/)[0])
  const target = join(DIST, clean)
  return existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')))
}

const seenTitles = new Map()
const seenDescriptions = new Map()
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

for (const { name, html } of pages) {
  const robots = meta(html, 'robots') ?? ''
  const noindex = robots.includes('noindex')
  const body = html.slice(html.indexOf('<body'))
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  const rendered = !name.startsWith('landing-pages/demos/')

  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1]
    if (url.includes('cerebrodigital.io') || url.includes('qzz.io')) fail(name, `dominio antiguo: ${url}`)
    if (url.startsWith('http://') && !url.includes('www.w3.org')) fail(name, `enlace sin HTTPS: ${url}`)
  }
  if (/name="keywords"/.test(html)) fail(name, 'meta keywords obsoleta')

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1])
    } catch (e) {
      fail(name, `JSON-LD inválido: ${e.message}`)
    }
  }

  if (!rendered) {
    if (!noindex) fail(name, 'la demo debe llevar noindex')
    continue
  }

  for (const m of body.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&')
    if (href.startsWith('#') && href.length > 1 && !ids.has(href.slice(1))) fail(name, `ancla sin destino: ${href}`)
    if (href.startsWith('/') && !exists(href)) fail(name, `enlace roto: ${href}`)
    if (href.startsWith('/#') && !readFileSync(join(DIST, 'index.html'), 'utf8').includes(`id="${href.slice(2)}"`)) fail(name, `ancla sin destino: ${href}`)
  }

  const h1s = body.match(/<h1[\s>]/g)?.length ?? 0
  if (h1s !== 1) fail(name, `tiene ${h1s} h1`)
  if (text(body).split(' ').length < 60) fail(name, 'poco texto en el HTML inicial')
  for (const m of body.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) fail(name, `imagen sin alt: ${m[0].slice(0, 80)}`)
  if (noindex) continue

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  const description = meta(html, 'description') ?? ''
  if (!title) fail(name, 'sin title')
  if (title.length > 70) fail(name, `title largo (${title.length})`)
  if (description.length < 70 || description.length > 170) fail(name, `description de ${description.length} caracteres`)
  if (seenTitles.has(title)) fail(name, `title duplicado con ${seenTitles.get(title)}`)
  if (seenDescriptions.has(description)) fail(name, `description duplicada con ${seenDescriptions.get(description)}`)
  seenTitles.set(title, name)
  seenDescriptions.set(description, name)

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  const expected = `${SITE}/${name.replace(/index\.html$/, '')}`
  if (canonical !== expected) fail(name, `canonical ${canonical}, se esperaba ${expected}`)
  if (!sitemapUrls.includes(expected)) fail(name, 'indexable pero fuera del sitemap')
  if (!/<html lang="es/.test(html)) fail(name, 'sin lang')
  if (!meta(html, 'viewport')) fail(name, 'sin viewport')
  for (const key of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'twitter:card']) {
    if (!meta(html, key)) fail(name, `sin ${key}`)
  }
}

for (const url of sitemapUrls) {
  if (!url.startsWith(`${SITE}/`)) fail('sitemap.xml', `URL externa: ${url}`)
  if (!exists(url.slice(SITE.length))) fail('sitemap.xml', `URL inexistente: ${url}`)
}
if (!readFileSync(join(DIST, 'robots.txt'), 'utf8').includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('robots.txt', 'sin Sitemap')
if (!meta(readFileSync(join(DIST, '404.html'), 'utf8'), 'robots')?.includes('noindex')) fail('404.html', 'debe llevar noindex')

if (problems.length) {
  console.error(`✗ ${problems.length} problemas:\n${problems.map((p) => `  - ${p}`).join('\n')}`)
  process.exit(1)
}
console.log(`✓ ${pages.length} HTML revisados, ${sitemapUrls.length} URL en el sitemap, sin problemas.`)
