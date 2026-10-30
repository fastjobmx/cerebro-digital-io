import App from './App'
import './index.css'
import { LenisSmoothScroll } from './components/LenisSmoothScroll'
import { validateEnv } from './lib/env'
import { mount } from './lib/mount'

validateEnv()

mount(
  document.getElementById('app')!,
  <LenisSmoothScroll>
    <App />
  </LenisSmoothScroll>,
)
