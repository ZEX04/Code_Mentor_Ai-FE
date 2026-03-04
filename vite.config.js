import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Code_Mentor_Ai-FE/',
  plugins: [react()],
})
