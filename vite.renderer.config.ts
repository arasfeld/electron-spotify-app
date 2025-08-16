import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['electron'],
    },
  },
  optimizeDeps: {
    exclude: ['electron'],
  },
  define: {
    global: 'globalThis',
  },
});
