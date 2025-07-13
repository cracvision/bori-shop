import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // ¡Crítico para Vercel!
  build: {
    outDir: 'dist',      // Vercel espera esta carpeta
    assetsDir: 'assets', // Default, pero explícito por claridad
    emptyOutDir: true,
  }
})

