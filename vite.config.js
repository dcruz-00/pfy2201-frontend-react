import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Rutas relativas: GitHub Pages sirve el sitio bajo /<repo>/ y así no
  // dependemos del nombre del repositorio.
  base: './',
})
