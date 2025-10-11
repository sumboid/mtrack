import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { THEME_COLORS } from './src/constants/theme'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'MediTrack - Medical History Tracker',
        short_name: 'MediTrack',
        description: 'Track patient medical records and history offline',
        theme_color: THEME_COLORS.dark, // Default dark theme - overridden by meta tag
        background_color: THEME_COLORS.dark,
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ],
        shortcuts: [
          {
            name: 'Add Patient',
            short_name: 'New Patient',
            description: 'Quickly add a new patient',
            url: '/?action=add-patient',
            icons: [{ src: '/vite.svg', sizes: 'any' }]
          },
          {
            name: 'View Patients',
            short_name: 'Patients',
            description: 'View all patients',
            url: '/',
            icons: [{ src: '/vite.svg', sizes: 'any' }]
          }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Add cache busting - change this version number when you need to force update
        cacheId: 'mtrack-v1.0.1',
        // Properly cache all navigation requests - serve cached app when offline
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /\/manifest\.webmanifest$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false, // Disable PWA in dev to avoid glob pattern warnings
        type: 'module'
      }
    })
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'xstate-vendor': ['xstate', '@xstate/react'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
})
