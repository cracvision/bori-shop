import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Importante para que todas las rutas funcionen en Vercel en la raíz
});

