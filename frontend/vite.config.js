import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Simple Vite config with socket.io-client pre-bundling
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['socket.io-client']
  }
});
