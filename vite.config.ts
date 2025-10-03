import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow setting a base path for GitHub Pages project sites
  // e.g., BASE_PATH=/fantasy-story-generator/
  base: process.env.BASE_PATH ?? '/',
})
