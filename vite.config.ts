import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 3003;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: PORT
  }
});
