import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    environment('all', { prefix: 'VITE_' }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});