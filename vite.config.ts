import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bori-shop/',  // Esto arregla paths para GitHub Pages
})
