import path from 'node:path'
import { fileURLToPath } from 'node:url'
import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  logLevel: 'error',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react-vendor';
          if (id.includes('react-router')) return 'router';
          if (id.includes('@radix-ui') || id.includes('lucide-react') || id.includes('cmdk') || id.includes('vaul')) return 'ui-vendor';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('three')) return 'three';
          if (id.includes('leaflet')) return 'maps';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf';
          if (id.includes('react-quill') || id.includes('quill')) return 'editor';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('@stripe')) return 'stripe';
          if (id.includes('react-helmet-async')) return 'seo';
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
