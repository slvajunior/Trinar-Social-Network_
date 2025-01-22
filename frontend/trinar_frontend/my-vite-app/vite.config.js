import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Adiciona o plugin do React
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // URL do backend Django
        changeOrigin: true,
        secure: false,
      },
    },
  },
});