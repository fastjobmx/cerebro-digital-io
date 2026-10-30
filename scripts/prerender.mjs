// Inserta en dist/ el HTML prerenderizado de cada página y genera sitemap.xml.
import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const SITE_URL = 'https://cerebrodigitalio.qd.je'
// Páginas estáticas de public/ que también deben indexarse.
const STATIC_ROUTES = [{ path: '/landing-pages/', sources: ['public/landing-pages/index.html'] }]

const { ROUTES, render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)

/** Fecha real del último commit de las fuentes; sin historial se omite lastmod. */
function lastmod(sources) {
  if (!sources.length) return ''
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

const verification = process.env.VITE_GOOGLE_SITE_VERIFICATION?.trim()

for (const route of ROUTES) {
  const file = resolve('dist', route.file)
  let html = readFileSync(file, 'utf8')
  const filled = html.replace(/(<div id="app"[^>]*>)\s*<\/div>/, (_, open) => `${open}${render(route)}</div>`)
  if (filled === html) throw new Error(`Sin contenedor #app en ${route.file}`)
  html = filled
  if (route.head) html = html.replace('<!--seo-->', route.head)
  if (html.includes('<!--seo-->')) throw new Error(`Cabecera sin generar en ${route.file}`)
  if (verification && route.path === '/') {
    html = html.replace('</head>', `  <meta name="google-site-verification" content="${verification}" />\n  </head>`)
  }
  writeFileSync(file, html)
}

const entries = [...ROUTES.filter((r) => r.indexable), ...STATIC_ROUTES]
  .map((r) => {
    const date = lastmod(r.sources)
    return `  <url><loc>${SITE_URL}${r.path}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`
  })
  .join('\n')

writeFileSync(
  resolve('dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
)

rmSync(resolve('dist-ssr'), { recursive: true, force: true })
console.log(`Prerender: ${ROUTES.length} páginas y sitemap con ${entries.split('\n').length} URL.`)
