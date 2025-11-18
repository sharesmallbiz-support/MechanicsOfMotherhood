import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Mechanics of Motherhood',
        short_name: 'MoM Recipes',
        description: 'Discover delicious family recipes and cooking tips for busy moms',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        categories: ['food', 'lifestyle'],
        orientation: 'portrait',
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/webspark\.markhazleton\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ]

  // Add bundle analyzer in analyze mode
  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        open: true,
        filename: '../dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    )
  }

  return {
    root: 'src',
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: mode !== 'production',
      // Bundle size budget warnings
      chunkSizeWarningLimit: 500, // 500 KB warning
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');

            if (!normalizedId.includes('node_modules')) {
              return undefined
            }

            if (/node_modules\/(react|react-dom|react-router-dom)\//.test(normalizedId)) {
              return 'react-vendor'
            }

            if (normalizedId.includes('@tanstack/react-query')) {
              return 'query-vendor'
            }

            if (normalizedId.includes('zustand') || normalizedId.includes('axios')) {
              return 'ui-vendor'
            }

            if (normalizedId.includes('react-markdown') || normalizedId.includes('remark-gfm') || normalizedId.includes('dompurify')) {
              return 'markdown-vendor'
            }

            if (normalizedId.includes('@sentry/react')) {
              return 'monitoring-vendor'
            }

            return undefined
          },
        },
        onwarn(warning, warn) {
          // Warn about large chunks
          if (warning.code === 'CHUNK_SIZE_EXCEEDED') {
            console.warn(`⚠️  Bundle size warning: ${warning.message}`)
          }
          warn(warning)
        },
      },
      // Target modern browsers for smaller bundles
      target: 'es2020',
      // Minification options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
        },
      },
    },
  }
})
