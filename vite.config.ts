import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
dotenv.config();

// timezone for HMR logging
process.env.TZ = 'Europe/Berlin';

const FRONTEND_PORT = Number(process.env.FRONTEND_PORT) || 3003;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(
      process.env.VITE_BUILD_VERSION
        ? `${process.env.VITE_BUILD_VERSION}`
        : 'local-development'
    ),
  },
  server: {
    watch: {
      usePolling: true // Add this line if you're running on a network filesystem or Docker and Hot Module Replace is not working
    },
    host: true,
    port: FRONTEND_PORT
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
