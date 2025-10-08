import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/mtrack/',
        start_url: '/mtrack/',
        icons: [
          {
            src: '/mtrack/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ],
        shortcuts: [
          {
            name: 'Add Patient',
            short_name: 'New Patient',
            description: 'Quickly add a new patient',
            url: '/mtrack/?action=add-patient',
            icons: [{ src: '/mtrack/vite.svg', sizes: 'any' }]
          },
          {
            name: 'View Patients',
            short_name: 'Patients',
            description: 'View all patients',
            url: '/mtrack/',
            icons: [{ src: '/mtrack/vite.svg', sizes: 'any' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Properly cache all navigation requests - serve cached app when offline
        navigateFallback: '/mtrack/index.html',
        navigateFallbackDenylist: [/^\/api/, /\/manifest\.webmanifest$/],
        // Clean URLs strategy
        cleanupOutdatedCaches: true,
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
        enabled: true,
        type: 'module'
      }
    })
  ],
  base: '/mtrack/'
})
