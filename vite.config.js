import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // هذا للـ dev فقط
      '/api': {
        target: process.env.VITE_API_URL || 'https://vstore2.runasp.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // لو حابة تحددي URL ثابت في الـ frontend
    'process.env': process.env,
  },
});
