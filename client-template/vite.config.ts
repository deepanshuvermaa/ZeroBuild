import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // Use relative paths for assets
  build: {
    // Output directory
    outDir: 'dist',

    // Generate source maps for debugging
    sourcemap: false,

    // Minify with esbuild (faster than terser)
    minify: 'esbuild',

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          vendor: ['react', 'react-dom'],

          // Separate chunk for Framer Motion (large animation library)
          animations: ['framer-motion'],
        },

        // Asset file naming
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
            return `assets/images/[name]-[hash][extname]`;
          }

          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }

          return `assets/[name]-[hash][extname]`;
        },

        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Chunk size warning limit (500 KB)
    chunkSizeWarningLimit: 500,

    // Enable CSS code splitting
    cssCodeSplit: true,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },

  // Performance optimizations
  server: {
    hmr: {
      overlay: true,
    },
  },
})
