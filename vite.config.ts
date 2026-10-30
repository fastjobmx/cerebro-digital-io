import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Sitio multipágina: portada + servicios + páginas legales + 404 (servida por Vercel/Netlify automáticamente).
export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  // El prerender empaqueta todo: gsap no se puede importar directamente desde Node.
  ssr: {
    noExternal: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        automatizacion: resolve(__dirname, 'servicios/automatizacion-de-procesos/index.html'),
        marketing: resolve(__dirname, 'servicios/marketing-con-ia/index.html'),
        contenido: resolve(__dirname, 'servicios/contenido-con-ia/index.html'),
        website: resolve(__dirname, 'servicios/sitio-web-con-asistente-ia/index.html'),
        terminos: resolve(__dirname, 'terminos/index.html'),
        privacidad: resolve(__dirname, 'privacidad/index.html'),
        cookies: resolve(__dirname, 'cookies/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
})
