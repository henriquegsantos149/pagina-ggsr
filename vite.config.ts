import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/posggsr/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'lista-de-espera': resolve(__dirname, 'lista-de-espera/index.html'),
        'lista-de-esperalp2': resolve(__dirname, 'lista-de-esperalp2/index.html'),
      },
    },
  },
})

//