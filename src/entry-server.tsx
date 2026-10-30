// Prerender del build (scripts/prerender.mjs): genera el HTML real de cada página para
// que buscadores y sistemas de IA lean el contenido sin ejecutar JavaScript.
import { renderToString } from 'react-dom/server'
import type { ReactElement } from 'react'
import App from './App'
import { SITE } from './config/site'
import { DOCS } from './legal/content'
import { LegalPage, NotFound } from './legal/LegalPage'
import { ServicePage } from './services/ServicePage'
import { SERVICES, servicePath } from './services/content'
import type { ServiceDoc } from './services/content'

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export interface Route {
  /** HTML generado por Vite, relativo a dist/. */
  file: string
  path: string
  /** Fuentes del contenido, para calcular lastmod del sitemap. */
  sources: string[]
  indexable: boolean
  element: ReactElement
  /** Metadatos generados para las páginas sin cabecera escrita a mano. */
  head?: string
}

function serviceHead(s: ServiceDoc) {
  const url = `${SITE.url}${servicePath(s)}`
  const image = `${SITE.url}/brand/og-image.jpg`
  const org = { '@id': `${SITE.url}/#organization` }
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: s.seoTitle,
        description: s.seoDescription,
        inLanguage: 'es-CO',
        isPartOf: { '@id': `${SITE.url}/#website` },
        about: { '@id': `${url}#service` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: s.title,
        serviceType: s.label,
        description: s.seoDescription,
        url,
        provider: org,
        areaServed: { '@type': 'Country', name: 'Colombia' },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: s.label, item: url },
        ],
      },
    ],
  }
  const title = escapeHtml(s.seoTitle)
  const desc = escapeHtml(s.seoDescription)
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE.name}" />`,
    `<meta property="og:locale" content="es_CO" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ')
}

export const ROUTES: Route[] = [
  { file: 'index.html', path: '/', sources: ['index.html', 'src/config/site.ts', 'src/sections'], indexable: true, element: <App /> },
  ...SERVICES.map((s) => ({
    file: `servicios/${s.slug}/index.html`,
    path: servicePath(s),
    sources: ['src/services'],
    indexable: true,
    element: <ServicePage doc={s} />,
    head: serviceHead(s),
  })),
  ...Object.keys(DOCS).map((page) => ({
    file: `${page}/index.html`,
    path: `/${page}/`,
    sources: [`${page}/index.html`, 'src/legal/content.tsx'],
    indexable: true,
    element: <LegalPage doc={DOCS[page as keyof typeof DOCS]} />,
  })),
  { file: '404.html', path: '/404.html', sources: [], indexable: false, element: <NotFound /> },
]

export const render = (route: Route) => renderToString(route.element)
