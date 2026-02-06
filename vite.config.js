import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-three': ['three'],
                    'vendor-react': ['react', 'react-dom']
                }
            }
        },
        chunkSizeWarningLimit: 500
    }
})
