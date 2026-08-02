import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig(({ mode }) => ({
  plugins: [devtools(), solidPlugin({ hot: mode !== 'test' }), tailwindcss()],
  test: {
    environment: 'jsdom',
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
}));
