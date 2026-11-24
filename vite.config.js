import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static SPA build — deploys to Vercel (or any static host) with no server code.
// When Supabase is wired later, VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are
// read at build time from the environment (see .env.example and src/lib/data.js).
export default defineConfig({
  plugins: [react()],
});
