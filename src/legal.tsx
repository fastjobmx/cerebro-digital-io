import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { DOCS } from './legal/content'
import { LegalPage, NotFound } from './legal/LegalPage'

// Punto de entrada ligero (sin three.js) para páginas legales y 404.
// Cada HTML indica su página con <div id="app" data-page="...">.
const root = document.getElementById('app')!
const page = root.dataset.page as keyof typeof DOCS | '404'

ReactDOM.createRoot(root).render(
  <React.StrictMode>{page === '404' || !(page in DOCS) ? <NotFound /> : <LegalPage doc={DOCS[page]} />}</React.StrictMode>,
)
