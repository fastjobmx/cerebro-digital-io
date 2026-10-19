import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Sitio multipágina: portada + páginas legales + 404 (servida por Vercel/Netlify automáticamente).
export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        terminos: resolve(__dirname, 'terminos/index.html'),
        privacidad: resolve(__dirname, 'privacidad/index.html'),
        cookies: resolve(__dirname, 'cookies/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
})
