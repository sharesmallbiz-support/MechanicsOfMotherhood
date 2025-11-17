import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react()]

  // Add bundle analyzer in analyze mode
  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: mode !== 'production',
      // Bundle size budget warnings
      chunkSizeWarningLimit: 500, // 500 KB warning
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'ui-vendor': ['zustand', 'axios'],
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
