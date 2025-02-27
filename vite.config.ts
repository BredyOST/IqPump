import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [ react(),
    svgr(),

  ],
  define: {
    'process.env': '{}' // Подменяем process.env на пустой объект
  }
})
