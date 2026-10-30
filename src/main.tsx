import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { LenisSmoothScroll } from './components/LenisSmoothScroll'
import { validateEnv } from './lib/env'

validateEnv()

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <LenisSmoothScroll>
      <App />
    </LenisSmoothScroll>
  </React.StrictMode>,
)
