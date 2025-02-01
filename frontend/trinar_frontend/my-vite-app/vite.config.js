import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
  resolve: {
    alias: {
      // Configura um alias para o diretório de mídia
      '/media': path.resolve(__dirname, '/home/junior-silva/Trinar/backend/media/'),
    },
  },
  optimizeDeps: {
    exclude: [
      // Adicione aqui as dependências problemáticas
      'chunk-S725DACQ',
      'chunk-KMN5OX7C',
    ],
  },
});