import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Asegúrate de que path esté importado si no lo está

// https://vitejs.dev/config/
export default defineConfig({
  // ✅ AGREGAR ESTA LÍNEA: Configura la base de la URL para GitHub Pages
  // Esto le dice a Vite que todos los assets deben cargarse desde el subdirectorio /bori-shop/
  base: '/bori-shop/',

  plugins: [react()],
  // Asegúrate de que las rutas para resolver módulos sean correctas si las necesitas
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //   },
  // },
});
