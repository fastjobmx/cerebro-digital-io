import './index.css'
import { DOCS } from './legal/content'
import { LegalPage, NotFound } from './legal/LegalPage'
import { mount } from './lib/mount'
import { ServicePage } from './services/ServicePage'
import { SERVICE_BY_PAGE } from './services/content'

// Punto de entrada ligero (sin three.js) para páginas de servicio, legales y 404.
// Cada HTML indica su página con <div id="app" data-page="...">.
const root = document.getElementById('app')!
const page = root.dataset.page ?? '404'
const service = SERVICE_BY_PAGE[page]

mount(root, service ? <ServicePage doc={service} /> : page in DOCS ? <LegalPage doc={DOCS[page as keyof typeof DOCS]} /> : <NotFound />)
