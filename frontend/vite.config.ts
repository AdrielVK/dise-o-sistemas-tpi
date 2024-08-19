import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  //cambiar para build
  base: '/',
  plugins: [react()],
  resolve:{
  }
});
