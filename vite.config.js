import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // the file watcher chokes (EBUSY) when binary assets change in public/ on Windows
    watch: { ignored: ['**/public/**', '**/dist/**'] },
  },
})
