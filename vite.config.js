import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Use root path for Vercel, relative for GitHub Pages
    base: process.env.VERCEL ? '/' : './',
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
